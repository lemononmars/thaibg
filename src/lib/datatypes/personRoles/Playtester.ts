export interface Playtester extends PlaytesterSubmission{
   Playtester_ID: number,
   Playtester_slug: string,
   Playtester_Relation?: PlaytesterRelation[]
}

export const PlaytesterSubmissionKeys = [
   'Playtester_show',
   'Playtester_name',
   'Playtester_name_th',
   'Playtester_team',
   'Playtester_description',
   'Playtester_link',
]

export interface PlaytesterSubmission {
   Playtester_show: boolean,
   Playtester_name: string,
   Playtester_name_th: string,
   Playtester_team: string,
   Playtester_description: string,
   Playtester_link: string
}

export const PlaytesterRelationArray = ['Person', 'Boardgame']

interface PlaytesterRelation {
   id: number,
   TBG_name: string,
   TBG_ID: number,
   Playtester_ID: number
}