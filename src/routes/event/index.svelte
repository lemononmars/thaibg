<script lang=ts context=module>
   import { getFilterOptions, getDataTableColumns } from '$lib/datatypes';
   import type {TypeName, FilterOption, DataTableColumns, Event} from '$lib/datatypes';

	export async function load({ url, fetch }) {
      const searchSuffix = url.search
		const searchString = url.searchParams.get('search')
		const res = await fetch(`/api/event${searchSuffix}`);

		if (!res.ok) return { status: 404, body: res.body };

		const data = await res.json();
		return {
			props: {
				data,
            type: 'event',
            filters: getFilterOptions('event'),
            dataTableColumns: getDataTableColumns('event'),
				searchString
			}
		};
	}
</script>

<script lang="ts">
	import Seo from '$lib/components/SEO.svelte';
	import { ChevronDownIcon, ChevronUpIcon, FilterIcon } from 'svelte-feather-icons';
	import Searchbar from '$lib/components/SearchBar.svelte';
	import { fly } from 'svelte/transition';
	import { quintOut } from 'svelte/easing';
	import { _, locale } from 'svelte-i18n';
	import DataViewer from '$lib/components/DataViewer.svelte';
   import { getVarPrefix } from '$lib/supabase';
	import RangeSlider from "svelte-range-slider-pips"

	export let data: Event[], type: TypeName;
   export let filters: FilterOption[], dataTableColumns: DataTableColumns
	export let searchString: string; // from url params
   let prefix = getVarPrefix(type)

	// unselect every options
	let filterOptions = filters.map((f: FilterOption) => {
		if(f.default)
			return f.default
		switch(f.type) {
			case 'multiple': return [-1]
			case 'range': return f.checkBetween? [f.min, f.max] : [f.min]
			default: return -1
		}
	})

	let activeFilterOptions: boolean[] = filters.map((f:FilterOption)=> {
		return !!f.default
	})

   searchString = searchString || ''
	let showAdvancedFilter = false;
   const eventTimeArray = ['all', 'past', 'ongoing', 'upcoming']
   let activeEventTime: number = 2 // default is 'ongoing'
   const todayDate = new Date(Date.now()).toISOString().slice(0,10)

   function changeEventTime(index: number) {
      activeEventTime = index
   }

	$: dataFiltered = data.filter(
		(d) =>
			// check if all filters are satisfied
			filters.every((f, idx: number) => 
				(
					!activeFilterOptions[idx] ||
					(
						(f.type === 'select' || f.type === 'single') 
						&& 
						(
							filterOptions[idx] == -1 
							|| d[f.key] === f.options[filterOptions[idx] as number]
							|| d[f.key]?.includes(f.options[filterOptions[idx] as number])
						)
					)
					|| 
					(
						f.type === 'multiple' 
						&&
						(
							(filterOptions[idx] as Array<any>).includes(f.options?.indexOf(d[f.key]))
						)
					)
					|| 
					(
						f.type === 'range' 
						&&
						(
							(!f.checkBetween && d[f.key] && d[f.key] <= filterOptions[idx][0]) // check if data is at least input
							||
							(d[f.keyMin] || d[f.keyMax]) // either min or max exists
							&& (!d[f.keyMin] || d[f.keyMin] <= filterOptions[idx][1]) // data min less than input max 
							&& (!d[f.keyMax] || d[f.keyMax] >= filterOptions[idx][0]) // data max greater than input min
						)
					)
				)
	 		) 
			&&
			(
				searchString === '' 
				|| d[prefix + '_name']?.toLowerCase().includes(searchString?.toLowerCase()) // name or name_th contains the string
			)
         &&
         (
            activeEventTime == 0
            || (activeEventTime == 1 && (d.Event_time_end < todayDate))
            || (activeEventTime == 2 && (d.Event_time_end >= todayDate) && (d.Event_time_start <= todayDate))
            || (activeEventTime == 3 && (d.Event_time_start > todayDate))
         )
	);

	function resetSearch() {
		filterOptions  = filters.map((f: FilterOption) => {
			switch(f.type) {
				case 'multiple': return [-1]
				case 'range': return f.checkBetween? [f.min, f.max] : [f.min]
				default: return -1
			}
		})
		activeFilterOptions = filters.map(f=>false)
		searchString = '';
	}
</script>

