require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// MongoDB Atlas connection
const MONGODB_URI = 'mongodb+srv://indieplantmarketing:hh3ScQ834zuzLaZy@topthcabrands.ea79zxn.mongodb.net/?retryWrites=true&w=majority&appName=topthcabrands';

console.log('Starting authentication test...');

// Connect to MongoDB
mongoose.connect(MONGODB_URI, {
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 5000,
})
  .then(async () => {
    console.log('✅ Connected to MongoDB Atlas!');
    
    try {
      // Import User model
      const User = require('./src/models/User');
      
      // Test finding a user
      console.log('Looking for admin user...');
      const adminUser = await User.findOne({ email: 'keshaun@indieplantmarketing.com' }).select('+password');
      
      if (!adminUser) {
        console.log('❌ Admin user not found. Creating admin user...');
        
        // Create admin user if not found
        const newAdmin = await User.create({
          name: 'KeShaun',
          email: 'keshaun@indieplantmarketing.com',
          password: '605Legends.',
          role: 'admin'
        });
        
        console.log('✅ Admin user created successfully!');
        console.log(newAdmin);
      } else {
        console.log('✅ Admin user found.');
        console.log({
          name: adminUser.name,
          email: adminUser.email,
          role: adminUser.role
        });
        
        // Test password match
        const testPassword = '605Legends.';
        const isMatch = await bcrypt.compare(testPassword, adminUser.password);
        
        if (isMatch) {
          console.log(`✅ Password "${testPassword}" is correct!`);
        } else {
          console.log(`❌ Password "${testPassword}" is incorrect.`);
        }
      }
    } catch (error) {
      console.error('❌ Error:', error);
    } finally {
      mongoose.disconnect();
      console.log('Disconnected from MongoDB.');
    }
  })
  .catch(err => {
    console.error('❌ MongoDB Connection Error:', err);
    process.exit(1);
  }); 