export * from './Person'
export * from './Boardgame'
export * from './Content'
export * from './Event'
export * from './Honor'
export * from './Shop'
export * from './Manufacturer'
export * from './Publisher'

export * from './personRoles'

export const TypeNamesArray = ['boardgame' , 'person', 'designer', 'graphicdesigner', 'contentcreator' ,'artist' ,'playtester', 'shop' ,'publisher' ,'content', 'honor', 'event' ,'investor' ,'type' ,'mechanics', 'category', 'manufacturer', 'rulebookeditor']

export type TypeName = TypeNameRole | 'boardgame' | 'person' | 'shop' |'publisher' |'content'| 'honor'| 'event' |'investor' |'type' |'mechanics'| 'category'| 'manufacturer'
export type TypeNameRole = 'designer' | 'graphicdesigner'| 'contentcreator' |'artist' |'playtester' | 'rulebookeditor'