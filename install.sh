#!/bin/bash

echo "========================================"
echo "Visa Requirements Checker - Installation"
echo "========================================"
echo

echo "Checking if Node.js is installed..."
if ! command -v node &> /dev/null; then
    echo "ERROR: Node.js is not installed!"
    echo "Please install Node.js from https://nodejs.org/"
    echo "Then run this script again."
    exit 1
fi

echo "Node.js is installed. Version:"
node --version

echo
echo "Installing dependencies..."
npm install

if [ $? -ne 0 ]; then
    echo "ERROR: Failed to install dependencies!"
    exit 1
fi

echo
echo "========================================"
echo "Installation completed successfully!"
echo "========================================"
echo
echo "To start the server, run:"
echo "  npm start"
echo
echo "Then open your browser to:"
echo "  http://localhost:3000"
echo
echo "To access the admin panel:"
echo "  http://localhost:3000/logs.html"
echo 