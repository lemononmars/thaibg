export interface Publisher extends PublisherSubmission {
	Publisher_ID: number;
	Publisher_slug: string;
	Publisher_cache: Record<string, any>;
	Publisher_Relation?: PublisherRelation[];
}

export const PublisherDatabaseKeys = [
	'Publisher_name',
	'Publisher_name_th',
	'Publisher_description',
	'Publisher_links',
	'Publisher_picture',
	'Publisher_show'
];

export interface PublisherSubmission {
	Publisher_name: string;
	Publisher_name_th: string;
	Publisher_links: string;
	Publisher_description: string;
	Publisher_picture: string;
	Publisher_show: boolean;
}

export const PublisherRelationArray = ['boardgame', 'organization'];

interface PublisherRelation {
	id: number;
	TBG_ID: number;
	Publisher_ID: number;
	TBG_name?: string;
	Publisher_name?: string;
}

export const PublisherSubmissionPackage = () => {
	return {
		submission: <PublisherSubmission>{},
		keys: PublisherDatabaseKeys,
		relations: PublisherRelationArray,
		selects: {},
		multiselects: {},
		required: []
	};
};
