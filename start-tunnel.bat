@echo off
echo ========================================
echo   Dev.Vibe - Cloudflare Tunnel Setup
echo ========================================
echo.
echo 4개의 터미널이 자동으로 열립니다:
echo  1. Backend (port 3001)
echo  2. Backend Tunnel (cloudflared)
echo  3. Frontend (port 3000)
echo  4. Frontend Tunnel (cloudflared)
echo.
echo ========================================
echo  발급된 URL은 각 Tunnel 터미널에 표시됩니다.
echo  Backend URL을 frontend/.env 의
echo  REACT_APP_API_URL 에 넣고 Frontend 재시작해주세요.
echo ========================================
echo.

start "Backend" cmd /k "cd /d %~dp0backend && npm start"
timeout /t 4 /nobreak >nul

start "Backend Tunnel" cmd /k "cloudflared tunnel --url http://localhost:3001"
timeout /t 6 /nobreak >nul

start "Frontend" cmd /k "cd /d %~dp0frontend && npm run dev"
timeout /t 15 /nobreak >nul

start "Frontend Tunnel" cmd /k "cloudflared tunnel --url http://localhost:3000"

echo.
echo 모든 서비스가 시작되었습니다!
echo Frontend Tunnel 터미널에서 URL 확인하세요.
echo (보통 https://something-random.trycloudflare.com)
echo.
echo 보안 페이지 없이 바로 사이트 표시됩니다!
echo.
pause
