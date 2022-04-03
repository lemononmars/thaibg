export interface Content extends ContentSubmission{
   Content_ID: number,
   Content_slug: string,
}

export const ContentSubmissionKeys = [
   'Content_name',
   'Content_media',
   'Content_type',
   'Content_link',
   'Content_description',
   'Content_show',
]

export interface ContentSubmission {
   Content_show: boolean,
   Content_name: string,
   Content_link: string,
   Content_description: string,
   Content_media: ContentMedia,
   Content_type: ContentType
}

export const ContentMediaArray = ['video', 'podcast', 'article', 'file'] as const
export type ContentMediaTuple = typeof ContentMediaArray
export type ContentMedia = ContentMediaTuple[number]

export const ContentTypeArray = ['review', 'preview', 'playthrough', 'howtoplay', 'rulebook', 'analysis'] as const
export type ContentTypeTuple = typeof ContentTypeArray
export type ContentType = ContentTypeTuple[number]

export const ContentRelation = ['Boardgame', 'Contentcreator']
