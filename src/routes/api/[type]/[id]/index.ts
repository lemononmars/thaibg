import {from, getTableName, getVarPrefix} from '$lib/supabase'
import { DataTypesArray } from '$lib/datatypes'

/**
 * Returns the object of the 
 * ex. /api/boardgame/8 will return the board game with TBG_ID = 8
 *
 * @param {string} type object's type
 * @param {number} id object's ID
 * @return {object} an object of the desired id, or error if the ID doesn't exist
 */
export async function get({params}){      
   if(!DataTypesArray.includes(params.type?.toLowerCase()))
      return{
         status: 404,
         message: `${params.type} is not a valid type`
      }
   
   const type = params.type?.toLowerCase() || ''
   const {data, error} = await from(getTableName(type))
      .select('*')
      .eq(`${getVarPrefix(type)}_ID`, params.id)
      .single()
      
   if(error)
      return{
         status: 404,
         message: `${params.type} not found`
      }
   
   return{
      status: 200,
      headers: {'Content-Type': 'application/json'},
      body: data
   }
      
}