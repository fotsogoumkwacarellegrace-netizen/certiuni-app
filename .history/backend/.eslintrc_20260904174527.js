module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: 'tsconfig.json',
    tsconfigRootDir: __dirname,
    sourceType: 'module',
  },
  plugins: [
    '@typescript-eslint/eslint-plugin',
    'import',
  ],
  extends: [
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
  ],
  root: true,
  env: {
    node: true,
    jest: true,
  },
  ignorePatterns: ['.eslintrc.js', 'dist', 'node_modules'],
  rules: {
    // -------------------------------------------------------------
    // Règles TypeScript
    // -------------------------------------------------------------
    '@typescript-eslint/interface-name-prefix': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-explicit-any': 'warn',
    '@typescript-eslint/no-unused-vars': [
      'error',
      {
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_',
        ignoreRestSiblings: true,
      },
    ],

    // -------------------------------------------------------------
    // Règles d'Imports & Organisation
    // -------------------------------------------------------------
    'import/order': [
      'error',
      {
        groups: [
          'builtin',   // Modules Node.js (fs, path, etc.)
          'external',  // Paquets npm (@nestjs, rxjs, etc.)
          'internal',  // Alias internes (@modules, @config, etc.)
          ['parent', 'sibling', 'index'],
        ],
        'newlines-between': 'always',
        alphabetize: {
          order: 'asc',
          caseInsensitive: true,
        },
      },
    ],

    // -------------------------------------------------------------
    // Qualité de Code & Console
    // -------------------------------------------------------------
    'no-console': ['warn', { allow: ['warn', 'error', 'info'] }],
    'no-return-await': 'error',
    'require-await': 'off', // Préférer la règle TS
    '@typescript-eslint/require-await': 'off',
  },
};