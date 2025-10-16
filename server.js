// Direct-open when safe; fall back to HTTPS for in-app browsers
app.get(['/download', '/download/'], (req, res) => {
  const ua = String(req.headers['user-agent'] || '');
  const ual = ua.toLowerCase();

  // Store URLs
  const PKG          = 'com.hoyalist.hoyalist';
  const AND_HTTPS    = `https://play.google.com/store/apps/details?id=${PKG}`;
  const AND_INTENT   =
    `intent://details?id=${PKG}` +
    `#Intent;scheme=market;package=com.android.vending;` +
    `S.browser_fallback_url=${encodeURIComponent(AND_HTTPS)};end;`;

  const IOS_HTTPS    = 'https://apps.apple.com/us/app/hoyalist/id6740706168';
  const IOS_ITMS     = 'itms-apps://apps.apple.com/us/app/id6740706168';

  // Heuristics
  const isAndroid    = ual.includes('android');
  const isIOS        = ual.includes('iphone') || ual.includes('ipad') || ual.includes('ipod');
  const isChrome     = isAndroid && ual.includes('chrome');                 // Android Chrome
  const isSafari     = isIOS && ual.includes('safari') && !ual.includes('crios') && !ual.includes('fxios');

  // Common in-app browsers that often block/app-prompt
  const isInApp =
    ual.includes('fban') || ual.includes('fbav') || ual.includes('facebook') ||
    ual.includes('instagram') || ual.includes('line/') || ual.includes('tiktok') ||
    ual.includes('twitter') || ual.includes('snapchat') || ual.includes('pinterest') ||
    ual.includes('gsa'); // Google Search app

  // Optional override: /download?direct=1 forces direct-open even in in-app UAs
  const forceDirect = req.query.direct === '1';

  res.set('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0');

  // ANDROID
  if (isAndroid) {
    if (!isInApp || forceDirect) {
      // Best experience: open Play Store app; falls back to HTTPS automatically if intents unsupported
      return res.redirect(302, AND_INTENT);
    }
    // In-app browsers: use HTTPS (fewer surprises)
    return res.redirect(302, AND_HTTPS);
  }

  // iOS
  if (isIOS) {
    if (!isInApp || forceDirect) {
      // Best experience: open App Store app (Safari will show a small system prompt)
      return res.redirect(302, IOS_ITMS);
    }
    // In-app browsers: use HTTPS
    return res.redirect(302, IOS_HTTPS);
  }

  // Desktop fallback
  return res.redirect(302, 'https://hoyalistapp.com');
});