import fs from 'fs';
import path from 'path';

const functionsDir = path.join('.vercel', 'output', 'functions');

if (fs.existsSync(functionsDir)) {
	const files = fs.readdirSync(functionsDir);
	for (const file of files) {
		const funcDir = path.join(functionsDir, file);
		if (fs.statSync(funcDir).isDirectory() && file.endsWith('.func')) {
			const configPath = path.join(funcDir, '.vc-config.json');
			if (fs.existsSync(configPath)) {
				const content = fs.readFileSync(configPath, 'utf8');
				const config = JSON.parse(content);
				if (config.handler) {
					config.handler = config.handler.replace(/\\/g, '/');
					fs.writeFileSync(configPath, JSON.stringify(config));
					console.log(`Fixed: ${config.handler}`);
				}
			}
		}
	}
}
