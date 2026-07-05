import fs from 'fs';
import path from 'path';

// Patch @sveltejs/kit
const files = [
	path.join('node_modules', '@sveltejs/kit', 'dist', 'chunks', 'index.js'),
	path.join('node_modules', '@sveltejs/kit', 'dist', 'chunks', 'index2.js')
];

for (const file of files) {
	if (fs.existsSync(file)) {
		let content = fs.readFileSync(file, 'utf8');
		// Patch Vite default import
		if (content.includes("import vite from 'vite';")) {
			content = content.replace(
				"import vite from 'vite';",
				"import * as viteNamespace from 'vite'; const vite = viteNamespace.default || viteNamespace;"
			);
			console.log(`Patched Vite default import in: ${file}`);
		}
		// Patch HTML fallback middleware name for Vite 3
		if (content.includes("'viteSpaFallbackMiddleware'")) {
			content = content.replace(
				"'viteSpaFallbackMiddleware'",
				"'viteSpaFallbackMiddleware',\n\t\t'viteHtmlFallbackMiddleware'"
			);
			console.log(`Patched HTML fallback middleware in: ${file}`);
		}
		fs.writeFileSync(file, content);
	}
}

// Patch @sveltejs/adapter-vercel/files/serverless.js to use installFetch and handle server.init
const serverlessFile = path.join('node_modules', '@sveltejs/adapter-vercel', 'files', 'serverless.js');
if (fs.existsSync(serverlessFile)) {
	let content = fs.readFileSync(serverlessFile, 'utf8');
	// Replace polyfills
	if (content.includes("'@sveltejs/kit/node/polyfills'")) {
		content = content.replace(
			"import { installPolyfills } from '@sveltejs/kit/node/polyfills';",
			"import { installFetch } from '@sveltejs/kit/install-fetch';"
		);
		content = content.replace(
			"installPolyfills();",
			"installFetch();"
		);
		console.log(`Patched polyfills in: ${serverlessFile}`);
	}
	// Make server.init conditional since SvelteKit next.334 doesn't have it
	if (content.includes("await server.init({")) {
		content = content.replace(
			"await server.init({",
			"if (server.init) await server.init({"
		);
		console.log(`Patched server.init in: ${serverlessFile}`);
	}
	fs.writeFileSync(serverlessFile, content);
}
