# CardioPulse AI - PowerShell Full Stack Launcher
Write-Host "=======================================================" -ForegroundColor Cyan
Write-Host "         CardioPulse AI - System Startup               " -ForegroundColor Yellow
Write-Host "=======================================================" -ForegroundColor Cyan

$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path

Write-Host "Starting FastAPI ML Backend on http://127.0.0.1:8000 ..." -ForegroundColor Green
Start-Process -FilePath "powershell.exe" -ArgumentList "-NoExit", "-Command", "Set-Location '$ScriptDir'; py -m uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload"

Start-Sleep -Seconds 3

Write-Host "Starting Next.js Web UI on http://localhost:3000 ..." -ForegroundColor Green
Start-Process -FilePath "powershell.exe" -ArgumentList "-NoExit", "-Command", "Set-Location '$ScriptDir\frontend'; npm run dev"

Write-Host "`nBoth services are starting!" -ForegroundColor Cyan
Write-Host "- Web Application:  http://localhost:3000" -ForegroundColor White
Write-Host "- FastAPI Backend:  http://127.0.0.1:8000" -ForegroundColor White
Write-Host "- Interactive Docs: http://127.0.0.1:8000/docs" -ForegroundColor White
Write-Host "=======================================================" -ForegroundColor Cyan

Start-Sleep -Seconds 4
Start-Process "http://localhost:3000"
