#!/bin/bash

# This script applies the leaderboard migration to Supabase
# It reads the SQL file and prints instructions

echo "=================================="
echo "SUPABASE LEADERBOARD MIGRATION"
echo "=================================="
echo ""
echo "Please follow these steps:"
echo ""
echo "1. Go to: https://supabase.com/dashboard/project/huejfknqflbkjcpdgbno/sql/new"
echo ""
echo "2. Copy the SQL below and paste it into the SQL Editor"
echo ""
echo "3. Click 'RUN' to execute"
echo ""
echo "=================================="
echo "SQL TO COPY:"
echo "=================================="
echo ""

cat /Users/drippo/Desktop/topthcabrands/backend/migrations/restore_leaderboard.sql

echo ""
echo "=================================="
echo "After running the SQL above, test with:"
echo "curl 'https://huejfknqflbkjcpdgbno.supabase.co/rest/v1/brand_leaderboard?select=*&limit=5' \\"
echo "  -H 'apikey: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh1ZWpma25xZmxia2pjcGRnYm5vIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk4MjExMjQsImV4cCI6MjA3NTM5NzEyNH0.Hnkt8RR5pO_joKKzb3DAXr0pFk7-VmEow2_HP9pOYj8'"

