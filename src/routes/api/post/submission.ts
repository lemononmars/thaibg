import { addToSubmission } from '$lib/supabase';
/**
 * @type {import('@sveltejs/kit').RequestHandler}
 */
export async function post( {request} ){
	const content = await request.json()
	return await addToSubmission(content)
}