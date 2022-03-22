export * from './Artist'
export * from './Designer'
export * from './Graphicdesigner'
export * from './Playtester'
export * from './Rulebookeditor'
export * from './Contentcreator'

// no longer needed? because of getTableName and getPrefix?
export const personDeveloperRoles = [
  'artist', 'designer', 'graphicdesigner', 'playtester', 'rulebookeditor'
]

// treated differently because content creators are associated with contents, not board games
export const personRoles = [
   ...personDeveloperRoles,
   'contentcreator'
]
export const PersonRelation = ['Boardgame', 'Artist', 'Designer', 'Graphicdesigner', 'Playtester', 'Rulebookeditor', 'Content']