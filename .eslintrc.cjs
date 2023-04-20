module.exports = {
	root: true,
	extends: [
		"plugin:@typescript-eslint/recommended",
		"plugin:prettier/recommended",
	],
	plugins: ["simple-import-sort"],
	rules: {
		"prettier/prettier": "warn",
		"simple-import-sort/imports": "warn",
		"simple-import-sort/exports": "warn",
		"@typescript-eslint/no-explicit-any": "off",
		"@typescript-eslint/explicit-module-boundary-types": "off",
	},
	ignorePatterns: ["/dist/"],
	overrides: [
		{
			files: "*.vue",
			extends: [
				"plugin:vue/vue3-recommended",
				// см. https://www.npmjs.com/package/@vue/eslint-config-typescript
				"@vue/typescript/recommended",
				"@vue/prettier",
			],
			rules: {
				// разрешить !
				"@typescript-eslint/no-non-null-assertion": "off",
				// называть компоненты-вот-так
				"vue/component-definition-name-casing": ["warn", "kebab-case"],
				// отключить ворнинг на автоматически создаваемые name
				"vue/multi-word-component-names": "off",
				// разрешить локальные переменные с совпадающим именем
				"vue/no-template-shadow": "off",
				// разрешить вот_такие_свойства
				"vue/prop-name-casing": "off",
			},
		},
	],
}
