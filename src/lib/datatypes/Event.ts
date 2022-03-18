export interface Event extends EventSubmission{
   Event_ID: number,
   Event_slug: string,
}

export interface EventSubmission {
   Event_show: boolean,
   Event_name: string,
   Event_link: string,
   Event_description: string,
   Event_location: string,
   Event_time_start: Date,
   Event_time_end: Date,
   Event_organizer: string,
   Event_type: EventType,
}

export const EventArray = ['convention', 'meetup', 'contest', 'competition', 'demo', 'award', 'sale']
export type EventTuple = typeof EventArray
export type EventType = EventTuple[number]

export const EventRelation = ['Boardgame'] // Question: how to add 'Person' | 'Designer' ?
