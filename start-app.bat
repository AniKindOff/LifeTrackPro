@echo off
echo ======================================
echo    LifeTrackPro Quick Start
echo ======================================
echo.

echo Setting up environment...
set NODE_ENV=development
set PORT=3966
set FAST_REFRESH=true

echo.
echo Starting LifeTrackPro application...
echo.
echo Your application will be available at: http://localhost:3966
echo.
echo Press Ctrl+C to stop the application
echo.

:: Run the development server
start "" http://localhost:3966
cd /d "%~dp0"
npm run dev

echo.
echo LifeTrackPro has been stopped.
echo. 