Write-Host "Starting LifeTrackPro in standalone mode..." -ForegroundColor Green

# Function to open a URL in the default browser
function Open-Browser {
    param (
        [string]$Url
    )
    Start-Process $Url
}

# Get the full path to the preview.html file and open it directly
$previewPath = Join-Path -Path $PSScriptRoot -ChildPath "preview.html"
$previewUrl = "file:///$($previewPath.Replace('\', '/'))"

Write-Host "Opening preview in your default browser: $previewUrl" -ForegroundColor Cyan
Open-Browser -Url $previewUrl

Write-Host "Preview should now be open in your browser." -ForegroundColor Yellow
Write-Host "If you see a white screen, try these troubleshooting steps:" -ForegroundColor Yellow
Write-Host "1. Open your browser's developer console (F12) to check for errors" -ForegroundColor Yellow
Write-Host "2. Try opening the simple-test.html file instead with:" -ForegroundColor Yellow
Write-Host "   Start-Process 'file:///C:/Users/omkam/OneDrive/Desktop/MultiTracker/LifeTrackPro/simple-test.html'" -ForegroundColor Cyan
Write-Host "3. Verify your browser's security settings allow opening local files" -ForegroundColor Yellow

Read-Host -Prompt "Press Enter to exit" 