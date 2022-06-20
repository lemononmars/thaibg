<script lang="ts">
	import { getVarPrefix } from '$lib/supabase';
	import type { TypeName, DataTableColumns } from '$lib/datatypes';
	import { BoardgameStatusArray, ShopStatusArray, personRoles } from '$lib/datatypes';

	import { GridIcon, ListIcon, CheckCircleIcon, SlashIcon, SlidersIcon, ChevronDownIcon, ChevronUpIcon } from 'svelte-feather-icons';
	import PersonCard from '$lib/components/PersonCard.svelte';
	import BoardgameCard from '$lib/components/BoardgameCard.svelte';
	import PlainCard from '$lib/components/PlainCard.svelte';
	import OrganizationCard from '$lib/components/OrganizationCard.svelte';
	import EventCard from '$lib/components/EventCard.svelte';
	import ContentCard from '$lib/components/ContentCard.svelte';
	import { flip } from 'svelte/animate';
	import { _ } from 'svelte-i18n';
	import TBGStageIcons from '$lib/assets/icons/TBGStageIcons.svelte';
	import ShopStatusBadge from './ShopStatusBadge.svelte';
	import Picture from './Picture.svelte';

	export let 
		data: any[], 
		type: TypeName, 
		dataTableColumns: DataTableColumns = {headers: [], body: []},
		listView: string = 'list',
		numColumns: number = 4,
		showPageNav: boolean = true

	const typePrefix = getVarPrefix(type);
	const gridCols = 'grid-cols-' + numColumns

	// pagination
	const ENTRY_PER_PAGES = 5 * numColumns; // make it dynamic?
	$: numData = data.length;
	$: numPages = Math.ceil(numData / ENTRY_PER_PAGES);
	let activePage = 0;
	// reset active page whenever data is updated
	$: if(data)
		activePage = 0

	$: dataCurrentPage = data.slice(activePage * ENTRY_PER_PAGES, (activePage + 1) * ENTRY_PER_PAGES);

	$: firstPageEntry = numData === 0 ? 0 : activePage * ENTRY_PER_PAGES + 1;
	$: lastPageEntry = Math.min((activePage + 1) * ENTRY_PER_PAGES, numData);

	function changePage(page: number) {
		activePage = page;
		window.scroll({ top: 0, behavior: 'smooth' });
	}

	let sortingColumn: number = -1
	let sortDescend: boolean = true
	$: sortingIcon = sortDescend ? ChevronUpIcon : ChevronDownIcon

	function sortData(idx: number) {
		if(idx === sortingColumn) {
			sortDescend = !sortDescend
			data = data.reverse()
			return
		}
		else {
			sortingColumn = idx
			sortDescend = true
		}
		const key = sortingColumn == -1 ? getVarPrefix(type) + '_name' : dataTableColumns.body[idx]
		if(key.includes('cache')) {
			const [cacheKey, nestedKey] = key.split('.')
			if(nestedKey.includes('latestTBG'))
				data = data.sort((a,b)=>{
					return a[cacheKey][nestedKey]['TBG_name']?.localeCompare(b[cacheKey][nestedKey]['TBG_name'])
				})
			else if(nestedKey.includes('latestContent'))
				data = data.sort((a,b)=>{
					return a[cacheKey][nestedKey]['Content_name']?.localeCompare(b[cacheKey][nestedKey]['Content_name'])
				})
			else if(typeof data[0][cacheKey][nestedKey] === 'number')
					data.sort((a,b)=>{
						return a[cacheKey][nestedKey] - b[cacheKey][nestedKey]
					})
			else
				data = data.sort((a,b)=>{
					return String(a[cacheKey][nestedKey])?.localeCompare(String(b[cacheKey][nestedKey]))
				})
		}
		else {
			data = data.sort((a,b)=>{
				return String(a[key])?.localeCompare(String(b[key]))
			})
		}
		if(sortDescend)
			data = data.reverse()
		else
			data = data
	}
</script>

