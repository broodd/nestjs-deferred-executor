// @ts-check
import eslint from '@eslint/js';
import perfectionist from 'eslint-plugin-perfectionist';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';

import globals from 'globals';
import tseslint from 'typescript-eslint';

export default [
  {
    ignores: ['eslint.config.mjs', 'dist', 'node_modules', 'coverage', '**/dist', '**/out-tsc'],
  },
  eslint.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,
  eslintPluginPrettierRecommended,
  {
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.jest,
      },
      sourceType: 'commonjs',
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  {
    files: ['**/*.ts'],
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-floating-promises': 'off',
      '@typescript-eslint/no-unsafe-argument': 'off',
      '@typescript-eslint/no-unsafe-assignment': 'off',
      '@typescript-eslint/no-unsafe-call': 'off',
      '@typescript-eslint/no-unsafe-member-access': 'off',
      '@typescript-eslint/no-unsafe-return': 'off',
      '@typescript-eslint/no-unsafe-enum-comparison': 'off',
    },
  },
  {
    files: ['**/*.ts'],
    plugins: {
      perfectionist,
    },
    rules: {
      'perfectionist/sort-imports': [
        'warn',
        {
          groups: [
            'builtin',
            'external',
            'nest',
            'internal',
            'commonLib',
            'common',
            'mainModules',
            'modules',
            'parent',
            'sibling',
            'unknown',
          ],
          customGroups: [
            {
              groupName: 'nest',
              elementNamePattern: ['^@nestjs/(.*)$'],
            },
            { groupName: 'commonLib', elementNamePattern: ['@common/(.*)'] },
            { groupName: 'common', elementNamePattern: ['(.*)/common/(.*)'] },
            { groupName: 'mainModules', elementNamePattern: ['^src/(?!modules/).*'] },
            { groupName: 'modules', elementNamePattern: ['^src/modules/(.*)$', '^../../(.*)$'] },
          ],

          newlinesBetween: 1,
          type: 'line-length',
          order: 'desc',
        },
      ],
      'perfectionist/sort-named-imports': [
        'warn',
        {
          type: 'line-length',
          order: 'desc',
        },
      ],
      'perfectionist/sort-exports': [
        'warn',
        {
          type: 'line-length',
          order: 'desc',
        },
      ],
    },
  },
];
