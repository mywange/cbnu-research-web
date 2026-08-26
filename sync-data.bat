@echo off
chcp 65001 > nul
echo ===================================================
echo   CBNU Research Group Web - Synchronizing Data
echo ===================================================
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0scripts\sync-data.ps1"
echo.
pause
