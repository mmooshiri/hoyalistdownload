const express = require('express');
const path = require('path');
const app = express();

// Serve static files (for index.html, etc.)
app.use(express.static(__dirname, { extensions: ['html'] }));

// Direct /download to open the correct store app
app.get(['/download', '/download/'], (req, res) => {
  const ua = (req.headers['user-agent'] || '').toLowerCase();

  const IOS_URL_ITMS   = 'itms-apps://apps.apple.com/us/app/id6740706168';
  const AND_URL_MARKET = 'market://details?id=com.hoyalist.hoyalist';
  const IOS_URL_HTTPS  = 'https://apps.apple.com/us/app/hoyalist/id6740706168';
  const AND_URL_HTTPS  = 'https://play.google.com/store/apps/details?id=com.hoyalist.hoyalist';

  res.set('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0');

  if (ua.includes('android')) {
    // Try to open Play Store directly
    return res.redirect(302, AND_URL_MARKET);
  }
  if (/(iphone|ipad|ipod)/.test(ua)) {
    // Try to open App Store directly
    return res.redirect(302, IOS_URL_ITMS);
  }

  // Desktop fallback
  return res.redirect(302, 'https://hoyalistapp.com');
});

// Simple homepage
app.get('/', (_req, res) => {
  res.type('html').send(`
    <!doctype html><html lang="en"><head>
    <meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
    <title>HoyaList</title></head>
    <body><h1>HoyaList</h1><p><a href="/download">Get the app</a></p></body>
    </html>
  `);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(\`HoyaList server running on port \${PORT}\`));
