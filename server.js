app.get(['/download', '/download/'], (req, res) => {
  const ua = String(req.headers['user-agent'] || '').toLowerCase();
  res.set('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0');

  // Store URLs
  const AND_PKG = 'com.hoyalist.hoyalist';
  const AND_HTTPS = `https://play.google.com/store/apps/details?id=${AND_PKG}`;
  // Android Intent: opens Play Store app; falls back to https if not supported
  const AND_INTENT =
    `intent://details?id=${AND_PKG}#Intent;scheme=market;package=com.android.vending;` +
    `S.browser_fallback_url=${encodeURIComponent(AND_HTTPS)};end;`;

  const IOS_HTTPS = 'https://apps.apple.com/us/app/hoyalist/id6740706168';
  // iOS app-store scheme (opens App Store app from Safari/most browsers)
  const IOS_ITMS = 'itms-apps://apps.apple.com/us/app/id6740706168';

  // Known “in-app browsers” often block custom schemes (can’t fully bypass)
  const isFB = ua.includes('fban') || ua.includes('fbav') || ua.includes('facebook');
  const isIG = ua.includes('instagram');
  const isTT = ua.includes('tiktok');
  const isX  = ua.includes('twitter');

  if (ua.includes('android')) {
    // Prefer Intent (fastest). Some in-app browsers may still show a confirm sheet.
    return res.redirect(302, AND_INTENT);
  }

  if (ua.includes('iphone') || ua.includes('ipad') || ua.includes('ipod')) {
    // Prefer App Store app; some in-app browsers will still prompt the user (cannot be skipped)
    return res.redirect(302, IOS_ITMS);
  }

  // Desktop fallback
  return res.redirect(302, 'https://hoyalistapp.com');
});
