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
export async function get({ params, url }) {
	if (!TypeNamesArray.includes(params.type?.toLowerCase()))
		return {
			status: 404,
			message: `${params.type} is not a valid type`
		};

	const selected = url.searchParams.get('select');
	const selectedColumns = selected
		? selected
				.split(',')
				.map((str) => getVarPrefix(params.type) + '_' + str)
				.join(',')
		: '*';

	const type = params.type?.toLowerCase() || '';
	const { data, error } = await from(getTableName(type))
		.select(selectedColumns)
		.eq(`${getVarPrefix(type)}_ID`, params.id)
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
