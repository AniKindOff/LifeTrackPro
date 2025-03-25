/**
 * LifeTrackPro Debug Script
 * This script helps diagnose and fix common issues that may cause white screens
 */

const fs = require('fs');
const path = require('path');
const http = require('http');
const { exec, spawn } = require('child_process');
const readline = require('readline');

// Create readline interface for user input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// ANSI color codes for prettier output
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m',
  bold: '\x1b[1m'
};

// Print styled messages
function print(message, color = 'white', bold = false) {
  console.log(`${bold ? colors.bold : ''}${colors[color]}${message}${colors.reset}`);
}

// Print header
function printHeader() {
  console.clear();
  print('==============================================================', 'cyan', true);
  print('              LifeTrackPro White Screen Debugger              ', 'cyan', true);
  print('==============================================================', 'cyan', true);
  console.log('');
}

// Main debugging function
async function debugApp() {
  printHeader();
  print('Starting diagnostic tests...', 'blue');
  console.log('');

  // 1. Check if critical files exist
  print('1. Checking for critical files...', 'yellow');
  const criticalFiles = [
    { path: 'client/src/main.tsx', name: 'Client Entry Point' },
    { path: 'client/index.html', name: 'Client HTML Template' },
    { path: 'client/src/App.tsx', name: 'Main App Component' },
    { path: 'package.json', name: 'Package Configuration' },
    { path: 'vite.config.ts', name: 'Vite Configuration' }
  ];

  let missingFiles = false;
  for (const file of criticalFiles) {
    if (fs.existsSync(path.join(__dirname, file.path))) {
      print(`  ✓ ${file.name} found`, 'green');
    } else {
      print(`  ✗ ${file.name} missing (${file.path})`, 'red');
      missingFiles = true;
    }
  }

  if (missingFiles) {
    print('\nSome critical files are missing. This may cause the white screen issue.', 'red');
    print('Suggestion: Restore these files from your repository or backups.', 'yellow');
  } else {
    print('\nAll critical files are present.', 'green');
  }
  console.log('');

  // 2. Check for port availability
  print('2. Checking port availability...', 'yellow');
  const portsToCheck = [3000, 3966, 5173];
  let portConflicts = false;

  for (const port of portsToCheck) {
    const isAvailable = await checkPort(port);
    if (isAvailable) {
      print(`  ✓ Port ${port} is available`, 'green');
    } else {
      print(`  ✗ Port ${port} is in use by another process`, 'red');
      portConflicts = true;
    }
  }

  if (portConflicts) {
    print('\nSome ports are already in use, which may cause connection issues.', 'red');
    print('Suggestion: Stop other applications that might be using these ports,', 'yellow');
    print('           or modify the port in vite.config.ts and package.json.', 'yellow');
  } else {
    print('\nAll required ports are available.', 'green');
  }
  console.log('');

  // 3. Check package.json for correct scripts
  print('3. Checking package.json scripts...', 'yellow');
  try {
    const packageJson = JSON.parse(fs.readFileSync(path.join(__dirname, 'package.json'), 'utf8'));
    const requiredScripts = ['dev', 'build', 'start'];
    let missingScripts = false;

    for (const script of requiredScripts) {
      if (packageJson.scripts && packageJson.scripts[script]) {
        print(`  ✓ "${script}" script found: ${packageJson.scripts[script]}`, 'green');
      } else {
        print(`  ✗ "${script}" script missing`, 'red');
        missingScripts = true;
      }
    }

    if (missingScripts) {
      print('\nSome required scripts are missing from package.json.', 'red');
      print('Suggestion: Add the missing scripts to your package.json file.', 'yellow');
    } else {
      print('\nAll required scripts are present in package.json.', 'green');
    }
  } catch (error) {
    print(`\nError reading package.json: ${error.message}`, 'red');
  }
  console.log('');

  // 4. Check for correct path in index.html
  print('4. Checking HTML entry point...', 'yellow');
  try {
    const clientIndexPath = path.join(__dirname, 'client', 'index.html');
    const rootIndexPath = path.join(__dirname, 'index.html');
    
    let indexHtml;
    let indexPath;
    
    if (fs.existsSync(clientIndexPath)) {
      indexHtml = fs.readFileSync(clientIndexPath, 'utf8');
      indexPath = clientIndexPath;
      print('  ✓ Client index.html found', 'green');
    } else if (fs.existsSync(rootIndexPath)) {
      indexHtml = fs.readFileSync(rootIndexPath, 'utf8');
      indexPath = rootIndexPath;
      print('  ✓ Root index.html found', 'green');
    } else {
      print('  ✗ No index.html found in client/ or root directory', 'red');
      throw new Error('No index.html found');
    }
    
    // Check for correct script path
    if (indexHtml.includes('src="./src/main') || 
        indexHtml.includes('src="/src/main') || 
        indexHtml.includes('src="src/main')) {
      print('  ✓ Correct script path in index.html', 'green');
    } else {
      print('  ✗ Script path may be incorrect in index.html', 'red');
      print('\nThe script path in index.html may be incorrect.', 'red');
      print('Suggestion: Update the script path in index.html to point to your entry file.', 'yellow');
      
      // Offer to fix the issue
      const answer = await askQuestion('Would you like to fix the script path in index.html? (y/n): ');
      if (answer.toLowerCase() === 'y') {
        const updatedHtml = indexHtml.replace(
          /<script.*type="module".*src=".*?".*>/,
          '<script type="module" src="./src/main.tsx"></script>'
        );
        fs.writeFileSync(indexPath, updatedHtml);
        print('\nScript path has been updated in index.html.', 'green');
      }
    }
  } catch (error) {
    if (error.message !== 'No index.html found') {
      print(`\nError checking index.html: ${error.message}`, 'red');
    }
  }
  console.log('');

  // 5. Offer quick fixes
  print('5. Quick fix options:', 'yellow');
  console.log('');
  print('  1. Clear node_modules and reinstall dependencies', 'white');
  print('  2. Start the app with debugging enabled', 'white');
  print('  3. Fix common white screen issues automatically', 'white');
  print('  4. Exit', 'white');
  console.log('');

  const choice = await askQuestion('Choose an option (1-4): ');

  switch (choice) {
    case '1':
      await clearAndReinstall();
      break;
    case '2':
      await startWithDebugging();
      break;
    case '3':
      await fixCommonIssues();
      break;
    case '4':
    default:
      rl.close();
      break;
  }
}

