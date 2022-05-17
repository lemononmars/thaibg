import { from } from '$lib/supabase';
/**
 * @type {import('@sveltejs/kit').RequestHandler}
 */
export async function post( {request} ){
	const content = await request.json()
	const {data, error} = await from('Report')
		.insert([
			content
		])
	if(data)
		return data
	else
		return error
}