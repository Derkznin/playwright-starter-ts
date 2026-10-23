import js from '@eslint/js';
import { defineConfig } from 'eslint/config';
import tseslint from 'typescript-eslint';
import prettier from 'eslint-config-prettier';
import playwright from 'eslint-plugin-playwright';

export default defineConfig([
  {
    ignores: [
      'node_modules/**',
      'playwright-report/**',
      'blob-report/**',
      'test-results/**',
      'coverage/**',
      'dist/**',
    ],
  },
  {
    files: ['**/*.{js,mjs,cjs,ts,mts,cts}'],
    extends: [js.configs.recommended, tseslint.configs.recommended, prettier],
  },
  {
    files: ['**/*.{ts,mts,cts}'],
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      '@typescript-eslint/no-floating-promises': 'error',
    },
  },
  {
    // Règles Playwright : uniquement sur les fichiers de test
    ...playwright.configs['flat/recommended'],
    files: ['tests/**'],
  },
  {
    // Méthodes de page qui contiennent des vérifications (expect)
    files: ['tests/**'],
    rules: {
      'playwright/expect-expect': ['warn', { assertFunctionPatterns: ['.*[Vv]erif.*'] }],
    },
  },
]);
