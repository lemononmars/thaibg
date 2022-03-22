export interface Designer extends DesignerSubmission{
   Designer_ID: number,
   Designer_slug: string,
   Designer_Relation?: DesignerRelation[]
}

export const DesignerSubmissionKeys = [
   'Designer_show',
   'Designer_name',
   'Designer_name_th',
   'Designer_team',
   'Designer_description',
   'Designer_link',
]

export interface DesignerSubmission {
   Designer_show: boolean,
   Designer_name: string,
   Designer_name_th: string,
   Designer_team: string,
   Designer_description: string,
   Designer_link: string
}

export const DesignerRelationArray = ['Person', 'Boardgame']

interface DesignerRelation {
   id: number,
   TBG_name: string,
   TBG_ID: number,
   Designer_name: string,
   Designer_ID: number
}