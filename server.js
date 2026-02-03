const express = require('express');
const app = express();

// -------------------------------------------
// 🔁 Root redirect FIRST
// -------------------------------------------
app.get('/', (req, res) => {
  res.set('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0');
  return res.redirect(302, '/go');
});

// -------------------------------------------
// Serve static files AFTER redirect
// -------------------------------------------
app.use(express.static(__dirname, { extensions: ['html'] }));

// -------------------------------------------
// /download route
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
// /go route (unchanged)
// -------------------------------------------
app.get(['/go', '/go/'], (req, res) => {
  const ua  = String(req.headers['user-agent'] || '');
  const ual = ua.toLowerCase();

  const PKG = 'com.hoyalist.hoyalist';
  const AND_HTTPS = `https://play.google.com/store/apps/details?id=${PKG}`;
  const IOS_HTTPS = 'https://apps.apple.com/us/app/hoyalist/id6740706168';

  const AND_INTENT =
    `intent://details?id=${PKG}` +
    `#Intent;scheme=market;package=com.android.vending;` +
    `S.browser_fallback_url=${encodeURIComponent(AND_HTTPS)};end;`;

  const IOS_ITMS = 'itms-apps://itunes.apple.com/app/id6740706168';

  const isAndroid = ual.includes('android');
  const isIOS = ual.includes('iphone') || ual.includes('ipad') || ual.includes('ipod');

  const isInApp =
    ual.includes('fban') || ual.includes('fbav') || ual.includes('facebook') ||
    ual.includes('instagram') || ual.includes('tiktok') ||
    ual.includes('twitter') || ual.includes('snapchat') ||
    ual.includes('pinterest') || ual.includes('gsa');

  res.set('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0');

  if (isAndroid) {
    if (!isInApp) return res.redirect(302, AND_INTENT);
    return res.redirect(302, AND_HTTPS);
  }
  if (isIOS) {
    if (!isInApp) return res.redirect(302, IOS_ITMS);
    return res.redirect(302, IOS_HTTPS);
  }

  return res.redirect(302, 'https://hoyalistapp.com');
});

// -------------------------------------------
// Health check
// -------------------------------------------
app.get('/healthz', (_req, res) => res.status(200).send('ok'));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ HoyaList server running on port ${PORT}`));
