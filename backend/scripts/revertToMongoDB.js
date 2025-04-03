/**
 * Revert To MongoDB Script
 * 
 * This script reverts your application back to using MongoDB controllers
 * by renaming backup files to their original names.
 * 
 * Run with: node scripts/revertToMongoDB.js
 */

const fs = require('fs');
const path = require('path');

// Print banner
console.log('='.repeat(80));
console.log('REVERTING TO MONGODB'.padStart(48, ' '));
console.log('='.repeat(80));
console.log();

// Define the directories to process
const directories = [
  path.join(__dirname, '..', 'src', 'routes'),
  path.join(__dirname, '..', 'src', 'controllers'),
  path.join(__dirname, '..', 'src', 'middleware')
];

// Counter for statistics
let restoredFiles = 0;
let errors = 0;

/**
 * Process a single file
 */
function processFile(filePath) {
  try {
    // Only process backup files
    if (filePath.endsWith('.mongodb.bak.js')) {
      const originalPath = filePath.replace('.mongodb.bak.js', '.js');
      
      // If the original file exists, make a backup of it first (just in case)
      if (fs.existsSync(originalPath)) {
        const supabaseBakPath = originalPath.replace('.js', '.supabase.bak.js');
        if (!fs.existsSync(supabaseBakPath)) {
          fs.copyFileSync(originalPath, supabaseBakPath);
          console.log(`Backed up current file: ${originalPath} → ${supabaseBakPath}`);
        }
      }
      
      // Restore the MongoDB version
      fs.copyFileSync(filePath, originalPath);
      console.log(`Restored: ${filePath} → ${originalPath}`);
      restoredFiles++;
    }
  } catch (error) {
    console.error(`Error processing file ${filePath}:`, error);
    errors++;
  }
}

/**
 * Process all files in a directory
 */
function processDirectory(directoryPath) {
  if (!fs.existsSync(directoryPath)) {
    console.log(`Directory not found: ${directoryPath}`);
    return;
  }
  
  // Read directory contents
  const items = fs.readdirSync(directoryPath);
  
  // Process each item
  for (const item of items) {
    const itemPath = path.join(directoryPath, item);
    const stat = fs.statSync(itemPath);
    
    if (stat.isDirectory()) {
      // If directory, process it recursively
      processDirectory(itemPath);
    } else if (stat.isFile()) {
      // If file, process it
      processFile(itemPath);
    }
  }
}

// Main execution
console.log('Looking for MongoDB backup files to restore...');

try {
  // Process all directories
  directories.forEach(directory => {
    console.log(`\nProcessing directory: ${directory}`);
    processDirectory(directory);
  });
  
  // Summary
  console.log('\n='.repeat(80));
  console.log(`Restored ${restoredFiles} files with ${errors} errors.`);
  
  if (restoredFiles > 0) {
    console.log('\nYour application has been reverted to use MongoDB.');
    console.log('You can now start your server normally:');
    console.log('  npm start');
  } else {
    console.log('\nNo MongoDB backup files found to restore.');
    console.log('Make sure you ran the Supabase migration script first,');
    console.log('which creates .mongodb.bak.js backup files.');
  }
  
} catch (error) {
  console.error('Error during reversion:', error);
} 