@echo off
echo ======================================
echo    LifeTrackPro with Riya Assistant
echo ======================================
echo.

echo [1/3] Checking dependencies...
cd %~dp0
IF NOT EXIST node_modules (
  echo Installing dependencies...
  call npm install
) ELSE (
  echo Dependencies already installed.
)

echo.
echo [2/3] Starting LifeTrackPro...
echo.
echo Your application will be available at:
echo - Frontend: http://localhost:3001
echo - API: http://localhost:3000
echo.
echo Press Ctrl+C to stop the application
echo.

echo [3/3] Launching...
echo.

start /B npm run dev

timeout /t 5 /nobreak > nul
start http://localhost:3001

echo LifeTrackPro with Riya Assistant is now running!
echo. 