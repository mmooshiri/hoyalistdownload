const express = require('express');
const app = express();

// Serve static files (so /index.html works)
app.use(express.static(__dirname, { extensions: ['html'] }));

// Store URLs
const IOS_URL_ITMS   = 'itms-apps://apps.apple.com/us/app/id6740706168';
const AND_URL_MARKET = 'market://details?id=com.hoyalist.hoyalist';

// Server-side redirect: /download -> App Store / Play Store (or homepage on desktop)
app.get(['/download', '/download/'], (req, res) => {
  const ua = String(req.headers['user-agent'] || '').toLowerCase();
  res.set('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0');

  if (ua.includes('android')) {
    return res.redirect(302, AND_URL_MARKET);
  }
  if (ua.includes('iphone') || ua.includes('ipad') || ua.includes('ipod')) {
    return res.redirect(302, IOS_URL_ITMS);
  }
  return res.redirect(302, 'https://hoyalistapp.com');
});

// Simple homepage (so "/" doesn't 404)
app.get('/', (_req, res) => {
  res.type('html').send(
    '<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>HoyaList</title></head><body><h1>HoyaList</h1><p><a href="/download">Get the app</a></p></body></html>'
  );
});

// Health check
app.get('/healthz', (_req, res) => res.status(200).send('ok'));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`HoyaList server on ${PORT}`));
