module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true
  },
  extends: [
    'standard'
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module'
  },
  rules: {
    // Ghost theme specific rules
    'no-undef': 'off', // Handlebars helpers are global
    'no-unused-vars': 'warn'
  },
  ignorePatterns: [
    'assets/built/**',
    'node_modules/**'
  ]
}
