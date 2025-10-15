const express = require('express');
const path = require('path');
const app = express();

// Serve static files from repo root (so /index.html and /download/index.html work)
app.use(express.static(__dirname, { extensions: ['html'] }));

// Explicit route for /download (optional but fine)
app.get('/download', (_req, res) => {
  res.sendFile(path.join(__dirname, 'download', 'index.html'));
});

// Health check (optional)
app.get('/healthz', (_req, res) => res.status(200).send('ok'));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`HoyaList server on ${PORT}`));
