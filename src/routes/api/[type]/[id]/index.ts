import { from, getTableName, getVarPrefix } from '$lib/supabase';
import { TypeNamesArray } from '$lib/datatypes';

/**
 * Returns the object of the
 * ex. /api/boardgame/8 will return the board game with TBG_ID = 8
 *
 * @param {string} type object's type
 * @param {number} id object's ID
 * @return {object} an object of the desired id, or error if the ID doesn't exist
 */
/** @type {import('/api/[type]/[id]/index.ts').RequestHandler} */
export async function get({ params, url }) {

	let {type, id} = params
	type = params.type?.toLowerCase() || '';
	let typePrevix = getVarPrefix(type)
	if (!TypeNamesArray.includes(type))
		return {
			status: 404,
			message: `${type} is not a valid type`
		};

	const selected = url.searchParams.get('select');
	const selectedColumns = selected
		? selected
				.split(',')
				.map((str: string) => typePrevix + '_' + str)
				.join(',')
		: '*';

	const { data, error } = await from(getTableName(type))
		.select(selectedColumns)
		.eq(`${typePrevix}_ID`, id)
		.single();

	if (error)
		return {
			status: 404,
			body: error
		};

	return {
		status: 200,
		headers: { 'Content-Type': 'application/json' },
		body: data
	};
}
