<script context=module lang="ts">
	import type { Person } from '$lib/datatypes';
	import { personRoles } from '$lib/datatypes';
	import { getVarPrefix } from '$lib/supabase';

	export async function load({ url, fetch }) {
		const res = await fetch('/api/person');
		if (!res.ok) return { status: 404, body: { message: 'cannot load person' } };

		let filteredData = await res.json();
		const role = url.searchParams.get('role') || 'designer'; // default to designer?
		if (role)
			filteredData = filteredData.filter((d: Person) => d[getVarPrefix(role) + '_ID'] != null);

		// fetch relational data
		for (const d in filteredData) {
			const res = await fetch(
				`/api/${role}/${
					filteredData[d][getVarPrefix(role) + '_ID']
				}/boardgame?select=name,name_th,released`
			);
			if (!res.ok) {
				filteredData[d]['latestWork'] = '-';
				filteredData[d]['lastUpdated'] = '-';
				break;
			}

			const bgData = await res.json();
			// count how many boardgameas have this person helped created
			filteredData[d]['numBoardgames'] = bgData.length;
			// get the lastest work
			// TODO: make a cache
			const latest = bgData.sort((a, b) => (b?.TBG_released || 0) - (a?.TBG_released || 0))[0];
			filteredData[d]['latestWork'] = latest?.TBG_name || latest?.TBG_name_th;
			filteredData[d]['lastUpdated'] = latest?.TBG_released;
		}

		return {
			props: {
				people: filteredData,
				role,
				search: url.searchParams.get('name')
			}
		};
	}
</script>

<script lang="ts">
	import Seo from '$lib/components/SEO.svelte';
	import { ChevronDownIcon, ChevronUpIcon } from 'svelte-feather-icons';
	import DataView from '$lib/components/DataView.svelte';
	import SearchBar from '$lib/components/SearchBar.svelte';
	import { fly } from 'svelte/transition';
	import { quintOut } from 'svelte/easing';
	import { _ } from 'svelte-i18n';

	export let people: Person[], search: string;
	export let role: string; // see below

	let option = -1;
	// handle error when role query is invalid
	if (!role || personRoles.indexOf(role) == -1) option = -1;
	else option = personRoles.indexOf(role);

	$: peopleFiltered = people.filter(
		(p: Person) =>
			(option == -1 || !!p[getVarPrefix(personRoles[option]) + '_ID']) && // no role, or has ID of that role
			(p.Person_name?.toLowerCase().includes(searchString.toLowerCase()) || // name or name_th contains the string
				p.Person_name_th?.includes(searchString))
	);

	let sorted = 0;
	let searchString = search || '';
	$: peopleSorted = peopleFiltered.sort((a: Person, b: Person) => compare(sorted, a, b));
	function compare(s: number, a: Person, b: Person) {
		if (s == 0) return a.Person_name?.localeCompare(b.Person_name);
		else return b.Person_name?.localeCompare(a.Person_name);
	}

	let showAdvancedFilter = false;

	function resetSearch() {
		option = -1;
		searchString = '';
	}

	const tableInfo = {
		headers: ['Number of Board Games', 'Latest Work', 'Last Updated'],
		body: ['numBoardgames', 'latestWork', 'lastUpdated']
	};
</script>

<Seo title="People" />
<div class="flex flex-col justify-center mx-auto">
	<DataView data={peopleSorted} type="person" {tableInfo}>
		<div><h1>{$_(`keyword.${role}`)}</h1></div>
		<div class="flex flex-row items-center justify-between gap-2">
			<!-- Search box -->
			<SearchBar placeholder={`Search ${role} (en/th)`} bind:searchString />

			<div class="btn gap-2" on:click={() => (showAdvancedFilter = !showAdvancedFilter)}>
				Advanced Filter
				{#if showAdvancedFilter}
					<ChevronUpIcon size="1x" />
				{:else}
					<ChevronDownIcon size="1x" />
				{/if}
			</div>
		</div>
		<!-- Advanced filter (hidden by default) -->
		{#if showAdvancedFilter}
			<div transition:fly={{ duration: 400, y: -20, easing: quintOut }} class="m-2" />
		{/if}
	</DataView>

	{#if peopleSorted?.length == 0}
		<div>
			No result. Try <div class="btn btn-outline" on:click={resetSearch}>resetting</div>
			 your search query.
		</div>
	{/if}
</div>