<div class="flex flex-col justify-center items-center">
	<slot />
	{#if showPageNav}
		<div class="flex flex-col lg:flex-row items-center flex-wrap">
			<!-- Select table view or grid view -->
			<div class="btn-group">
				<div class="btn" on:click={() => (listView = 'list')} class:btn-active={listView === 'list'}>
					<div class="tooltip" data-tip="List view">
						<ListIcon size="20" />
					</div>
				</div>
				<div class="btn" on:click={() => (listView = 'grid')} class:btn-active={listView === 'grid'}>
					<div class="tooltip" data-tip="Grid view">
						<GridIcon size="20" />
					</div>
				</div>
			</div>
			<!-- top pagination -->
			<div class="m-2">
				<div class="btn-group">
					<button class="btn">Page </button>
					{#each Array(numPages) as _, idx}
						<button class="btn" class:btn-active={activePage === idx} on:click={() => changePage(idx)}
							>{idx + 1}</button
						>
					{/each}
				</div>
			</div>
			<p class="text-xs">Show results: {firstPageEntry} - {lastPageEntry} from {numData}</p>
		</div>
	{/if}
	{#if dataCurrentPage && data.length > 0}
		{#if listView === 'grid'}
			<!-- Grid view -->
			<div class="w-full text-center mb-4 grid grid-cols-2 lg:{gridCols} lg:gap-4 justify-items-center">
				{#each dataCurrentPage as d (d[typePrefix + '_ID'])}
					<div animate:flip={{ duration: 300 }}>
						{#if type === 'person' || personRoles.includes(type)}
							<PersonCard person={d} role={type}/>
						{:else if type === 'organization'}
							<OrganizationCard organization={d} role={type} />
						{:else if type === 'boardgame'}
							<BoardgameCard bg={d} />
						{:else if type === 'event'}
							<EventCard event={d} />
						{:else if type === 'content'}
							<ContentCard content={d} />
						{:else}
							<PlainCard object={d} {type} />
						{/if}
					</div>
				{/each}
			</div>
		{:else}
			<!-- Table view -->
			<div class="w-full">
				<table class="relative table table-zebra table-compact lg:table-normal table-fixed w-full overflow-hidden">
					<thead>
						<tr>
							{#if type!=='content'}
								<th class="w-20">{$_(`table.image`)}</th>
							{/if}
							<th class="w-3/4 lg:w-1/2">
								<div class="flex flex-row align-middle gap-2 ">
								{$_(`table.name`)}
								<div on:click={()=>sortData(-1)}>
									{#if sortingColumn == -1}
										<svelte:component this={sortingIcon} size=20/>
									{:else}
										<SlidersIcon size=20/>
									{/if}
								</div>
							</div></th>
							{#each dataTableColumns.headers as t, idx}
								<th class="hidden lg:table-cell">
									<div class="flex flex-row align-middle gap-2">
										{$_(`table.${t}`)}
										<div on:click={()=>sortData(idx)}>
											{#if idx === sortingColumn}
												<svelte:component this={sortingIcon} size="20"/>
											{:else}
												<SlidersIcon size=20/>
											{/if}
										</div>
									</div>
								</th>
							{/each}
						</tr>
					</thead>
					<!-- Table body -->
					<tbody>
						{#each dataCurrentPage as d (d[typePrefix + '_ID'])}
							<tr animate:flip={{ duration: 300 }}>
								{#if type!=='content'}
									<td>
										<Picture {type} height={16} picture={d[typePrefix + '_picture']} mask='square'/>
									</td>
								{/if}
								<td>
									<a href="/{type}/{d[typePrefix + '_ID']}">
										<p class="break-words truncate">
											{d[typePrefix + '_name'] || d[typePrefix + '_name_th'] || 'N/A'}
										</p>
										{#if d[typePrefix + '_name'] && d[typePrefix + '_name_th']}
											<p class="opacity-60 break-words">{d[typePrefix + '_name_th']}</p>
										{/if}
									</a>
								</td>
								{#each dataTableColumns.body as t}
									<td class="hidden lg:table-cell truncate">
										{#if typeof d[t] === 'boolean'}
											{#if d[t] == true}
												<CheckCircleIcon size="1x" class="text-success" />
											{:else}
												<SlashIcon size="1x" class="text-error" />
											{/if}
										{:else if BoardgameStatusArray.includes(d[t])}
											<TBGStageIcons status={d[t]} showText={true} class="h-12"/>
										{:else if ShopStatusArray.includes(d[t])}
											<ShopStatusBadge status={d[t]} showText={true} />
										{:else if Array.isArray(d[t])}
											{#each d[t] as a}
												<div class="badge badge-outline">{a}</div>
											{/each}
										{:else if t.includes('cache') && d[t.slice(0, t.indexOf('.'))]}
											{@const cache = d[t.slice(0, t.indexOf('.'))]}
											{#if t.includes('latestTBG')}
												<a href='/boardgame/{cache.latestTBG.TBG_ID}'>{cache.latestTBG.TBG_name || cache.latestTBG.TBG_name_th || '-'}</a>
											{:else if t.includes('latestContent')}
												<a href='/content/{cache.latestContent.Content_ID}'><p class="truncate">{cache.latestContent.Content_name || '-'}</p></a>
											{:else}
												{cache[t.slice(t.indexOf('.')+1)]}
											{/if}
										{:else if t === 'Organization_relation'}
											{#each Object.keys(d[t]) as r, idx}
												{idx == 0? '': ', '}{$_(`keyword.${r}`)}
											{/each}
										{:else}
											{d[t] || '-'}
										{/if}
									</td>
								{/each}
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		{/if}
		<!-- bottom pagination -->
		{#if showPageNav}
			<div class="m-2">
				<div class="btn-group">
					<button class="btn">Page </button>
					{#each Array(numPages) as _, idx}
						<button class="btn" class:btn-active={activePage === idx} on:click={() => changePage(idx)}
							>{idx + 1}</button
						>
					{/each}
				</div>
			</div>
			<p class="text-xs">Show results: {firstPageEntry} - {lastPageEntry} from {numData}</p>
		{/if}
	{:else}
		<div>No result found.</div>
	{/if}
</div>
