export interface Manufacturer extends ManufacturerSubmission {
	Manufacturer_ID: number;
	Manufacturer_slug: string;
	Manufacturer_Relation?: ManufacturerRelation[];
}

export const ManufacturerDatabaseKeys = [
	'Manufacturer_name',
	'Manufacturer_location',
	'Manufacturer_service',
	'Manufacturer_link',
	'Manufacturer_description',
	'Manufacturer_picture',
	'Manufacturer_show'
];

export interface ManufacturerSubmission {
	Manufacturer_show: boolean;
	Manufacturer_name: string;
	Manufacturer_link: string;
	Manufacturer_description: string;
	Manufacturer_service: string[];
	Manufacturer_picture: string;
}

export const ManufacturerRelationArray = ['Boardgame'];
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
			'Manufacturer_service'
		]
	};
};
