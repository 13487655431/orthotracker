#!/bin/bash
# 一键导出正畸APP到桌面
set -e
cd "C:/Users/Windows/Desktop/claude code/OrthoTracker"

echo "📦 导出网页..."
npx expo export --platform web

echo "🔧 添加PWA配置..."
# 替换 index.html 的 title 和 meta
sed -i 's|<html lang="en">|<html lang="zh-CN">|' dist/index.html
sed -i 's|<title>OrthoTracker</title>|<title>🦷 正畸记录</title>\n    <meta name="description" content="正畸时长记录与复查照片管理" />\n    <meta name="apple-mobile-web-app-capable" content="yes" />\n    <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />\n    <meta name="apple-mobile-web-app-title" content="正畸记录" />\n    <meta name="theme-color" content="#FFB5C2" />\n    <link rel="apple-touch-icon" href="/favicon.ico" />\n    <link rel="manifest" href="/manifest.json" />|' dist/index.html
sed -i 's|shrink-to-fit=no"|shrink-to-fit=no, viewport-fit=cover"|' dist/index.html

# 添加 manifest.json
cat > dist/manifest.json << 'MANIFEST'
{
  "name": "🦷 正畸记录",
  "short_name": "正畸记录",
  "description": "记录正畸时长，管理复查照片",
  "start_url": "/",
  "display": "standalone",
  "orientation": "portrait",
  "background_color": "#FFF5F5",
  "theme_color": "#FFB5C2",
  "icons": [
    { "src": "/favicon.ico", "sizes": "48x48", "type": "image/x-icon" }
  ]
}
MANIFEST

echo "📁 复制到桌面..."
rm -rf "/c/Users/Windows/Desktop/正畸记录APP"
cp -r dist "/c/Users/Windows/Desktop/正畸记录APP"

echo "✅ 完成！桌面文件夹已更新"
