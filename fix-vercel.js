import fs from 'fs';
import path from 'path';

const functionsDir = path.join('.vercel', 'output', 'functions');

function processDirectory(dir) {
	if (!fs.existsSync(dir)) return;
	const files = fs.readdirSync(dir);
	for (const file of files) {
		const fullPath = path.join(dir, file);
		if (fs.statSync(fullPath).isDirectory()) {
			processDirectory(fullPath);
		} else if (file === '.vc-config.json') {
			const content = fs.readFileSync(fullPath, 'utf8');
			const config = JSON.parse(content);
			if (config.handler) {
				config.handler = config.handler.replace(/\\/g, '/');
				fs.writeFileSync(fullPath, JSON.stringify(config));
				console.log(`Fixed: ${config.handler}`);
			}
		}
	}
}

processDirectory(functionsDir);
