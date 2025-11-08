require('dotenv').config();
const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

// Parse connection string from Supabase URL
const supabaseUrl = process.env.SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !serviceKey) {
  console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_KEY');
  process.exit(1);
}

// Extract project ref from URL
const projectRef = supabaseUrl.match(/https:\/\/(.+?)\.supabase\.co/)?.[1];
if (!projectRef) {
  console.error('Could not extract project ref from SUPABASE_URL');
  process.exit(1);
}

console.log('================================================================================');
console.log('                   DIRECT SQL LEADERBOARD MIGRATION');
console.log('================================================================================\n');
console.log(`Project: ${projectRef}`);
console.log('\nThis script will create the leaderboard tables using direct PostgreSQL connection.');
console.log('\nNote: You need to get the database password from Supabase dashboard.');
console.log('Go to: Settings > Database > Connection string (Direct connection)');
console.log('\nOr run this via Supabase SQL Editor in the dashboard.\n');

// Read SQL file
const sqlPath = path.join(__dirname, '../migrations/create_leaderboard_tables.sql');
const sql = fs.readFileSync(sqlPath, 'utf8');

console.log('SQL to execute:');
console.log('================================================================================');
console.log(sql);
console.log('================================================================================\n');

console.log('\nTo execute this migration:');
console.log('1. Go to https://supabase.com/dashboard/project/' + projectRef + '/sql/new');
console.log('2. Copy and paste the SQL above');
console.log('3. Click "Run"');
console.log('\nOr use the Supabase CLI:');
console.log('  supabase db push --db-url "your-connection-string"');

