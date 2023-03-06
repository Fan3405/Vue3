module.exports = {
  root: true,
  env: {
    browser: true,
    es2021: true,
  },
  extends: ['plugin:vue/vue3-essential', 'eslint:recommended', 'airbnb-base'],
  overrides: [],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  settings: {
    'import/resolver': {
      alias: {
        map: [['@', './src']],
        extensions: ['.js', '.vue'],
      },
    },
    'import/core-modules': ['vite', '@vitejs/plugin-vue'],
  },
  plugins: ['vue'],
  rules: {
    'max-len': [
      'error',
      {
        code: 130, // 標記的最大長度
        tabWidth: 2,
        ignoreUrls: true,
        ignorePattern: '^\\s*<',
      },
    ],
  },
};
