export interface Graphicdesigner extends GraphicdesignerSubmission{
   Graphicdesigner_ID: number,
   Graphicdesigner_slug: string,
   Graphicdesigner_Relation?: GraphicdesignerRelation[]
}

export const GraphicdesignerSubmissionKeys = [
   'Graphicdesigner_show',
   'Graphicdesigner_name',
   'Graphicdesigner_name_th',
   'Graphicdesigner_team',
   'Graphicdesigner_description',
   'Graphicdesigner_link',
]

export interface GraphicdesignerSubmission {
   Graphicdesigner_show: boolean,
   Graphicdesigner_name: string,
   Graphicdesigner_name_th: string,
   Graphicdesigner_team: string,
   Graphicdesigner_description: string,
   Graphicdesigner_link: string
}

export const GraphicdesignerRelationArray = ['Person', 'Boardgame']

interface GraphicdesignerRelation {
   id: number,
   TBG_name: string,
   TBG_ID: number,
   Graphicdesigner_ID: number
}