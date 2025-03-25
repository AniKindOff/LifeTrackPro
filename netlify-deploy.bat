@echo off
echo Building client application...
cd client
call npm install
call npm run build
cd ..

echo Deploying to Netlify...
REM Check if Netlify CLI is installed
where netlify >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo Installing Netlify CLI...
    call npm install -g netlify-cli
)

REM Deploy to Netlify (will prompt for login if not authenticated)
call netlify deploy --prod 