module.exports = {
    env: {
        browser: true,
        es2021: true
    },
    extends: [
        'standard-with-typescript'
    ],
    overrides: [
        {
            files: [
                '**/*.test.ts',
                '**/*.test.js'
            ],
            env: {
                jest: true // now **/*.test.js files' env has both es6 *and* jest
            },
            // Can't extend in overrides: https://github.com/eslint/eslint/issues/8813
            // "extends": ["plugin:jest/recommended"]
            plugins: ['jest'],
            rules: {
                '@typescript-eslint/member-delimiter-style': ['off'],
                semi: ['error', 'always'],
                indent: ['error', 4],
                '@typescript-eslint/indent': ['off'],
                '@typescript-eslint/semi': ['off'],
                'jest/no-disabled-tests': 'warn',
                'jest/no-focused-tests': 'error',
                'jest/no-identical-title': 'error',
                'jest/prefer-to-have-length': 'warn',
                'jest/valid-expect': 'error'
            }
        }
    ],
    parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        project: ['./tsconfig.json', './tsconfig.test.json']
    },
    rules: {
        '@typescript-eslint/member-delimiter-style': ['off'],
        semi: ['error', 'always'],
        indent: ['error', 4],
        '@typescript-eslint/indent': ['off'],
        '@typescript-eslint/semi': ['off']
    }
};
