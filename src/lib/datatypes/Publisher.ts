export interface Publisher extends PublisherSubmission{
   Publisher_ID: number,
   Publisher_slug: string,
   Publisher_Relation?: PublisherRelation[]
}

export const PublisherSubmissionKeys = [
   'Publisher_name',
   'Publisher_link',
   'Publisher_description',
   'Publisher_picture',
   'Publisher_show',
]

export interface PublisherSubmission {
   Publisher_name: string,
   Publisher_link: string,
   Publisher_description: string,
   Publisher_picture: string,
   Publisher_show: boolean,
}

export const PublisherRelationArray = ['Boardgame']

interface PublisherRelation {
   id: number,
   TBG_ID: number,
   Publisher_ID: number,
   TBG_name?: string,
   Publisher_name?: string
}
