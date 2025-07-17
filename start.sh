#!/bin/bash

echo "🚀 Starting Task Manager API..."
echo "📁 Current working directory: $(pwd)"
echo "📋 Directory contents:"
ls -la

echo ""
echo "🔍 Checking for dist folder..."
if [ -d "dist" ]; then
    echo "✅ Found dist folder"
    echo "📁 Dist contents:"
    ls -la dist/
    
    if [ -f "dist/index.js" ]; then
        echo "✅ Found dist/index.js"
        echo "🌟 Starting server with: node dist/index.js"
        node dist/index.js
    else
        echo "❌ dist/index.js not found"
        echo "🔨 Building project first..."
        npm run build
        if [ -f "dist/index.js" ]; then
            echo "✅ Build successful, starting server..."
            node dist/index.js
        else
            echo "❌ Build failed or dist/index.js still not found"
            exit 1
        fi
    fi
else
    echo "❌ No dist folder found"
    echo "🔨 Building project..."
    npm run build
    if [ -d "dist" ] && [ -f "dist/index.js" ]; then
        echo "✅ Build successful, starting server..."
        node dist/index.js
    else
        echo "❌ Build failed"
        exit 1
    fi
fi
