export interface Content extends ContentSubmission {
	Content_ID: number;
	Content_slug: string;
}

export const ContentDatabaseKeys = [
	'Content_name',
	'Content_media',
	'Content_type',
	'Content_links',
	'Content_description',
	'Content_show'
];

export interface ContentSubmission {
	Content_show: boolean;
	Content_name: string;
	Content_links: string[];
	Content_description: string;
	Content_media: ContentMedia;
	Content_type: ContentType;
}

export const ContentMediaArray = ['video', 'podcast', 'article', 'file'];
export type ContentMedia = 'video' | 'podcast' | 'article' | 'file';

export const ContentTypeArray = [
	'review',
	'preview',
	'playthrough',
	'howtoplay',
	'rulebook',
	'analysis'
];
export type ContentType =
	| 'review'
	| 'preview'
	| 'playthrough'
	| 'howtoplay'
	| 'rulebook'
	| 'analysis';

export const ContentRelationArray = ['boardgame', 'contentcreator'];

export const ContentSubmissionPackage = () => {
	return {
		submission: <ContentSubmission>{},
		keys: ContentDatabaseKeys,
		relations: ContentRelationArray,
		selects: {
			Content_media: ContentMediaArray,
			Content_type: ContentTypeArray
		},
		multiselects: {},
		required: [
			"Content_name",
			"Content_media",
			"Content_type",
			"Content_links"
		]
	};
};
