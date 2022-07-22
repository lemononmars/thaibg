export interface Honor extends HonorSubmission {
	Honor_ID: number;
	Honor_slug: string;
	Honor_Relation: HonorRelation[];
}

export const HonorDatabaseKeys = [
	'Honor_name',
	'Honor_name_th',
	'Honor_year',
	'Honor_type',
	'Honor_organizer',
	'Honor_links',
	'Honor_description',
	'Honor_picture',
	'Honor_show'
];

export interface HonorSubmission {
	Honor_name: string;
	Honor_name_th: string;
	Honor_links: string[];
	Honor_description: string;
	Honor_location: string;
	Honor_time_start: Date;
	Honor_time_end: Date;
	Honor_organizer: string;
	Honor_type: HonorType;
	Honor_picture: string;
	Honor_show: boolean;
}

export const HonorTypeArray = ['contest', 'competition', 'award'];
export type HonorType = 'contest' | 'competition' | 'award';

export const HonorRelationArray = ['boardgame'];
export const HonorPosition = ['winner', 'runner-up', '1st runner-up', '2nd runner-up', 'nominee', 'recommended', 'popular vote', 'special']

export interface HonorRelation {
	id?: number,
	Honor_ID: number;
	TBG_ID: number;
	Honor_position: string;
	Honor_category: string; // e.g. best family game, most popular votes, staff's favorite
}

export const HonorSubmissionPackage = () => {
	return {
		submission: <HonorSubmission>{},
		keys: HonorDatabaseKeys,
		relations: HonorRelationArray,
		selects: {
			Honor_type: HonorTypeArray
		},
		multiselects: {},
		required: [
			"Honor_year",
			"Honor_type"
		],
		numbers: []
	};
};
