module.exports = {
  extends: ['expo', '@repo/eslint-config'],
  rules: {
    '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
  },
};