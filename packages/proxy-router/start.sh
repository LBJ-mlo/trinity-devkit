#!/bin/bash
# Trinity Router — Linux/macOS 启动脚本

cd "$(dirname "$0")"

if ! command -v node &>/dev/null; then
    echo "❌ 未找到 Node.js，请先安装: https://nodejs.org"
    exit 1
fi

if [ -z "$DEEPSEEK_API_KEY" ]; then
    echo "⚠️  未设置 DEEPSEEK_API_KEY 环境变量"
fi
if [ -z "$GLM_API_KEY" ]; then
    echo "⚠️  未设置 GLM_API_KEY 环境变量"
fi

echo "🚀 启动 Trinity Router..."
exec node server.js
