require('dotenv').config();
const supabase = require('./src/utils/supabaseClient');

/**
 * Test Supabase authentication and admin user existence
 */
async function testSupabaseAuth() {
  console.log('Starting Supabase authentication test...');
  
  try {
    // Test connection to Supabase
    console.log('Testing connection to Supabase...');
    const { data: testData, error: testError } = await supabase.from('users').select('count');
    
    if (testError) {
      throw new Error(`Supabase connection error: ${testError.message}`);
    }
    
    console.log('✅ Connected to Supabase successfully!');
    
    // Check for admin user
    console.log('Looking for admin user...');
    const { data: adminUser, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('role', 'admin')
      .maybeSingle();
    
    if (userError) {
      throw new Error(`Error finding admin user: ${userError.message}`);
    }
    
    if (!adminUser) {
      console.log('❌ No admin user found. You need to create an admin user.');
      console.log('You can use the admin dashboard to create one after logging in with the initial admin account.');
    } else {
      console.log('✅ Admin user found:');
      console.log({
        name: adminUser.name,
        email: adminUser.email,
        role: adminUser.role
      });
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

// Run the test
testSupabaseAuth();
