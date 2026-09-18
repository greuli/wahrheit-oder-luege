@echo off
title Wahrheit oder Luege - Spielserver
cd /d "%~dp0"
echo ========================================================
echo   WAHRHEIT ODER LUEGE - 2 Wahrheiten, 1 Luege
echo ========================================================
echo.
echo Der Server wird gestartet...
echo.
uv run --with fastapi --with uvicorn --with websockets python server.py
pause
