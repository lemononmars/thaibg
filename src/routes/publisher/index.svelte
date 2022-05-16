<script lang=ts context=module>
	export async function load({ fetch }) {
		const res = await fetch('/api/publisher');
		if (!res.ok) return { status: 404, message: 'no publishers found' };
		const data = await res.json();

		// fetch relational data
		// for (const d in data) {
		// 	await fetch(
		// 		`/api/publisher/${data[d]['Publisher_ID']}/boardgame?select=name,name_th,released`
		// 	)
		// 		.then((res) => res.json())
		// 		.then((bgData) => {
		// 			// count how many boardgameas have this person helped created
		// 			data[d]['numBoardgames'] = bgData.length;
		// 			// get the lastest work
		// 			// TODO: make this work....
		// 			const latest = bgData.sort((a, b) => (b.TBG_released || 0) - (a.TBG_released || 0))[0];
		// 			data[d]['latestWork'] = latest.TBG_name || latest.TBG_name_th;
		// 			data[d]['lastUpdated'] = latest.TBG_released;
		// 		})
		// 		.catch((error) => (data[d]['numBoardgames'] = '-'));
		// }

		return {
			props: {
				publishers: data
			}
		};
	}
</script>

<script lang="ts">
	import Seo from '$lib/components/SEO.svelte';
	import SearchBar from '$lib/components/SearchBar.svelte';
	import DataView from '$lib/components/DataView.svelte';

	export let publishers;
	let searchString = '';
	$: publisherFiltered = publishers.filter(
		(p) =>
			p.Publisher_name?.toLowerCase().includes(searchString.toLowerCase()) || // name or name_th contains the string
			p.Publisher_name_th?.includes(searchString)
	);

	const tableInfo = {
		headers: ['Number of Board Games', 'Latest Work', 'Last Updated'],
		body: ['numBoardgames', 'latestWork', 'lastUpdated']
	};
</script>

<Seo title="Publisher" />
<div class="flex flex-col justify-center mx-auto">
	<DataView data={publisherFiltered} type="publisher" {tableInfo}>
		<SearchBar placeholder="Search publisher (en/th)" bind:searchString />
	</DataView>
</div>
