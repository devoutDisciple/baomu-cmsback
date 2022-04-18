module.exports = {
	env: {
		browser: true,
		commonjs: true,
		es2021: true,
	},
	extends: ['airbnb-base', 'plugin:prettier/recommended'],
	parserOptions: {
		ecmaVersion: 12,
	},
	rules: {
		'consistent-return': 0,
		'no-param-reassign': 0,
		camelcase: 0,
		'prefer-destructuring': 0,
		'no-console': 0,
		'prefer-promise-reject-errors': 0,
		'no-async-promise-executor': 0,
		'no-plusplus': 0,
		'no-await-in-loop': 0,
	},
};
