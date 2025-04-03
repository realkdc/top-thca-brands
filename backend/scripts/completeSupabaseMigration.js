/**
 * Complete Supabase Migration Script
 * 
 * This script performs all necessary steps to migrate from MongoDB to Supabase:
 * 1. Tests the Supabase connection
 * 2. Creates tables and storage buckets in Supabase
 * 3. Migrates data from MongoDB to Supabase
 * 4. Updates routes to use Supabase controllers
 * 
 * Run with: node scripts/completeSupabaseMigration.js
 */

require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

// Make sure we have the Supabase URL and key
if (!process.env.SUPABASE_URL || !process.env.SUPABASE_KEY) {
  console.error('❌ Error: SUPABASE_URL and SUPABASE_KEY must be set in .env file');
  process.exit(1);
}

// Make sure we have a JWT_SECRET
if (!process.env.JWT_SECRET || process.env.JWT_SECRET === 'your_jwt_secret_key_replace_this_in_production') {
  console.error('❌ Error: JWT_SECRET must be set to a valid value in .env file');
  process.exit(1);
}

// Print migration banner
console.log('='.repeat(80));
console.log('COMPLETE SUPABASE MIGRATION'.padStart(50, ' '));
console.log('='.repeat(80));
console.log();

/**
 * Run a script and return a promise
 */
function runScript(scriptPath) {
  return new Promise((resolve, reject) => {
    console.log(`\n${'-'.repeat(80)}\nRunning: ${scriptPath}\n${'-'.repeat(80)}\n`);
    
    const process = spawn('node', [scriptPath], { stdio: 'inherit' });
    
    process.on('close', (code) => {
      if (code !== 0) {
        reject(new Error(`Script ${scriptPath} exited with code ${code}`));
      } else {
        resolve();
      }
    });
    
    process.on('error', (err) => {
      reject(err);
    });
  });
}

/**
 * Main migration function
 */
async function migrate() {
  try {
    // Step 1: Test Supabase connection
    console.log('Step 1: Testing Supabase connection...');
    await runScript(path.join(__dirname, '../src/utils/testSupabaseConnection.js'));
    
    // Step 2: Set up Supabase tables and storage
    console.log('\nStep 2: Setting up Supabase tables and storage...');
    await runScript(path.join(__dirname, '../src/utils/setupSupabase.js'));
    
    // Step 3: Migrate data from MongoDB
    console.log('\nStep 3: Migrating data from MongoDB to Supabase...');
    await runScript(path.join(__dirname, '../src/utils/migrateToSupabase.js'));
    
    // Step 4: Update routes to use Supabase controllers
    console.log('\nStep 4: Updating routes to use Supabase controllers...');
    await runScript(path.join(__dirname, '../scripts/switchToSupabase.js'));
    
    // Done!
    console.log('\n='.repeat(80));
    console.log('MIGRATION COMPLETE!'.padStart(48, ' '));
    console.log('='.repeat(80));
    console.log('\nYour application has been successfully migrated to Supabase.');
    console.log('\nNext steps:');
    console.log('1. Start your server: npm start');
    console.log('2. Verify that everything works correctly');
    console.log('3. Update your frontend to use the new backend API');
    
  } catch (error) {
    console.error('\n❌ Migration failed:', error.message);
    console.log('\nPlease fix the issue and try again.');
  }
}

// Run the migration
migrate(); 