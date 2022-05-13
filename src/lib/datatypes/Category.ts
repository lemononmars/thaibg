export interface Category extends CategorySubmission {
	Category_ID: number;
	Category_slug: string;
	Category_Relation: CategoryRelation[];
}

export const CategoryDatabaseKeys = [
	'Category_name',
	'Category_name_th',
	'Category_link',
	'Category_description',
	'Category_picture'
];

export interface CategorySubmission {
	Category_name: string;
	Category_name_th: string;
	Category_link: string;
	Category_description: string;
	Category_picture: string;
}

export interface CategoryRelation {
	id: number,
	TBG_ID: number;
	Category_ID: number;
}

const CategoryRelationArray = ['boardgame']

export const CategorySubmissionPackage = () => {
	return {
		submission: <CategorySubmission>{},
		keys: CategoryDatabaseKeys,
		relations: CategoryRelationArray,
		multiselects: {},
		required: [
		]
	};
};
