import { json } from "svelte-i18n";

export interface Shop extends ShopSubmission {
	Shop_ID: number;
	Shop_slug: string;
	Shop_Relation?: ShopRelation[];
}

export const ShopDatabaseKeys = [
	'Shop_name',
	'Shop_location',
	'Shop_province',
	'Shop_status',
	'Shop_year_start',
	'Shop_capacity',
	'Shop_description',
	'Shop_link',
	'Shop_type',
	'Shop_picture',
	'Shop_show'
];

export interface ShopSubmission {
	Shop_show: boolean;
	Shop_name: string;
	Shop_link: string;
	Shop_description: string;
	Shop_picture: string;
	Shop_province: string;
	Shop_location: string;
	Shop_start_year: number;
	Shop_capacity: number;
	Shop_type: string[];
	Shop_status: ShopStatus;
}

// add in construction status?
export const ShopStatusArray = ['active', 'inactive', 'closed'];
export type ShopStatus = 'active' | 'inactive' | 'closed';

export const ShopRelationArray = ['Boardgame'];
export const ShopTypeArray = ['online', 'physical', 'cafe', 'club', 'meetup']

interface ShopRelation {
	id: number;
	Shop_ID: number;
	TBG_ID: number;
	Shop_TBG_obtainable: boolean;
	Shop_TBG_playable: boolean;
}

export const ShopSubmissionPackage = () => {
	return {
		submission: <ShopSubmission>{},
		keys: ShopDatabaseKeys,
		relations: ShopRelationArray,
		selects: {
			Shop_status: ShopStatusArray,
			Shop_province: ThaiProvinceArray
		},
		multiselects: {
			Shop_type: ShopTypeArray
		},
		required: [
			'Shop_name',
			'Shop_location',
			'Shop_province',
			'Shop_status',
			'Shop_type'
		]
	};
};

const ThaiProvinceMap = [
	'krabi',
	'bangkok',
	'kanchanaburi',
	'kalasin',
	'kamphaengphet',
	'khonkaen',
	'chanthaburi',
	'chachoengsao',
	'chonburi',
	'chainat',
	'chaiyaphum',
	'chumphon',
	'chiangrai',
	'chiangmai',
	'trang',
	'trat',
	'tak',
	'nakhonnayok',
	'nakhonpathom',
	'nakhonphanom',
	'nakhonratchasima',
	'nakhonsithammarat',
	'nakhonsawan',
	'nonthaburi',
	'narathiwat',
	'nan',
	'buriram',
	'pathumthani',
	'prachuapkhirikhan',
	'prachinburi',
	'pattani',
	'ayutthaya',
	'phayao',
	'phangnga',
	'phatthalung',
	'phichit',
	'phitsanulok',
	'phetchaburi',
	'phetchabun',
	'phrae',
	'phuket',
	'mahasarakham',
	'mukdahan',
	'maehongson',
	'yasothon',
	'yala',
	'roiet',
	'ranong',
	'rayong',
	'ratchaburi',
	'lopburi',
	'loei',
	'lampang',
	'lamphun',
	'sisaket',
	'sakonnakhon',
	'songkhla',
	'satun',
	'samutprakan',
	'samutsongkhram',
	'samutsakhon',
	'sakaeo',
	'saraburi',
	'singburi',
	'sukhothai',
	'suphanburi',
	'suratthani',
	'surin',
	'nongkhai',
	'nongbualamphu',
	'angthong',
	'amnatcharoen',
	'udonthani',
	'uttaradit',
	'uthaithani',
	'ubonratchathani',
	'betong'
]

export const ThaiProvinceArray = ThaiProvinceMap.map(p => 'province.' + p)