// Check if a port is available
function checkPort(port) {
  return new Promise(resolve => {
    const server = http.createServer();
    server.unref();
    server.on('error', () => resolve(false));
    server.listen(port, () => {
      server.close(() => resolve(true));
    });
  });
}

// Ask user a question
function askQuestion(question) {
  return new Promise(resolve => {
    rl.question(question, answer => resolve(answer));
  });
}

// Clear node_modules and reinstall dependencies
async function clearAndReinstall() {
  print('\nClearing node_modules and reinstalling dependencies...', 'blue');
  
  const options = { cwd: __dirname, stdio: 'inherit' };
  
  try {
    print('Removing node_modules...', 'yellow');
    if (process.platform === 'win32') {
      await execCommand('rmdir /s /q node_modules');
      print('Checking for client node_modules...', 'yellow');
      if (fs.existsSync(path.join(__dirname, 'client', 'node_modules'))) {
        await execCommand('rmdir /s /q client\\node_modules');
      }
    } else {
      await execCommand('rm -rf node_modules');
      print('Checking for client node_modules...', 'yellow');
      if (fs.existsSync(path.join(__dirname, 'client', 'node_modules'))) {
        await execCommand('rm -rf client/node_modules');
      }
    }
    
    print('Installing dependencies...', 'yellow');
    await execCommand('npm install');
    
    print('Checking for client package.json...', 'yellow');
    if (fs.existsSync(path.join(__dirname, 'client', 'package.json'))) {
      print('Installing client dependencies...', 'yellow');
      await execCommand('cd client && npm install');
    }
    
    print('\nDependencies have been reinstalled successfully.', 'green');
    print('Try running the app again with: npm run dev', 'green');
  } catch (error) {
    print(`\nError during reinstallation: ${error.message}`, 'red');
  }
  
  await askQuestion('\nPress Enter to return to the main menu...');
  debugApp();
}

