@echo off
TITLE NeuroSaathi - Production Server Launcher
COLOR 0B
cls
echo ======================================================================
echo             NEUROSAATHI - PRODUCTION LAUNCHER
echo       "Your Companion for a Healthier Mind" (SIH 2026)
echo ======================================================================
echo.

echo [1/3] Building Optimized React Production Bundle...
cd /d "%~dp0web"
call npm run build
if %errorlevel% neq 0 (
    echo [ERROR] Frontend build failed! Check errors above.
    pause
    exit /b %errorlevel%
)
cd /d "%~dp0"

set "PY_CMD=python"
if exist "%~dp0backend\python_embed\python.exe" (
    set "PY_CMD=%~dp0backend\python_embed\python.exe"
)

echo.
echo [2/3] Initializing SQLite Database and Models...
"%PY_CMD%" -c "import sys; sys.path.insert(0, 'backend'); from models.database import init_db; init_db(); print('Database verified!')"

echo.
echo [3/3] Starting Multi-Threaded WSGI Server on Port 5000...
echo Single-Port Full Stack (API: /api/*, Frontend SPA: /)
echo.
start http://localhost:5000
"%PY_CMD%" backend\prod_server.py

pause
