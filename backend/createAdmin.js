require('dotenv').config();
const bcrypt = require('bcryptjs');
const supabase = require('./src/utils/supabaseClient');
const { v4: uuidv4 } = require('uuid');

/**
 * Create an admin user in the Supabase database
 */
async function createAdminUser() {
  console.log('Creating admin user in Supabase...');
  
  try {
    // Admin user details
    const adminEmail = 'keshaun@indieplantmarketing.com';
    const adminPassword = '605Legends.';
    const adminName = 'KeShaun';
    
    // Check if user already exists
    console.log(`Checking if user ${adminEmail} already exists...`);
    const { data: existingUser, error: checkError } = await supabase
      .from('users')
      .select('*')
      .eq('email', adminEmail)
      .maybeSingle();
    
    if (checkError) {
      throw new Error(`Error checking for existing user: ${checkError.message}`);
    }
    
    if (existingUser) {
      console.log('✅ Admin user already exists:');
      console.log({
        name: existingUser.name,
        email: existingUser.email,
        role: existingUser.role
      });
      return;
    }
    
    // Hash password
    console.log('Hashing password...');
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(adminPassword, salt);
    
    // Create user with UUID
    const userId = uuidv4();
    
    // Insert user into Supabase
    const { data: newUser, error: insertError } = await supabase
      .from('users')
      .insert([
        {
          id: userId,
          name: adminName,
          email: adminEmail,
          password: hashedPassword,
          role: 'admin',
          created_at: new Date().toISOString()
        }
      ])
      .select()
      .single();
    
    if (insertError) {
      throw new Error(`Error creating admin user: ${insertError.message}`);
    }
    
    console.log('✅ Admin user created successfully:');
    console.log({
      name: newUser.name,
      email: newUser.email,
      role: newUser.role
    });
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

// Run the function
createAdminUser(); 