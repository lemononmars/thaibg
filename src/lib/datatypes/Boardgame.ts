export interface Boardgame extends BoardgameSubmission {
	TBG_ID: number;
	TBG_slug: string;
}

export const BoardgameDatabaseKeys = [
	'TBG_name',
	'TBG_name_th',
	'TBG_link',
	'TBG_description',
	'TBG_age',
	'TBG_weight',
	'BGG_ID',
	'BGG_link',
	'TBG_released',
	'TBG_player_min',
	'TBG_player_max',
	'TBG_playtime_min',
	'TBG_playtime_max',
	'TBG_status',
	'TBG_picture',
	'TBG_picture_cover',
	'TBG_show'
];

export const BoardgameDatabaseKeys1 = [
	'TBG_name',
	'TBG_name_th',
	'TBG_link',
	'TBG_description',
	'TBG_status',
	'TBG_released',
	'TBG_picture',
	'TBG_picture_cover',
	'TBG_show'
]

export const BoardgameDatabaseKeys2 = [
	'TBG_age',
	'TBG_weight',
	'TBG_player_min',
	'TBG_player_max',
	'TBG_playtime_min',
	'TBG_playtime_max',
	'BGG_link',
	'BGG_ID',
];

export interface BoardgameSubmission {
	TBG_show: boolean;
	TBG_name: string;
	TBG_name_th: string;
	TBG_picture: string;
	TBG_picture_cover: string;
	TBG_link: string;
	TBG_description: string;
	TBG_age: number;
	TBG_weight: number;
	BGG_ID: number;
	BGG_link: string;
	TBG_released: number;
	TBG_player_min: number;
	TBG_player_max: number;
	TBG_playtime_min: number;
	TBG_playtime_max: number;
	TBG_status: BoardgameStatus;
}

/*
 * pending, planned, prototype, published
 */
export const BoardgameStatusArray = ['planned', 'pending',  'prototype', 'published'];
export type BoardgameStatus = 'pending' | 'planned' | 'prototype' | 'published';

// split for readablility
export const BoardgamePersonRelation = [
	'designer',
	'artist',
	'graphicdesigner',
	'rulebookeditor',
	'playtester',
	"producer",
];
export const BoardgameInfoRelation = ['publisher', 'manufacturer', 'sponsor'];
export const BoardgameProperties = ['type', 'mechanics', 'category'];
export const BoardgameETCRelation = ['event', 'honor', 'shop'];

export const BoardgameRelationArray = [
	...BoardgamePersonRelation,
	...BoardgameProperties,
	...BoardgameInfoRelation,
	...BoardgameETCRelation
];

export const BoardGameTypeArray = [
	`Abstract Strategy Games`,
	`Children's Games`,
	`Customizable Games`,
	`Family Games`,
	`Party Games`,
	`Strategy Games`,
	`Thematic Games`,
	`Wargames`
]

export const BoardgameSubmissionPackage = () => {
	return {
		submission: <BoardgameSubmission>{},
		keys: BoardgameDatabaseKeys,
		relations: BoardgameRelationArray,
		selects: {
			TBG_status: BoardgameStatusArray,
		},
		multiselects: {
			//TBG_Type: BoardGameTypeArray
		},
		required: [
			"TBG_status",
		]
	};
};
