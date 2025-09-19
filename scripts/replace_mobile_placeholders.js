#!/usr/bin/env node
// scripts/replace_mobile_placeholders.js
// Copies provided images into apps/mobile/assets/images to replace placeholders.
// Usage: node scripts/replace_mobile_placeholders.js --src=/path/to/new/images --dry-run

const fs = require('fs');
const path = require('path');
const argv = require('minimist')(process.argv.slice(2));

const SRC = argv.src;
const DRY = argv['dry-run'] || false;
if (!SRC) {
  console.error('Usage: node scripts/replace_mobile_placeholders.js --src=/path/to/new/images [--dry-run]');
  process.exit(2);
}

const targets = {
  'icon.png': 'icon.png',
  'splash.png': 'splash.png',
  'favicon.png': 'favicon.png',
  'adaptive-icon.png': 'adaptive-icon.png',
};

const destDir = path.resolve(__dirname, '..', 'apps', 'mobile', 'assets', 'images');

for (const [srcName, destName] of Object.entries(targets)) {
  const srcPath = path.resolve(SRC, srcName);
  const destPath = path.join(destDir, destName);
  if (!fs.existsSync(srcPath)) {
    console.warn(`Source not found: ${srcPath} — skipping`);
    continue;
  }
  if (DRY) {
    console.log(`[dry-run] would copy ${srcPath} -> ${destPath}`);
    continue;
  }
  fs.copyFileSync(srcPath, destPath);
  console.log(`Copied ${srcPath} -> ${destPath}`);
}

console.log('Done.');
