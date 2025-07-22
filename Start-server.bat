@echo off
cd /d C:\dstock
call npm install

REM פותח את הדפדפן אחרי 3 שניות, במקביל
start "" cmd /c "timeout /t 3 >nul && start http://localhost:3000"

call npm run dev
pause
