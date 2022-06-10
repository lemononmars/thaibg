import { from } from '$lib/supabase';
import { sendhook } from '$lib/discord';
/*
 * @type {import('@sveltejs/kit').RequestHandler}
 */
export async function post( {request} ){
	const content = await request.json()
	sendhook(':mega:' + content.Report_url + ' - ' + content.Report_content)

	const {data, error} = await from('Report')
		.insert([
			content
		])
	
	if(data)
		return data
	else
		return error
}