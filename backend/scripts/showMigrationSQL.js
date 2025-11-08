const fs = require('fs');
const path = require('path');

console.log('================================================================================');
console.log('                   LEADERBOARD MIGRATION SQL');
console.log('================================================================================\n');

// Read SQL file
const sqlPath = path.join(__dirname, '../migrations/create_leaderboard_tables.sql');
const sql = fs.readFileSync(sqlPath, 'utf8');

console.log(sql);

console.log('\n================================================================================');
console.log('HOW TO APPLY THIS MIGRATION:');
console.log('================================================================================\n');
console.log('1. Go to: https://supabase.com/dashboard/project/huejfknqflbkjcpdgbno/sql/new');
console.log('2. Copy and paste the SQL above');
console.log('3. Click "Run" to execute');
console.log('\nThis will create:');
console.log('  - brand_ratings table (for user ratings)');
console.log('  - brand_lists table (for curated lists)');
console.log('  - brand_list_items table (for list items)');
console.log('  - brand_leaderboard view (aggregated ratings)');

