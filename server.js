const express = require('express');
const path = require('path');
const app = express();

// Serve everything in the repo (so /download/index.html is available)
app.use(express.static(__dirname, { extensions: ['html'] }));

// Explicit route for /download -> serve the HTML redirect page
app.get('/download', (_req, res) => {
  res.sendFile(path.join(__dirname, 'download', 'index.html'));
});

// Health check (optional)
app.get('/healthz', (_req, res) => res.status(200).send('ok'));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`HoyaList download server on ${PORT}`));
