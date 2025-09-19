// Minimal flat-config for the `web` package to declare ignored files and
// ensure TypeScript/TSX are parsed correctly. This avoids the
// `.eslintignore` deprecation warning while keeping rule surface minimal.
module.exports = [
  {
    ignores: ['**/*.gen.ts', '**/*.gen.tsx', '**/*.generated.ts', '**/*.generated.tsx', 'dist/**', '.vite/**'],
    // Keep default JS parsing for non-TS files; add an explicit override
    // below to ensure TypeScript files use @typescript-eslint/parser.
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      parserOptions: {
        ecmaFeatures: { jsx: true },
      },
    },
    plugins: { '@typescript-eslint': require('@typescript-eslint/eslint-plugin') },
  },
  // Explicit override for TypeScript files to force the TypeScript parser.
  {
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: {
      parser: require('@typescript-eslint/parser'),
      ecmaVersion: 2022,
      sourceType: 'module',
      parserOptions: {
        ecmaFeatures: { jsx: true },
      },
    },
    plugins: { '@typescript-eslint': require('@typescript-eslint/eslint-plugin') },
  },
];
