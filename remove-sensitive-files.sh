#!/bin/bash
# This script removes sensitive environment files from Git history

echo "⚠️  WARNING: This script will rewrite Git history ⚠️"
echo "Make sure all team members are aware of this change!"
echo "They will need to clone the repository again after this."
echo ""
echo "Press Ctrl+C to cancel or Enter to continue..."
read

# Create a temporary .gitignore to ensure we don't commit the files again
cat > temp_gitignore << EOL
# Node.js dependencies
node_modules/

# Environment variables - block ALL env files
.env
.env.*
*.env

# Logs
logs
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Runtime data
pids
*.pid
*.seed
*.pid.lock

# Directory for uploaded files
uploads/*
!uploads/.gitkeep

# Coverage directory
coverage/

# Build files
dist/
build/

# Misc
.DS_Store
EOL

# Files to remove from history
files_to_remove=(
  "backend/.env"
  "backend/.env.render"
  "backend/.env.supabase"
  "backend/.env.bak"
  "backend/testSupabase.js"
)

echo "Removing sensitive files from Git history..."

# Use git filter-repo to remove files
# First, make sure you have git-filter-repo installed
# pip install git-filter-repo

# Create paths spec file for git-filter-repo
cat > paths-to-remove.txt << EOL
backend/.env
backend/.env.*
backend/*.env
EOL

echo "To complete this process, run these commands:"
echo ""
echo "1. Install git-filter-repo if you haven't already:"
echo "   pip install git-filter-repo"
echo ""
echo "2. Run the filter command to remove sensitive files:"
echo "   git filter-repo --paths-from-file paths-to-remove.txt --invert-paths"
echo ""
echo "3. Force push the changes to GitHub:"
echo "   git push origin --force"
echo ""
echo "4. Ask your team members to clone the repository again"
echo ""
echo "IMPORTANT: After this, immediately rotate your secrets on Supabase and MongoDB!"

# Instructions for Supabase and MongoDB credential rotation
echo ""
echo "==== CREDENTIAL ROTATION INSTRUCTIONS ===="
echo ""
echo "Supabase:"
echo "1. Go to https://app.supabase.com"
echo "2. Select your project"
echo "3. Go to Project Settings > API"
echo "4. Click 'Rotate Service Key'"
echo ""
echo "MongoDB:"
echo "1. Go to https://cloud.mongodb.com"
echo "2. Select your cluster"
echo "3. Go to Security > Database Access"
echo "4. Edit the user and reset the password"
echo ""
echo "After rotating credentials, update your environment files and deployment platforms" 