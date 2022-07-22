export interface Person extends PersonSubmission {
	Person_ID: number;
	Designer_ID: number;
	Contentcreator_ID: number;
	Playtester_ID: number;
	Graphicdesigner_ID: number;
	Artist_ID: number;
	Producer_ID: number;
	Person_slug: string;
}

export const PersonDatabaseKeys = [
	'Person_name',
	'Person_name_th',
	'Person_nickname',
	'Person_description',
	'Person_links',
	'Person_email',
	'Person_picture',
	'Person_show'
];

export interface PersonSubmission {
	Person_name: string;
	Person_name_th: string;
	Person_nickname: string;
	Person_links: string[];
	Person_email: string;
	Person_description: string;
	Person_picture: string;
	Person_show: boolean;
}

export const PersonRelationArray = [
	'artist',
	'designer',
	'graphicdesigner',
	'playtester',
	'rulebookeditor',
	'producer'
];

export const PersonSubmissionPackage = () => {
	return {
		submission: <PersonSubmission>{},
		keys: PersonDatabaseKeys,
		relations: PersonRelationArray,
		selects: {},
		multiselects: {},
		number: [],
		required: [
			
		]
	};
};
