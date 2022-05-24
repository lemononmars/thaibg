
export const MechanicsDatabaseKeys = [
	'Mech_name',
	'Mech_category',
	'Mech_link',
	'Mech_description',
];

export interface Mechanics extends MechanicsSubmission{
	Mech_ID: number;
	Mech_slug: string;
}

export interface MechanicsSubmission{
	Mech_name: string;
	Mech_link: string;
	Mech_description: string;
	Mech_category: string;
	Mech_picture: string;
}

export const MechanicsCategoriesArray = ['action', 'areacontrol', 'auction', 'card', 'common', 'economics', 'gameend', 'gamestructure', 'movement', 'resolution', 'setcollection', 'turnorder', 'uncertainty', 'workerplacement'];
export type MechanicsCategories = 'action'| 'areacontrol'| 'auction'| 'card'| 'common'| 'economics'| 'gameend'| 'gamestructure'| 'movement'| 'resolution'| 'setcollection'| 'turnorder'| 'uncertainty'| 'workerplacement'

export const MechanicsSubmissionPackage = () => {
	return {
		submission: <MechanicsSubmission>{},
		keys: MechanicsDatabaseKeys,
		relations: [],
		selects: {},
		multiselects: {},
		required: []
	};
};