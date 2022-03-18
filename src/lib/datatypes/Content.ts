export interface Content extends ContentSubmission{
   Content_ID: number,
   Content_slug: string,
}

export interface ContentSubmission {
   Content_show: boolean,
   Content_name: string,
   Content_link: string,
   Content_description: string,
   Content_media: ContentMedia,
   Content_type: ContentType
}

export const ContentMediaArray = ['video', 'podcast', 'article', 'file']
export type ContentMediaTuple = typeof ContentMediaArray
export type ContentMedia = ContentMediaTuple[number]

export const ContentTypeArray = ['review', 'preview', 'playthrough', 'howtoplay', 'rulebook', 'analysis']
export type ContentTypeTuple = typeof ContentTypeArray
export type ContentType = ContentTypeTuple[number]


export const ContentRelation = ['Boardgame', 'Contentcreator']
