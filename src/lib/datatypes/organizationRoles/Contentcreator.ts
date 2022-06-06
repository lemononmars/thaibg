export interface Contentcreator extends ContentcreatorSubmission {
	Contentcreator_ID: number;
	Contentcreator_slug: string;
	Contentcreator_cache: Record<string, any>;
	Contentcreator_Relation?: ContentcreatorRelation[];
}

export const ContentcreatorDatabaseKeys = [
	'Contentcreator_name',
	'Contentcreator_name_th',
	'Contentcreator_links',
	'Contentcreator_description',
	'Contentcreator_picture',
	'Contentcreator_show'
];

export interface ContentcreatorSubmission {
	Contentcreator_show: boolean;
	Contentcreator_name: string;
	Contentcreator_name_th: string;
	Contentcreator_picture: string;
	Contentcreator_description: string;
	Contentcreator_links: string[];
}

export const ContentcreatorRelationArray = ['organization', 'content'];

interface ContentcreatorRelation {
	id: number;
	Content_ID: number;
	Contentcreator_ID: number;
}

export const ContentcreatorSubmissionPackage = () => {
	return {
		submission: <ContentcreatorSubmission>{},
		keys: ContentcreatorDatabaseKeys,
		relations: ContentcreatorRelationArray,
		selects: {},
		multiselects: {}
	};
};
