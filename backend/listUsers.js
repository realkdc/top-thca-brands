require('dotenv').config();
const supabase = require('./src/utils/supabaseClient');

/**
 * List all users from Supabase database
 */
async function listUsers() {
  console.log('Listing users from Supabase...');
  
  try {
    // Get all users
    const { data: users, error } = await supabase
      .from('users')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      throw new Error(`Error fetching users: ${error.message}`);
    }
    
    if (users.length === 0) {
      console.log('No users found in the database.');
      return;
    }
    
    console.log(`Found ${users.length} users:`);
    users.forEach((user, index) => {
      console.log(`\n[${index + 1}] User Details:`);
      console.log(`  ID: ${user.id}`);
      console.log(`  Name: ${user.name}`);
      console.log(`  Email: ${user.email}`);
      console.log(`  Role: ${user.role}`);
      console.log(`  Created: ${new Date(user.created_at).toLocaleString()}`);
    });
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

// Run the function
listUsers();
