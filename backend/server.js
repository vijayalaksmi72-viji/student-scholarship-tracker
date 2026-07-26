// ============================================================
// server.js
// Entry point for the Scholarship Tracker backend API.
// ============================================================

const express = require('express');
const cors = require('cors');
require('dotenv').config();

require('./db'); // initializes the SQLite database on startup

const applicationsRouter = require('./routes/applications');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Simple request logger
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
  next();
});

app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Student Scholarship Application and Disbursement Tracker API',
    endpoints: [
      'GET    /api/health',
      'GET    /api/applications',
      'GET    /api/applications/:id',
      'POST   /api/applications',
      'PUT    /api/applications/:id',
      'DELETE /api/applications/:id',
    ],
  });
});

app.get('/api/health', (req, res) => {
  res.status(200).json({ success: true, status: 'ok', timestamp: new Date().toISOString() });
});

app.use('/api/applications', applicationsRouter);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found.' });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('[Unhandled Error]', err);
  res.status(500).json({ success: false, message: 'Internal server error.' });
});

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`✅ Scholarship Tracker API running on http://localhost:${PORT}`);
  });
}

module.exports = app;
