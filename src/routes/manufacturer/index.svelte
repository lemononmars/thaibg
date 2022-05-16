<script lang=ts context=module>
	export async function load({ fetch }) {
		const res = await fetch(`/api/manufacturer`);
		if (!res.ok) return { status: 404, message: 'no manufacturer found' };

		const data = await res.json();
		return {
			props: {
				manufacturers: data
			}
		};
	}
</script>

<script lang="ts">
	import Seo from '$lib/components/SEO.svelte';
	import SearchBar from '$lib/components/SearchBar.svelte';
	import DataView from '$lib/components/DataView.svelte';

	export let manufacturers;
	
	let searchString = '';
	$: manufacturerFiltered = manufacturers.filter(
		(m) =>
			m.Manufacturer_name?.toLowerCase().includes(searchString.toLowerCase())
	);
	console.log(manufacturerFiltered)

	const tableInfo = {
		headers: ['Service', 'Last Updated'],
		body: ['Manufacturer_service', 'lastUpdated']
	};
</script>

<Seo title="Manufacturer" />
<div class="flex flex-col justify-center mx-auto">
	<DataView data={manufacturerFiltered} type="manufacturer" {tableInfo}>
		<SearchBar placeholder="Search manufacturer (en/th)" bind:searchString />
	</DataView>
</div>

