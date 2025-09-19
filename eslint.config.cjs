// Minimal root ESLint flat config. Keep this file intentionally small and
// non-opinionated so per-package `eslint.config.cjs` files can take precedence.
module.exports = [
  {
    ignores: ['node_modules/**'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
    },
    rules: {},
  },
];