<Seo title="{type}" />
<div class="flex flex-col justify-center mx-auto">
	<h1>{$_(`keyword.listof`)}{$_(`keyword.${type}`)}{$locale === 'en'? 's':''}</h1>
   <div class="tabs w-full mx-auto flex-grow">
      {#each eventTimeArray as r, idx}
         <!-- svelte-ignore a11y-missing-attribute -->
         <a
            class="tab tab-lg tab-bordered text-xl"
            class:text-success={activeEventTime == idx}
            class:tab-active={activeEventTime == idx}
            class:text-bold={activeEventTime == idx}
            on:click={() => changeEventTime(idx)}
         >
            {$_(`event.${r}`)}
         </a>
      {/each}
   </div>
	<DataViewer data={dataFiltered} {type} {dataTableColumns}>
		<!-- Search box -->
		<div class="flex flex-col lg:flex-row items-center m-2">
			<Searchbar placeholder="Search {type} (en/th)" bind:searchString />
			{#if filters?.length > 0}
				<div
					class="btn"
					class:btn-active={showAdvancedFilter}
					on:click={() => (showAdvancedFilter = !showAdvancedFilter)}
				>
					<FilterIcon size="1x"/>
					<p class="mx-2">Advanced Filter</p>
					{#if showAdvancedFilter}
						<ChevronUpIcon size="1x" />
					{:else}
						<ChevronDownIcon size="1x" />
					{/if}
				</div>
			{/if}
		</div>
		<!-- Advanced filter (hidden by default) -->
		{#if filters.length > 0 && showAdvancedFilter}
			<div in:fly={{ duration: 400, y: -20, easing: quintOut }} class="my-2 mx-auto bg-base-200 p-4 rounded-md w-full">
				<div class="grid grid-cols-1 lg:grid-cols-2 justify-left gap-1">
					{#each filters as f, fidx}
						<div class="flex flex-col lg:flex-row items-center">
							<div class="flex flex-row lg:flex-col w-30 mx-auto gap-1">
								<p class="text-xs">{$_(`key.${f.key}`)}</p>
								<input type="checkbox" class="toggle mx-auto" bind:checked={activeFilterOptions[fidx]}/>
							</div>
							<div class="w-full lg:w-4/5">
								{#if f.type === 'select'}
									<select class="select" bind:value={filterOptions[fidx]} on:change={()=>activeFilterOptions[fidx] = true}>
										<option selected value={-1}>{$_('keyword.all')}</option>
										{#each f.options as o, oidx}
											<option value={oidx} >{$_(`option.${o}`)}</option>
										{/each}
									</select>
								{:else if f.type === 'multiple'}
									<div class="flex flex-row flex-wrap w-full gap-2">
										{#each f.options as o, oidx}
										<label class="label cursor-pointer text-xs">
												<input 
													type=checkbox bind:group={filterOptions[fidx]} 
													name="flavours" value={oidx} class="checkbox"
													on:click={()=>activeFilterOptions[fidx] = true}
												>
												<span class="label-text mx-2">{$_(`option.${o}`)}</span>
											</label>
										{/each}
									</div>
								{:else if f.type === 'range'}
									<div class="flex flex-col gap-1 mx-auto pr-8 -my-2"
										class:opacity-20={!activeFilterOptions[fidx]}
									>
										{#if f.checkBetween}
											<RangeSlider 
												bind:values={filterOptions[fidx]}
												id="rangeSlider"
												range pushy float
												disabled={!activeFilterOptions[fidx]}
												min={f.min} max={f.max}
												step={f.step}
												pips all='label' pipstep={f.pipStep}
											/>
										{:else}
											<RangeSlider
												bind:values={filterOptions[fidx]}
												id="rangeSlider"
												float 
												range="min"
												disabled={!activeFilterOptions[fidx]}
												min={f.min} max={f.max}
												step={f.step}
												pips all="label" pipstep={f.pipStep}
											/>
										{/if}
									</div>
								{:else}
									<div class="btn-group">
										{#each f.options as opt, optionIdx}
											<div 
												class="btn btn-xs" 
												class:btn-active={filterOptions[fidx] == optionIdx && activeFilterOptions[fidx]}
												on:click={()=> {filterOptions[fidx] = optionIdx; ; activeFilterOptions[fidx] = true}}
											>{opt}</div>
										{/each}
									</div>
								{/if}
							</div>
						</div>
					{/each}
					<div class="btn btn-wide btn-outline lg:col-span-2 mx-auto" on:click={()=>resetSearch()}>Reset</div>
				</div>
			</div>
		{/if}
	</DataViewer>
	{#if dataFiltered?.length == 0}
		<div>
			No result for "{searchString}". Try
			<div class="btn btn-outline" on:click={resetSearch}>resetting</div>
			 your search query.
		</div>
	{/if}
</div>