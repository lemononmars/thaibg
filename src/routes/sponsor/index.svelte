<script lang=ts context=module>
	export async function load({ fetch }) {
		const res = await fetch('/api/sponsor');
		if (!res.ok) return { status: 404, message: 'no publishers found'};
		const data = await res.json();
		return {
			props: {
				sponsors: data
			}
		};
	}
</script>

<script lang="ts">
	import Seo from '$lib/components/SEO.svelte';
	import SearchBar from '$lib/components/SearchBar.svelte';
	import DataView from '$lib/components/DataView.svelte';

	export let sponsors;
	let searchString = '';
	$: sponsorFiltered = sponsors.filter(
		(s) =>
			s.Sponsor_name?.toLowerCase().includes(searchString.toLowerCase()) || // name or name_th contains the string
			s.Sponsor_name_th?.includes(searchString)
	);

	const tableInfo = {
		headers: ['Number of Board Games', 'Latest Work', 'Last Updated'],
		body: ['numBoardgames', 'latestWork', 'lastUpdated']
	};
</script>

<Seo title="Sponsor" />
<div class="flex flex-col justify-center mx-auto">
	<DataView data={sponsorFiltered} type="sponsor" {tableInfo}>
		<SearchBar placeholder="Search sponsor (en/th)" bind:searchString />
	</DataView>
</div>

