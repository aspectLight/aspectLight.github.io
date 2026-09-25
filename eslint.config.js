import js from '@eslint/js';
import { defineConfig } from 'eslint/config';
import astro from 'eslint-plugin-astro';
import globals from 'globals';
import tseslint from 'typescript-eslint';

const NO_UNKNOWN = {
  selector: 'TSUnknownKeyword',
  message: 'Use a precise type instead of unknown.',
};

/** Shared types live in *.types.ts; a type used by one file stays in it, unexported. */
const TYPES_LIVE_IN_TYPES_FILES = [
  {
    selector: 'ExportNamedDeclaration > TSInterfaceDeclaration',
    message: 'Export shared interfaces from a *.types.ts file; keep file-private ones unexported.',
  },
  {
    selector: 'ExportNamedDeclaration > TSTypeAliasDeclaration',
    message: 'Export shared types from a *.types.ts file; keep file-private ones unexported.',
  },
];

export default defineConfig(
  { ignores: ['dist/', '.astro/', 'docs/', 'node_modules/', '.playwright-mcp/'] },
  js.configs.recommended,
  tseslint.configs.strictTypeChecked,
  tseslint.configs.stylisticTypeChecked,
  astro.configs.recommended,
  ...astro.configs['jsx-a11y-strict'],
  {
    languageOptions: {
      globals: { ...globals.browser, ...globals.node },
      parserOptions: {
        projectService: true,
        extraFileExtensions: ['.astro'],
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      '@typescript-eslint/consistent-type-assertions': ['error', { assertionStyle: 'never' }],
      '@typescript-eslint/consistent-type-imports': 'error',
      '@typescript-eslint/explicit-module-boundary-types': 'error',
      '@typescript-eslint/switch-exhaustiveness-check': 'error',
      '@typescript-eslint/no-explicit-any': 'error',
      // Object shapes are interfaces; `type` is for unions and aliases (Google TS style guide).
      '@typescript-eslint/consistent-type-definitions': ['error', 'interface'],
      'no-restricted-syntax': ['error', NO_UNKNOWN, ...TYPES_LIVE_IN_TYPES_FILES],
      eqeqeq: 'error',
      curly: 'error',
      'no-console': 'error',
      'max-params': ['error', 3],
      'max-depth': ['error', 3],
      complexity: ['error', 10],
      'max-lines-per-function': ['error', { max: 60, skipBlankLines: true, skipComments: true }],
    },
  },
  {
    files: ['**/*.types.ts', 'src/env.d.ts'],
    rules: { 'no-restricted-syntax': ['error', NO_UNKNOWN] },
  },
  {
    // astro-eslint-parser cannot type JSX returned inside templates, so every
    // `list.map(item => <li />)` reads as unsafe. `astro check` type-checks these files.
    files: ['**/*.astro'],
    rules: { '@typescript-eslint/no-unsafe-return': 'off' },
  },
  {
    files: ['**/*.js'],
    ...tseslint.configs.disableTypeChecked,
  },
);
