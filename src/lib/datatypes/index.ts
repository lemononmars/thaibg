export * from './Person'
export * from './Boardgame'
export * from './Content'

export const DataTypesArray = ['boardgame' , 'person', 'designer', 'graphicdesigner', 'contentcreator' ,'artist' ,'playtester', 'shop' ,'publisher' ,'content', 'honor', 'event' ,'investor' ,'type' ,'mechanics', 'category', 'manufacturer', 'rulebookeditor']
export type DataTypesArrayTuple = typeof DataTypesArray
export type DataType = DataTypesArrayTuple[number]