// Start the app with debugging enabled
async function startWithDebugging() {
  print('\nStarting the app with debugging enabled...', 'blue');
  print('Press Ctrl+C to stop the app and return to the debugger.', 'yellow');
  console.log('');
  
  // Set debug environment variables
  const env = {
    ...process.env,
    DEBUG: 'vite:*',
    VITE_DEBUG: 'true',
    NODE_ENV: 'development'
  };
  
  const clientProcess = spawn('npm', ['run', 'dev'], {
    cwd: __dirname,
    env,
    stdio: 'inherit',
    shell: true
  });
  
  clientProcess.on('exit', (code) => {
    if (code !== null) {
      print(`\nApp process exited with code ${code}`, code === 0 ? 'green' : 'red');
    }
    
    setTimeout(() => {
      askQuestion('\nPress Enter to return to the main menu...').then(() => {
        debugApp();
      });
    }, 1000);
  });
}

// Fix common white screen issues automatically
async function fixCommonIssues() {
  print('\nAttempting to fix common white screen issues...', 'blue');
  
  // 1. Create a proper vite.config.js if not exists or is problematic
  print('1. Fixing Vite configuration...', 'yellow');
  const viteConfigPath = path.join(__dirname, 'vite.config.ts');
  const viteConfigContent = `
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: './',
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'client/src'),
    },
  },
  server: {
    port: 3966,
    open: true,
    cors: true,
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
  },
})
  `;
  
  fs.writeFileSync(viteConfigPath, viteConfigContent);
  print('  ✓ Vite configuration updated', 'green');
  
  // 2. Ensure the correct main script in index.html
  print('2. Fixing HTML entry point...', 'yellow');
  const clientIndexPath = path.join(__dirname, 'client', 'index.html');
  const rootIndexPath = path.join(__dirname, 'index.html');
  
  // Create a basic index.html if none exists
  if (!fs.existsSync(clientIndexPath) && !fs.existsSync(rootIndexPath)) {
    const indexHtml = `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/logo.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>LifeTrackPro</title>
    <script>
      // Error handling
      window.addEventListener('error', function(e) {
        console.error('Global error caught:', e.error || e.message);
      });
    </script>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="./client/src/main.tsx"></script>
  </body>
</html>
    `;
    
    fs.writeFileSync(rootIndexPath, indexHtml);
    print('  ✓ Created new index.html in root', 'green');
  } else {
    // Update existing index.html
    const indexPath = fs.existsSync(clientIndexPath) ? clientIndexPath : rootIndexPath;
    let indexHtml = fs.readFileSync(indexPath, 'utf8');
    
    // Add error handling script if not present
    if (!indexHtml.includes('window.addEventListener(\'error\'')) {
      indexHtml = indexHtml.replace('</head>', `  <script>
    // Error handling
    window.addEventListener('error', function(e) {
      console.error('Global error caught:', e.error || e.message);
    });
  </script>
</head>`);
    }
    
    // Fix script path if needed
    indexHtml = indexHtml.replace(
      /<script.*type="module".*src=".*?".*>/,
      '<script type="module" src="./client/src/main.tsx"></script>'
    );
    
    fs.writeFileSync(indexPath, indexHtml);
    print(`  ✓ Updated ${path.basename(indexPath)}`, 'green');
  }
  
  // 3. Create .env file with debug settings
  print('3. Creating debug environment settings...', 'yellow');
  const envContent = `
VITE_DEBUG=true
VITE_API_URL=http://localhost:3000
  `;
  fs.writeFileSync(path.join(__dirname, '.env'), envContent);
  print('  ✓ Created debug .env file', 'green');
  
  print('\nCommon issues have been fixed. Try running the app again with:', 'green');
  print('npm run dev', 'cyan');
  
  await askQuestion('\nPress Enter to return to the main menu...');
  debugApp();
}

// Execute a command and return a promise
function execCommand(command) {
  return new Promise((resolve, reject) => {
    exec(command, { cwd: __dirname }, (error, stdout, stderr) => {
      if (error) {
        console.error(stderr);
        reject(error);
        return;
      }
      resolve(stdout);
    });
  });
}

// Start the debugging process
debugApp();

// Handle SIGINT (Ctrl+C)
process.on('SIGINT', () => {
  console.log('\n');
  print('Exiting debugger...', 'yellow');
  process.exit(0);
}); 