export interface Person extends PersonSubmission{
   Person_ID: number,
   Designer_ID: number,
   Contentcreator_ID: number,
   Playtester_ID: number
   Graphicdesigner_ID:number,
   Artist_ID: number,
   Person_slug: string,
}

export const PersonSubmissionKeys = [
   'Person_name',
   'Person_name_th',
   'Person_nickname',
   'Person_description',
   'Person_facebook',
   'Person_twitter',
   'Person_website',
   'Person_email',
   'Person_picture',
   'Person_show',
]

export interface PersonSubmission {
   Person_name: string,
   Person_name_th: string,
   Person_nickname: string
   Person_facebook: string,
   Person_twitter: string,
   Person_website: string,
   Person_email: string,
   Person_description: string,
   Person_picture: string,
   Person_show: boolean,
}

export const PersonRelationArray = ['artist', 'contentcreator', 'designer', 'graphicdesigner', 'playtester', 'rulebookeditor'] 
export type PersonRelation = 'artist' | 'contentcreator' | 'designer' | 'graphicdesigner' | 'playtester' | 'rulebookeditor'

import type {Artist, Contentcreator, Designer, Graphicdesigner, Playtester, Rulebookeditor} from './personRoles'
export type PersonRole = Artist | Contentcreator | Designer | Graphicdesigner | Playtester | Rulebookeditor