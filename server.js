const express = require('express');
const app = express();

// Serve static files (so /index.html works if present)
app.use(express.static(__dirname, { extensions: ['html'] }));

// HEALTH CHECK
app.get('/healthz', (_req, res) => res.status(200).send('ok'));

// /download -> Store pages (safe https-only)
app.get(['/download', '/download/'], (req, res) => {
  const ua = String(req.headers['user-agent'] || '').toLowerCase();
  res.set('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0');

  const IOS_HTTPS = 'https://apps.apple.com/us/app/hoyalist/id6740706168';
  const AND_HTTPS = 'https://play.google.com/store/apps/details?id=com.hoyalist.hoyalist';

  if (ua.includes('android')) return res.redirect(302, AND_HTTPS);
  if (ua.includes('iphone') || ua.includes('ipad') || ua.includes('ipod')) return res.redirect(302, IOS_HTTPS);
  return res.redirect(302, 'https://hoyalistapp.com');
});

// Simple homepage so "/" never 404s
app.get('/', (_req, res) => {
  res.type('html').send(
    '<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>HoyaList</title></head><body><h1>HoyaList</h1><p><a href="/download">Get the app</a></p></body></html>'
  );
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`HoyaList server listening on ${PORT}`));

