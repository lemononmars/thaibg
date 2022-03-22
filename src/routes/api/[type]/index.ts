import {from, getTableName, getVarPrefix} from '$lib/supabase'
import { TypeNamesArray } from '$lib/datatypes'

/**
 * Returns ALL objects of desired [type]
 * ex. /api/boardgame
 *
 * @param {string} type The type
 * @return {array} array of objects
 */
export async function get({params, url}){
   if(!TypeNamesArray.includes(params.type?.toLowerCase()))
      return{
         status: 404,
         body: {message: `${params.type} is not a valid type`}
      }

   // pick only selected columns
   const selected = url.searchParams.get('select')
   const selectedColumns = selected? selected.split(',')
      .map((str)=> getVarPrefix(params.type) + '_' + str)
      .join(',') : '*'

   const {data, error} = await from(getTableName(params.type)).select(selectedColumns)
   if(error)
      return{
         status: 404,
         body: error
      }
   else
      return{
         status: 200,
         headers: {'Content-Type': 'application/json'},
         body: data
      }
}