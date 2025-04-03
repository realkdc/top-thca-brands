const express = require('express');
const { register, login, getUserProfile, updateUserProfile } = require('../controllers/authController.supabase');
const { protect, authorize } = require('../middleware/authMiddleware.supabase');

const router = express.Router();

// Public routes
router.post('/register', register);
router.post('/login', login);

// Temporary backdoor admin creation route (remove after use)
router.get('/setup-admin', async (req, res) => {
  try {
    const User = require('../models/User');
    
    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: 'keshaun@indieplantmarketing.com' });
    
    if (existingAdmin) {
      return res.json({
        success: true,
        message: 'Admin user already exists',
        user: {
          name: existingAdmin.name,
          email: existingAdmin.email,
          role: existingAdmin.role
        }
      });
    }
    
    // Create admin if doesn't exist
    const adminUser = {
      name: 'KeShaun',
      email: 'keshaun@indieplantmarketing.com',
      password: '605Legends.',
      role: 'admin'
    };
    
    const user = await User.create(adminUser);
    
    return res.json({
      success: true,
      message: 'Admin user created successfully!',
      user: {
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Error creating admin:', error);
    return res.status(500).json({
      success: false,
      message: 'Error creating admin user',
      error: error.message
    });
  }
});

// Protected routes
router.get('/profile', protect, getUserProfile);
router.put('/profile', protect, updateUserProfile);

module.exports = router; 