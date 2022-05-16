<script lang=ts context=module>
	export async function load({ fetch }) {
		const res = await fetch('/api/organization');
		if (!res.ok) return { status: 404, message: 'no organization found'};
		const data = await res.json();
		return {
			props: {
				organizations: data
			}
		};
	}
</script>

<script lang="ts">
	import Seo from '$lib/components/SEO.svelte';
	import SearchBar from '$lib/components/SearchBar.svelte';
	import DataView from '$lib/components/DataView.svelte';

	export let organizations;
	let searchString = '';
	$: organizationFiltered = organizations.filter(
		(o) =>
			o.Organization_name?.toLowerCase().includes(searchString.toLowerCase()) || // name or name_th contains the string
			o.Organization_name_th?.includes(searchString)
	);

	const tableInfo = {
		headers: [],
		body: []
	};
</script>

<Seo title="Organization" />
<div class="flex flex-col justify-center mx-auto">
	<DataView data={organizationFiltered} type="organization" {tableInfo}>
		<SearchBar placeholder="Search organization (en/th)" bind:searchString />
	</DataView>
</div>

