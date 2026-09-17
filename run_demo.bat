@echo off
TITLE NeuroSaathi - SIH 2026 Live Demo Launcher
COLOR 0A
cls
echo ======================================================================
echo                 NEUROSAATHI - SIH 2026 LIVE DEMO
echo           "Your Companion for a Healthier Mind"
echo ======================================================================
echo.
echo [1/3] Starting Python + Flask REST Backend (Port 5000)...
start "NeuroSaathi Backend" cmd /k "backend\python_embed\python.exe backend\app.py"

echo [2/3] Waiting for Backend to Initialize...
timeout /t 3 /nobreak >nul

echo [3/3] Launching React + Vite Frontend...
start "NeuroSaathi Frontend" cmd /k "npm run dev --prefix web"

echo.
echo ======================================================================
echo Both Backend and Frontend servers are launching!
echo Backend API : http://127.0.0.1:5000/api/health
echo Frontend Web: http://localhost:3000 (or http://localhost:5173)
echo.
echo Opening your browser now...
echo ======================================================================
timeout /t 3 /nobreak >nul
start http://localhost:3000

echo.
echo Press any key to exit this launcher window (Servers will remain active).
pause >nul
