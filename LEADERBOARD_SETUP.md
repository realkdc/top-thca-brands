# Leaderboard Setup Complete! 🎉

## ✅ What's Been Done

### 1. Code Changes (Committed & Pushed)
- **Updated `leaderboardService.js`** to fetch real data from Supabase
  - Primary: Direct Supabase query to `brand_leaderboard` view
  - Fallback: Backend API endpoint
  - Robust data normalization for both sources
  
- **Commits:**
  - `45dbc07` - Fix leaderboard to fetch real data from Supabase
  - `a2f482c` - Add leaderboard migration scripts

### 2. Database Migration Ready
- Created `backend/migrations/restore_leaderboard.sql`
- Migration creates:
  - `brand_ratings` table (for user ratings)
  - `brand_lists` table (for curated lists)
  - `brand_list_items` table (for list items)
  - `brand_leaderboard` view (aggregated ratings)

## 🚀 Final Steps (Do This Now!)

### Step 1: Apply Database Migration

**The SQL is already copied to your clipboard!**

1. The Supabase SQL Editor should be open in your browser
2. If not, go to: https://supabase.com/dashboard/project/huejfknqflbkjcpdgbno/sql/new
3. Paste the SQL (Cmd+V)
4. Click **"RUN"**

### Step 2: Verify It Worked

Run this in terminal:

```bash
curl 'https://huejfknqflbkjcpdgbno.supabase.co/rest/v1/brand_leaderboard?select=*&limit=5' \
  -H "apikey: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh1ZWpma25xZmxia2pjcGRnYm5vIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk4MjExMjQsImV4cCI6MjA3NTM5NzEyNH0.Hnkt8RR5pO_joKKzb3DAXr0pFk7-VmEow2_HP9pOYj8"
```

You should see your 5 brands with 0 ratings initially.

### Step 3: Check Netlify Deploy

Your code has been pushed to GitHub. Check Netlify:
- Go to: https://app.netlify.com
- Wait for the deploy to finish (~2-3 minutes)
- Visit your site and check the leaderboard section

## 📊 Expected Results

- **Leaderboard shows:** All 5 brands from your Supabase database
- **Initial ratings:** 0.0/10 for all categories (no ratings yet)
- **Rating count:** 0 ratings per brand
- **Users can rate:** Click "Rate Now" button to submit ratings
- **Real-time updates:** Ratings get saved to Supabase and update the leaderboard

## 🔍 Troubleshooting

### If leaderboard is empty:
```bash
# Check if brands exist
curl 'https://huejfknqflbkjcpdgbno.supabase.co/rest/v1/brands?select=id,name&is_active=eq.true&limit=10' \
  -H "apikey: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh1ZWpma25xZmxia2pjcGRnYm5vIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk4MjExMjQsImV4cCI6MjA3NTM5NzEyNH0.Hnkt8RR5pO_joKKzb3DAXr0pFk7-VmEow2_HP9pOYj8"
```

### If you get permission errors:
- Make sure you ran the SQL migration with the GRANT statements
- Check RLS policies in Supabase dashboard

### To re-run migration:
```bash
./apply-leaderboard-migration.sh
```

## 📁 Files Created

- `backend/migrations/restore_leaderboard.sql` - Main migration SQL
- `backend/scripts/restoreLeaderboardFromBackup.js` - Automated restore script
- `backend/scripts/showMigrationSQL.js` - Display SQL helper
- `apply-leaderboard-migration.sh` - Easy migration runner
- `LEADERBOARD_SETUP.md` - This file!

## 🎯 Next Steps After Migration

1. **Test rating submission:** Go to leaderboard, click "Rate Now", submit a rating
2. **Verify ratings persist:** Refresh page, ratings should still be there
3. **Test sorting:** Click different criteria (Potency, Flavor, etc.)
4. **Monitor backend logs:** Check for any errors

## 🆘 Need Help?

If something's not working:
1. Check browser console for errors (F12)
2. Check backend logs
3. Verify Supabase tables exist in dashboard
4. Test API endpoints directly with curl

