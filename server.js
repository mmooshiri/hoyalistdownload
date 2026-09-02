const express = require('express');
const app = express();

// -------------------------------------------
// Root redirect
// -------------------------------------------
app.get('/', (req, res) => {
  res.set(
    'Cache-Control',
    'no-store, no-cache, must-revalidate, max-age=0'
  );

  return res.redirect(302, '/go');
});

// -------------------------------------------
// Project-specific HoyaList link
// -------------------------------------------
app.get(['/project', '/project/'], (req, res) => {
  res.set(
    'Cache-Control',
    'no-store, no-cache, must-revalidate, max-age=0'
  );

  const projectID = String(req.query.id || '').trim();

  if (!projectID) {
    return res.redirect(302, '/go');
  }

  return res.redirect(
    302,
    `/go?projectID=${encodeURIComponent(projectID)}`
  );
});

// -------------------------------------------
// Android App Links verification
// -------------------------------------------
app.get('/.well-known/assetlinks.json', (req, res) => {

  res.set('Content-Type', 'application/json');

  return res.json([
    {
      relation: [
        'delegate_permission/common.handle_all_urls'
      ],
      target: {
        namespace: 'android_app',
        package_name: 'com.hoyalist.hoyalist',
        sha256_cert_fingerprints: [
       '0F:65:BD:6E:88:4F:EB:9F:79:6C:50:6D:38:7D:BA:C7:F1:13:9B:C7:37:94:20:AD:67:0B:8E:48:3D:C7:D6:AB',
       '52:3F:DC:EA:88:89:08:FB:F0:92:54:8A:F1:9E:EC:4F:EE:86:CC:34:10:24:8F:1A:AA:2B:DA:13:0A:23:F0:C2'
       ]
      }
    }
  ]);
});

// -------------------------------------------
// Serve static files
// -------------------------------------------
app.use(
  express.static(__dirname, {
    extensions: ['html']
  })
);

// -------------------------------------------
// /download route
// -------------------------------------------
app.get(['/download', '/download/'], (req, res) => {
  const ua = String(
    req.headers['user-agent'] || ''
  ).toLowerCase();

  res.set(
    'Cache-Control',
    'no-store, no-cache, must-revalidate, max-age=0'
  );

  const IOS_HTTPS =
    'https://apps.apple.com/us/app/hoyalist/id6740706168';

  const AND_HTTPS =
    'https://play.google.com/store/apps/details?id=com.hoyalist.hoyalist';

  if (ua.includes('android')) {
    return res.redirect(302, AND_HTTPS);
  }

  if (
    ua.includes('iphone') ||
    ua.includes('ipad') ||
    ua.includes('ipod')
  ) {
    return res.redirect(302, IOS_HTTPS);
  }

  return res.redirect(
    302,
    'https://hoyalistapp.com'
  );
});

// -------------------------------------------
// /go route
// -------------------------------------------
app.get(['/go', '/go/'], (req, res) => {
  const ua = String(
    req.headers['user-agent'] || ''
  );

  const ual = ua.toLowerCase();

  // Project ID is now available here.
  // We will use this in the next step.
  const projectID = String(
    req.query.projectID || ''
  ).trim();

  const PKG =
    'com.hoyalist.hoyalist';

  const AND_HTTPS =
    `https://play.google.com/store/apps/details?id=${PKG}`;

  const IOS_HTTPS =
    'https://apps.apple.com/us/app/hoyalist/id6740706168';

  const AND_INTENT =
    `intent://details?id=${PKG}` +
    `#Intent;scheme=market;` +
    `package=com.android.vending;` +
    `S.browser_fallback_url=${encodeURIComponent(AND_HTTPS)};end;`;

  const IOS_ITMS =
    'itms-apps://itunes.apple.com/app/id6740706168';

  const isAndroid =
    ual.includes('android');

  const isIOS =
    ual.includes('iphone') ||
    ual.includes('ipad') ||
    ual.includes('ipod');

  const isInApp =
    ual.includes('fban') ||
    ual.includes('fbav') ||
    ual.includes('facebook') ||
    ual.includes('instagram') ||
    ual.includes('tiktok') ||
    ual.includes('twitter') ||
    ual.includes('snapchat') ||
    ual.includes('pinterest') ||
    ual.includes('gsa');

  res.set(
    'Cache-Control',
    'no-store, no-cache, must-revalidate, max-age=0'
  );

  // Helpful temporary logging.
  // You can remove this later.
  if (projectID) {
    console.log(
      `Project link received: ${projectID}`
    );
  }

  if (isAndroid) {
    if (!isInApp) {
      return res.redirect(
        302,
        AND_INTENT
      );
    }

    return res.redirect(
      302,
      AND_HTTPS
    );
  }

  if (isIOS) {
    if (!isInApp) {
      return res.redirect(
        302,
        IOS_ITMS
      );
    }

    return res.redirect(
      302,
      IOS_HTTPS
    );
  }

   return res.sendFile(
  __dirname + '/index.html'
);
});

// -------------------------------------------
// Health check
// -------------------------------------------
app.get(
  '/healthz',
  (_req, res) => {
    res.status(200).send('ok');
  }
);

const PORT =
  process.env.PORT || 3000;

app.listen(
  PORT,
  () =>
    console.log(
      `✅ HoyaList server running on port ${PORT}`
    )
);
