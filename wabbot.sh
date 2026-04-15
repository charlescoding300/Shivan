#!/bin/bash

echo "⚡ WABBOT FULL A–Z RESTORE STARTING..."

# =========================
# 1. UPDATE SYSTEM
# =========================
pkg update -y && pkg upgrade -y

# =========================
# 2. CORE TOOLS
# =========================
pkg install -y git nodejs python ffmpeg

# =========================
# 3. CLONE BOT
# =========================
rm -rf Shivan
git clone https://github.com/charlescoding300/Shivan.git

cd Shivan

# =========================
# 4. NODE DEPENDENCIES
# =========================
npm install

# =========================
# 5. RESTORE TERMUX PACKAGES
# =========================
if [ -f "../packages.txt" ]; then
    echo "📦 Restoring Termux packages..."
    cat ../packages.txt | xargs pkg install -y
else
    echo "⚠️ No packages.txt found"
fi

# =========================
# 6. START BOT
# =========================
echo "🚀 Starting WABBot..."
node index.js
