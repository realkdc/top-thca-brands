import { createClient } from '@supabase/supabase-js';

// Frontend uses the public anon key. Env vars override the safe defaults below.
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'https://huejfknqflbkjcpdgbno.supabase.co';
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh1ZWpma25xZmxia2pjcGRnYm5vIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk4MjExMjQsImV4cCI6MjA3NTM5NzEyNH0.Hnkt8RR5pO_joKKzb3DAXr0pFk7-VmEow2_HP9pOYj8';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
});

export default supabase;


