import tseslint from 'typescript-eslint';
import prettierPlugin from 'eslint-plugin-prettier/recommended'; 
import globals from 'globals';

export default tseslint.config(
  {
    ignores: [
      'dist/',
      'node_modules/',
      '*.js',
    ],
  },
  
  {
    files: ['**/*.ts'],
    

    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        project: './tsconfig.json',
        sourceType: 'module',
      },
      globals: {
        ...globals.node,
        ...globals.es2021,
      },
    },

    plugins: {
      '@typescript-eslint': tseslint.plugin,
    },
    
    extends: [
      tseslint.configs.recommended,
    ],

    rules: {
      
      '@typescript-eslint/no-explicit-any': 'off',
      
      '@typescript-eslint/no-empty-interface': 'off', 
      
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      
      '@typescript-eslint/no-this-alias': 'off', 

      'prettier/prettier': [
        'error',
        {
          'endOfLine': 'lf',
          'semi': true,
          'singleQuote': true,
          'tabWidth': 2,
          'trailingComma': 'all',
        },
      ],
      
      'arrow-body-style': 'off',
      'prefer-arrow-callback': 'off',
    },
  },
  prettierPlugin,
);