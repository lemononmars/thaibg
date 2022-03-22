export interface Contentcreator extends ContentcreatorSubmission{
   Contentcreator_ID: number,
   Contentcreator_slug: string,
   Contentcreator_Relation?: ContentcreatorRelation[]
}

export const ContentcreatorSubmissionKeys = [
   'Contentcreator_show',
   'Contentcreator_name',
   'Contentcreator_name_th',
   'Contentcreator_team',
   'Contentcreator_description',
   'Contentcreator_link',
]

export interface ContentcreatorSubmission {
   Contentcreator_show: boolean,
   Contentcreator_name: string,
   Contentcreator_name_th: string,
   Contentcreator_team: string,
   Contentcreator_description: string,
   Contentcreator_link: string
}

export const ContentcreatorRelationArray = ['Person', 'Content']

interface ContentcreatorRelation {
   id: number,
   Content_ID: number,
   Contentcreator_ID: number
}