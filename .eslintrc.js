module.exports = {
  env: {
    browser: true,
    node: true,
    es2021: true,
    jasmine: true
  },
  extends: [
    'eslint:recommended'
  ],
  parserOptions: {
    ecmaVersion: 12,
    sourceType: 'module'
  },
  rules: {
    "no-unsafe-finally": "off",
    "no-native-reassign": "off",
    "complexity": ["off", 11],
    "comma-dangle": "error",
    "require-yield": "error"
  }
};
