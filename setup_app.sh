#!/bin/bash

# Bookmark Manager - Setup & Launch Script
# This script installs dependencies, processes data, and launches the application.

echo "========================================"
echo "    Starting Bookmark Manager Setup     "
echo "========================================"

# 1. Install Dependencies
echo ""
echo "[1/4] Installing dependencies..."
if [ ! -d "node_modules" ]; then
    npm install
    if [ $? -ne 0 ]; then
        echo "Error: Failed to install dependencies."
        exit 1
    fi
else
    echo "Node modules already exist. Skipping install (run 'npm install' manually to update)."
fi

# 2. Process Bookmarks
echo ""
echo "[2/4] Processing bookmarks..."
if [ -f "public/Main DB.html" ]; then
    node scripts/import-bookmarks.js
    if [ $? -ne 0 ]; then
        echo "Warning: Bookmark import script encountered an issue."
    else
        echo "Bookmarks imported successfully."
    fi
else
    echo "Warning: 'public/Main DB.html' not found. Skipping import."
    echo "Please place your bookmark export file at 'public/Main DB.html' to see your data."
fi

# 3. Cache Images (Background)
echo ""
echo "[3/4] Caching images..."
echo "Starting image cacher in the background (this may take a while)..."
# Run silently in background so we don't block startup
node scripts/cache-images.js > /dev/null 2>&1 &
PID=$!
echo "Image cacher running with PID $PID"

# 4. Launch App
echo ""
echo "[4/4] Launching application..."
echo "Opening http://localhost:5173 ..."
echo "Press Ctrl+C to stop the server."
echo "========================================"

npm run dev
