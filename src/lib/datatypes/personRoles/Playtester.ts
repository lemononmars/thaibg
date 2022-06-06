export interface Playtester extends PlaytesterSubmission {
	Playtester_ID: number;
	Playtester_slug: string;
	Playtester_picture: string;
	Playtester_cache: Record<string, any>;
	Playtester_Relation?: PlaytesterRelation[];
}

export const PlaytesterDatabaseKeys = [
	'Playtester_name',
	'Playtester_name_th',
	'Playtester_links',
	'Playtester_description',
	'Playtester_show'
];

export interface PlaytesterSubmission {
	Playtester_show: boolean;
	Playtester_name: string;
	Playtester_name_th: string;
	Playtester_description: string;
	Playtester_links: string[];
}

export const PlaytesterRelationArray = ['person', 'boardgame'];

interface PlaytesterRelation {
	id: number;
	TBG_name?: string;
	TBG_ID: number;
	Playtester_ID: number;
}

export const PlaytesterSubmissionPackage = () => {
	return {
		submission: <PlaytesterSubmission>{},
		keys: PlaytesterDatabaseKeys,
		relations: PlaytesterRelationArray,
		selects: {},
		multiselects: {}
	};
};
