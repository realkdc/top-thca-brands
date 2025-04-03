# Simple Supabase Migration Guide

This guide provides a straightforward approach to migrating your Top THCA Brands application from MongoDB to Supabase.

## Prerequisites

You need:
1. Your Supabase project information:
   - Project URL: `https://pjuqrxeupqdnhojjtrgf.supabase.co`
   - API Key: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBqdXFyeGV1cHFkbmhvamp0cmdmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM2NTA0NzIsImV4cCI6MjA1OTIyNjQ3Mn0.eKbX5w7-Q8qC7totRVDUGkXORn0ir9u6svVM-3KCh0c`
2. Your MongoDB database (for migrating existing data)
3. Node.js installed

## Step 1: Run the SQL Setup in Supabase

1. Log in to the [Supabase Dashboard](https://app.supabase.com)
2. Select your project
3. Go to SQL Editor and run this SQL:

```sql
-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create a function that allows executing arbitrary SQL
CREATE OR REPLACE FUNCTION exec_sql(sql text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  EXECUTE sql;
END;
$$;
```

## Step 2: Run the Migration Script

The complete migration script will handle everything for you:

```bash
cd backend
node scripts/completeSupabaseMigration.js
```

This script will:
- Test your Supabase connection
- Create necessary tables
- Set up storage buckets
- Create an initial admin user
- Migrate your data from MongoDB
- Update your routes to use Supabase

## Step 3: Test Your Application

1. Start your server:
   ```bash
   npm start
   ```

2. Test key functionality:
   - Admin login
   - Viewing brands
   - Adding/editing brands
   - Contact form submission

## Reverting to MongoDB (If Needed)

If you encounter issues, you can revert to MongoDB by running:

```bash
cd backend
node scripts/revertToMongoDB.js
```

## Need Help?

If you encounter any issues during migration:

1. Check your JWT_SECRET in the .env file
2. Make sure Supabase connection is working
3. Verify that all controllers and middleware files exist 