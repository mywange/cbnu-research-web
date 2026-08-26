@echo off
chcp 65001 > nul
echo ===================================================
echo   CBNU Research Group Web - Starting Local Server
echo ===================================================
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0scripts\start-server.ps1"
pause
