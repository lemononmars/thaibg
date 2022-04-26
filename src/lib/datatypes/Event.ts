export interface Event extends EventSubmission {
	Event_ID: number;
	Event_slug: string;
	Event_Relation?: EventRelation[];
}

export const EventDatabaseKeys = [
	'Event_name',
	'Event_type',
	'Event_location',
	'Event_time_start',
	'Event_time_end',
	'Event_organizer',
	'Event_link',
	'Event_description',
	'Event_picture',
	'Event_show'
];

export interface EventSubmission {
	Event_show: boolean;
	Event_name: string;
	Event_link: string;
	Event_description: string;
	Event_location: string;
	Event_time_start: Date;
	Event_time_end: Date;
	Event_organizer: string;
	Event_type: EventType;
	Event_picture: string;
	Shop_ID: number;
}

export const EventTypeArray = [
	'convention',
	'meetup',
	'contest',
	'competition',
	'demo',
	'award',
	'sale'
];
export type EventType =
	| 'convention'
	| 'meetup'
	| 'contest'
	| 'competition'
	| 'demo'
	| 'award'
	| 'sale';

export const EventRelationArray = ['Boardgame', 'Shop']; // Question: how to add 'Person' | 'Designer' ?

interface EventRelation {
	id: number;
	TBG_name?: string;
	Event_ID: number;
	TBG_ID: number;
}

export const EventSubmissionPackage = () => {
	return {
		submission: <EventSubmission>{},
		keys: EventDatabaseKeys,
		relations: EventRelationArray,
		selects: {
			Event_type: EventTypeArray
		},
		multiselects: {}
	};
};
