export interface Rulebookeditor extends RulebookeditorSubmission {
	Rulebookeditor_ID: number;
	Rulebookeditor_slug: string;
	Rulebookeditor_picture: string;
	Rulebookeditor_Relation?: RulebookeditorRelation[];
}

export const RulebookeditorDatabaseKeys = [
	'Rulebookeditor_name',
	'Rulebookeditor_name_th',
	'Rulebookeditor_link',
	'Rulebookeditor_description',
	'Rulebookeditor_language',
	'Rulebookeditor_show'
];

export interface RulebookeditorSubmission {
	Rulebookeditor_show: boolean;
	Rulebookeditor_name: string;
	Rulebookeditor_name_th: string;
	Rulebookeditor_description: string;
	Rulebookeditor_link: string;
	Rulebookeditor_language: Array<string>;
}

export const RulebookeditorRelationArray = ['person', 'boardgame'];
export const RulebookeditorLanguage = ['Thai', 'English', 'German', 'Chinese'];

interface RulebookeditorRelation {
	id: number;
	TBG_name?: string;
	TBG_ID: number;
	Rulebookeditor_ID: number;
}

export const RulebookeditorSubmissionPackage = () => {
	return {
		submission: <RulebookeditorSubmission>{},
		keys: RulebookeditorDatabaseKeys,
		relations: RulebookeditorRelationArray,
		selects: {},
		multiselects: {
			Rulebookeditor_language: RulebookeditorLanguage
		}
	};
};
