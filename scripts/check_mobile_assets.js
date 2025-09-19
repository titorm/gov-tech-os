#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const ASSETS_DIR = path.join(__dirname, '../apps/mobile/assets');
const IMG_EXT = ['.png', '.jpg', '.jpeg', '.webp', '.gif', '.svg'];

function isImageFile(name) {
  return IMG_EXT.includes(path.extname(name).toLowerCase());
}

function checkPngHeader(buffer) {
  if (buffer.length < 8) return false;
  // PNG header: 89 50 4E 47 0D 0A 1A 0A
  return (
    buffer[0] === 0x89 &&
    buffer[1] === 0x50 &&
    buffer[2] === 0x4e &&
    buffer[3] === 0x47 &&
    buffer[4] === 0x0d &&
    buffer[5] === 0x0a &&
    buffer[6] === 0x1a &&
    buffer[7] === 0x0a
  );
}

function checkJpegHeader(buffer) {
  if (buffer.length < 3) return false;
  // JPEG starts with FF D8 FF
  return buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff;
}

function walk(dir) {
  const results = [];
  const list = fs.readdirSync(dir);
  for (const file of list) {
    const full = path.join(dir, file);
    const stat = fs.statSync(full);
    if (stat.isDirectory()) {
      results.push(...walk(full));
    } else {
      results.push(full);
    }
  }
  return results;
}

// If run with `--fix`, write tiny PNGs to the known invalid paths before checking
if (require.main === module && process.argv.includes('--fix')) {
  const targets = [
    path.join(__dirname, '../apps/mobile/assets/images/adaptive-icon.png'),
    path.join(__dirname, '../apps/mobile/assets/images/favicon.png'),
    path.join(__dirname, '../apps/mobile/assets/images/icon.png'),
    path.join(__dirname, '../apps/mobile/assets/images/splash.png'),
  ];
  for (const t of targets) {
    try {
      console.log('Writing tiny PNG to', t);
      writeTinyPng(t);
    } catch (err) {
      console.error('Failed to write', t, err.message);
    }
  }
  console.log('Wrote replacements. Continuing to verify...');
}

function main() {
  if (!fs.existsSync(ASSETS_DIR)) {
    console.error('Assets directory not found:', ASSETS_DIR);
    process.exit(2);
  }

  const files = walk(ASSETS_DIR).filter(isImageFile);
  if (files.length === 0) {
    console.error('No image files found under', ASSETS_DIR);
    process.exit(3);
  }

  const report = [];
  for (const f of files) {
    let entry = { path: f, size: 0, ok: true, reason: null };
    try {
      const buffer = fs.readFileSync(f);
      entry.size = buffer.length;
      if (buffer.length === 0) {
        entry.ok = false;
        entry.reason = 'empty file';
      } else {
        const ext = path.extname(f).toLowerCase();
        if (ext === '.png' && !checkPngHeader(buffer)) {
          entry.ok = false;
          entry.reason = 'invalid PNG header';
        } else if ((ext === '.jpg' || ext === '.jpeg') && !checkJpegHeader(buffer)) {
          entry.ok = false;
          entry.reason = 'invalid JPEG header';
        }
      }
    } catch (err) {
      entry.ok = false;
      entry.reason = 'read error: ' + String(err.message);
    }
    report.push(entry);
  }

  const bad = report.filter(r => !r.ok);
  console.log('Checked', report.length, 'image files.');
  if (bad.length === 0) {
    console.log('All image files look valid.');
  } else {
    console.log('Found', bad.length, 'invalid image files:');
    for (const b of bad) {
      console.log(' -', b.path, `(size=${b.size})`, b.reason);
    }
  }

  // Also print app.config.js references
  const appConfig = path.join(__dirname, '../apps/mobile/app.config.js');
  if (fs.existsSync(appConfig)) {
    console.log('\nContents of apps/mobile/app.config.js:');
    console.log(fs.readFileSync(appConfig, 'utf8'));
  }

  process.exit(bad.length === 0 ? 0 : 4);
}

main();
// Helper: create small valid 1x1 PNG at target paths (used interactively)
function writeTinyPng(targetPath) {
  // 1x1 transparent PNG
  const png = Buffer.from([
    0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0x00, 0x00, 0x00, 0x0d, 0x49, 0x48, 0x44, 0x52, 0x00, 0x00, 0x00,
    0x01, 0x00, 0x00, 0x00, 0x01, 0x08, 0x06, 0x00, 0x00, 0x00, 0x1f, 0x15, 0xc4, 0x89, 0x00, 0x00, 0x00, 0x0a, 0x49,
    0x44, 0x41, 0x54, 0x78, 0x9c, 0x63, 0x00, 0x01, 0x00, 0x00, 0x05, 0x00, 0x01, 0x0d, 0x0a, 0x2d, 0xb4, 0x00, 0x00,
    0x00, 0x00, 0x49, 0x45, 0x4e, 0x44, 0xae, 0x42, 0x60, 0x82,
  ]);
  fs.mkdirSync(path.dirname(targetPath), { recursive: true });
  fs.writeFileSync(targetPath, png);
}

// If run with `--fix`, write tiny PNGs to the known invalid paths before checking
if (require.main === module && process.argv.includes('--fix')) {
  const targets = [
    path.join(__dirname, '../apps/mobile/assets/images/adaptive-icon.png'),
    path.join(__dirname, '../apps/mobile/assets/images/favicon.png'),
    path.join(__dirname, '../apps/mobile/assets/images/icon.png'),
    path.join(__dirname, '../apps/mobile/assets/images/splash.png'),
  ];
  for (const t of targets) {
    try {
      console.log('Writing tiny PNG to', t);
      writeTinyPng(t);
    } catch (err) {
      console.error('Failed to write', t, err.message);
    }
  }
  console.log('Wrote replacements. Continuing to verify...');
}
