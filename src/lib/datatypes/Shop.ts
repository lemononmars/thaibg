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
	'Shop_online',
	'Shop_physical',
	'Shop_cafe',
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
	Shop_online: boolean;
	Shop_physical: boolean;
	Shop_cafe: boolean;
	Shop_status: ShopStatus;
}

// add in construction status?
export const ShopStatusArray = ['active', 'inactive', 'closed'];
export type ShopStatus = 'active' | 'inactive' | 'closed';

export const ShopRelationArray = ['Boardgame'];

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
			Shop_status: ShopStatusArray
		},
		multiselects: {}
	};
};

export const ThaiProvinceMap = {
	krabi: 'กระบี่',
	bangkok: 'กรุงเทพมหานคร',
	kanchanaburi: 'กาญจนบุรี',
	kalasin: 'กาฬสินธุ์',
	kamphaengphet: 'กำแพงเพชร',
	khonkaen: 'ขอนแก่น',
	chanthaburi: 'จันทบุรี',
	chachoengsao: 'ฉะเชิงเทรา',
	chonburi: 'ชลบุรี',
	chainat: 'ชัยนาท',
	chaiyaphum: 'ชัยภูมิ',
	chumphon: 'ชุมพร',
	chiangrai: 'เชียงราย',
	chiangmai: 'เชียงใหม่',
	trang: 'ตรัง',
	trat: 'ตราด',
	tak: 'ตาก',
	nakhonnayok: 'นครนายก',
	nakhonpathom: 'นครปฐม',
	nakhonphanom: 'นครพนม',
	nakhonratchasima: 'นครราชสีมา',
	nakhonsithammarat: 'นครศรีธรรมราช',
	nakhonsawan: 'นครสวรรค์',
	nonthaburi: 'นนทบุรี',
	narathiwat: 'นราธิวาส',
	nan: 'น่าน',
	buriram: 'บุรีรัมย์',
	pathumthani: 'ปทุมธานี',
	prachuapkhirikhan: 'ประจวบคีรีขันธ์',
	prachinburi: 'ปราจีนบุรี',
	pattani: 'ปัตตานี',
	ayutthaya: 'พระนครศรีอยุธยา',
	phayao: 'พะเยา',
	phangnga: 'พังงา',
	phatthalung: 'พัทลุง',
	phichit: 'พิจิตร',
	phitsanulok: 'พิษณุโลก',
	phetchaburi: 'เพชรบุรี',
	phetchabun: 'เพชรบูรณ์',
	phrae: 'แพร่',
	phuket: 'ภูเก็ต',
	mahasarakham: 'มหาสารคาม',
	mukdahan: 'มุกดาหาร',
	maehongson: 'แม่ฮ่องสอน',
	yasothon: 'ยโสธร',
	yala: 'ยะลา',
	roiet: 'ร้อยเอ็ด',
	ranong: 'ระนอง',
	rayong: 'ระยอง',
	ratchaburi: 'ราชบุรี',
	lopburi: 'ลพบุรี',
	loei: 'เลย',
	lampang: 'ลำปาง',
	lamphun: 'ลำพูน',
	sisaket: 'ศรีสะเกษ',
	sakonnakhon: 'สกลนคร',
	songkhla: 'สงขลา',
	satun: 'สตูล',
	samutprakan: 'สมุทรปราการ',
	samutsongkhram: 'สมุทรสงคราม',
	samutsakhon: 'สมุทรสาคร',
	sakaeo: 'สระแก้ว',
	saraburi: 'สระบุรี',
	singburi: 'สิงห์บุรี',
	sukhothai: 'สุโขทัย',
	suphanburi: 'สุพรรณบุรี',
	suratthani: 'สุราษฎร์ธานี',
	surin: 'สุรินทร์',
	nongkhai: 'หนองคาย',
	nongbualamphu: 'หนองบัวลำภู',
	angthong: 'อ่างทอง',
	amnatcharoen: 'อำนาจเจริญ',
	udonthani: 'อุดรธานี',
	uttaradit: 'อุตรดิตถ์',
	uthaithani: 'อุทัยธานี',
	ubonratchathani: 'อุบลราชธานี',
	betong: 'เบตง'
};
