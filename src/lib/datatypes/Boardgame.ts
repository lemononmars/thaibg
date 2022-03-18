export interface Boardgame extends BoardgameSubmission{
   TBG_ID: number,
   TBG_slug: string,
}

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

export const BoardgameStatusArray = ['pending' , 'planned' , 'prototype' , 'published']
export type BoardgameStatusTuple = typeof BoardgameStatusArray
export type BoardgameStatus = BoardgameStatusTuple[number]

// split for readablility
const BoardgamePersonRelation = ['Designer', 'Artist', 'Graphicdesigner', 'Rulebookeditor', 'Playtester']
const BoardgameInfoRelation = ['Publisher', 'Manufacturer', 'Investor']
const BoardgameProperties = ['Type' ,'Mechanics','Category']
const BoardgameETCRelation = ['Event', 'Honor', 'Shop']

export const BoardgameRelation = [
   ...BoardgamePersonRelation, 
   ...BoardgameProperties, 
   ...BoardgameInfoRelation, 
   ...BoardgameETCRelation
]