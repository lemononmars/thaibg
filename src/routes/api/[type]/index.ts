import { from, getTableName, getVarPrefix } from '$lib/supabase';
import { TypeNamesArray } from '$lib/datatypes';
import Fuse from 'fuse.js'

/**
 * Returns ALL objects of desired [type]
 * ex. /api/boardgame
 *
 * @param {string} type The type
 * @return {array} array of objects
 */
/** @type {import('/api/[type]/index.ts').RequestHandler} */
export async function get({ params, url }) {
	let {type} = params;

	// in case i was stupid or something
	if(type === 'TBG')
		type = 'boardgame'
		
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

	let { data, error } = await from(getTableName(type)).select(selectedColumns);

	if (error)
		return {
			status: 500,
			body: error
		};

	// parse from string in database table to array
	if(type === 'organization')
		data.forEach(d=> d.Organization_relation = JSON.parse(d.Organization_relation))

	if (!searched)
		return {
			status: 200,
			headers: { 'Content-Type': 'application/json' },
			body: data
		};

	// fuzzy search, powered by fuse.js
	const options = {
		keys: [
			nameColumn,
			nameColumn + '_th'
		]
	}

	const fuse = new Fuse(data, options)
	const searchedData = fuse.search(searched).map((result)=> result.item)
	// fuse returns [{item: {}}, {item: {}}, ...]

	return {
		status: 200,
		headers: { 'Content-Type': 'application/json' },
		body: searchedData
	};
}
