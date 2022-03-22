export interface Rulebookeditor extends RulebookeditorSubmission{
   Rulebookeditor_ID: number,
   Rulebookeditor_slug: string,
   Rulebookeditor_Relation?: RulebookeditorRelation[]
}

export const RulebookeditorSubmissionKeys = [
   'Rulebookeditor_show',
   'Rulebookeditor_name',
   'Rulebookeditor_name_th',
   'Rulebookeditor_team',
   'Rulebookeditor_description',
   'Rulebookeditor_link',
   'Rulebookeditor_en'
]

export interface RulebookeditorSubmission {
   Rulebookeditor_show: boolean,
   Rulebookeditor_name: string,
   Rulebookeditor_name_th: string,
   Rulebookeditor_team: string,
   Rulebookeditor_description: string,
   Rulebookeditor_link: string,
   Rulebookeditor_en: boolean
}

export const RulebookeditorRelationArray = ['Person', 'Boardgame']

interface RulebookeditorRelation {
   id: number,
   TBG_name: string,
   TBG_ID: number,
   Rulebookeditor_ID: number
}