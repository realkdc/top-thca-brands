-- Create brand_ratings table for user votes
CREATE TABLE brand_ratings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
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

-- Create brand_lists table for curated lists
CREATE TABLE brand_lists (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create brand_list_items table for items in lists
CREATE TABLE brand_list_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  list_id UUID REFERENCES brand_lists(id) ON DELETE CASCADE,
  brand_id UUID REFERENCES brands(id) ON DELETE CASCADE,
  position INTEGER NOT NULL,
  upvotes INTEGER DEFAULT 0,
  downvotes INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(list_id, brand_id)
);

-- Create brand_leaderboard view for easy querying
CREATE OR REPLACE VIEW brand_leaderboard AS
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
ORDER BY avg_overall DESC; 