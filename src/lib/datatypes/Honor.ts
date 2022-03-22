import type {Boardgame} from './Boardgame'

export interface Honor extends HonorSubmission{
   Honor_ID: number,
   Honor_slug: string,
   Honor_Relation: HonorRelation[]
}

export const HonorSubmissionKeys = [
   'Honor_show',
   'Honor_name',
   'Honor_name_th',
   'Honor_link',
   'Honor_description',
   'Honor_year',
   'Honor_organizer',
   'Honor_type',
]

export interface HonorSubmission {
   Honor_show: boolean,
   Honor_name: string,
   Honor_name_th: string,
   Honor_link: string,
   Honor_description: string,
   Honor_location: string,
   Honor_time_start: Date,
   Honor_time_end: Date,
   Honor_organizer: string,
   Honor_type: HonorType,
}

export const HonorTypeArray = ['contest', 'competition', 'award']
export type HonorTuple = typeof HonorTypeArray
export type HonorType = HonorTuple[number]

export const HonorRelation = ['Boardgame']

export interface HonorRelation {
   Honor_ID: number,
   TBG_ID: number,
   TBG_name: string,
   Honor_order: number,
   Honor_position: string,
   Honor_position_th: string,
   Honor_category: string
}