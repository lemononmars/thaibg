import { addToSubmission, from } from '$lib/supabase';
import { sendhook} from '$lib/discord'
/**
 * @type {import('@sveltejs/kit').RequestHandler}
 */
export async function post( {request} ){
	const content = await request.json()
	const {pageType, username, type} = content
	const hookMessage = ':game_die: ' + username + ' - ' + type + ' - ' + pageType
	console.log(hookMessage)
	try {
		sendhook(hookMessage)
	}
	catch (error) {
		console.log(error)
		return {
			status: 501,
			message: error
		}
	}

	const {data: settings} = await from('Admin_Settings').select('*').single()
	const {requireApproval} = settings
	return await addToSubmission(content, requireApproval)
}