@echo off
title CardioPulse AI - Local Full Stack Launcher
echo =======================================================
echo          CardioPulse AI - System Startup
echo =======================================================
echo Starting FastAPI ML Backend on http://127.0.0.1:8000 ...
start "CardioPulse FastAPI Backend" cmd /k "cd /d \"%~dp0\" && py -m uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload"

timeout /t 3 /nobreak > nul

echo Starting Next.js Web UI on http://localhost:3000 ...
start "CardioPulse Next.js Frontend" cmd /k "cd /d \"%~dp0frontend\" && npm run dev"

echo.
echo =======================================================
echo Both services are now running!
echo - Web Application:  http://localhost:3000
echo - FastAPI Backend:  http://127.0.0.1:8000
echo - Interactive Docs: http://127.0.0.1:8000/docs
echo =======================================================
timeout /t 5 > nul
start http://localhost:3000
