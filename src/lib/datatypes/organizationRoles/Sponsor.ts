export interface Sponsor extends SponsorSubmission {
	Sponsor_ID: number;
	Sponsor_slug: string;
	Sponsor_cache: Record<string, any>;
	Sponsor_Relation?: SponsorRelation[];
}

export const SponsorDatabaseKeys = [
	'Sponsor_name',
	'Sponsor_links',
	'Sponsor_description',
	'Sponsor_picture',
	'Sponsor_show'
];

export interface SponsorSubmission {
	Sponsor_show: boolean;
	Sponsor_name: string;
	Sponsor_links: string;
	Sponsor_description: string;
	Sponsor_picture: string;
}

export const SponsorRelationArray = ['boardgame'];

interface SponsorRelation {
	id: number;
	TBG_ID: number;
	Sponsor_ID: number;
}

export const SponsorSubmissionPackage = () => {
	return {
		submission: <SponsorSubmission>{},
		keys: SponsorDatabaseKeys,
		relations: SponsorRelationArray,
		selects: {},
		multiselects: {},
		required: [
			'Sponsor_name'
		]
	};
};
