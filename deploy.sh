#!/bin/bash

# Menu Web App Deployment Script

echo "🚀 Starting deployment process..."

# Build the application
echo "📦 Building the application..."
yarn build

if [ $? -eq 0 ]; then
    echo "✅ Build successful!"
    
    # Check if build folder exists
    if [ -d "build" ]; then
        echo "📁 Build folder created successfully"
        echo "📊 Build size:"
        du -sh build/
        
        echo ""
        echo "🎉 Your app is ready for deployment!"
        echo ""
        echo "📋 Next steps:"
        echo "1. For Firebase Hosting:"
        echo "   firebase deploy"
        echo ""
        echo "2. For Netlify:"
        echo "   - Drag the 'build' folder to Netlify"
        echo ""
        echo "3. For Vercel:"
        echo "   vercel"
        echo ""
        echo "4. For GitHub Pages:"
        echo "   yarn deploy"
        echo ""
        echo "📖 See DEPLOYMENT.md for detailed instructions"
    else
        echo "❌ Build folder not found!"
        exit 1
    fi
else
    echo "❌ Build failed!"
    exit 1
fi 