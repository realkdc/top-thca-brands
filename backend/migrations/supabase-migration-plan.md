# Migration Plan: MongoDB to Supabase

## Step 1: Install Supabase Dependencies
```bash
npm install @supabase/supabase-js
```

## Step 2: Supabase Database Tables

### Create Tables in Supabase SQL Editor

#### 1. Users Table
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'editor',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index on email for faster lookups during login
CREATE INDEX users_email_idx ON users(email);
```

#### 2. Brands Table
```sql
CREATE TABLE brands (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  image TEXT NOT NULL,
  category TEXT NOT NULL,
  rating NUMERIC NOT NULL DEFAULT 0,
  description TEXT NOT NULL,
  featured BOOLEAN NOT NULL DEFAULT FALSE,
  slug TEXT UNIQUE NOT NULL,
  website TEXT,
  product_types TEXT[] DEFAULT '{}',
  location TEXT,
  "order" INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index on slug for faster lookups
CREATE INDEX brands_slug_idx ON brands(slug);
```

#### 3. Contacts Table
```sql
CREATE TABLE contacts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  brand_name TEXT NOT NULL,
  website TEXT,
  message TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  admin_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## Step 3: Implement User Authentication with Supabase

We can leverage Supabase Auth or use their database to handle our custom authentication.

### Auth Implementation Plan:

1. Create a supabaseClient.js file
2. Modify auth controller to use Supabase instead of MongoDB
3. Update middleware to verify JWT using Supabase

## Step 4: Application Change Summary

1. Replace mongoose models with Supabase queries
2. Update all controllers to use Supabase
3. Modify auth middleware to work with Supabase tokens
4. Adapt frontend API services to handle Supabase responses

## Step 5: Data Migration

1. Export existing data from MongoDB (if any)
2. Transform data to match Supabase schema
3. Import data into Supabase tables 