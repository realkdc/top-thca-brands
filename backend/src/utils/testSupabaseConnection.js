require('dotenv').config();
const supabase = require('./supabaseClient');

/**
 * Test connection to Supabase
 */
const testConnection = async () => {
  console.log('Testing connection to Supabase...');
  console.log(`URL: ${process.env.SUPABASE_URL}`);
  console.log(`Key: ${process.env.SUPABASE_KEY ? process.env.SUPABASE_KEY.substring(0, 15) + '...' : 'Not set'}`);
  
  try {
    // Simple query using system information
    const { data, error } = await supabase.rpc('get_system_info');
    
    if (error) {
      // Try a simpler query as fallback
      const { data: versionData, error: versionError } = await supabase.from('pg_stat_statements').select('*').limit(1);
      
      if (versionError) {
        // Even simpler test - request a non-existent bucket just to test the connection
        const { data: buckets, error: bucketError } = await supabase.storage.listBuckets();
        
        if (bucketError && !bucketError.message.includes('organizationId')) {
          throw bucketError;
        } else {
          console.log('✅ Connected to Supabase successfully!');
          console.log(`Found ${buckets ? buckets.length : 0} storage buckets`);
        }
      } else {
        console.log('✅ Connected to Supabase successfully!');
      }
    } else {
      console.log('✅ Connected to Supabase successfully!');
      console.log('System info:', data);
    }
    
    // Verify exec_sql function exists
    console.log('\nChecking exec_sql function...');
    try {
      const { error: sqlError } = await supabase.rpc('exec_sql', { 
        sql: 'SELECT 1 as test' 
      });
      
      if (sqlError) {
        console.error('❌ exec_sql function not available:', sqlError.message);
        console.log('Please run the SQL from setup_supabase_sql.sql in the Supabase SQL Editor');
      } else {
        console.log('✅ exec_sql function is available and working!');
      }
    } catch (sqlErr) {
      console.error('❌ Error testing exec_sql function:', sqlErr.message);
      console.log('Please run the SQL from setup_supabase_sql.sql in the Supabase SQL Editor');
    }
    
  } catch (error) {
    console.error('❌ Error connecting to Supabase:', error);
  }
};

// Run the test if this file is executed directly
if (require.main === module) {
  testConnection().then(() => process.exit());
}

module.exports = { testConnection }; 