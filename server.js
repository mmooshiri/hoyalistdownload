// --- BEGIN GUARDED DIRECT-OPEN ROUTE ---
app.get(['/download', '/download/'], (req, res) => {
  const ua = String(req.headers['user-agent'] || '').toLowerCase();
  res.set('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0');

  // Android
  const AND_PKG   = 'com.hoyalist.hoyalist';
  const AND_HTTPS = `https://play.google.com/store/apps/details?id=${AND_PKG}`;
  const AND_INTENT =
    `intent://details?id=${AND_PKG}` +
    `#Intent;scheme=market;package=com.android.vending;` +
    `S.browser_fallback_url=${encodeURIComponent(AND_HTTPS)};end;`;

  // iOS
  const IOS_HTTPS = 'https://apps.apple.com/us/app/hoyalist/id6740706168';
  const IOS_ITMS  = 'itms-apps://apps.apple.com/us/app/id6740706168';

  const isAndroid = ua.includes('android');
  const isIOS     = ua.includes('iphone') || ua.includes('ipad') || ua.includes('ipod');

  try {
    if (isAndroid) {
      // Prefer Play Store app via Intent (falls back to https automatically)
      return res.redirect(302, AND_INTENT);
    }
    if (isIOS) {
      // Prefer App Store app; iOS may show a system prompt (expected)
      return res.redirect(302, IOS_ITMS);
    }
  } catch (e) {
    console.error('Direct scheme redirect failed:', e);
  }

  // Fallbacks (never crash)
  if (isAndroid) return res.redirect(302, AND_HTTPS);
  if (isIOS)     return res.redirect(302, IOS_HTTPS);
  return res.redirect(302, 'https://hoyalistapp.com');
});
// --- END GUARDED DIRECT-OPEN ROUTE ---
