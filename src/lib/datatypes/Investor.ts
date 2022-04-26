export interface Investor extends InvestorSubmission {
	Investor_ID: number;
	Investor_slug: string;
	Investor_Relation?: InvestorRelation[];
}

export const InvestorDatabaseKeys = [
	'Investor_name',
	'Investor_location',
	'Investor_link',
	'Investor_description',
	'Investor_picture',
	'Investor_show'
];

export interface InvestorSubmission {
	Investor_show: boolean;
	Investor_name: string;
	Investor_link: string;
	Investor_description: string;
	Investor_picture: string;
}

export const InvestorRelationArray = ['Boardgame'];

interface InvestorRelation {
	id: number;
	TBG_ID: number;
	Investor_ID: number;
}

export const InvestorSubmissionPackage = () => {
	return {
		submission: <InvestorSubmission>{},
		keys: InvestorDatabaseKeys,
		relations: InvestorRelationArray,
		selects: {},
		multiselects: {}
	};
};
