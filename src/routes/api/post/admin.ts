import { changeSubmissionStatus } from '$lib/supabase';
/**
 * @type {import('@sveltejs/kit').RequestHandler}
 */
export async function post( {request} ){
	const content = await request.json()
	return await changeSubmissionStatus(content.id, content.approved);
}