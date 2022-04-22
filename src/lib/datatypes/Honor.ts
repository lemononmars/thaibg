export interface Honor extends HonorSubmission{
   Honor_ID: number,
   Honor_slug: string,
   Honor_Relation: HonorRelation[]
}

export const HonorDatabaseKeys = [
   'Honor_name',
   'Honor_name_th',
   'Honor_year',
   'Honor_type',
   'Honor_organizer',
   'Honor_link',
   'Honor_description',
   'Honor_picture',
   'Honor_show',
]

export interface HonorSubmission {
   Honor_name: string,
   Honor_name_th: string,
   Honor_link: string,
   Honor_description: string,
   Honor_location: string,
   Honor_time_start: Date,
   Honor_time_end: Date,
   Honor_organizer: string,
   Honor_type: HonorType,
   Honor_picture: string,
   Honor_show: boolean,
}

export const HonorTypeArray = ['contest', 'competition', 'award'] 
export type HonorType = 'contest' | 'competition' | 'award'

export const HonorRelationArray = ['Boardgame']

export interface HonorRelation {
   Honor_ID: number,
   TBG_ID: number,
   TBG_name?: string,
   Honor_order: number,
   Honor_position: string,
   Honor_position_th: string,
   Honor_category: string // e.g. best family game, most popular votes, staff's favorite
}

export const HonorSubmissionPackage = () => {
   return {
      submission: <HonorSubmission>{},
      keys: HonorDatabaseKeys,
      relations: HonorRelationArray,
      selects: {
         Honor_type: HonorTypeArray
      },
      multiselects: {}
   }
}