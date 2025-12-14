// eslint.config.js
import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
// 1. Импортируем плагин для работы с импортами
import importPlugin from 'eslint-plugin-import'; // [!code ++]

export default tseslint.config(
  // 1. Базовый конфиг для ВСЕХ файлов
  {
    files: ['**/*.{js,mjs,cjs,ts,tsx}'],
    extends: [eslint.configs.recommended],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        browser: 'readonly',
      },
    },
    ignores: [
      'dist/**',
      'node_modules/**',
      '*.config.js',
      '*.config.ts',
      'stylelint.config.mjs',
    ],
  },

  // 2. Конфигурация ТОЛЬКО для TypeScript-файлов
  {
    files: ['**/*.{ts,tsx}'],
    extends: [tseslint.configs.recommended],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        project: './tsconfig.json',
        warnOnUnsupportedTypeScriptVersion: false,
      },
    },
    // 2. Подключаем плагин в этот объект конфигурации
    plugins: {
      import: importPlugin, // [!code ++]
    },
    rules: {
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      quotes: ['error', 'single'], // Заменили '@typescript-eslint/quotes'
      // Правила из плагина 'import' теперь доступны
      'import/extensions': ['error', 'ignorePackages'],
      'import/no-extraneous-dependencies': [
        'error',
        { devDependencies: true },
      ],
      'class-methods-use-this': 'off',
      'max-len': ['error', { code: 120 }],
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_' },
      ],
    },
  },
);