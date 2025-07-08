module.exports = {
    root: true,
    env: {
        browser: false,
        es6: true,
        node: true,
    },
    parser: '@typescript-eslint/parser',
    parserOptions: {
        project: ['./tsconfig.json'],
        sourceType: 'module',
        ecmaVersion: 2022,
    },
    plugins: ['@typescript-eslint', 'n8n-nodes-base'],
    extends: [
        'eslint:recommended',
        'plugin:@typescript-eslint/recommended',
        'plugin:n8n-nodes-base/community',
    ],
    rules: {
        // Allow any for n8n workflow compatibility
        '@typescript-eslint/no-explicit-any': 'off',
        // Allow unused vars prefixed with underscore
        '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
        // Disable strict return type requirement for n8n compatibility
        '@typescript-eslint/explicit-function-return-type': 'off',
        '@typescript-eslint/explicit-module-boundary-types': 'off',
        // Allow non-null assertion for n8n workflow data
        '@typescript-eslint/no-non-null-assertion': 'off',
        // Allow empty functions
        '@typescript-eslint/no-empty-function': 'off',
    },
    ignorePatterns: ['dist/**', 'node_modules/**', '*.js'],
}; 