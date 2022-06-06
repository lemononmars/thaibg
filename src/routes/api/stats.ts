import { from, getTableName, getVarPrefix } from '$lib/supabase';

/**
 * Returns stats for 'boardgame', 'content', 'person', 'event', 'manufacturer', 'publisher', 'shop'
 * for now, simply return the number of entries for each category
 * ex. /api/boardgame
 *
 * @param {null}
 * @return {object} array of objects
 */
export async function get() {
	const statsCategory = ['boardgame', 'person', 'organization']; // to be added? 'event', 'manufacturer', 'publisher', 'shop']
	let stats = {};

	for (const cat of statsCategory) {
		const { data } = await from(getTableName(cat)).select(getVarPrefix(cat) + '_ID');
		stats[cat] = data.length || 0;
	}

	return {
		status: 200,
		headers: { 'Content-Type': 'application/json' },
		body: stats
	};
}
