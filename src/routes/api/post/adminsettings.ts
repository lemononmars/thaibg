import { from } from '$lib/supabase';
import { sendhook } from '$lib//discord';
/**
 * @type {import('@sveltejs/kit').RequestHandler}
 */
export async function post( {request} ){
	const content = await request.json()
	sendhook('Someone changes admin settings!')
	return await from('Admin_Settings').upsert([
		content]
	)
}