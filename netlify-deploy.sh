#!/bin/bash

# Build the client application
echo "Building client application..."
cd client
npm install
npm run build
cd ..

# Deploy to Netlify
echo "Deploying to Netlify..."
# Install Netlify CLI if not already installed
if ! command -v netlify &> /dev/null
then
    echo "Installing Netlify CLI..."
    npm install -g netlify-cli
fi

# Deploy to Netlify (will prompt for login if not authenticated)
netlify deploy --prod 