export interface Organization extends OrganizationSubmission {
	Organization_ID: number;
	Organization_slug: string;
}

export const OrganizationDatabaseKeys = [
	'Organization_name',
	'Organization_description',
	'Organization_links',
	'Organization_picture',
	'Organization_show'
];

export interface OrganizationSubmission {
	Organization_name: string;
	Organization_description: string;
	Organization_links: string[];
	Organization_relation: string; // Record<OrganizationRelation, number[]>; // stored as string, so you need to call JSON.parse()
	Organization_picture: string;
	Organization_show: boolean;
}

// TODO: perhaps allowing person ?
export const OrganizationRelationArray = [
	'manufacturer',
	'publisher',
	'shop',
	'sponsor',
	'contentcreator',
	//'person'
];

export type OrganizationRoleName = 'manufacturer' | 'publisher' | 'shop' | 'sponsor' | 'contentcreator' 
export type OrganizationRelation = OrganizationRoleName | 'person'

// export type {
// 	Manufacturer,
// 	Publisher,
// 	Shop,
// 	Sponsor,
// 	Contentcreator
// } from './organizationRoles';

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
