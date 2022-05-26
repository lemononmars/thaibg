<script context=module lang="ts">
	import type { TypeName, PersonRole } from '$lib/datatypes';
	import { personRoles } from '$lib/datatypes';
	import { getVarPrefix } from '$lib/supabase';

	export async function load({ params, fetch, url }) {
		const {role} = params;
		const {search} = url
		const searchString = url.searchParams.get('search')
		const res = await fetch(`/api/${role}${search}`);
		if (!res.ok) return { status: 404, body: { message: 'cannot load this role' } };

		let filteredData = await res.json();
		return {
			props: {
				people: filteredData,
				role,
				searchString
			}
		};
	}
</script>

<script lang="ts">
	import Seo from '$lib/components/SEO.svelte';
	import DataViewer from '$lib/components/DataViewer.svelte';
	import SearchBar from '$lib/components/SearchBar.svelte';
	import { _ } from 'svelte-i18n';

	export let people: PersonRole[], searchString: string = '';
	export let role: TypeName; // see below
	const prefix = getVarPrefix(role)

	let option = -1;
	// handle error when role query is invalid
	if (!role || personRoles.indexOf(role) == -1) 
		option = -1;
	else 
		option = personRoles.indexOf(role);

	$: peopleFiltered = people.filter(
		p =>
			// no role, or has ID of that role
			(option == -1 || !!p[getVarPrefix(personRoles[option]) + '_ID']) 
				&& 
			(
				p[prefix + '_name']?.toLowerCase().includes(searchString.toLowerCase())
					|| p[prefix + '_name_th']?.includes(searchString)
			)
	);

	let sorted = 0;
	$: peopleSorted = peopleFiltered.sort((a: PersonRole, b: PersonRole) => compare(sorted, a, b));

	function compare(s: number, a: PersonRole, b: PersonRole) {
		if (s == 0) return a[prefix + '_name']?.localeCompare(b[prefix+'_name']);
		else return b[prefix + '_name']?.localeCompare(a[prefix+'_name']);
	}

	let showAdvancedFilter = false;

	function resetSearch() {
		option = -1;
		searchString = '';
	}

	const dataTableColumns = {
		headers: [],//['Number of Board Games', 'Latest Work', 'Last Updated'],
		body: []//['numBoardgames', 'latestWork', 'lastUpdated']
	};
</script>

<Seo title="People" />
<div class="flex flex-col justify-center mx-auto">
	<h1>List of {$_(`keyword.${role}`)}</h1>
	<DataViewer data={peopleSorted} type={role} {dataTableColumns}>
		<div class="flex flex-row items-center justify-between gap-2">
			<!-- Search box -->
			<SearchBar placeholder={`Search ${role} (en/th)`} bind:searchString />
		</div>
	</DataViewer>

	{#if peopleSorted?.length == 0}
		<div>
			No result. Try <div class="btn btn-outline" on:click={resetSearch}>resetting</div>
			 your search query.
		</div>
	{/if}
</div>
