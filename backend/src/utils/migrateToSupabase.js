require('dotenv').config();
const mongoose = require('mongoose');
const supabase = require('./supabaseClient');

// MongoDB Models
const User = require('../models/userModel');
const Brand = require('../models/brandModel');
const Contact = require('../models/contactModel');

/**
 * Connects to MongoDB
 */
const connectMongoDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
    process.exit(1);
  }
};

/**
 * Migrate users from MongoDB to Supabase
 */
const migrateUsers = async () => {
  console.log('Migrating users...');
  
  try {
    // Fetch all users from MongoDB
    const users = await User.find({});
    console.log(`Found ${users.length} users in MongoDB`);
    
    if (users.length === 0) {
      console.log('No users to migrate');
      return;
    }
    
    // Transform users for Supabase
    const supabaseUsers = users.map(user => ({
      id: user._id.toString(), // Use MongoDB _id as Supabase id
      name: user.name,
      email: user.email,
      password: user.password, // Password is already hashed in MongoDB
      role: user.role || 'editor',
      created_at: user.createdAt || new Date().toISOString(),
      updated_at: user.updatedAt || new Date().toISOString()
    }));
    
    // Insert users into Supabase
    for (const user of supabaseUsers) {
      const { data, error } = await supabase.from('users').upsert([user]);
      
      if (error) {
        console.error(`Error migrating user ${user.email}:`, error);
      } else {
        console.log(`Migrated user: ${user.email}`);
      }
    }
    
    console.log('✅ Users migration completed');
  } catch (error) {
    console.error('❌ Error migrating users:', error);
  }
};

/**
 * Migrate brands from MongoDB to Supabase
 */
const migrateBrands = async () => {
  console.log('Migrating brands...');
  
  try {
    // Fetch all brands from MongoDB
    const brands = await Brand.find({});
    console.log(`Found ${brands.length} brands in MongoDB`);
    
    if (brands.length === 0) {
      console.log('No brands to migrate');
      return;
    }
    
    // Transform brands for Supabase
    const supabaseBrands = brands.map(brand => ({
      id: brand._id.toString(), // Use MongoDB _id as Supabase id
      name: brand.name,
      description: brand.description || '',
      logo: brand.logo || '',
      website_url: brand.websiteUrl || '',
      rank: brand.rank || 999,
      is_active: brand.isActive || true,
      thc_percentage: brand.thcPercentage || '',
      cbd_percentage: brand.cbdPercentage || '',
      product_types: brand.productTypes || [],
      created_at: brand.createdAt || new Date().toISOString(),
      updated_at: brand.updatedAt || new Date().toISOString()
    }));
    
    // Insert brands into Supabase
    for (const brand of supabaseBrands) {
      const { data, error } = await supabase.from('brands').upsert([brand]);
      
      if (error) {
        console.error(`Error migrating brand ${brand.name}:`, error);
      } else {
        console.log(`Migrated brand: ${brand.name}`);
      }
    }
    
    console.log('✅ Brands migration completed');
  } catch (error) {
    console.error('❌ Error migrating brands:', error);
  }
};

/**
 * Migrate contacts from MongoDB to Supabase
 */
const migrateContacts = async () => {
  console.log('Migrating contacts...');
  
  try {
    // Fetch all contacts from MongoDB
    const contacts = await Contact.find({});
    console.log(`Found ${contacts.length} contacts in MongoDB`);
    
    if (contacts.length === 0) {
      console.log('No contacts to migrate');
      return;
    }
    
    // Transform contacts for Supabase
    const supabaseContacts = contacts.map(contact => ({
      id: contact._id.toString(), // Use MongoDB _id as Supabase id
      name: contact.name,
      email: contact.email,
      message: contact.message,
      status: contact.status || 'pending',
      created_at: contact.createdAt || new Date().toISOString(),
      updated_at: contact.updatedAt || new Date().toISOString()
    }));
    
    // Insert contacts into Supabase
    for (const contact of supabaseContacts) {
      const { data, error } = await supabase.from('contacts').upsert([contact]);
      
      if (error) {
        console.error(`Error migrating contact from ${contact.email}:`, error);
      } else {
        console.log(`Migrated contact: ${contact.email}`);
      }
    }
    
    console.log('✅ Contacts migration completed');
  } catch (error) {
    console.error('❌ Error migrating contacts:', error);
  }
};

/**
 * Migrate all data from MongoDB to Supabase
 */
const migrateData = async () => {
  console.log('Starting migration from MongoDB to Supabase...');
  
  try {
    // Connect to MongoDB
    const mongoConnection = await connectMongoDB();
    
    // Run migrations
    await migrateUsers();
    await migrateBrands();
    await migrateContacts();
    
    console.log('🎉 Migration completed successfully!');
    
    // Close MongoDB connection
    await mongoose.connection.close();
    console.log('MongoDB connection closed');
  } catch (error) {
    console.error('❌ Migration failed:', error);
  } finally {
    process.exit();
  }
};

// Run migration if this file is executed directly
if (require.main === module) {
  migrateData();
}

module.exports = {
  migrateData,
  migrateUsers,
  migrateBrands,
  migrateContacts
}; 