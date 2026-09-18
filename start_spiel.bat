@echo off
title Wahrheit oder Luege - Spielserver
cd /d "%~dp0"
echo ========================================================
echo   WAHRHEIT ODER LUEGE - 2 Wahrheiten, 1 Luege
echo ========================================================
echo.
echo Der Server startet...
echo Dein Internet-Browser wird gleich automatisch geoeffnet!
echo.
timeout /t 2 /nobreak >nul
start "" "http://localhost:8000"
uv run --with fastapi --with uvicorn --with websockets python server.py
pause
