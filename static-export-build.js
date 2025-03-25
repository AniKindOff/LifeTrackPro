import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('Building static export...');

// Set environment variable for static export
process.env.STATIC_EXPORT = 'true';

try {
  // Build the static export
  execSync('vite build --outDir static-export --emptyOutDir', { stdio: 'inherit' });
  
  // Create API directory and generate mock data
  const apiDir = path.join(__dirname, 'static-export', 'api');
  if (!fs.existsSync(apiDir)) {
    fs.mkdirSync(apiDir, { recursive: true });
  }
  
  // Run the copy-static-assets script
  execSync('node server/scripts/copy-static-assets.js', { stdio: 'inherit' });
  
  // Check if index.html exists
  const indexPath = path.join(__dirname, 'static-export', 'index.html');
  if (!fs.existsSync(indexPath)) {
    console.error('Error: index.html not found after build. Check the Vite build output.');
    process.exit(1);
  }
  
  // Check for assets directory with files
  const assetsDir = path.join(__dirname, 'static-export', 'assets');
  if (!fs.existsSync(assetsDir)) {
    console.error('Error: assets directory not found after build. Check the Vite build output.');
    fs.mkdirSync(assetsDir, { recursive: true });
  }
  
  // List asset files for debugging
  console.log('Assets in static-export directory:');
  walkDir(path.join(__dirname, 'static-export'));
  
  console.log('Static export build complete!');
} catch (error) {
  console.error('Error building static export:', error);
  process.exit(1);
}

// Helper function to recursively list files in a directory
function walkDir(dir) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      console.log(`Directory: ${filePath}`);
      walkDir(filePath);
    } else {
      console.log(`File: ${filePath}`);
    }
  });
} 