export interface Person extends PersonSubmission{
   Person_ID: number,
   Designer_ID?: number,
   Contentcreator_ID?: number,
   Playtester_ID?: number
   Graphicdesigner_ID?:number,
   Artist_ID?: number,
   Person_slug: string,
   Person_show: boolean,
}

export interface PersonSubmission {
   Person_show: boolean,
   Person_name: string,
   Person_name_th?: string,
   Person_picture?: string,
   Person_facebook?: string,
   Person_twitter?: string,
   Person_website?: string,
   Person_email?: string,
   Person_bio: string,
   Person_nickname: string
}

export const PersonRelation = ['Boardgame', 'Content']