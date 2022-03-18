import {from, getTableName, getVarPrefix} from '$lib/supabase'
import { DataTypesArray } from '$lib/datatypes'

/**
 * Returns the object of 
 * ex. /api/boardgame/8/designer 
 * will return the list of designers for the board game with TBG_ID = 8
 *
 * @param {string} type object's type
 * @param {number} id object's ID
 * @param {string} relation object's relational
 * @param {string} select selected columns
 * @return {array} an array of objects, or error if the ID doesn't exist
 */
export async function get({url, params}){
   if(!DataTypesArray.includes(params.type?.toLowerCase()) || !DataTypesArray.includes(params.relation?.toLowerCase()))
      return{
         //status: 404,
         message: `${params.type} is not a valid type`,
         body:{message: 'nope'}
      }

   let relation = params.relation?.toLowerCase() || ''

   // pick only selected columns
   const selected = url.searchParams.get('select')
   const selectedColumns = selected? selected.split(',') : '*'

   // in case of a person, we'll look up directly in ${role} table, not ${role}_Relation
   if(relation === 'person') {
      const {data, error} = await from('Person')
         .select(`${selectedColumns}, ${getTableName(params.type)}!inner(*)`)
         .eq(`${getTableName(params.type)}.${getVarPrefix(params.type)}_ID`, params.id)
         
      if(error)
         return{
            status: 404,
            message: `No person associated with ${params.type} found`
         }
      else
         return{
            status: 200,
            headers: {'Content-Type': 'application/json'},
            body: data
         }
   }

   // in case of /api/designer/9/boardgame
   // we'll look up Designer_Relation, not Boardgame_Relation
   // everything else stays the same
   if(relation === 'boardgame')
      relation = params.type

   const selectStr = `${selectedColumns}, ${getTableName(relation)}_Relation!inner(*)`
   const eqStr = `${getTableName(relation)}_Relation.${getVarPrefix(params.type)}_ID`
   const {data, error} = await from(getTableName(params.relation))
      .select(selectStr)
      .eq(eqStr, params.id)

   if(error)
      return{
         status: 404,
         body: {message: `No ${params.relation} associated with ${params.type} found`, error: error}
      }
   else
      return{
         status: 200,
         headers: {'Content-Type': 'application/json'},
         body: data
      }
      
}