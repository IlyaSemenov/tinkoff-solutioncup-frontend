import vue from "@vitejs/plugin-vue"
import { resolve } from "path"
import { defineConfig } from "vite"
import pages from "vite-plugin-pages"
import tsconfig_paths from "vite-tsconfig-paths"

export default defineConfig({
	base: process.env.BASE_URL,
	plugins: [tsconfig_paths({ loose: true }), vue(), pages()],
	resolve: {
		alias: {
			// for SCSS: https://github.com/aleclarson/vite-tsconfig-paths/issues/30
			"@": resolve("./src"),
		},
	},
})
