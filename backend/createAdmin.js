require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// MongoDB Atlas connection
const MONGODB_URI = 'mongodb+srv://indieplantmarketing:hh3ScQ834zuzLaZy@topthcabrands.ea79zxn.mongodb.net/?retryWrites=true&w=majority&appName=topthcabrands';

// Connect to MongoDB
mongoose.connect(MONGODB_URI)
  .then(() => console.log('Connected to MongoDB Atlas successfully!'))
  .catch(err => {
    console.error('Could not connect to MongoDB:', err);
    process.exit(1);
  });

// Get the User model
const User = require('./src/models/User');

// Admin user details
const adminUser = {
  name: 'Admin User',
  email: 'admin@example.com', // Change this to your email
  password: 'admin123!', // Change this to a secure password
  role: 'admin'
};

// Create the admin user
async function createAdmin() {
  try {
    // Check if user already exists
    const existingUser = await User.findOne({ email: adminUser.email });
    if (existingUser) {
      console.log('Admin user already exists');
      process.exit(0);
    }

    // Create new user
    const user = await User.create(adminUser);
    console.log('Admin user created successfully:', user.email);
  } catch (error) {
    console.error('Error creating admin user:', error);
  } finally {
    mongoose.disconnect();
  }
}

createAdmin(); 