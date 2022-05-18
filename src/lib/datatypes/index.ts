export * from './Boardgame';
export * from './Mechanics';

export * from './Content';
export * from './Event';
export * from './Honor';

export * from './Person';
export * from './personRoles';
export * from './Organization';
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
	//'crowdfunding'
];

export const TypeNamesArray = [
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
	'mechanics',
	'organization',
	'person',
	'playtester',
	'producer',
	'publisher',
	'rulebookeditor',
	'shop',
	'sponsor',
	'type',
];

export type TypeName =
	| TypeNameRole
	| 'boardgame'
	| 'person'
	| 'shop'
	| 'publisher'
	| 'content'
	| 'honor'
	| 'event'
	| 'sponsor'
	| 'type'
	| 'mechanics'
	| 'category'
	| 'manufacturer'
	| 'organization'
export type TypeNameRole =
	| 'designer'
	| 'graphicdesigner'
	| 'contentcreator'
	| 'artist'
	| 'playtester'
	| 'rulebookeditor'
	| 'producer';

export interface SubmissionPackage {
	submission: any;
	keys: string[];
	relations: string[];
	selects?: Record<string, string[]>;
	multiselects?: Record<string, string[]>;
	required?: string[]
}

import { ArtistSubmissionPackage } from './personRoles/Artist';
import { BoardgameStatusArray, BoardgameSubmissionPackage } from './Boardgame';
import { CategorySubmissionPackage } from './Category';
import { ContentMediaArray, ContentSubmissionPackage, ContentTypeArray } from './Content';
import { ContentcreatorSubmissionPackage } from './organizationRoles/Contentcreator';
import { DesignerSubmissionPackage } from './personRoles/Designer';
import { EventSubmissionPackage, EventTypeArray } from './Event';
import { GraphicdesignerSubmissionPackage } from './personRoles/Graphicdesigner';
import { HonorSubmissionPackage, HonorTypeArray } from './Honor';
import { ManufacturerSubmissionPackage, ManufacturerServiceArray } from './organizationRoles/Manufacturer';
import { OrganizationSubmissionPackage } from './Organization';
import { PersonSubmissionPackage } from './Person';
import { PlaytesterSubmissionPackage } from './personRoles/Playtester';
import { ProducerSubmissionPackage } from './personRoles/Producer';
import { PublisherSubmissionPackage } from './organizationRoles/Publisher';
import { RulebookeditorSubmissionPackage } from './personRoles/Rulebookeditor';
import { ShopSubmissionPackage, ShopStatusArray, ShopTypeArray } from './organizationRoles/Shop';
import { SponsorSubmissionPackage } from './organizationRoles/Sponsor';
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
	}
}

export interface FilterOption {
	name: string,
	key: string,
	options: string[]
}

export function getFilterOptions(type: TypeName): FilterOption[] {
	switch(type) {
		case 'event':
			return [{
				name: 'Event type',
				key: 'Event_type',
				options: EventTypeArray
			}]
		case 'honor':
			return [{
				name: 'Honor type',
				key: 'Honor_type',
				options: HonorTypeArray
			}]
		case 'content':
			return [{
				name: 'Content type',
				key: 'Content_type',
				options: ContentTypeArray
			},
			{
				name: 'Content media',
				key: 'Content_media',
				options: ContentMediaArray
			}]
		case 'manufacturer':
			return [{
				name: 'Service',
				key: 'Manufacturer_service',
				options: ManufacturerServiceArray
			}]
		case 'publisher':
			return []
		case 'boardgame':
			return [{
				name: 'Status',
				key: 'TBG_status',
				options: BoardgameStatusArray
			}]
		case 'organization':
			return []
		case 'sponsor':
			return []
		case 'shop':
			return [{
				name: 'Status',
				key: 'Shop_status',
				options: ShopStatusArray
			},
			{
				name: 'Type',
				key: 'Shop_type',
				options: ShopTypeArray
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
		case 'event': 
			return {
				headers: ['Start', 'End', 'Type'],
				body: ['Event_time_start', 'Event_time_end', 'Event_type']
			}
		case 'honor':
			return {
				headers: ['Type'],
				body: ['Honor_type']
			};
		case 'content':
			return {
				headers: ['Type', 'Media'],
				body: ['Content_type', 'Content_media']
			}
		case 'manufacturer':
			return {
				headers: ['Service'],//'Last Updated'],
				body: ['Manufacturer_service']//, 'lastUpdated']
			}
		case 'publisher':
			return {
				headers: [],//['Number of Board Games', 'Latest Work', 'Last Updated'],
				body: []//['numBoardgames', 'latestWork', 'lastUpdated']
			}
		case 'boardgame':
			return {
				headers: ['Year', 'Status'],
				body: ['TBG_released', 'TBG_status']
			}
		case 'organization':
			return BLANK_COLUMNS
		case 'sponsor':
			return BLANK_COLUMNS
		case 'shop':
			return {
				headers: ['Status', 'Province', 'Type'],
				body: ['Shop_status', 'Shop_province', 'Shop_type']
			}
		case 'person': 
			return {
				headers: ['Artist', 'Designer', 'Graphic Designer'],
				body: ['Artist_ID', 'Designer_ID', 'Graphicdesigner_ID']
			}
		default:
			return BLANK_COLUMNS
	}
}