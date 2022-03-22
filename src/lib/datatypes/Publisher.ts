export interface Publisher extends PublisherSubmission{
   Publisher_ID: number,
   Publisher_slug: string,
   Publisher_Relation?: PublisherRelation[]
}

export const PublisherSubmissionKeys = [
   'Publisher_show',
   'Publisher_name',
   'Publisher_link',
   'Publisher_description',
]

export interface PublisherSubmission {
   Publisher_show: boolean,
   Publisher_name: string,
   Publisher_link: string,
   Publisher_description: string,

}

export const PublisherRelationArray = ['Boardgame']

interface PublisherRelation {
   id: number,
   TBG_ID: number,
   Publisher_ID: number,
   TBG_name: string,
   Publisher_name: string
}
