#!/usr/bin/env node
/*
 A tiny wrapper that runs eslint CLI within a given package directory so that
 legacy `.eslintrc.*` configs (which use `extends`) resolve and run with the
 package's local dependencies. Usage: `node ./scripts/run-eslint-per-package.js packages/ui`.
*/
const { spawnSync } = require('child_process');
const path = require('path');

const pkgDir = process.argv[2] || '.';
const cwd = path.resolve(process.cwd(), pkgDir);

const args = [
  'eslint',
  '-c',
  '.eslintrc.cjs',
  'src',
  '--ext',
  'ts,tsx',
  '--report-unused-disable-directives',
  '--max-warnings',
  '0',
];

console.log(`Running eslint in ${cwd}`);
const res = spawnSync('pnpm', ['--filter', `./${pkgDir}`, 'exec', '--', ...args], {
  stdio: 'inherit',
  cwd: process.cwd(),
});
process.exit(res.status);
