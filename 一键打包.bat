@echo off
cd /d "C:\Users\Windows\Desktop\claude code\OrthoTracker"
echo ========================================
echo    🦷 正畸APP - 一键打包
echo ========================================
echo.
echo 正在初始化项目...
call npx eas-cli init --non-interactive
if %errorlevel% neq 0 (
    echo.
    echo 需要确认，正在重试...
    echo y | call npx eas-cli init
)
echo.
echo 开始构建APK，大约需要10-20分钟...
call npx eas-cli build --platform android --profile preview --non-interactive
echo.
echo ========================================
echo 完成后会显示下载链接！
echo ========================================
pause
