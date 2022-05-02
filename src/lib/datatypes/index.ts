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
	'category',
	'manufacturer',
	'rulebookeditor',
	'crowdfunding'
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
	| 'crowdfunding';
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

import { BoardgameSubmissionPackage } from './Boardgame';
import { ContentSubmissionPackage } from './Content';
import { EventSubmissionPackage } from './Event';
import { HonorSubmissionPackage } from './Honor';
import { SponsorSubmissionPackage } from './Sponsor';
import { ManufacturerSubmissionPackage } from './Manufacturer';
import { PersonSubmissionPackage } from './Person';
import { PublisherSubmissionPackage } from './Publisher';
import { ShopSubmissionPackage } from './Shop';
import { ArtistSubmissionPackage } from './personRoles/Artist';
import { ContentcreatorSubmissionPackage } from './personRoles/Contentcreator';
import { DesignerSubmissionPackage } from './personRoles/Designer';
import { GraphicdesignerSubmissionPackage } from './personRoles/Graphicdesigner';
import { PlaytesterSubmissionPackage } from './personRoles/Playtester';
import { ProducerSubmissionPackage } from './personRoles/Producer';
import { RulebookeditorSubmissionPackage } from './personRoles/Rulebookeditor';
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
	}
}
