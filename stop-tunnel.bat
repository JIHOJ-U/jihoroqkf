@echo off
echo 모든 Node 프로세스 종료...
taskkill /F /IM node.exe 2>nul
echo 종료 완료.
pause
