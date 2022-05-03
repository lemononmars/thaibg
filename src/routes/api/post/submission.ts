import { addToSubmission, from } from '$lib/supabase';
/**
 * @type {import('@sveltejs/kit').RequestHandler}
 */
export async function post( {request} ){
	const content = await request.json()
	const {data: settings} = await from('Admin_Settings').select('*').single()
	const {requireApproval} = settings
	return await addToSubmission(content, requireApproval)
}