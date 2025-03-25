#!/bin/bash

# Build the app
npm run build

# Create or ensure the existence of .gitignore in dist to not track unnecessary files
echo "node_modules\n.DS_Store" > dist/.gitignore

# Initialize git in the dist folder
cd dist
git init
git add -A
git commit -m "Deploy to GitHub Pages"

# Push to the gh-pages branch
git push -f https://github.com/yourusername/LifeTrackPro.git master:gh-pages

cd -

echo "Deployed to GitHub Pages" 