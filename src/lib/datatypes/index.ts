export * from './Person';
export * from './Boardgame';
export * from './Content';
export * from './Event';
export * from './Honor';
export * from './Shop';
export * from './Manufacturer';
export * from './Publisher';
export * from './Mechanics';

export * from './personRoles';

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
	'boardgame',
	'person',
	'designer',
	'graphicdesigner',
	'contentcreator',
	'artist',
	'playtester',
	'producer',
	'shop',
	'publisher',
	'content',
	'honor',
	'event',
	'sponsor',
	'type',
	'mechanics',
	'category',
	'manufacturer',
	'rulebookeditor',
	'crowdfunding'
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
import { BoardgameSubmissionPackage } from './Boardgame';
import { CategorySubmissionPackage } from './Category';
import { ContentSubmissionPackage } from './Content';
import { ContentcreatorSubmissionPackage } from './personRoles/Contentcreator';
import { DesignerSubmissionPackage } from './personRoles/Designer';
import { EventSubmissionPackage } from './Event';
import { GraphicdesignerSubmissionPackage } from './personRoles/Graphicdesigner';
import { HonorSubmissionPackage } from './Honor';
import { ManufacturerSubmissionPackage } from './Manufacturer';
import { OrganizationSubmissionPackage } from './Organization';
import { PersonSubmissionPackage } from './Person';
import { PlaytesterSubmissionPackage } from './personRoles/Playtester';
import { ProducerSubmissionPackage } from './personRoles/Producer';
import { PublisherSubmissionPackage } from './Publisher';
import { RulebookeditorSubmissionPackage } from './personRoles/Rulebookeditor';
import { ShopSubmissionPackage } from './Shop';
import { SponsorSubmissionPackage } from './Sponsor';
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
