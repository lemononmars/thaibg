export * from './Artist';
export * from './Designer';
export * from './Graphicdesigner';
export * from './Playtester';
export * from './Rulebookeditor';
export * from './Producer';

export const personRoles = [
	'artist',
	'designer',
	'graphicdesigner',
	'playtester',
	'producer',
	'rulebookeditor',
];

import type {Artist} from './Artist'
import type {Designer} from './Designer'
import type {Graphicdesigner} from './Graphicdesigner'
import type {Playtester} from './Playtester'
import type {Rulebookeditor} from './Rulebookeditor'
import type {Producer} from './Producer'

export type PersonRole = Artist | Designer | Graphicdesigner | Playtester | Rulebookeditor | Producer