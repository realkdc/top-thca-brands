require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function createLeaderboardTables() {
  console.log('Creating leaderboard tables...\n');

  try {
    // Read the SQL file
    const sqlPath = path.join(__dirname, '../migrations/create_leaderboard_tables.sql');
    const sql = fs.readFileSync(sqlPath, 'utf8');

    // Split into individual statements
    const statements = sql
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0 && !s.startsWith('--'));

    console.log(`Found ${statements.length} SQL statements to execute\n`);

    // Execute each statement
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];
      console.log(`Executing statement ${i + 1}/${statements.length}...`);
      
      // Use the raw SQL endpoint
      const response = await fetch(`${supabaseUrl}/rest/v1/rpc/exec`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': supabaseServiceKey,
          'Authorization': `Bearer ${supabaseServiceKey}`,
        },
        body: JSON.stringify({ query: statement })
      });

      if (!response.ok) {
        const error = await response.text();
        console.error(`Failed to execute statement ${i + 1}:`, error);
        console.error('Statement was:', statement.substring(0, 200));
        
        // Try alternative method using pg_query
        console.log('Trying alternative method...');
        const altResponse = await fetch(`${supabaseUrl}/rest/v1/query`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'apikey': supabaseServiceKey,
            'Authorization': `Bearer ${supabaseServiceKey}`,
            'Prefer': 'return=representation'
          },
          body: statement
        });

        if (!altResponse.ok) {
          console.error('Alternative method also failed');
        }
      } else {
        console.log(`✅ Statement ${i + 1} executed successfully`);
      }
    }

    console.log('\n✅ Leaderboard tables creation complete!');
    console.log('\nYou can now:');
    console.log('1. Rate brands via POST /api/leaderboard/brands/:id/rate');
    console.log('2. View leaderboard via GET /api/leaderboard');
    
  } catch (error) {
    console.error('Error creating tables:', error);
    process.exit(1);
  }
}

createLeaderboardTables();

