import { addToSubmission, from } from '$lib/supabase';
import { sendhook} from '$lib/discord'
/**
 * @type {import('@sveltejs/kit').RequestHandler}
 */
export async function post( {request} ){
	const url = String(import.meta.env.VITE_SITE_URL)
	const sub = await request.json()
	const {pageType, username, type} = sub
	
	const {data: settings} = await from('Admin_Settings').select('*').single()
	const {requireApproval} = settings
	const res = await addToSubmission(sub, requireApproval)

	let hookMessage = ':game_die: ' + username + ' - ' + type + ' - ' + pageType

	hookMessage += url + pageType + res.index
	//sendhook(hookMessage)

	return res
}