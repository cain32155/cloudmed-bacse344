const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const doctorsRoutes = require('./routes/doctors');
const patientsRoutes = require('./routes/patients');
const appointmentsRoutes = require('./routes/appointments');
const analyticsRoutes = require('./routes/analytics');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request Logging Middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
  next();
});

// REST API Routes
app.use('/api/doctors', doctorsRoutes);
app.use('/api/patients', patientsRoutes);
app.use('/api/appointments', appointmentsRoutes);
app.use('/api/analytics', analyticsRoutes);

// Health Check & Cloud Status Endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    service: 'CloudMed REST API',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    cloudEnvironment: process.env.NODE_ENV || 'development'
  });
});

// Serve frontend build static files if present
const clientDistPath = path.join(__dirname, '../client/dist');
const publicPath = path.join(__dirname, 'public');

if (require('fs').existsSync(clientDistPath)) {
  app.use(express.static(clientDistPath));
  app.get('*', (req, res) => {
    if (!req.originalUrl.startsWith('/api')) {
      res.sendFile(path.join(clientDistPath, 'index.html'));
    }
  });
} else if (require('fs').existsSync(publicPath)) {
  app.use(express.static(publicPath));
  app.get('*', (req, res) => {
    if (!req.originalUrl.startsWith('/api')) {
      res.sendFile(path.join(publicPath, 'index.html'));
    }
  });
}

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled Error:', err.stack);
  res.status(500).json({ success: false, error: 'Internal Server Error', message: err.message });
});

// Start Server
app.listen(PORT, () => {
  console.log(`====================================================`);
  console.log(`🚀 CloudMed REST API Server running on port ${PORT}`);
  console.log(`🏥 Health Check: http://localhost:${PORT}/api/health`);
  console.log(`====================================================`);
});
