@echo off
echo ========================================
echo Visa Requirements Checker - Installation
echo ========================================
echo.

echo Checking if Node.js is installed...
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Node.js is not installed!
    echo Please install Node.js from https://nodejs.org/
    echo Then run this script again.
    pause
    exit /b 1
)

echo Node.js is installed. Version:
node --version

echo.
echo Installing dependencies...
npm install

if %errorlevel% neq 0 (
    echo ERROR: Failed to install dependencies!
    pause
    exit /b 1
)

echo.
echo ========================================
echo Installation completed successfully!
echo ========================================
echo.
echo To start the server, run:
echo   npm start
echo.
echo Then open your browser to:
echo   http://localhost:3000
echo.
echo To access the admin panel:
echo   http://localhost:3000/logs.html
echo.
pause 