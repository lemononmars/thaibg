import { from } from '$lib/supabase';
import { sendhook } from '$lib/discord';
import { findNewUniqueID } from '$lib/supabase';
/*
 * @type {import('@sveltejs/kit').RequestHandler}
 */
export async function post( {request} ){
	let content = await request.json()
	sendhook(':mega:' + 'update honor table - ' + content[0].Honor_ID)

	// increment ID for new rows (board games)
	let firstID = await findNewUniqueID('Honor_Relation', 'id')
	for(const row in content) {
		if(!content[row].id) {
			content[row]['id'] = firstID
			firstID++ 
		}
	}

	const {data, error} = await from('Honor_Relation')
		.upsert(
			content
		,{returning: 'minimal'})

	if(data)
		return {
			status: 200,
			body: {
				message: 'successfully updated honor relation'
			}
		}
		
	return error
}