export interface Producer extends ProducerSubmission {
	Producer_ID: number;
	Producer_slug: string;
	Producer_picture: string;
	Producer_Relation: ProducerRelation[];
}

export const ProducerDatabaseKeys = [
	'Producer_name',
	'Producer_name_th',
	'Producer_description',
	'Producer_link',
	'Producer_show'
];

export interface ProducerSubmission {
	Producer_show: boolean;
	Producer_name: string;
	Producer_name_th: string;
	Producer_description: string;
	Producer_link: string;
}

export const ProducerRelationArray = ['person', 'boardgame'];

interface ProducerRelation {
	id: number;
	TBG_name: string;
	TBG_ID: number;
	Producer_ID: number;
}

export const ProducerSubmissionPackage = () => {
	return {
		submission: <ProducerSubmission>{},
		keys: ProducerDatabaseKeys,
		relations: ProducerRelationArray,
		selects: {},
		multiselects: {}
	};
};
