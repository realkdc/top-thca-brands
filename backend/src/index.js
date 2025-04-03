require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');

// Import routes
const brandRoutes = require('./routes/brands');
const contactRoutes = require('./routes/contact');
const authRoutes = require('./routes/auth');
const adminRoutes = require('./routes/admin');

// Create Express app
const app = express();
const PORT = process.env.PORT || 5001;

// Connect to MongoDB with improved options
console.log('Connecting to MongoDB...');
mongoose.connect(process.env.MONGODB_URI, {
  // Set shorter timeouts to fail fast and provide better diagnostics
  serverSelectionTimeoutMS: 5000, // 5 seconds
  socketTimeoutMS: 10000,
  connectTimeoutMS: 10000,
  family: 4 // Force IPv4
})
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => {
    console.error('Could not connect to MongoDB:', err);
    // Don't crash the server on MongoDB connection failure
    console.log('Continuing without MongoDB connection. Some features may not work.');
  });

// Add MongoDB connection status endpoint
app.get('/api/db-status', (req, res) => {
  const status = mongoose.connection.readyState;
  const statusText = {
    0: 'disconnected',
    1: 'connected',
    2: 'connecting',
    3: 'disconnecting'
  }[status];
  
  res.json({
    status,
    statusText,
    message: status === 1 ? 'Database connected' : 'Database not connected'
  });
});

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || '*',
  credentials: true
}));
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// Static files directory for uploads
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Routes
app.use('/api/brands', brandRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);

// Health check route
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK' });
});

// API root route
app.get('/', (req, res) => {
  res.json({ 
    message: 'Top THCA Brands API', 
    version: '1.0.0',
    endpoints: [
      '/api/brands',
      '/api/contact',
      '/api/auth',
      '/api/admin',
      '/api/db-status'
    ] 
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : {}
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 