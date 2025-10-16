const express = require('express');
const app = express();

// Serve static files (so /index.html works if you have one)
app.use(express.static(__dirname, { extensions: ['html'] }));

// -------------------------------------------
// ✅ Stable version of /download (safe HTTPS redirect)
// -------------------------------------------
app.get(['/download', '/download/'], (req, res) => {
  const ua = String(req.headers['user-agent'] || '').toLowerCase();
  res.set('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0');

  const IOS_HTTPS = 'https://apps.apple.com/us/app/hoyalist/id6740706168';
  const AND_HTTPS = 'https://play.google.com/store/apps/details?id=com.hoyalist.hoyalist';

  if (ua.includes('android')) return res.redirect(302, AND_HTTPS);
  if (ua.includes('iphone') || ua.includes('ipad') || ua.includes('ipod')) return res.redirect(302, IOS_HTTPS);
  return res.redirect(302, 'https://hoyalistapp.com');
});

// -------------------------------------------
// 🚀 New /go route (direct-open for app store links)
// -------------------------------------------
app.get(['/go', '/go/'], (req, res) => {
  const ua  = String(req.headers['user-agent'] || '');
  const ual = ua.toLowerCase();

  // Store URLs
  const PKG        = 'com.hoyalist.hoyalist';
  const AND_HTTPS  = `https://play.google.com/store/apps/details?id=${PKG}`;
  const IOS_HTTPS  = 'https://apps.apple.com/us/app/hoyalist/id6740706168';

  // Android Intent (opens Play Store app)
  const AND_INTENT =
    `intent://details?id=${PKG}` +
    `#Intent;scheme=market;package=com.android.vending;` +
    `S.browser_fallback_url=${encodeURIComponent(AND_HTTPS)};end;`;

  // iOS App Store scheme (opens App Store app)
  const IOS_ITMS = 'itms-apps://itunes.apple.com/app/id6740706168';

  const isAndroid = ual.includes('android');
  const isIOS     = ual.includes('iphone') || ual.includes('ipad') || ual.includes('ipod');

  // Detect in-app browsers that block direct opens
  const isInApp =
    ual.includes('fban') || ual.includes('fbav') || ual.includes('facebook') ||
    ual.includes('instagram') || ual.includes('tiktok') ||
    ual.includes('twitter') || ual.includes('snapchat') ||
    ual.includes('pinterest') || ual.includes('gsa'); // Google Search app

  const forceDirect = req.query.direct === '1'; // use /go?direct=1 to force direct open

  res.set('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0');

  try {
    if (isAndroid) {
      if (!isInApp || forceDirect) return res.redirect(302, AND_INTENT);
      return res.redirect(302, AND_HTTPS);
    }
    if (isIOS) {
      if (!isInApp || forceDirect) return res.redirect(302, IOS_ITMS);
      return res.redirect(302, IOS_HTTPS);
    }
  } catch (e) {
    console.error('Direct-open redirect error:', e);
  }

  // Desktop fallback
  return res.redirect(302, 'https://hoyalistapp.com');
});

// -------------------------------------------
// 🏠 Simple homepage for root
// -------------------------------------------
app.get('/', (_req, res) => {
  res.type('html').send(`
    <!doctype html><html><head>
    <meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
    <title>HoyaList</title></head>
    <body><h1>HoyaList</h1><p><a href="/download">Get the app</a></p></body></html>
  `);
});

// -------------------------------------------
// 💚 Health check endpoint
// -------------------------------------------
app.get('/healthz', (_req, res) => res.status(200).send('ok'));

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ HoyaList server running on port ${PORT}`));
