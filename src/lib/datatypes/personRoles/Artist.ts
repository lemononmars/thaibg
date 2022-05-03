export interface Artist extends ArtistSubmission {
	Artist_ID: number;
	Artist_slug: string;
	Artist_Relation: ArtistRelation[];
}

export const ArtistDatabaseKeys = [
	'Artist_name',
	'Artist_name_th',
	'Artist_description',
	'Artist_link',
	'Artist_show'
];

export interface ArtistSubmission {
	Artist_show: boolean;
	Artist_name: string;
	Artist_name_th: string;
	Artist_description: string;
	Artist_link: string;
}

export const ArtistRelationArray = ['person', 'boardgame'];

interface ArtistRelation {
	id: number;
	TBG_name: string;
	TBG_ID: number;
	Artist_ID: number;
}

export const ArtistSubmissionPackage = () => {
	return {
		submission: <ArtistSubmission>{},
		keys: ArtistDatabaseKeys,
		relations: ArtistRelationArray,
		selects: {},
		multiselects: {}
	};
};
