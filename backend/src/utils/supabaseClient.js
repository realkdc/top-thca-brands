const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL;
// Important: Use the service role key to bypass RLS
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('SUPABASE_URL and SUPABASE_SERVICE_KEY (or SUPABASE_KEY) environment variables must be set');
  process.exit(1);
}

console.log('Initializing Supabase client with service role permissions');
console.log(`Using URL: ${supabaseUrl}`);
console.log(`Service key provided: ${supabaseServiceKey ? 'Yes' : 'No'}`);

// Create Supabase client with more resilient settings
const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
    detectSessionInUrl: false
  },
  global: {
    headers: {
      'Authorization': `Bearer ${supabaseServiceKey}`
    }
  },
  realtime: {
    params: {
      eventsPerSecond: 10
    }
  }
});

// Export a function to get a fresh client if needed
const getSupabaseClient = () => {
  return createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
      detectSessionInUrl: false
    },
    global: {
      headers: {
        'Authorization': `Bearer ${supabaseServiceKey}`
      }
    }
  });
};

// Test connection to verify client works
(async () => {
  try {
    const { data, error } = await supabase.from('brands').select('count');
    if (error) {
      console.error('❌ Supabase connection test failed:', error);
    } else {
      console.log('✅ Supabase connection successful!');
    }
  } catch (err) {
    console.error('❌ Supabase connection error:', err);
  }
})();

module.exports = supabase;
module.exports.getSupabaseClient = getSupabaseClient; 