import { from } from "$lib/supabase"

/** @type {import('./[id]').RequestHandler} */
export async function get() {
   const {data, error} = await from('Manufacturer').select('*')
   if(error) return {status: 404, message: 'not found'}
   
   return {
      status: 200,
      body: {
         manufacturers: data
      }
   }
}