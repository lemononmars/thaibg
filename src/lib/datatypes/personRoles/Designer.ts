export interface Designer extends DesignerSubmission {
	Designer_ID: number;
	Designer_slug: string;
	Designer_picture: string;
	Desigener_cache: Record<string, any>;
	Designer_Relation?: DesignerRelation[];
}

export const DesignerDatabaseKeys = [
	'Designer_name',
	'Designer_name_th',
	'Designer_links',
	'Designer_description',
	'Designer_show'
];

export interface DesignerSubmission {
	Designer_show: boolean;
	Designer_name: string;
	Designer_name_th: string;
	Designer_description: string;
	Designer_links: string[];
}

export const DesignerRelationArray = ['person', 'boardgame'];

interface DesignerRelation {
	id: number;
	TBG_name?: string;
	TBG_ID: number;
	Designer_name?: string;
	Designer_ID: number;
}

export const DesignerSubmissionPackage = () => {
	return {
		submission: <DesignerSubmission>{},
		keys: DesignerDatabaseKeys,
		relations: DesignerRelationArray,
		selects: {},
		required: [],
		multiselects: {},
	};
};
