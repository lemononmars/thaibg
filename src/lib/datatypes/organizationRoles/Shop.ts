export interface Shop extends ShopSubmission {
	Shop_ID: number;
	Shop_slug: string;
	Shop_cache: Record<string, any>;
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
	'Shop_links',
	'Shop_type',
	'Shop_picture',
	'Shop_show'
];

export interface ShopSubmission {
	Shop_show: boolean;
	Shop_name: string;
	Shop_links: string;
	Shop_description: string;
	Shop_picture: string;
	Shop_province: string;
	Shop_location: ShopLocation;
	Shop_year_start: number;
	Shop_capacity: number;
	Shop_type: string[];
	Shop_status: ShopStatus;
}

// add in construction status?
export const ShopStatusArray = ['active', 'inactive', 'closed'];
export type ShopStatus = 'active' | 'inactive' | 'closed';
export const ShopTypeArray = ['online shop', 'physical shop', 'cafe', 'club', 'meetup']

export const ShopRelationArray = ['boardgame', 'organization'];

export interface ShopRelation {
	id: number;
	Shop_ID: number;
	TBG_ID: number;
	Shop_TBG_obtainable: boolean;
	Shop_TBG_playable: boolean;
}

interface Location {
	lat: number,
	lng: number
}

// for google map
export interface ShopLocation {
	place_id?: string,
	formatted_address?: string,
	location?: Location,
}

export const ShopSubmissionPackage = () => {
	return {
		submission: <ShopSubmission>{},
		keys: ShopDatabaseKeys,
		relations: ShopRelationArray,
		selects: {
			Shop_status: ShopStatusArray,
			Shop_province: ThaiProvince
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
		],
		numbers: [
			'Shop_start_year',
			'Shop_capacity'
		]
	};
};

export const ThaiProvince = [
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