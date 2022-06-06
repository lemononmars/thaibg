export interface Manufacturer extends ManufacturerSubmission {
	Manufacturer_ID: number;
	Manufacturer_slug: string;
	Manufacturer_cache: Record<string, any>;
	Manufacturer_Relation?: ManufacturerRelation[];
}

export const ManufacturerDatabaseKeys = [
	'Manufacturer_name',
	'Manufacturer_location',
	'Manufacturer_service',
	'Manufacturer_links',
	'Manufacturer_description',
	'Manufacturer_picture',
	'Manufacturer_show'
];

export interface ManufacturerSubmission {
	Manufacturer_show: boolean;
	Manufacturer_name: string;
	Manufacturer_links: string;
	Manufacturer_description: string;
	Manufacturer_service: string[];
	Manufacturer_picture: string;
}

export const ManufacturerRelationArray = ['boardgame', 'organization'];
export const ManufacturerServiceArray = ['3d', 'organizer', 'card', 'board', 'component'];

interface ManufacturerRelation {
	id: number;
	TBG_ID: number;
	Manufacturer_ID: number;
}

export const ManufacturerSubmissionPackage = () => {
	return {
		submission: <ManufacturerSubmission>{},
		keys: ManufacturerDatabaseKeys,
		relations: ManufacturerRelationArray,
		selects: {},
		multiselects: {
			Manufacturer_service: ManufacturerServiceArray
		},
		required: [
			'Manufacturer_name',
		]
	};
};
