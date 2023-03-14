module.exports = {
	"env": {
		"browser": true,
		"commonjs": true,
		"es2021": true
	},
	"extends": "eslint:recommended",
	"overrides": [
	],
	"parserOptions": {
		"ecmaVersion": "latest"
	},
	"rules": {
		"indent": "off",
		"linebreak-style": [
			"error",
			"windows"
		],
		"quotes": [
			"error",
			"double"
		],
		"semi": [
			"error",
			"always"
		],
		"no-unused-vars": "off",
		"eqeqeq": "error",
		"no-trailing-spaces": "error",
		"object-curly-spacing": [
			"error", "always"
		],
		"arrow-spacing": [
			"error", { "before": true, "after": true }
		],
		"no-console": 0
	}
};
