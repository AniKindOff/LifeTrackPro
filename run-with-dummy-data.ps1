Write-Host "🚀 LifeTrackPro with 3D icons and dummy data" -ForegroundColor Cyan
Write-Host "---------------------------------------------" -ForegroundColor Cyan

# Create directory for data if it doesn't exist
$dataDir = "server/data"
if (-not (Test-Path $dataDir)) {
    Write-Host "Creating data directory..." -ForegroundColor Yellow
    New-Item -ItemType Directory -Path $dataDir -Force | Out-Null
}

# Generate dummy data
Write-Host "Generating dummy data..." -ForegroundColor Yellow
node server/scripts/generate-dummy-data.js

# Run the application
Write-Host "Starting the application with dummy data..." -ForegroundColor Green
npm run dev 