export * from './Artist';
export * from './Designer';
export * from './Graphicdesigner';
export * from './Playtester';
export * from './Rulebookeditor';
export * from './Producer';

export const personDeveloperRoles = [
	'artist',
	'designer',
	'graphicdesigner',
	'playtester',
	'rulebookeditor',
	'producer'
];

// treated differently because content creators are associated with contents, not board games
export const personRoles = [...personDeveloperRoles, 'contentcreator'];
