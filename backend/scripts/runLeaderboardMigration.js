require('dotenv').config();
const fs = require('fs');
const path = require('path');
const supabase = require('../src/utils/supabaseClient');

// Function to run SQL file
async function runSQLFile(filePath) {
  console.log(`Running SQL file: ${filePath}`);
  const sql = fs.readFileSync(filePath, 'utf8');
  
  try {
    // Execute SQL using Supabase
    const { error } = await supabase.rpc('exec_sql', { sql: sql });
    
    if (error) {
      console.error('Error executing SQL:', error);
      throw error;
    }
    
    console.log('✅ SQL executed successfully');
    return true;
  } catch (error) {
    console.error('❌ Error running SQL file:', error);
    return false;
  }
}

// Run the leaderboard migration
async function runLeaderboardMigration() {
  console.log('='.repeat(80));
  console.log('LEADERBOARD MIGRATION'.padStart(50, ' '));
  console.log('='.repeat(80));
  console.log();
  
  try {
    // First, test connection to Supabase
    console.log('Testing Supabase connection...');
    
    // Simple connection test - try to get the UUID extension
    const { data, error } = await supabase.rpc('exec_sql', { 
      sql: "CREATE EXTENSION IF NOT EXISTS \"uuid-ossp\";"
    });
    
    if (error) {
      console.error('❌ Connection to Supabase failed:', error);
      process.exit(1);
    }
    
    console.log('✅ Connected to Supabase successfully');
    
    // Run the leaderboard migration file
    const migrationFilePath = path.join(__dirname, '../migrations/create_leaderboard_tables.sql');
    const success = await runSQLFile(migrationFilePath);
    
    if (success) {
      console.log('\n='.repeat(80));
      console.log('LEADERBOARD MIGRATION COMPLETE!'.padStart(50, ' '));
      console.log('='.repeat(80));
      console.log('\nYour leaderboard tables have been successfully created.');
    } else {
      console.error('\n❌ Migration failed. Please check the errors above.');
    }
  } catch (error) {
    console.error('\n❌ Migration failed:', error.message);
  } finally {
    process.exit();
  }
}

// Run the migration
runLeaderboardMigration(); 