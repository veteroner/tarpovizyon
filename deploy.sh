#!/bin/bash

echo "🚀 TarpoVizyon GitHub Deployment Script"
echo "======================================="

# First accept Xcode license if needed
echo "1. Checking Xcode license..."
if ! git --version >/dev/null 2>&1; then
    echo "❌ Xcode license not accepted. Please run:"
    echo "   sudo xcodebuild -license accept"
    exit 1
fi

echo "✅ Git is available"

# Initialize git repository if not already initialized
if [ ! -d ".git" ]; then
    echo "2. Initializing git repository..."
    git init
    echo "✅ Git repository initialized"
else
    echo "✅ Git repository already exists"
fi

# Configure git user if not set
if [ -z "$(git config user.name)" ]; then
    echo "3. Setting up git configuration..."
    read -p "Enter your name for git commits: " git_name
    read -p "Enter your email for git commits: " git_email
    git config user.name "$git_name"
    git config user.email "$git_email"
    echo "✅ Git configuration set"
fi

# Add all files to git
echo "4. Adding files to git..."
git add .
echo "✅ Files added to git"

# Create initial commit
echo "5. Creating initial commit..."
git commit -m "Initial commit - TarpoVizyon AI deployment"
echo "✅ Initial commit created"

# Add remote origin
echo "6. Adding GitHub remote..."
git remote add origin https://github.com/veteroner/tarpovizyon.git
echo "✅ Remote origin added"

# Push to GitHub
echo "7. Pushing to GitHub..."
git branch -M main
git push -u origin main --force
echo "✅ Pushed to GitHub successfully!"

echo ""
echo "🎉 Deployment completed!"
echo "Your project is now available at: https://github.com/veteroner/tarpovizyon"
echo ""
echo "Next steps for Netlify deployment:"
echo "1. Go to https://netlify.com"
echo "2. Click 'New site from Git'"
echo "3. Choose GitHub and select 'veteroner/tarpovizyon'"
echo "4. Set Environment Variables:"
echo "   - GEMINI_API_KEY = your_api_key_here"
echo "5. Deploy!"
