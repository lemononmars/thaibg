export * from './Boardgame';
export * from './Mechanics';
export * from './Category';
export * from './Type';

export * from './Content';
export * from './Event';
export * from './Honor';

export * from './Person';
export * from './Organization';
export * from './AdminSettings';
export * from './Submission';

export * from './personRoles';
export * from './organizationRoles';

export const TypeSubmissionAllowed = [
	'artist',
	'boardgame',
	'category',
	'content',
	'contentcreator',
	'designer',
	'event',
	'graphicdesigner',
	'honor',
	'manufacturer',
	'organization',
	'person',
	'playtester',
	'producer',
	'publisher',
	'rulebookeditor',
	'sponsor',
	'shop',
];

export const TypeNamesArray = [
	...TypeSubmissionAllowed,
	'mechanics',
	'type',
];

export const activityTypes = [
	'content',
	'event',
	'honor',
]

export type TypeName =
	| TypeNameRole
	| TypeNameOrganizationRole
	| 'boardgame'
	| 'person'
	| 'content'
	| 'honor'
	| 'event'
	| 'type'
	| 'mechanics'
	| 'category'
	| 'organization'
export type TypeNameRole =
	| 'designer'
	| 'graphicdesigner'
	| 'artist'
	| 'playtester'
	| 'rulebookeditor'
	| 'producer';
export type TypeNameOrganizationRole =
	| 'contentcreator'
	| 'manufacturer'
	| 'publisher'
	| 'shop'
	| 'sponsor';

export interface SubmissionPackage {
	submission: any;
	keys: string[];
	relations: string[];
	selects?: Record<string, string[]>;
	multiselects?: Record<string, string[]>;
	required?: string[],
	numbers?: string[] // keys with type="number"
}

import { ArtistSubmissionPackage } from './personRoles/Artist';
import { BoardgameStatusArray, BoardgameSubmissionPackage } from './Boardgame';
import { CategorySubmissionPackage } from './Category';
import { ContentMediaArray, ContentSubmissionPackage, ContentTypeArray } from './Content';
import { ContentcreatorSubmissionPackage } from './organizationRoles/Contentcreator';
import { DesignerSubmissionPackage } from './personRoles/Designer';
import { EventSubmissionPackage, EventTypeArray } from './Event';
import { GraphicdesignerSubmissionPackage } from './personRoles/Graphicdesigner';
import { PersonSubmissionPackage } from './Person';
import { ProducerSubmissionPackage } from './personRoles/Producer';
import { PlaytesterSubmissionPackage } from './personRoles/Playtester';
import { RulebookeditorSubmissionPackage } from './personRoles/Rulebookeditor';
import { HonorSubmissionPackage, HonorTypeArray } from './Honor';
import { MechanicsSubmissionPackage} from './Mechanics';
import { ManufacturerSubmissionPackage, ManufacturerServiceArray } from './organizationRoles/Manufacturer';
import { OrganizationSubmissionPackage } from './Organization';
import { PublisherSubmissionPackage } from './organizationRoles/Publisher';
import { ShopSubmissionPackage, ShopStatusArray, ShopTypeArray, ThaiProvince } from './organizationRoles/Shop';
import { SponsorSubmissionPackage } from './organizationRoles/Sponsor';
import { TypeSubmissionPackage } from './Type';
import { personRoles } from './personRoles';
import { organizationRoles } from './organizationRoles'
/*
 * return necessary data for submission page
 */
export function getSubmissionPackage(type: TypeName): SubmissionPackage {
	switch (type) {
		case 'boardgame':
			return BoardgameSubmissionPackage();
		case 'content':
			return ContentSubmissionPackage();
		case 'event':
			return EventSubmissionPackage();
		case 'honor':
			return HonorSubmissionPackage();
		case 'manufacturer':
			return ManufacturerSubmissionPackage();
		case 'sponsor':
			return SponsorSubmissionPackage();
		case 'person':
			return PersonSubmissionPackage();
		case 'publisher':
			return PublisherSubmissionPackage();
		case 'shop':
			return ShopSubmissionPackage();
		case 'artist':
			return ArtistSubmissionPackage();
		case 'contentcreator':
			return ContentcreatorSubmissionPackage();
		case 'designer':
			return DesignerSubmissionPackage();
		case 'graphicdesigner':
			return GraphicdesignerSubmissionPackage();
		case 'playtester':
			return PlaytesterSubmissionPackage();
		case 'rulebookeditor':
			return RulebookeditorSubmissionPackage();
		case 'producer':
			return ProducerSubmissionPackage();
		case 'category':
			return CategorySubmissionPackage();
		case 'organization':
			return OrganizationSubmissionPackage();
		case 'type':
			return TypeSubmissionPackage();
		case 'mechanics': // just in case... mechanics shouldn't be editted or added
			return MechanicsSubmissionPackage();
	}
}

interface FilterSingle {
	type: 'single' | 'select',
	key: string,
	default?: number,
	options: string[]
}

interface FilterMultiple {
	type: 'multiple',
	key: string,
	default?: number[],
	options: string[]
}

interface FilterRange {
	type: 'range',
	checkBetween: boolean,
	default?: number,
	key: string,
	keyMin?: string,
	keyMax?: string,
	min: number,
	max: number,
	step: number,
	pipStep: number,
}

export type FilterOption = FilterMultiple | FilterRange | FilterSingle

