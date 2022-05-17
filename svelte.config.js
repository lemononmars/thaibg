import sveltePreprocess from 'svelte-preprocess';
//import vercel from '@sveltejs/adapter-vercel';
import node from '@sveltejs/adapter-node';
// import pkg from './package.json';

/** @type {import('@sveltejs/kit').Config} */
export default {
	// Consult https://github.com/sveltejs/svelte-preprocess
	// for more information about preprocessors
	preprocess: [
		sveltePreprocess({
			postcss: true
		})
	],
	kit: {
		adapter: node(),
		//adapter: vercel(),

		// vite: {
		// 	ssr: {
		// 		noExternal: Object.keys(pkg.dependencies || {})
		// 	}
		// }
	}
};
