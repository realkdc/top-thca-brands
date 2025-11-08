require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
    detectSessionInUrl: false
  },
  db: {
    schema: 'public'
  }
});

async function executeSQL(sql, description) {
  console.log(`\n🔨 ${description}...`);
  try {
    const { data, error } = await supabase.rpc('exec', { sql });
    if (error) {
      console.error(`❌ Error: ${error.message}`);
      return false;
    }
    console.log(`✅ Success`);
    return true;
  } catch (err) {
    console.error(`❌ Exception: ${err.message}`);
    return false;
  }
}

async function restoreLeaderboardTables() {
  console.log('================================================================================');
  console.log('           RESTORING LEADERBOARD TABLES FROM BACKUP');
  console.log('================================================================================\n');

  // SQL statements to execute
  const migrations = [
    {
      name: 'Create brand_ratings table',
      sql: `
        CREATE TABLE IF NOT EXISTS public.brand_ratings (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          brand_id UUID REFERENCES brands(id) ON DELETE CASCADE,
          user_ip TEXT NOT NULL,
          potency_rating SMALLINT CHECK (potency_rating BETWEEN 1 AND 10),
          flavor_rating SMALLINT CHECK (flavor_rating BETWEEN 1 AND 10),
          effects_rating SMALLINT CHECK (effects_rating BETWEEN 1 AND 10),
          value_rating SMALLINT CHECK (value_rating BETWEEN 1 AND 10),
          overall_rating SMALLINT CHECK (overall_rating BETWEEN 1 AND 10),
          comment TEXT,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          UNIQUE(brand_id, user_ip)
        );
      `
    },
    {
      name: 'Create brand_lists table',
      sql: `
        CREATE TABLE IF NOT EXISTS public.brand_lists (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          title TEXT NOT NULL,
          description TEXT,
          is_active BOOLEAN DEFAULT TRUE,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `
    },
    {
      name: 'Create brand_list_items table',
      sql: `
        CREATE TABLE IF NOT EXISTS public.brand_list_items (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          list_id UUID REFERENCES brand_lists(id) ON DELETE CASCADE,
          brand_id UUID REFERENCES brands(id) ON DELETE CASCADE,
          position INTEGER NOT NULL,
          upvotes INTEGER DEFAULT 0,
          downvotes INTEGER DEFAULT 0,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          UNIQUE(list_id, brand_id)
        );
      `
    },
    {
      name: 'Create brand_leaderboard view',
      sql: `
        CREATE OR REPLACE VIEW public.brand_leaderboard AS
        SELECT 
          b.id,
          b.name,
          b.logo,
          b.description,
          b.product_types,
          b.website_url,
          COALESCE(AVG(br.potency_rating), 0) as avg_potency,
          COALESCE(AVG(br.flavor_rating), 0) as avg_flavor,
          COALESCE(AVG(br.effects_rating), 0) as avg_effects,
          COALESCE(AVG(br.value_rating), 0) as avg_value,
          COALESCE(AVG(br.overall_rating), 0) as avg_overall,
          COUNT(br.id) as total_ratings
        FROM brands b
        LEFT JOIN brand_ratings br ON b.id = br.brand_id
        WHERE b.is_active = TRUE
        GROUP BY b.id, b.name
        ORDER BY COALESCE(AVG(br.overall_rating), 0) DESC;
      `
    }
  ];

  // Try using the Supabase REST API directly to check tables
  console.log('🔍 Checking current tables...\n');
  
  const { data: existingTables, error: checkError } = await supabase
    .from('brand_ratings')
    .select('count', { count: 'exact', head: true });

  if (checkError && checkError.code === 'PGRST205') {
    console.log('📝 brand_ratings table does not exist yet. Will create it.\n');
  } else if (!checkError) {
    console.log('✅ brand_ratings table already exists.\n');
  }

  // Execute migrations directly via HTTP since RPC might not work
  for (const migration of migrations) {
    console.log(`\n🔨 Executing: ${migration.name}`);
    
    // Try via fetch to the pg_query endpoint
    try {
      const response = await fetch(`${supabaseUrl}/rest/v1/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': supabaseServiceKey,
          'Authorization': `Bearer ${supabaseServiceKey}`,
          'Prefer': 'return=minimal'
        },
        body: JSON.stringify({ query: migration.sql })
      });

      console.log(`Response status: ${response.status}`);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.log(`⚠️  Response: ${errorText}`);
      } else {
        console.log(`✅ ${migration.name} completed`);
      }
    } catch (error) {
      console.error(`❌ Error executing ${migration.name}:`, error.message);
    }
  }

  console.log('\n================================================================================');
  console.log('MIGRATION ATTEMPT COMPLETE');
  console.log('================================================================================\n');
  console.log('If migrations failed above, please run the SQL manually in Supabase dashboard:');
  console.log(`https://supabase.com/dashboard/project/${supabaseUrl.match(/https:\/\/(.+?)\.supabase/)?.[1]}/sql/new\n`);
  console.log('SQL to copy:\n');
  migrations.forEach(m => {
    console.log('-- ' + m.name);
    console.log(m.sql);
    console.log('');
  });
}

restoreLeaderboardTables();

