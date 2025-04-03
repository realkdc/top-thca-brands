/**
 * Script to update route files to use Supabase controllers instead of MongoDB controllers
 * 
 * Run with: node scripts/switchToSupabase.js
 */

const fs = require('fs');
const path = require('path');

// Define the directory where route files are located
const routesDir = path.join(__dirname, '..', 'src', 'routes');

// Define controller replacements
const replacements = [
  {
    pattern: /require\(['"]\.\.\/controllers\/authController['"]\)/g,
    replacement: "require('../controllers/authController.supabase')"
  },
  {
    pattern: /require\(['"]\.\.\/controllers\/brandController['"]\)/g,
    replacement: "require('../controllers/brandController.supabase')"
  },
  {
    pattern: /require\(['"]\.\.\/controllers\/contactController['"]\)/g,
    replacement: "require('../controllers/contactController.supabase')"
  },
  {
    pattern: /require\(['"]\.\.\/middleware\/authMiddleware['"]\)/g,
    replacement: "require('../middleware/authMiddleware.supabase')"
  }
];

// Function to process a single file
function processFile(filePath) {
  try {
    // Read file content
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Check if this is a backup file
    if (filePath.endsWith('.mongodb.bak.js')) {
      console.log(`Skipping backup file: ${filePath}`);
      return;
    }
    
    // Create a backup of the original file
    const backupPath = `${filePath.replace('.js', '.mongodb.bak.js')}`;
    if (!fs.existsSync(backupPath)) {
      fs.writeFileSync(backupPath, content);
      console.log(`Created backup: ${backupPath}`);
    }
    
    // Apply replacements
    let modified = false;
    for (const { pattern, replacement } of replacements) {
      if (pattern.test(content)) {
        content = content.replace(pattern, replacement);
        modified = true;
      }
    }
    
    // If file was modified, write the new content
    if (modified) {
      fs.writeFileSync(filePath, content);
      console.log(`Updated: ${filePath}`);
    } else {
      console.log(`No changes needed for: ${filePath}`);
    }
  } catch (error) {
    console.error(`Error processing file ${filePath}:`, error);
  }
}

// Function to process all files in a directory
function processDirectory(directoryPath) {
  // Read directory contents
  const items = fs.readdirSync(directoryPath);
  
  // Process each item
  for (const item of items) {
    const itemPath = path.join(directoryPath, item);
    const stat = fs.statSync(itemPath);
    
    if (stat.isDirectory()) {
      // If directory, process it recursively
      processDirectory(itemPath);
    } else if (stat.isFile() && item.endsWith('.js')) {
      // If JavaScript file, process it
      processFile(itemPath);
    }
  }
}

// Main execution
console.log('Switching route files to use Supabase controllers...');
try {
  if (fs.existsSync(routesDir)) {
    processDirectory(routesDir);
    console.log('\nDone! Route files have been updated to use Supabase controllers.');
    console.log('Backup files with .mongodb.bak.js extension have been created.');
    console.log('To revert changes, rename the backup files back to .js');
  } else {
    console.error(`Routes directory not found: ${routesDir}`);
  }
} catch (error) {
  console.error('Error:', error);
} 