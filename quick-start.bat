@echo off
echo ======================================
echo    LifeTrackPro Quick Launcher
echo ======================================
echo.

REM Set environment variables
SET NODE_ENV=development
SET PORT=3966

echo [1/4] Checking dependencies...
cd %~dp0
IF NOT EXIST node_modules (
  echo Installing dependencies...
  call npm install
) ELSE (
  echo Dependencies already installed.
)

echo.
echo [2/4] Preloading assets...
IF NOT EXIST public\preloaded (
  mkdir public\preloaded
  echo Asset directory created.
) ELSE (
  echo Assets already preloaded.
)

echo.
echo [3/4] Setting up environment...
echo Loading configuration...

REM Optimize for faster startup
echo OPTIMIZE_LOAD=true > .env.local
echo PRELOAD_ASSETS=true >> .env.local
echo DISABLE_ANALYTICS_IN_DEV=true >> .env.local

echo.
echo [4/4] Starting LifeTrackPro...
echo.
echo Your application will be available at: http://localhost:3966
echo.
echo Press Ctrl+C to stop the application
echo.

REM Start client and server concurrently with optimized flags
start /B npm run dev

REM Open browser automatically after a short delay
timeout /t 5 /nobreak > nul
start http://localhost:3966

echo LifeTrackPro is now running!
echo. 