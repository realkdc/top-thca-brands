require('dotenv').config();
const bcrypt = require('bcryptjs');
const supabase = require('./src/utils/supabaseClient');
const { v4: uuidv4 } = require('uuid');

/**
 * Force create an admin user by directly using SQL
 */
async function forceCreateAdmin() {
  try {
    console.log('Force creating admin user...');
    
    // Step 1: Try to delete any existing user with the email
    const { error: deleteError } = await supabase
      .from('users')
      .delete()
      .eq('email', 'keshaun@indieplantmarketing.com');
    
    if (deleteError) {
      console.log(`Note: Delete operation result: ${deleteError.message}`);
    } else {
      console.log('Any existing user with that email was deleted.');
    }
    
    // Step 2: Create a simple password hash
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('admin123', salt);
    
    // Step 3: Insert new user
    console.log('Creating new admin user...');
    const { data, error } = await supabase
      .from('users')
      .insert([
        {
          id: uuidv4(),
          name: 'KeShaun',
          email: 'keshaun@indieplantmarketing.com',
          password: hashedPassword,
          role: 'admin',
          created_at: new Date().toISOString()
        }
      ])
      .select()
      .single();
    
    if (error) {
      throw new Error(`Error inserting user: ${error.message}`);
    }
    
    console.log('✅ Admin user created successfully!');
    console.log({
      id: data.id,
      name: data.name,
      email: data.email,
      role: data.role
    });
    
    console.log('\nLOGIN CREDENTIALS:');
    console.log('Email: keshaun@indieplantmarketing.com');
    console.log('Password: admin123');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

// Run the function
forceCreateAdmin();
