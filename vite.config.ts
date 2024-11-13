import { defineConfig } from 'vitest/config';
import { sveltekit } from '@sveltejs/kit/vite';
import wasm from 'vite-plugin-wasm';
import topLevelAwait from 'vite-plugin-top-level-await';
import { nodePolyfills } from 'vite-plugin-node-polyfills';

export default defineConfig({
	plugins: [
		sveltekit(),
		wasm(),
		topLevelAwait(),
		nodePolyfills({
			globals: { Buffer: true, global: true },
			protocolImports: true
		})
	],
	define: {
		global: 'globalThis'
	},
	test: {
		include: ['src/**/*.{test,spec}.{js,ts}']
	}
});
