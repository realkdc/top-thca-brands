-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create a function that allows executing arbitrary SQL
-- This is needed for the setupSupabase.js script to work
CREATE OR REPLACE FUNCTION exec_sql(sql text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  EXECUTE sql;
END;
$$;

-- Create RLS policies for tables
-- These will be applied after tables are created

-- Storage bucket policies (run after bucket creation)
-- Replace 'brand-images' with your actual bucket name if different
/*
BEGIN;
  -- Policy to allow anonymous users to read/view files in the bucket
  INSERT INTO storage.policies (name, definition, bucket_id)
  VALUES (
    'Public Read Access',
    '(bucket_id = ''brand-images''::text)',
    'brand-images'
  )
  ON CONFLICT DO NOTHING;
  
  -- Policy to allow authenticated users to upload files
  INSERT INTO storage.policies (name, definition, bucket_id)
  VALUES (
    'Auth Users Upload Access',
    '(bucket_id = ''brand-images''::text AND auth.role() = ''authenticated''::text)',
    'brand-images'
  )
  ON CONFLICT DO NOTHING;
COMMIT;
*/ 