import js from '@eslint/js'
import globals from 'globals'
import solidPlugin from 'eslint-plugin-solid'
import tseslint from '@typescript-eslint/eslint-plugin'

export default tseslint.config(
  { ignores: ['dist'] },
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    plugins: {
      'solid': solidPlugin,
    },
    rules: {
      // Solid-specific rules
      'solid/jsx-no-undef': 'error', // For ensuring JSX elements are defined
      'solid/props-rule': 'warn', // You can add Solid-specific rules here
    },
  },
)
