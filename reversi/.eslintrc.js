const path = require('path');

module.exports = {
  extends: ['airbnb', 'plugin:prettier/recommended'],
  rules: {
    // 0: turn the rule off
    // 1: turn the rule on as a warning
    // 2: turn the rule on as an error (exit code 1)
    'jsx-a11y/': 0,
    'react/jsx-filename-extension': 0,
    // requires multiple variable declarations per scope because sometimes we 
    // would like to declare variables consecutively one by one such as 
    // `mapStateToProps` and `mapDispatchToProps` in container components.
    'one-var': [2, "never"],
    // Link component of 'react-router' uses `to` attribute instead of `href`
    // see https://github.com/evcohen/eslint-plugin-jsx-a11y/issues/339
    'jsx-a11y/anchor-is-valid': [0, {
      "specialLink": ["to"]
    }],
    // now audio tags are only used for music, not songs so they are not the
    // case to improve a11y.
    'jsx-a11y/media-has-caption': [ 1, {
      "Audio": [ "Audio" ]
    }]
  },
  overrides: [
    // ignore "one-var" rule since almost all of container components have 
    // `mapStateToProps` and `mapDispatchToProps`, which can be too long scope 
    // to see `const` statement.
    {
      'files': ['**/containers/**/*.js'],
      'rules': {
        'one-var': [0, "consecutive"]
      } 
    },
    // `yield` cannot be used at callback fuctions such as forEach while
    // `no-restricted-syntax` forbids to make use of `for` statement, which is
    // good reason to disable this rule in all saga.js files
    // see https://github.com/airbnb/javascript/issues/1603
    {
      'files': ['**/sagas.js'],
      'rules': {
        'no-restricted-syntax': 0
      }
    }
  ],
  env: {
    es6: true,
    browser: true,
    jest: true,
    jquery: true
  },
  settings: {
    'import/resolver': {
      webpack: {
        config: path.join(__dirname, '/webpack.local.config.js'),
        'config-index': 1
      }
    }
  }
};
