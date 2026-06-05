/**
 * PWA Enhancement Script
 * Post-processes Expo web export to add full PWA capabilities:
 * - manifest.json link
 * - Apple/Safari mobile web app meta tags
 * - Service worker registration
 * - Theme color
 *
 * Usage: node scripts/pwa-enhance.js [dist-path]
 */

const fs = require('fs');
const path = require('path');

const distPath = process.argv[2] || './dist';
const distDir = path.resolve(distPath);

if (!fs.existsSync(distDir)) {
  console.error(`❌ Directory not found: ${distDir}`);
  console.error('   Run: npx expo export --platform web  first');
  process.exit(1);
}

// ============ 1. Copy PWA assets ============

// Copy manifest.json
const manifestSrc = path.resolve('./public/manifest.json');
const manifestDst = path.join(distDir, 'manifest.json');
if (fs.existsSync(manifestSrc)) {
  fs.copyFileSync(manifestSrc, manifestDst);
  console.log('✅ Copied manifest.json');
}

// Copy service worker
const swSrc = path.resolve('./public/sw.js');
const swDst = path.join(distDir, 'sw.js');
if (fs.existsSync(swSrc)) {
  fs.copyFileSync(swSrc, swDst);
  console.log('✅ Copied sw.js');
}

// Copy icons directory
const iconsSrc = path.resolve('./public/icons');
const iconsDst = path.join(distDir, 'icons');
if (fs.existsSync(iconsSrc)) {
  fs.cpSync(iconsSrc, iconsDst, { recursive: true });
  console.log('✅ Copied icons/');
}

// ============ 2. Enhance index.html ============

const indexPath = path.join(distDir, 'index.html');
if (!fs.existsSync(indexPath)) {
  console.error(`❌ index.html not found in ${distDir}`);
  process.exit(1);
}

let html = fs.readFileSync(indexPath, 'utf-8');

// PWA meta tags to inject into <head>
const pwaHeadTags = `
  <!-- PWA Meta Tags -->
  <meta name="apple-mobile-web-app-capable" content="yes">
  <meta name="apple-mobile-web-app-status-bar-style" content="default">
  <meta name="apple-mobile-web-app-title" content="正畸追踪">
  <meta name="mobile-web-app-capable" content="yes">
  <meta name="theme-color" content="#FFB5C2">
  <meta name="description" content="记录正畸之旅，追踪每次复查的变化">

  <!-- Apple Touch Icon -->
  <link rel="apple-touch-icon" href="/icons/apple-touch-icon.png">
  <link rel="apple-touch-icon" sizes="180x180" href="/icons/apple-touch-icon.png">
  <link rel="apple-touch-icon" sizes="192x192" href="/icons/icon-192.png">

  <!-- Favicon -->
  <link rel="icon" type="image/png" sizes="32x32" href="/icons/favicon-32.png">
  <link rel="icon" type="image/png" sizes="16x16" href="/icons/favicon-16.png">

  <!-- PWA Manifest -->
  <link rel="manifest" href="/manifest.json">`;

// Inject after <meta charset="utf-8"> or at the beginning of <head>
if (html.includes('<meta charset="utf-8">')) {
  html = html.replace('<meta charset="utf-8">', '<meta charset="utf-8">' + pwaHeadTags);
} else if (html.includes('<head>')) {
  html = html.replace('<head>', '<head>' + pwaHeadTags);
} else {
  // Fallback: add after <html> tag
  html = html.replace('<html>', '<html><head>' + pwaHeadTags + '</head>');
}

// Service worker registration before </body>
const swScript = `
  <script>
    // Register service worker for PWA offline support
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', function() {
        navigator.serviceWorker.register('/sw.js').then(function(reg) {
          console.log('SW registered:', reg.scope);
        }).catch(function(err) {
          console.log('SW registration failed:', err);
        });
      });
    }
  </script>`;

if (html.includes('</body>')) {
  html = html.replace('</body>', swScript + '\n</body>');
} else {
  html += swScript;
}

fs.writeFileSync(indexPath, html, 'utf-8');
console.log('✅ Enhanced index.html with PWA tags');

console.log('\n🎉 PWA ready! Deploy the dist/ folder to any static host.');
console.log('   Try: npx serve dist   (for local testing)');
