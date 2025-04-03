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
  origin: function(origin, callback) {
    // Allow requests with no origin (like mobile apps, curl requests)
    if (!origin) return callback(null, true);
    
    // Define allowed origins - both with and without trailing slash
    const allowedOrigins = [
      'https://topthcabrands.netlify.app',
      'https://topthcabrands.netlify.app/',
      process.env.CLIENT_URL,
      process.env.CLIENT_URL + '/',
      'http://localhost:5173',
      'http://localhost:5173/'
    ];
    
    if (allowedOrigins.indexOf(origin) !== -1 || process.env.NODE_ENV !== 'production') {
      callback(null, true);
    } else {
      console.log('CORS blocked request from:', origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// Static files directory for uploads
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Add explicit handling for OPTIONS requests (CORS preflight)
app.options('*', cors());

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