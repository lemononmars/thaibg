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
	'Person_link',
	'Person_email',
	'Person_picture',
	'Person_show'
];

export interface PersonSubmission {
	Person_name: string;
	Person_name_th: string;
	Person_nickname: string;
	Person_link: string[];
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
export type PersonRelation =
	| 'artist'
	| 'designer'
	| 'graphicdesigner'
	| 'playtester'
	| 'rulebookeditor'
	| 'producer';

import type {
	Artist,
	Designer,
	Graphicdesigner,
	Playtester,
	Rulebookeditor,
	Producer
} from './personRoles';
export type PersonRole =
	| Artist
	| Designer
	| Graphicdesigner
	| Playtester
	| Rulebookeditor
	| Producer;

export const PersonSubmissionPackage = () => {
	return {
		submission: <PersonSubmission>{},
		keys: PersonDatabaseKeys,
		relations: PersonRelationArray,
		selects: {},
		multiselects: {},
		required: [
			
		]
	};
};
