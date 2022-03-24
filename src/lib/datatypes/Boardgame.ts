export interface Boardgame extends BoardgameSubmission{
   TBG_ID: number,
   TBG_slug: string,
}

export const BoardgameSubmissionKeys = [
   'TBG_show',
   'TBG_name',
   'TBG_name_th',
   'TBG_picture',
   'TBG_picture_cover',
   'TBG_link',
   'TBG_description',
   'TBG_age',
   'TBG_weight',
   'BGG_ID',
   'BGG_link',
   'TBG_keyword',
   'TBG_released',
   'TBG_player_min',
   'TBG_player_max',
   'TBG_playtime_min',
   'TBG_playtime_max',
   'TBG_status',
]

export interface BoardgameSubmission {
   TBG_show: boolean,
   TBG_name: string,
   TBG_name_th: string,
   TBG_picture: string,
   TBG_picture_cover: string,
   TBG_link: string,
   TBG_description: string,
   TBG_age: number,
   TBG_weight: number,
   BGG_ID: number,
   BGG_link: string,
   TBG_keyword: string,
   TBG_released: number,
   TBG_player_min: number,
   TBG_player_max: number,
   TBG_playtime_min: number,
   TBG_playtime_max: number,
   TBG_status: BoardgameStatus,
}

/* 
* pending, planned, prototype, published
*/
export const BoardgameStatusArray = ['pending' , 'planned' , 'prototype' , 'published'] as const
export type BoardgameStatusTuple = typeof BoardgameStatusArray
export type BoardgameStatus = BoardgameStatusTuple[number]

// split for readablility
const BoardgamePersonRelation = ['Designer', 'Artist', 'Graphicdesigner', 'Rulebookeditor', 'Playtester']
const BoardgameInfoRelation = ['Publisher', 'Manufacturer', 'Investor']
const BoardgameProperties = ['Type' ,'Mechanics','Category']
const BoardgameETCRelation = ['Event', 'Honor', 'Shop']

export const BoardgameRelationArray = [
   ...BoardgamePersonRelation, 
   ...BoardgameProperties, 
   ...BoardgameInfoRelation, 
   ...BoardgameETCRelation
]