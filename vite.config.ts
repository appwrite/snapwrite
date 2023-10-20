import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import UnoCSS from '@unocss/svelte-scoped/vite';

export default defineConfig({
	plugins: [
		UnoCSS({
			injectReset: `@unocss/reset/normalize.css` // see type definition for all included reset options or how to pass in your own
			// ...other Svelte Scoped options
		}),
		sveltekit()
	],
	css: {
		preprocessorOptions: {
			scss: {
				additionalData: `@use '$styles' as *;`
			}
		}
	}
});
