# Static Export PowerShell Script for LifeTrackPro
# This script builds the app for static export and serves it locally

Write-Host "🚀 Building LifeTrackPro for static export..." -ForegroundColor Cyan

# Set the static export environment variable
$env:STATIC_EXPORT = "true"

# Build the static version
Write-Host "📦 Building client..." -ForegroundColor Yellow
npm run build:static

# Create the API directory if it doesn't exist
if (-not (Test-Path -Path "static-export/api")) {
    New-Item -ItemType Directory -Path "static-export/api" -Force | Out-Null
}

# Copy sounds directory if it exists
if (Test-Path -Path "public/sounds") {
    if (-not (Test-Path -Path "static-export/sounds")) {
        New-Item -ItemType Directory -Path "static-export/sounds" -Force | Out-Null
    }
    Copy-Item -Path "public/sounds/*" -Destination "static-export/sounds" -Recurse -Force
    Write-Host "🔊 Copied sound files" -ForegroundColor Green
}

# Run the script to generate mock API data
Write-Host "🔧 Generating mock API data..." -ForegroundColor Yellow
node server/scripts/copy-static-assets.js

Write-Host "✅ Static export complete!" -ForegroundColor Green

# Ask if user wants to serve the static export
$serveStatic = Read-Host "Would you like to serve the static export locally? (y/n)"
if ($serveStatic -eq "y") {
    Write-Host "🌐 Starting local server..." -ForegroundColor Magenta
    npx serve static-export
}

# Ask if user wants to deploy to Netlify
$deployNetlify = Read-Host "Would you like to deploy to Netlify? (y/n)"
if ($deployNetlify -eq "y") {
    Write-Host "🚀 Deploying to Netlify..." -ForegroundColor Blue
    npx netlify deploy --dir=static-export
    
    $publishProd = Read-Host "Would you like to publish to production? (y/n)"
    if ($publishProd -eq "y") {
        npx netlify deploy --dir=static-export --prod
    }
} 