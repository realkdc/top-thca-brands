-- Fix Security Issues: Enable RLS and Fix View
-- This migration is SAFE - your backend uses service role key which bypasses RLS
-- Run this in Supabase SQL Editor or via CLI

BEGIN;

-- Enable RLS on all public tables
ALTER TABLE IF EXISTS public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.brands ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.brand_ratings ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.brand_lists ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.brand_list_items ENABLE ROW LEVEL SECURITY;

-- Create permissive policies for anon (read-only for public data)
-- Adjust these based on your actual access needs

-- Drop existing policies if they exist (safe to run multiple times)
DROP POLICY IF EXISTS "anon_select_users" ON public.users;
DROP POLICY IF EXISTS "anon_select_contacts" ON public.contacts;
DROP POLICY IF EXISTS "anon_insert_contacts" ON public.contacts;
DROP POLICY IF EXISTS "anon_select_brands" ON public.brands;
DROP POLICY IF EXISTS "anon_insert_subscribers" ON public.subscribers;
DROP POLICY IF EXISTS "anon_select_subscribers" ON public.subscribers;
DROP POLICY IF EXISTS "anon_select_brand_ratings" ON public.brand_ratings;
DROP POLICY IF EXISTS "anon_insert_brand_ratings" ON public.brand_ratings;
DROP POLICY IF EXISTS "anon_select_brand_lists" ON public.brand_lists;
DROP POLICY IF EXISTS "anon_select_brand_list_items" ON public.brand_list_items;
DROP POLICY IF EXISTS "auth_all_users" ON public.users;
DROP POLICY IF EXISTS "auth_all_contacts" ON public.contacts;
DROP POLICY IF EXISTS "auth_all_brands" ON public.brands;
DROP POLICY IF EXISTS "auth_all_subscribers" ON public.subscribers;
DROP POLICY IF EXISTS "auth_all_brand_ratings" ON public.brand_ratings;
DROP POLICY IF EXISTS "auth_all_brand_lists" ON public.brand_lists;
DROP POLICY IF EXISTS "auth_all_brand_list_items" ON public.brand_list_items;

-- Users table: Only allow reading (no public writes)
CREATE POLICY "anon_select_users" 
  ON public.users FOR SELECT 
  TO anon 
  USING (true);

-- Contacts table: Allow reading and inserting (for contact forms)
CREATE POLICY "anon_select_contacts" 
  ON public.contacts FOR SELECT 
  TO anon 
  USING (true);

CREATE POLICY "anon_insert_contacts" 
  ON public.contacts FOR INSERT 
  TO anon 
  WITH CHECK (true);

-- Brands table: Public read access
CREATE POLICY "anon_select_brands" 
  ON public.brands FOR SELECT 
  TO anon 
  USING (true);

-- Subscribers table: Allow inserting (for newsletter signups)
CREATE POLICY "anon_insert_subscribers" 
  ON public.subscribers FOR INSERT 
  TO anon 
  WITH CHECK (true);

CREATE POLICY "anon_select_subscribers" 
  ON public.subscribers FOR SELECT 
  TO anon 
  USING (true);

-- Brand ratings: Allow reading and inserting (for user ratings)
CREATE POLICY "anon_select_brand_ratings" 
  ON public.brand_ratings FOR SELECT 
  TO anon 
  USING (true);

CREATE POLICY "anon_insert_brand_ratings" 
  ON public.brand_ratings FOR INSERT 
  TO anon 
  WITH CHECK (true);

-- Brand lists: Public read access
CREATE POLICY "anon_select_brand_lists" 
  ON public.brand_lists FOR SELECT 
  TO anon 
  USING (true);

-- Brand list items: Public read access
CREATE POLICY "anon_select_brand_list_items" 
  ON public.brand_list_items FOR SELECT 
  TO anon 
  USING (true);

-- Authenticated users: Full access (adjust if you need restrictions)
CREATE POLICY "auth_all_users" 
  ON public.users FOR ALL 
  TO authenticated 
  USING (true) 
  WITH CHECK (true);

CREATE POLICY "auth_all_contacts" 
  ON public.contacts FOR ALL 
  TO authenticated 
  USING (true) 
  WITH CHECK (true);

CREATE POLICY "auth_all_brands" 
  ON public.brands FOR ALL 
  TO authenticated 
  USING (true) 
  WITH CHECK (true);

CREATE POLICY "auth_all_subscribers" 
  ON public.subscribers FOR ALL 
  TO authenticated 
  USING (true) 
  WITH CHECK (true);

CREATE POLICY "auth_all_brand_ratings" 
  ON public.brand_ratings FOR ALL 
  TO authenticated 
  USING (true) 
  WITH CHECK (true);

CREATE POLICY "auth_all_brand_lists" 
  ON public.brand_lists FOR ALL 
  TO authenticated 
  USING (true) 
  WITH CHECK (true);

CREATE POLICY "auth_all_brand_list_items" 
  ON public.brand_list_items FOR ALL 
  TO authenticated 
  USING (true) 
  WITH CHECK (true);

-- Fix the brand_leaderboard view: Remove SECURITY DEFINER (recreate as SECURITY INVOKER)
DROP VIEW IF EXISTS public.brand_leaderboard CASCADE;

CREATE VIEW public.brand_leaderboard 
WITH (security_invoker = true) AS
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
GROUP BY b.id, b.name, b.logo, b.description, b.product_types, b.website_url
ORDER BY COALESCE(AVG(br.overall_rating), 0) DESC;

-- Grant permissions on the view
GRANT SELECT ON public.brand_leaderboard TO anon;
GRANT SELECT ON public.brand_leaderboard TO authenticated;

COMMIT;
