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
   'Person_show',
   'Person_name',
   'Person_name_th',
   'Person_picture',
   'Person_facebook',
   'Person_twitter',
   'Person_website',
   'Person_email',
   'Person_description',
   'Person_nickname',
]

export interface PersonSubmission {
   Person_show: boolean,
   Person_name: string,
   Person_name_th?: string,
   Person_picture?: string,
   Person_facebook?: string,
   Person_twitter?: string,
   Person_website?: string,
   Person_email?: string,
   Person_description: string,
   Person_nickname: string
}

export const PersonRelationArray = ['artist', 'contentcreator', 'designer', 'graphicdesigner', 'playtester', 'rulebookeditor']
export const PersonRoleArray = PersonRelationArray

import type {Artist, Contentcreator, Designer, Graphicdesigner, Playtester, Rulebookeditor} from './personRoles'
export type PersonRole = Artist | Contentcreator | Designer | Graphicdesigner | Playtester | Rulebookeditor