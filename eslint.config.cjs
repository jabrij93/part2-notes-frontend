// eslint.config.cjs
const globals = require('globals');
const stylisticJsPlugin = require('@stylistic/eslint-plugin-js');

// Manually specify recommended rules
const recommendedRules = {
  'no-unused-vars': 0,
  'no-undef': 'error',
  'eqeqeq': 'error',
  'no-trailing-spaces': 'error',
  'object-curly-spacing': ['error', 'always'],
  'arrow-spacing': ['error', { 'before': true, 'after': true }],
  'no-console': 0,
  'react/react-in-jsx-scope': 'off',
  'react/prop-types': 0
};

module.exports = [
  {
    files: ["**/*.js"],
    languageOptions: {
      sourceType: "module",
      globals: {AudioWorkletGlobalScope: 'readonly', // Ensure no spaces here
        "vitest-globals/env": true, // Add other specific globals if needed
      },
     
    },
    plugins: {
      '@stylistic/js': stylisticJsPlugin,
    },
    extends: [
      'eslint:recommended',
      'plugin:react/recommended',
      'plugin:react/jsx-runtime',
      'plugin:react-hooks/recommended',
      'plugin:vitest-globals/recommended', // Add this line to extend Vitest's recommended rules
    ],
    rules: {
      ...recommendedRules,
      '@stylistic/js/indent': ['error', 2],
      '@stylistic/js/linebreak-style': ['error', 'unix'],
      '@stylistic/js/quotes': ['error', 'single'],
      '@stylistic/js/semi': ['error', 'never'],
    },
  },
];
