const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
require('dotenv').config();

const { initializeDatabase } = require('./database');
const plantsRouter = require('./routes/plants');
const usersRouter = require('./routes/users');
const analysisRouter = require('./routes/analysis');

const app = express();
const PORT = process.env.PORT || 5000;

// CSP headers for Flutter web (allows WASM and CanvasKit from gstatic)
app.use((req, res, next) => {
  res.setHeader('Content-Security-Policy',
    "default-src 'self' https://www.gstatic.com; " +
    "script-src 'self' 'unsafe-inline' 'unsafe-eval' 'wasm-unsafe-eval' https://www.gstatic.com; " +
    "script-src-elem 'self' 'unsafe-inline' https://www.gstatic.com; " +
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; " +
    "img-src 'self' data: blob: https:; " +
    "font-src 'self' data: https://fonts.gstatic.com; " +
    "connect-src * data: blob:; " +
    "worker-src 'self' blob:;"
  );
  next();
});

// Middleware
app.use(cors({ origin: process.env.CORS_ORIGIN || '*' }));
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

// Initialize database
initializeDatabase();

// Routes
app.use('/api/plants', plantsRouter);
app.use('/api/users', usersRouter);
app.use('/api/analysis', analysisRouter);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'Plant Health Analysis API is running',
    timestamp: new Date().toISOString()
  });
});

// Serve Flutter web app with mobile fixes
const publicPath = path.join(__dirname, 'public');
const fs = require('fs');

// Middleware to inject viewport meta tag for mobile compatibility (BEFORE static files)
app.get('/', (req, res) => {
  let html = fs.readFileSync(path.join(publicPath, 'index.html'), 'utf8');

  // Ensure viewport meta tag exists for mobile rendering
  if (!html.includes('name="viewport"')) {
    html = html.replace(
      '<meta name="description"',
      '<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">\n  <meta name="description"'
    );
  }

  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  res.type('text/html');
  res.send(html);
});

// Serve static files
app.use(express.static(publicPath));

// Fallback for SPA routing - catch all other routes and serve index.html
app.use((req, res) => {
  let html = fs.readFileSync(path.join(publicPath, 'index.html'), 'utf8');

  if (!html.includes('name="viewport"')) {
    html = html.replace(
      '<meta name="description"',
      '<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">\n  <meta name="description"'
    );
  }

  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  res.type('text/html');
  res.send(html);
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ error: 'Internal server error', message: err.message });
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

// Start server
app.listen(PORT, () => {
  console.log(`\n🌱 Plant Health API Server running on http://localhost:${PORT}`);
  console.log(`📍 Health check: http://localhost:${PORT}/api/health\n`);
});
