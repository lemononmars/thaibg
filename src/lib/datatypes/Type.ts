export interface Type extends TypeSubmission {
	Type_ID: number;
	Type_slug: string;
}

export const TypeDatabaseKeys = [
	'Type_name',
	'Type_name_th',
	'Type_description',
];

export interface TypeSubmission {
	Type_name: string;
	Type_name_th: string;
	Type_description: string;
}

export const TypeSubmissionPackage = () => {
	return {
		submission: <TypeSubmission>{},
		keys: TypeDatabaseKeys,
		relations: [],
		selects: {},
		multiselects: {},
		numbers: [],
		required: []
	};
};
