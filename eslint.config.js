import js from '@eslint/js'
import prettierConfig from 'eslint-config-prettier'
import importPlugin from 'eslint-plugin-import'
import nPlugin from 'eslint-plugin-n'
import prettierPlugin from 'eslint-plugin-prettier'
import tseslint from 'typescript-eslint'

export default [
  // Base JS recommended
  js.configs.recommended,
  // TypeScript rules com type-check
  ...tseslint.configs.recommendedTypeChecked,
  {
    files: ['**/*.ts'],
    ignores: ['dist/**'],

    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        project: './tsconfig.json',
        tsconfigRootDir: import.meta.dirname,
      },
      ecmaVersion: 'latest',
      sourceType: 'module',
    },

    plugins: {
      import: importPlugin,
      n: nPlugin,
      prettier: prettierPlugin,
    },

    rules: {
      // Desativa conflitos com Prettier
      ...prettierConfig.rules,

      // Node
      'n/no-missing-import': 'off', // NodeNext já resolve
      'n/no-process-exit': 'off',

      // Organização de imports
      'import/order': [
        'error',
        {
          alphabetize: { order: 'asc', caseInsensitive: true },
          'newlines-between': 'always',
        },
      ],

      // TS ajustes comuns em backend
      '@typescript-eslint/no-misused-promises': [
        'error',
        { checksVoidReturn: false },
      ],
      '@typescript-eslint/require-await': 'off',

      // Prettier
      'prettier/prettier': 'error',
    },
  },
]