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

// Patch @sveltejs/adapter-vercel
const vercelAdapterIndex = path.join('node_modules', '@sveltejs/adapter-vercel', 'index.js');
if (fs.existsSync(vercelAdapterIndex)) {
	let content = fs.readFileSync(vercelAdapterIndex, 'utf8');
	if (content.includes('nodeFileTrace([entry], { base })')) {
		content = content.replace(
			'nodeFileTrace([entry], { base })',
			`nodeFileTrace([entry], {
		base,
		ignore: (p) => p.includes('colorthief') || p.includes('sharp') || p.includes('canvas') || p.includes('discord.js')
	})`
		);
		fs.writeFileSync(vercelAdapterIndex, content);
		console.log(`Patched @vercel/nft tracing in: ${vercelAdapterIndex}`);
	}
}
