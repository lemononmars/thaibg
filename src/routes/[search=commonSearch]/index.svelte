<script lang=ts context=module>
   import { getFilterOptions, getDataTableColumns } from '$lib/datatypes';
   import type {TypeName, FilterOption, DataTableColumns, PersonRole} from '$lib/datatypes';

	export async function load({ params, url, fetch }) {
      const {search: type} = params
		const res = await fetch(`/api/${type}`);
		if (!res.ok) return { status: 404 };

		const data = await res.json();

		return {
			props: {
				data,
            type,
            filter: getFilterOptions(type),
            dataTableColumns: getDataTableColumns(type),
				searchString: url.searchParams.get('name')
			}
		};
	}
</script>

<script lang="ts">
	import Seo from '$lib/components/SEO.svelte';
	import { ChevronDownIcon, ChevronUpIcon } from 'svelte-feather-icons';
	import Searchbar from '$lib/components/SearchBar.svelte';
	import { fly } from 'svelte/transition';
	import { quintOut } from 'svelte/easing';
	import { _ } from 'svelte-i18n';
	import DataViewer from '$lib/components/DataViewer.svelte';
   import { getVarPrefix } from '$lib/supabase';

	export let data: PersonRole[], type: TypeName;
   export let filter: FilterOption[], dataTableColumns: DataTableColumns
	export let searchString: string; // from url params
   let prefix = getVarPrefix(type)

	let filterOptions = filter.map(f => -1)

	$: dataFiltered = data.filter(
		(d) =>
			// check if all filters are satisfied
			filter.every((f, idx: number) => 
				(filterOptions[idx] == -1) 
					|| d[f.key] === (f.options[filterOptions[idx]]
					|| d[f.key]?.includes(f.options[filterOptions[idx]])
				)
	 		) &&
			(searchString === '' ||
				d[prefix + '_name']?.toLowerCase().includes(searchString?.toLowerCase()) || // name or name_th contains the string
				d[prefix + '_name_th']?.includes(searchString))
	);

	let sorted: number = 0;
	searchString = searchString || ''
	$: dataSorted = dataFiltered.sort((a, b) => 
		compare(sorted, a, b)
	);

	// TODO: allow advanced search settings
	function compare(s: number, a: PersonRole, b: PersonRole) {
      const result = a[prefix + '_name']?.localeCompare(b[prefix + '_name'])
		if (s == 0) return result
		return !result
	}

	let showAdvancedFilter = false;

	function resetSearch() {
		filterOptions.fill(0)
		searchString = '';
	}
</script>

<Seo title="{type}" />
<div class="flex flex-col justify-center items-center w-full">
	<h1>List of {$_(`keyword.${type}`)}</h1>
	<DataViewer data={dataSorted} {type} {dataTableColumns}>
		<!-- Search box -->
		<div class="flex flex-row items-center gap-4">
			<Searchbar placeholder="Search {type} (en/th)" bind:searchString />
			{#if filter?.length > 0}
				<div
					class="btn gap-2"
					class:btn-active={showAdvancedFilter}
					on:click={() => (showAdvancedFilter = !showAdvancedFilter)}
				>
					Advanced Filter
					{#if showAdvancedFilter}
						<ChevronUpIcon size="1x" />
					{:else}
						<ChevronDownIcon size="1x" />
					{/if}
				</div>
			{/if}
		</div>
		<!-- Advanced filter (hidden by default) -->
		{#if filter?.length > 0 && showAdvancedFilter}
			<div in:fly={{ duration: 400, y: -20, easing: quintOut }} class="my-2 mx-auto bg-base-200 p-4 rounded-md">
				<div class="flex flex-col justify-left gap-1">
					{#each filter as f, fidx}
						<div class="flex flex-row gap-2 items-center">
							<div class="text-sm">{f.name}</div>
								<div class="btn-group">
									<div 
										class="btn btn-xs" 
										class:btn-active={filterOptions[fidx] == -1}
										on:click={()=> filterOptions[fidx] = -1}
									>All</div>
									{#each f.options as opt, optionIdx}
										<div 
											class="btn btn-xs" 
											class:btn-active={filterOptions[fidx] == optionIdx}
											on:click={()=> filterOptions[fidx] = optionIdx}
										>{opt}</div>
									{/each}
								</div>
						</div>
					{/each}
				</div>
			</div>
		{/if}
	</DataViewer>
	{#if dataSorted?.length == 0}
		<div>
			No result for "{searchString}". Try
			<div class="btn btn-outline" on:click={resetSearch}>resetting</div>
			 your search query.
		</div>
	{/if}
</div>