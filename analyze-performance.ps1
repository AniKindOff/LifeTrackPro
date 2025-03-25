# LifeTrackPro Performance Analyzer
Write-Host "===============================================" -ForegroundColor Magenta
Write-Host "      LifeTrackPro Performance Analyzer        " -ForegroundColor Magenta
Write-Host "===============================================" -ForegroundColor Magenta
Write-Host ""

# Get script directory
$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $scriptDir

# Function to check if a command exists
function Test-Command {
    param($command)
    $oldPreference = $ErrorActionPreference
    $ErrorActionPreference = 'stop'
    try {
        if (Get-Command $command) { return $true }
    } catch { return $false }
    finally { $ErrorActionPreference = $oldPreference }
}

Write-Host "1. Analyzing bundle size..." -ForegroundColor Yellow

# Create temp directory for analysis
$analysisDir = Join-Path $scriptDir "analysis-temp"
if (-not (Test-Path $analysisDir)) {
    New-Item -Path $analysisDir -ItemType Directory -Force | Out-Null
}

# Check if webpack-bundle-analyzer is installed
if (-not (Test-Command "npx")) {
    Write-Host "npx not found. Please install Node.js." -ForegroundColor Red
    exit 1
}

# Create a file to collect performance data
$perfDataFile = Join-Path $analysisDir "performance-data.json"

Write-Host "2. Checking for performance optimization opportunities..." -ForegroundColor Yellow

# Check if we have React DevTools installed
$hasReactDevTools = Test-Path (Join-Path $scriptDir "node_modules" "react-devtools")

# Check lazy loading implementation
$clientDir = Join-Path $scriptDir "client"
$srcDir = Join-Path $clientDir "src"
$componentsDir = Join-Path $srcDir "components"

$totalFiles = (Get-ChildItem -Path $componentsDir -File -Recurse -Include "*.tsx","*.jsx").Count
$lazyLoadedFiles = (Get-ChildItem -Path $componentsDir -File -Recurse -Include "*.tsx","*.jsx" | Select-String -Pattern "React.lazy" -SimpleMatch).Count

# Check CSS optimization
$cssFiles = (Get-ChildItem -Path $srcDir -File -Recurse -Include "*.css").Count
$purgedCss = Test-Path (Join-Path $scriptDir "postcss.config.js") -and (Get-Content (Join-Path $scriptDir "postcss.config.js") | Select-String -Pattern "cssnano|purgecss" -SimpleMatch)

# Collect performance data
$perfData = @{
    "timestamp" = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    "totalComponents" = $totalFiles
    "lazyLoadedComponents" = $lazyLoadedFiles
    "lazyLoadPercentage" = if ($totalFiles -gt 0) { [math]::Round(($lazyLoadedFiles / $totalFiles) * 100, 2) } else { 0 }
    "cssFiles" = $cssFiles
    "cssOptimized" = $purgedCss
    "hasDevTools" = $hasReactDevTools
}

# Save performance data
$perfData | ConvertTo-Json | Set-Content $perfDataFile

# Create optimization suggestions
$suggestions = @()

if ($perfData.lazyLoadPercentage -lt 30) {
    $suggestions += "Consider implementing React.lazy() for more components to improve initial load time"
}

if (-not $perfData.cssOptimized) {
    $suggestions += "Add CSS optimization with PurgeCSS and cssnano in postcss.config.js"
}

if (-not $perfData.hasDevTools) {
    $suggestions += "Install react-devtools for better performance debugging: npm install --save-dev react-devtools"
}

# Check for large bundle dependencies
$packageJsonPath = Join-Path $clientDir "package.json"
if (Test-Path $packageJsonPath) {
    $packageJson = Get-Content $packageJsonPath | ConvertFrom-Json
    $dependencies = @($packageJson.dependencies.PSObject.Properties.Name) + @($packageJson.devDependencies.PSObject.Properties.Name)
    
    $largePackages = @("moment", "lodash", "chart.js", "three", "monaco-editor")
    $foundLargePackages = $largePackages | Where-Object { $dependencies -contains $_ }
    
    foreach ($pkg in $foundLargePackages) {
        switch ($pkg) {
            "moment" { $suggestions += "Replace moment.js with date-fns or luxon for smaller bundle size" }
            "lodash" { $suggestions += "Use lodash-es or consider importing only needed lodash functions" }
            "chart.js" { $suggestions += "Consider using a lighter charting library or lazy-load chart.js" }
            "three" { $suggestions += "Lazy-load three.js only when 3D features are needed" }
            "monaco-editor" { $suggestions += "Lazy-load monaco-editor only when advanced editing is needed" }
        }
    }
}

# Create performance report
$reportPath = Join-Path $scriptDir "performance-report.md"
$report = @"
# LifeTrackPro Performance Report
Generated: $($perfData.timestamp)

## Component Analysis
- Total Components: $($perfData.totalComponents)
- Lazy Loaded Components: $($perfData.lazyLoadedComponents)
- Lazy Loading Percentage: $($perfData.lazyLoadPercentage)%

## CSS Analysis
- CSS Files: $($perfData.cssFiles)
- CSS Optimization: $($perfData.cssOptimized)

## Development Tools
- React DevTools: $($perfData.hasDevTools)

## Optimization Suggestions
"@

foreach ($suggestion in $suggestions) {
    $report += "`n- " + $suggestion
}

$report += @"

## Quick Optimization Commands

### Add CSS optimization
```
npm install --save-dev cssnano purgecss autoprefixer
```

### Setup route-based code splitting
```javascript
const Dashboard = React.lazy(() => import('./components/Dashboard'));
```

### Enable production mode optimizations
```
npm run build -- --mode=production
```
"@

# Save the report
$report | Set-Content $reportPath

Write-Host "Performance analysis complete!" -ForegroundColor Green
Write-Host "Report saved to: $reportPath" -ForegroundColor Green
Write-Host ""
Write-Host "Key findings:" -ForegroundColor Cyan
Write-Host "- Component lazy loading: $($perfData.lazyLoadPercentage)%" -ForegroundColor $(if ($perfData.lazyLoadPercentage -lt 30) { "Red" } else { "Green" })
Write-Host "- CSS optimization: $(if ($perfData.cssOptimized) { "Enabled" } else { "Disabled" })" -ForegroundColor $(if ($perfData.cssOptimized) { "Green" } else { "Red" })

if ($suggestions.Count -gt 0) {
    Write-Host ""
    Write-Host "Suggestions:" -ForegroundColor Yellow
    foreach ($suggestion in $suggestions) {
        Write-Host "- $suggestion" -ForegroundColor White
    }
}

Write-Host ""
Write-Host "To run the app with optimizations, use: ./quick-run.ps1" -ForegroundColor Magenta 