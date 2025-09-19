module.exports = {
  semi: true,
  singleQuote: true,
  quoteProps: 'as-needed',
  trailingComma: 'es5',
  tabWidth: 2,
  printWidth: 120,
  useTabs: false,
  bracketSpacing: true,
  bracketSameLine: false,
  arrowParens: 'avoid',
  endOfLine: 'lf',
  embeddedLanguageFormatting: 'auto',
  overrides: [
    {
      files: ['*.json', '*.jsonc'],
      options: {
        printWidth: 120,
        tabWidth: 2
      }
    },
    {
      files: ['*.md', '*.mdx'],
      options: {
        printWidth: 120,
        proseWrap: 'always'
      }
    }
  ]
};
