export const config = {
	baseUrl: import.meta.env.VITE_BASE_URL
};

export const siteSeoBase = {
	title: 'Thai BG Database',
	description: 'Database for boardgames from Thai designers',
	keywords: 'boardgame, thailand, designer, database',
	canonical: import.meta.env ? import.meta.env.VITE_SITE_URL : 'https://thaibg.herokuapp.com'
};

export const siteSeoOpenGraphBase = {
	title: 'Thai BG Database',
	description: 'Database for boardgames from Thai designers',
	url: import.meta.env ? import.meta.env.VITE_SITE_URL : '',
	type: 'website',
	images: [
		{
			url: 'https://raw.githubusercontent.com/lemononmars/thaibg/main/src/lib/assets/logos/THBDDB-Logo.png',
			width: 800,
			height: 800,
			alt: 'Og Image Alt'
		}
	]
};

export const siteSeoOpenGraphArticle = {
	type: 'article',
	article: {
		publishedTime: '2022-07-01T17:31:37Z',
		modifiedTime: '2022-07-01T09:31:37Z',
		expirationTime: '2025-12-21T17:31:37Z',
		section: 'Section I',
		authors: [
			'https://github.com/lemononmars',
		],
		tags: ['board game', 'database', 'TBG', 'thailand', 'event', 'designer', 'publisher']
	}
};

export const siteSeoTwitter = {
	site: '@username',
	title: 'Thai BG Database',
	description: 'Database for boardgames from Thai designersd',
	image: 'https://raw.githubusercontent.com/lemononmars/thaibg/main/src/lib/assets/logos/THBDDB-Logo.png',
	imageAlt: 'Cover image'
};
