@echo off
REM Trinity Router — Windows 启动脚本
REM 请先设置环境变量或创建 .env 文件

cd /d "%~dp0"

REM 检查 Node.js
where node >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ 未找到 Node.js，请先安装: https://nodejs.org
    pause
    exit /b 1
)

REM 检查 API Key
if "%DEEPSEEK_API_KEY%"=="" (
    echo ⚠️  未设置 DEEPSEEK_API_KEY 环境变量
    echo    请运行: set DEEPSEEK_API_KEY=你的密钥
    echo    或创建 .env 文件
)
if "%GLM_API_KEY%"=="" (
    echo ⚠️  未设置 GLM_API_KEY 环境变量
)

echo 🚀 启动 Trinity Router...
node server.js
pause
