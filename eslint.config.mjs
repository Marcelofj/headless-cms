// eslint.config.mjs - IMPORTS ES MODULES
import js from '@eslint/js'
import globals from 'globals'
import tsParser from '@typescript-eslint/parser'
import tsPlugin from '@typescript-eslint/eslint-plugin'

export default [
  // base config
  js.configs.recommended,

  // TypeScript config
  {
    files: ['**/*.ts'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        project: './tsconfig.jsonc',
      },
      globals: {
        ...globals.node,
      },
    },
    plugins: {
      '@typescript-eslint': tsPlugin,
    },
    rules: {
      // forbidden semicolon
      semi: ['error', 'never'],

      // TypeScript
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
        },
      ],

      // clean code
      'no-console': 'warn',
      'prefer-const': 'error',
      'no-var': 'error',

      // Formatting
      quotes: ['error', 'single'],
      indent: ['error', 2],
      'comma-dangle': ['error', 'never'],
    },
  },

  // Ignore files
  {
    ignores: ['dist/**', 'node_modules/**', '**/*.js', '*.config.*'],
  },
]
