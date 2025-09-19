// Per-package flat ESLint config for the mobile app (Expo).
// Ensures TypeScript and TSX files are parsed by @typescript-eslint/parser
// and common build/artifact folders are ignored.
module.exports = [
  {
    ignores: ['dist/**', 'node_modules/**', '.expo/**', 'web-build/**'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      parserOptions: { ecmaFeatures: { jsx: true } },
    },
    plugins: { '@typescript-eslint': require('@typescript-eslint/eslint-plugin') },
  },
  {
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: {
      parser: require('@typescript-eslint/parser'),
      // Avoid `parserOptions.project` here because the mobile tsconfig extends
      // `@expo/tsconfig` which may not be resolvable in CI/lint runners. This
      // configuration provides parsing for TS/TSX without enabling type-aware
      // rules that require a fully-resolved tsconfig.
      parserOptions: {
        tsconfigRootDir: __dirname,
        ecmaFeatures: { jsx: true },
      },
    },
    plugins: { '@typescript-eslint': require('@typescript-eslint/eslint-plugin') },
    rules: {},
  },
];
