module.exports =  {
  env: {
    es6: true
  },
  extends:  [
    // 'plugin:@typescript-eslint/recommended',  // Uses the recommended rules from @typescript-eslint/eslint-plugin,
    'airbnb-typescript/base'
  ],
  parserOptions:  {
    project: './tsconfig.json',
    ecmaVersion:  2018,  // Allows for the parsing of modern ECMAScript features
    sourceType:  'module',  // Allows for the use of imports
  },
  ignorePatterns: ['.eslintrc.js'],
  rules:  {
    // Place to specify ESLint rules. Can be used to overwrite rules specified from the extended configs
    // e.g. '@typescript-eslint/explicit-function-return-type': 'off',
    "no-underscore-dangle": ["error", { "allowAfterThis": true }],
    'import/extensions': ['error', 'ignorePackages', {
      js: 'never',
      mjs: 'never',
      jsx: 'never',
      ts: 'never'
    }],
  },
  settings:  {
    'import/resolver': {
      node: {
        extensions: ['.mjs', '.js', '.json', '.ts']
      }
    },
    'import/extensions': [
      '.ts',
      '.js',
      '.mjs',
      '.jsx',
    ],
    'import/core-modules': [
    ],
    'import/ignore': [
      'node_modules',
      '\\.(coffee|scss|css|less|hbs|svg|json)$',
    ],
  },
};