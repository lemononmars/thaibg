import {from, getTableName} from '$lib/supabase'
import { DATA_TYPES } from '$lib/constants'

/**
 * Returns ALL objects of desired [type]
 * ex. /api/boardgame
 *
 * @param {string} type The type
 * @return {array} array of objects
 */
export async function get({params}){
   if(!DATA_TYPES.includes(params.type?.toLowerCase()))
      return{
         status: 404,
         body: {message: `${params.type} is not a valid type`}
      }

   const {data, error} = await from(getTableName(params.type)).select('*')
   if(error)
      return{
         status: 404,
         body: {message: `${params.type} not found`}
      }
   else
      return{
         status: 200,
         headers: {'Content-Type': 'application/json'},
         body: data
      }
}