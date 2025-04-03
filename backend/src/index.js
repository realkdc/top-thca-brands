require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');

// Import Supabase client
const supabase = require('./utils/supabaseClient');

// Import routes
const brandRoutes = require('./routes/brands');
const contactRoutes = require('./routes/contact');
const authRoutes = require('./routes/auth');
const adminRoutes = require('./routes/admin');

// Create Express app
const app = express();
const PORT = process.env.PORT || 5001;

// Replace MongoDB connection with Supabase connection status logging
console.log('Initializing Supabase connection...');
supabase.from('brands').select('count').then(({ data, error }) => {
  if (error) {
    console.error('Could not connect to Supabase:', error.message);
  } else {
    console.log('Connected to Supabase successfully');
  }
});

// Replace MongoDB status endpoint with Supabase status endpoint
app.get('/api/db-status', async (req, res) => {
  const { data, error } = await supabase.from('brands').select('count');
  
  if (error) {
    res.json({
      status: 0,
      statusText: 'disconnected',
      message: 'Database not connected: ' + error.message
    });
  } else {
    res.json({
      status: 1,
      statusText: 'connected',
      message: 'Supabase database connected'
    });
  }
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