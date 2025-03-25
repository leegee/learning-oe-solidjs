import js from '@eslint/js'
import globals from 'globals'
import solidPlugin from 'eslint-plugin-solid'
import tseslint from '@typescript-eslint/eslint-plugin'
import tsparser from '@typescript-eslint/parser'

export default [
  {
    ignores: ['dist', '*.config.[jt]s', 'tests'],
  },
  {
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: globals.browser,
      parser: tsparser,
      parserOptions: {
        project: './tsconfig.app.json', // Ensure this exists
      },
    },
  },
  {
    files: ['**/*.{ts,tsx}'],
    plugins: {
      solid: solidPlugin,
      '@typescript-eslint': tseslint,
    },
    rules: {
      ...js.configs.recommended.rules, // JavaScript recommended rules
      ...tseslint.configs.recommended.rules, // TypeScript recommended rules
      'solid/jsx-no-undef': 'error', // Ensure JSX elements are defined
      'solid/no-unknown-namespaces': 'warn', // Solid-specific rule
    },
  },
]