export function getFilterOptions(type: TypeName): FilterOption[] {
	switch(type) {
		case 'event':
			return [{
				key: 'Event_type',
				type: 'single',
				options: EventTypeArray
			}]
		case 'honor':
			return [{
				key: 'Honor_type',
				type: 'single',
				options: HonorTypeArray
			}]
		case 'content':
			return [{
				key: 'Content_type',
				type: 'single',
				options: ContentTypeArray
			},
			{
				key: 'Content_media',
				type: 'single',
				options: ContentMediaArray
			}]
		case 'manufacturer':
			return [{
				type: 'single',
				key: 'Manufacturer_service',
				options: ManufacturerServiceArray
			}]
		case 'publisher':
			return []
		case 'boardgame':
			return [{
				key: 'TBG_status',
				default: [3],
				type: 'multiple',
				options: BoardgameStatusArray
			},
			// {
			// 	key: 'Type_name',
			// 	type: 'select',
			// 	options: BoardGameTypeArray
			// },
			{
				type: 'range',
				checkBetween: false,
				key: 'TBG_age',
				min: 2,
				max: 18,
				step: 1,
				pipStep: 2
			},
			{
				type: 'range',
				key: 'TBG_playtime',
				checkBetween: true,
				keyMin: 'TBG_playtime_min',
				keyMax: 'TBG_playtime_max',
				min: 0,
				max: 120, 
				step: 5,
				pipStep: 3,
			},
			{
				type: 'range',
				key: 'TBG_player',
				checkBetween: true,
				keyMin: 'TBG_player_min',
				keyMax: 'TBG_player_max',
				min: 1, 
				max: 8, 
				step: 1,
				pipStep: 1
			},
			{
				type: 'range',
				key: 'TBG_weight',
				checkBetween: true,
				keyMin: 'TBG_weight',
				keyMax: 'TBG_weight',
				min: 1, 
				max: 5, 
				step: 0.1,
				pipStep: 5
			}
		]
		case 'organization':
			return [{
				type: 'multiple',
				key: 'Organization_relation',
				options: organizationRoles
			}]
			//return []
		case 'sponsor':
			return []
		case 'shop':
			return [{
				type: 'single',
				key: 'Shop_status',
				options: ShopStatusArray
			},
			{
				type: 'single',
				key: 'Shop_type',
				options: ShopTypeArray
			},
			{
				type: 'select',
				key: 'Shop_province',
				options: ThaiProvince
			}]
		default:
			return []
	}
}

export interface DataTableColumns {
	headers: string[];
	body: string[];
}

const BLANK_COLUMNS = {
	headers: [],
	body: []
}
export function getDataTableColumns(type: TypeName) {
	switch(type) {
		case 'boardgame':
			return {
				headers: ['released', 'status'],
				body: ['TBG_released', 'TBG_status']
			}
		case 'event': 
			return {
				headers: ['start', 'end', 'type'],
				body: ['Event_time_start', 'Event_time_end', 'Event_type']
			}
		case 'honor':
			return {
				headers: ['type'],
				body: ['Honor_type']
			};
		case 'content':
			return {
				headers: ['type', 'media'],
				body: ['Content_type', 'Content_media']
			}
		case 'organization':
			return  {
				headers: ['relation'],
				body: ['Organization_relation']
			}
		case 'manufacturer':
			return {
				headers: ['service', 'published', 'latest_work', 'released'],
				body: ['Manufacturer_service', 'Manufacturer_cache.numTBG', 'Manufacturer_cache.latestTBG', 'Manufacturer_cache.latestReleased']
			}
		case 'publisher':
			return {
				headers: ['published', 'latest_work', 'released'],
				body: ['Publisher_cache.numTBG', 'Publisher_cache.latestTBG', 'Publisher_cache.latestReleased']
			}
		case 'sponsor':
			return {
				headers: ['published', 'latest_work', 'released'],
				body: ['Sponsor_cache.numTBG', 'Sponsor_cache.latestTBG', 'Sponsor_cache.latestReleased']
			}
		case 'shop':
			return {
				headers: ['status', 'province', 'type'],
				body: ['Shop_status', 'Shop_province', 'Shop_type']
			}
		case 'person': 
			return {
				headers: ['artist', 'designer', 'graphicdesigner', 'playtester', 'rulebookeditor', 'producer'],
				body: ['Artist_ID', 'Designer_ID', 'Graphicdesigner_ID', 'Playtester_ID', 'Rulebookeditor_ID', 'Producer_ID']
			}
		case 'artist':
			return {
				headers: ['published', 'latest_work', 'released'],
				body: ['Artist_cache.numTBG', 'Artist_cache.latestTBG', 'Artist_cache.latestReleased']
			}
		case 'designer':
			return {
				headers: ['published', 'latest_work', 'released'],
				body: ['Designer_cache.numTBG', 'Designer_cache.latestTBG', 'Designer_cache.latestReleased']
			}
		case 'graphicdesigner':
			return {
				headers: ['published', 'latest_work', 'released'],
				body: ['Graphicdesigner_cache.numTBG', 'Graphicdesigner_cache.latestTBG', 'Graphicdesigner_cache.latestReleased']
			}
		case 'playtester':
			return {
				headers: ['published', 'latest_work', 'released'],
				body: ['Playtester_cache.numTBG', 'Playtester_cache.latestTBG', 'Playtester_cache.latestReleased']
			}
		case 'rulebookeditor':
			return {
				headers: ['published', 'latest_work', 'released'],
				body: ['Rulebookeditor_cache.numTBG', 'Rulebookeditor_cache.latestTBG', 'Rulebookeditor_cache.latestReleased']
			}
		case 'producer':
			return {
				headers: ['published', 'latest_work', 'released'],
				body: ['Producer_cache.numTBG', 'Producer_cache.latestTBG', 'Producer_cache.latestReleased']
			}
		case 'contentcreator':
			return {
				headers: ['created', 'latest_work'],
				body: ['Contentcreator_cache.numContent', 'Contentcreator_cache.latestContent']
			}
		default:
			return BLANK_COLUMNS
	}
}