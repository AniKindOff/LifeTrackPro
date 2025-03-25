#!/usr/bin/env pwsh
# LifeTrackPro Application Launcher

# Configuration
$port = 3000
$basePath = $PSScriptRoot
$indexFile = "index.html"
$serverType = "static" # Options: "static", "dynamic"

Write-Host "=========================================="
Write-Host "   LifeTrackPro Application Launcher     "
Write-Host "=========================================="
Write-Host ""

# Check for Node.js
try {
    $nodeVersion = node -v
    Write-Host "✓ Node.js detected: $nodeVersion"
} catch {
    Write-Host "✕ Node.js is not installed. Please install Node.js to run this application."
    Write-Host "  Download from: https://nodejs.org/"
    exit 1
}

# Function to check if required files exist
function Test-RequiredFiles {
    $requiredFiles = @(
        "index.html",
        "riya-chatbot.html", 
        "riya-gemini.js",
        "riya-enhanced.css",
        "fixed-app.js"
    )

    $allFilesExist = $true
    foreach ($file in $requiredFiles) {
        $filePath = Join-Path -Path $basePath -ChildPath $file
        if (-not (Test-Path $filePath)) {
            Write-Host "✕ Required file not found: $file"
            $allFilesExist = $false
        }
    }

    return $allFilesExist
}

# Check if http-server is installed
function Install-HttpServer {
    try {
        $httpServerVersion = npm list -g http-server
        if ($httpServerVersion -match "http-server") {
            Write-Host "✓ http-server is installed"
            return $true
        } else {
            Write-Host "Installing http-server..."
            npm install -g http-server
            if ($LASTEXITCODE -ne 0) {
                Write-Host "✕ Failed to install http-server"
                return $false
            } else {
                Write-Host "✓ http-server installed successfully"
                return $true
            }
        }
    } catch {
        Write-Host "Installing http-server..."
        npm install -g http-server
        if ($LASTEXITCODE -ne 0) {
            Write-Host "✕ Failed to install http-server"
            return $false
        } else {
            Write-Host "✓ http-server installed successfully"
            return $true
        }
    }
}

# Main execution
$filesExist = Test-RequiredFiles
if (-not $filesExist) {
    Write-Host "Some required files are missing. Please make sure all files are in the correct location."
    exit 1
}

$httpServerInstalled = Install-HttpServer
if (-not $httpServerInstalled) {
    Write-Host "Failed to set up the server. Please make sure npm is working correctly."
    exit 1
}

# Generate startup file to properly initialize application
$startupContent = @"
<!DOCTYPE html>
<html>
<head>
    <meta http-equiv="refresh" content="0; url=index.html">
    <title>Starting LifeTrackPro...</title>
</head>
<body>
    <p>Initializing LifeTrackPro application...</p>
    <script>
        // Ensure proper initialization of components
        window.addEventListener('load', function() {
            // Redirect to main app
            window.location.href = 'index.html';
        });
    </script>
</body>
</html>
"@

$startupFile = Join-Path -Path $basePath -ChildPath "startup.html"
$startupContent | Out-File -FilePath $startupFile -Encoding utf8

Write-Host ""
Write-Host "Starting LifeTrackPro application server..."
Write-Host "URL: http://localhost:$port/"
Write-Host ""
Write-Host "Press Ctrl+C to stop the server"

# Start the server
Set-Location -Path $basePath
http-server -p $port

# Cleanup
Remove-Item -Path $startupFile -ErrorAction SilentlyContinue 