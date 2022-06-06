export interface Graphicdesigner extends GraphicdesignerSubmission {
	Graphicdesigner_ID: number;
	Graphicdesigner_slug: string;
	Graphicdesigner_picture: string;
	Graphicdesigner_cache: Record<string, any>;
	Graphicdesigner_Relation?: GraphicdesignerRelation[];
}

export const GraphicdesignerDatabaseKeys = [
	'Graphicdesigner_name',
	'Graphicdesigner_name_th',
	'Graphicdesigner_links',
	'Graphicdesigner_description',
	'Graphicdesigner_show'
];

export interface GraphicdesignerSubmission {
	Graphicdesigner_show: boolean;
	Graphicdesigner_name: string;
	Graphicdesigner_name_th: string;
	Graphicdesigner_description: string;
	Graphicdesigner_links: string[];
}

export const GraphicdesignerRelationArray = ['person', 'boardgame'];

interface GraphicdesignerRelation {
	id: number;
	TBG_name: string;
	TBG_ID: number;
	Graphicdesigner_ID: number;
}

export const GraphicdesignerSubmissionPackage = () => {
	return {
		submission: <GraphicdesignerSubmission>{},
		keys: GraphicdesignerDatabaseKeys,
		relations: GraphicdesignerRelationArray,
		selects: {},
		multiselects: {
			Graphicdesigner_links: []
		}
	};
};
