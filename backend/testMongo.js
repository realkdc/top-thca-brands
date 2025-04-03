require('dotenv').config();
const mongoose = require('mongoose');

// MongoDB Atlas connection
const MONGODB_URI = 'mongodb+srv://indieplantmarketing:hh3ScQ834zuzLaZy@topthcabrands.ea79zxn.mongodb.net/?retryWrites=true&w=majority&appName=topthcabrands';

console.log('Starting MongoDB connection test...');
console.log('Connection string:', MONGODB_URI.replace(/(mongodb\+srv:\/\/[^:]+:)([^@]+)/, '$1[PASSWORD_HIDDEN]'));

// Try to connect with a shorter timeout
mongoose.connect(MONGODB_URI, {
  serverSelectionTimeoutMS: 5000, // 5 seconds timeout
  socketTimeoutMS: 5000
})
  .then(() => {
    console.log('✅ Successfully connected to MongoDB Atlas!');
    // Try to access a collection
    return mongoose.connection.db.listCollections().toArray();
  })
  .then(collections => {
    console.log('✅ Successfully accessed collections in the database!');
    console.log('Collections found:', collections.map(c => c.name).join(', '));
    mongoose.disconnect();
  })
  .catch(err => {
    console.error('❌ MongoDB Connection Error:', err.message);
    if (err.name === 'MongooseServerSelectionError') {
      console.log('\n🔍 Possible causes:');
      console.log('1. IP whitelisting issue: Make sure "0.0.0.0/0" is in MongoDB Atlas Network Access');
      console.log('2. MongoDB Atlas service disruption: Check status.mongodb.com');
      console.log('3. Incorrect connection string or credentials');
    }
    process.exit(1);
  }); 