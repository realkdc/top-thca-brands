require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const readline = require('readline');

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
    console.log('Creating Admin User for Top THCA Brands Website');
    console.log('===============================================');
    
    // Get admin details from user input
    const name = await askQuestion('Enter admin name: ');
    const email = await askQuestion('Enter admin email: ');
    const password = await askQuestion('Enter admin password (min 6 characters): ');
    
    // Admin user details
    const adminUser = {
      name: name || 'Admin User',
      email: email || 'admin@example.com',
      password: password || 'admin123!',
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