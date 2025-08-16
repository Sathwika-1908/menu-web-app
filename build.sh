#!/bin/bash

echo "🚀 Starting build process..."

# Install dependencies
echo "📦 Installing dependencies..."
yarn install

# Build the application
echo "🔨 Building the application..."
yarn build

# Check if build was successful
if [ $? -eq 0 ]; then
    echo "✅ Build successful!"
    
    # Check if build folder exists and contains index.html
    if [ -f "build/index.html" ]; then
        echo "📁 Build folder created successfully with index.html"
        echo "📊 Build contents:"
        ls -la build/
        echo ""
        echo "🎉 Ready for deployment!"
    else
        echo "❌ index.html not found in build folder!"
        exit 1
    fi
else
    echo "❌ Build failed!"
    exit 1
fi 