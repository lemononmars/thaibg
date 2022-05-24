import { from, getTableName, getVarPrefix } from '$lib/supabase';
import { TypeNamesArray } from '$lib/datatypes';

/**
 * Returns ALL objects of desired [type]
 * ex. /api/boardgame
 *
 * @param {string} type The type
 * @return {array} array of objects
 */
export async function get({ params, url }) {
	const type = params.type;
	// special case: admin settings
	if(type === 'adminsettings') {
		const {data, error} = await from('Admin_Settings').select('*')
		if(error)
			return {
				status: 500,
				headers: { 'Content-Type': 'application/json' },
				body: error
			}
		return {
			status: 200,
			headers: { 'Content-Type': 'application/json' },
			body: data
		}
	}

	// then, check if it is a valid type
	// i.e. boardgame, designer, publisher, content, etc.
	if (!TypeNamesArray.includes(type?.toLowerCase()))
		return {
			status: 404,
			body: { message: `${type} is not a valid type` }
		};

	// pick only selected columns
	const selected = url.searchParams.get('select');
	const searched = url.searchParams.get('search')?.toLowerCase() || ``;
	const nameColumn = getVarPrefix(type) + '_name';

	const selectedColumns = selected
		? selected
			.split(',')
			.map((str: string) => getVarPrefix(type) + '_' + str)
			.join(',')
		: '*';

	const { data, error } = await from(getTableName(type)).select(selectedColumns);

	if (error)
		return {
			status: 500,
			body: error
		};

	if (!searched)
		return {
			status: 200,
			headers: { 'Content-Type': 'application/json' },
			body: data
		};

	// case-insensitive, and also allow searching in Thai language
	const searchedData = data.filter(d => 
		d[nameColumn]?.toLowerCase().includes(searched) 
		|| d[nameColumn + '_th']?.includes(searched)
	);
	return {
		status: 200,
		headers: { 'Content-Type': 'application/json' },
		body: searchedData
	};
}
