#!/bin/bash

echo "⚡ Restoring WABBot..."

# remove old folder if exists
rm -rf Shivan

# clone latest version from GitHub
git clone https://github.com/charlescoding300/Shivan.git

cd Shivan

echo "📦 Installing packages..."
npm install

echo "✅ Restore complete!"

echo "🚀 Starting bot..."
node index.js
