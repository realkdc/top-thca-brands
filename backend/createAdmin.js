require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const readline = require('readline');

// MongoDB Atlas connection
const MONGODB_URI = 'mongodb+srv://indieplantmarketing:hh3ScQ834zuzLaZy@topthcabrands.ea79zxn.mongodb.net/?retryWrites=true&w=majority&appName=topthcabrands';

// Connect to MongoDB with improved options
console.log('Connecting to MongoDB Atlas...');
mongoose.connect(MONGODB_URI, {
  // Add connection options to handle timeout issues
  serverSelectionTimeoutMS: 30000, // 30 seconds
  socketTimeoutMS: 45000, // 45 seconds
  connectTimeoutMS: 30000, // 30 seconds
  keepAlive: true,
  keepAliveInitialDelay: 300000 // 5 minutes
})
  .then(() => console.log('Connected to MongoDB Atlas successfully!'))
  .catch(err => {
    console.error('Could not connect to MongoDB:', err);
    process.exit(1);
  });

// Get the User model
const User = require('./src/models/User');

// Create readline interface for input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Function to ask questions to the user
function askQuestion(query) {
  return new Promise(resolve => {
    rl.question(query, resolve);
  });
}

// Create the admin user
async function createAdmin() {
  try {
    console.log('===============================================');
    console.log('Creating Specific Admin User');
    console.log('===============================================');
    
    // Admin user details
    const adminUser = {
      name: 'KeShaun',
      email: 'keshaun@indieplantmarketing.com',
      password: '605Legends.',
      role: 'admin'
    };

    // Check if user already exists
    const existingUser = await User.findOne({ email: adminUser.email });
    if (existingUser) {
      console.log(`Admin user with email ${adminUser.email} already exists`);
      process.exit(0);
    }

    // Create new user
    const user = await User.create(adminUser);
    console.log('Admin user created successfully!');
    console.log(`Name: ${user.name}`);
    console.log(`Email: ${user.email}`);
    console.log(`Role: ${user.role}`);
    console.log('\nYou can now log in to the admin dashboard at: https://topthcabrands.netlify.app/admin');
  } catch (error) {
    console.error('Error creating admin user:', error);
  } finally {
    mongoose.disconnect();
    rl.close();
  }
}

createAdmin(); 