module.exports = {
  env: {
    browser: true,
    es2021: true
  },
  settings: {
    react: {
      version: 'detect'
    }
  },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:@typescript-eslint/recommended'
  ],
  overrides: [],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module'
  },
  plugins: ['react', '@typescript-eslint'],
  rules: {
    quotes: ['off', 'single', { allowTemplateLiterals: true }],
    semi: ['off', 'never'],
    'no-trailing-spaces': 'error',
    'no-undef': ['off'],
    'no-multi-spaces': 'error',
    'no-console': 'off',
    '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '_' }],
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/ban-ts-comment': 'off',
    'linebreak-style': ['warn', 'unix'],
    'react/react-in-jsx-scope': 'off',
    'react/display-name': 'off',
    'react/jsx-uses-react': 'off',
  }
}
