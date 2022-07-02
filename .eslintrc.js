// setting up the eslint here :-
module.exports = {

    // environment of eslint :-
    env: {
        browser: true,
        commonjs: true,
        es2021: true,
    },

    // style guide of eslint :-
    extends: [
        'airbnb-base',
    ],

    // ECMAScript version :-
    parserOptions: {
        ecmaVersion: 13,
        sourceType: 'module',
    },

    // rules of eslint :-
    rules: {
        semi: ['error', 'always'],
        quotes: ['error', 'single'],
        indent: ['error', 4],
        camelcase: 'off',
        radix: 'warn',
        'max-len': [
            'warn',
            {
                code: 350,
            }],
        'no-console': 'off',
        'no-shadow': ['warn', { hoist: 'all' }],
        'no-unused-vars': ['off', { vars: 'all' }],
        'no-return-await': 0, // '0' means 'off' :-
        'consistent-return': 'off',
        'no-plusplus': 'off',
        'prefer-const': 'off',
        'no-loop-func': 'off',
        'no-param-reassign': 0,
        'array-callback-return': 'off',
        'brace-style': 'warn',
        'no-unused-expressions': 'warn',
        'import/no-extraneous-dependencies': 'off',
        'no-extra-semi': 'error',
        'no-multi-spaces': 'error',
        'no-duplicate-imports': 'warn',
        'linebreak-style': 'off',
        'no-trailing-spaces': 'off',
    },
};
