require('dotenv').config();
const supabase = require('./supabaseClient');
const bcrypt = require('bcryptjs');

/**
 * Create the users table in Supabase
 */
const createUsersTable = async () => {
  console.log('Creating users table...');
  
  // SQL to create users table
  const createTableSQL = `
    CREATE TABLE IF NOT EXISTS users (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      role TEXT NOT NULL DEFAULT 'editor',
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );
    
    CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
    CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
  `;
  
  try {
    // Execute SQL using Supabase
    const { error } = await supabase.rpc('exec_sql', { sql: createTableSQL });
    
    if (error) throw error;
    
    console.log('✅ Users table created successfully');
  } catch (error) {
    console.error('❌ Error creating users table:', error);
  }
};

/**
 * Create the brands table in Supabase
 */
const createBrandsTable = async () => {
  console.log('Creating brands table...');
  
  // SQL to create brands table
  const createTableSQL = `
    CREATE TABLE IF NOT EXISTS brands (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      name TEXT NOT NULL,
      description TEXT,
      logo TEXT,
      website_url TEXT,
      rank INTEGER NOT NULL,
      is_active BOOLEAN DEFAULT TRUE,
      thc_percentage TEXT,
      cbd_percentage TEXT,
      product_types TEXT[],
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );
    
    CREATE INDEX IF NOT EXISTS idx_brands_rank ON brands(rank);
    CREATE INDEX IF NOT EXISTS idx_brands_is_active ON brands(is_active);
  `;
  
  try {
    // Execute SQL using Supabase
    const { error } = await supabase.rpc('exec_sql', { sql: createTableSQL });
    
    if (error) throw error;
    
    console.log('✅ Brands table created successfully');
  } catch (error) {
    console.error('❌ Error creating brands table:', error);
  }
};

/**
 * Create the contacts table in Supabase
 */
const createContactsTable = async () => {
  console.log('Creating contacts table...');
  
  // SQL to create contacts table
  const createTableSQL = `
    CREATE TABLE IF NOT EXISTS contacts (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      message TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'pending',
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );
    
    CREATE INDEX IF NOT EXISTS idx_contacts_status ON contacts(status);
    CREATE INDEX IF NOT EXISTS idx_contacts_created_at ON contacts(created_at);
  `;
  
  try {
    // Execute SQL using Supabase
    const { error } = await supabase.rpc('exec_sql', { sql: createTableSQL });
    
    if (error) throw error;
    
    console.log('✅ Contacts table created successfully');
  } catch (error) {
    console.error('❌ Error creating contacts table:', error);
  }
};

/**
 * Create an initial admin user
 */
const createAdminUser = async () => {
  console.log('Checking for existing admin user...');
  
  try {
    // Check if admin already exists
    const { data: existingAdmins, error: queryError } = await supabase
      .from('users')
      .select('*')
      .eq('role', 'admin')
      .limit(1);
    
    if (queryError) throw queryError;
    
    if (existingAdmins && existingAdmins.length > 0) {
      console.log('✅ Admin user already exists');
      return;
    }
    
    // Hash password
    const salt = await bcrypt.genSalt(10);
    const password = await bcrypt.hash('admin123', salt);
    
    // Create admin user
    const { data: user, error } = await supabase
      .from('users')
      .insert([{
        name: 'Admin User',
        email: 'admin@example.com',
        password,
        role: 'admin'
      }])
      .select()
      .single();
    
    if (error) throw error;
    
    console.log(`✅ Admin user created successfully with email: ${user.email}`);
    console.log('   Default password: admin123');
    console.log('   Please change this password after first login!');
  } catch (error) {
    console.error('❌ Error creating admin user:', error);
  }
};

/**
 * Setup Supabase Storage buckets
 */
const setupStorage = async () => {
  console.log('Setting up storage buckets...');
  
  try {
    // Create brand-images bucket
    const { data: bucket, error } = await supabase.storage.createBucket('brand-images', {
      public: true,
      allowedMimeTypes: ['image/png', 'image/jpeg', 'image/gif', 'image/webp'],
      fileSizeLimit: 5242880 // 5MB
    });
    
    if (error && !error.message.includes('already exists')) throw error;
    
    console.log('✅ Storage bucket created or already exists');
  } catch (error) {
    console.error('❌ Error setting up storage:', error);
  }
};

/**
 * Run all setup functions
 */
const setupDatabase = async () => {
  console.log('Beginning Supabase setup...');
  
  try {
    // Create tables
    await createUsersTable();
    await createBrandsTable();
    await createContactsTable();
    
    // Setup storage
    await setupStorage();
    
    // Create admin user
    await createAdminUser();
    
    console.log('🎉 Supabase setup completed successfully!');
  } catch (error) {
    console.error('❌ Error during Supabase setup:', error);
  } finally {
    process.exit();
  }
};

// Run setup if this file is executed directly
if (require.main === module) {
  setupDatabase();
}

module.exports = {
  setupDatabase,
  createUsersTable,
  createBrandsTable,
  createContactsTable,
  createAdminUser,
  setupStorage
}; 