// Minimal fallback ESLint flat config used during pre-commit to avoid requiring workspace packages.
// This keeps lint-staged/eslint from failing when workspace package resolution is not available.
module.exports = [
  {
    ignores: ['node_modules/**'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
    },
    rules: {
      // keep defaults; specialized rules live in workspace config
    },
  },
];
