#!/usr/bin/env bash
# ==============================================================================
# NeuroSaathi - Linux/macOS Production Build & Launcher
# ==============================================================================
set -e

echo "======================================================================"
echo "          NEUROSAATHI - PRODUCTION DEPLOYMENT LAUNCHER"
echo "======================================================================"

echo "[1/3] Installing frontend dependencies & building bundle..."
cd web
npm install
npm run build
cd ..

echo "[2/3] Installing Python dependencies..."
python3 -m pip install -r backend/requirements.txt

echo "[3/3] Starting Production WSGI Server on port 5000..."
python3 backend/prod_server.py
