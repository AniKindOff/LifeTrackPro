@echo off
echo ======================================
echo    LifeTrackPro Live Server
echo ======================================
echo.

echo [1/2] Building the application...
cd %~dp0
cd client
call npm run build

echo.
echo [2/2] Starting Live Server...
echo.
echo Your application will be available at:
echo - http://localhost:5000
echo - On your network: Check the terminal for the network URL
echo.
echo Press Ctrl+C to stop the server
echo.

cd %~dp0\client
serve -s dist -l 5000

echo LifeTrackPro is now running on a live server!
echo. 