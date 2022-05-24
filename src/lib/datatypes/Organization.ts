export interface Organization extends OrganizationSubmission {
	Organization_ID: number;
	Organization_slug: string;
	Organization_relation: string; // stored as string, so you need to call JSON.parse()
}

export const OrganizationDatabaseKeys = [
	'Organization_name',
	'Organization_description',
	'Organization_link',
	'Organization_picture',
	'Organization_show'
];

export interface OrganizationSubmission {
	Organization_name: string;
	Organization_description: string;
	Organization_link: string;
	Organization_picture: string;
	Organization_show: boolean;
}

export const OrganizationRelationArray = [
	'manufacturer',
	'publisher',
	'shop',
	'sponsor',
	'contentcreator'
];

import type {
	Manufacturer,
	Publisher,
	Shop,
	Sponsor,
	Contentcreator
} from './organizationRoles';
export type OrganizationRole =
	| Manufacturer
	| Publisher
	| Shop
	| Sponsor
	| Contentcreator;

export const OrganizationSubmissionPackage = () => {
	return {
		submission: <OrganizationSubmission>{},
		keys: OrganizationDatabaseKeys,
		relations: OrganizationRelationArray,
		selects: {},
		multiselects: {},
		required: [
			'Organization_name'	
		]
	};
};
