<script lang=ts>
	import { getVarPrefix } from '$lib/supabase';
	import { DeleteIcon, SearchIcon } from 'svelte-feather-icons';
	import {_} from 'svelte-i18n'
	import Spinner from './Spinner.svelte';
	import { getTypeIcon	} from '$lib/assets/icons'

	export let selects = [];
	export let type: string;
	export let relation: string = null
	const typeIcon = getTypeIcon(type)

	interface TBGShopData extends simpleData {
		Shop_TBG_playable: boolean,
		Shop_TBG_obtainable: boolean,
	}

	interface TBGHonorData extends simpleData {
		Honor_position: string,
		Honor_category: string
	}
	
	interface simpleData {
		id: number,
		name?: string,
		name_th?: string
	}

	let searchString: string = '';
	let searchedData: simpleData[];
	let searchCount: number = 0;

	let typingTimer: ReturnType<typeof setTimeout>
	let isTyping = false

	function startTyping() {
		isTyping = true
		searchedData = []
		clearTimeout(typingTimer)
	}

	function stopTyping() {
		clearTimeout(typingTimer)
		typingTimer = setTimeout(search, 500)
	}

	async function search() {
		const res = await fetch(`/api/${type}?search=${searchString}`);
		if (res.ok) {
			const data = await res.json();
			searchCount = data.length
			searchedData = data.slice(0, 15).map((d) => ({
				id: d[getVarPrefix(type) + '_ID'],
				name: d[getVarPrefix(type) + '_name'],
				name_th: d[getVarPrefix(type) + '_name_th']
			}));
		}
		isTyping = false
	}

	function select(data: simpleData) {
		// check whether the data is already in the array
		if(selects.every(selected => selected.id != data.id))
			selects = [...selects, data];
		searchString = '';
		searchedData = null;
	}
</script>

<div class="flex flex-col items-center mx-auto">
	<div class="flex flex-col w-full">
		<div class="dropdown">
			<!-- svelte-ignore a11y-label-has-associated-control -->
			<label tabindex="0">
				<div class="flex flex-row h-12">
					<div class="my-auto w-12">
						<img 
							src={typeIcon}
							class="aspect-square"
							alt={type}
						>
					</div>
					<div class="flex flex-col">
						<div class="label-text">{$_(`keyword.${type}`)}</div>
						<label class="input-group input-group-xs">
							<input
								type="text"
								placeholder={"Search"}
								class="input input-xs input-bordered w-36"
								bind:value={searchString}
								on:keyup={() => stopTyping()}
								on:keydown={()=> startTyping()}
							/>
							<div class="btn btn-xs"><SearchIcon size="20"/></div>
						</label>
					</div>
				</div>
			</label>
			<ul
				tabindex="0"
				class="p-2 shadow menu dropdown-content bg-base-100 rounded-box w-full"
				class:hidden={searchString.length == 0}
			>
				{#if isTyping}
					<li><Spinner /></li>
				{:else if searchedData}
					{#each searchedData as d}
						<li>
							<div class="btn btn-ghost" on:click={() => select(d)}>
								{d.name || ''}{d.name && d.name_th? ' - ' : ''}{d.name_th || ''}
							</div>
						</li>
					{:else}
						<li><div class="btn btn-outline btn-error"> <a href="/create/{type}" target="_blank">Create new {type}</a></div></li>
					{/each}
					{#if searchCount > 15}
						<li><div class="btn btn-outline btn-info">{searchCount - 15} more...</div></li>
					{/if}
				{/if}
			</ul>
		</div>
		{#each selects as s}
			<div
				class="badge badge-outline w-full justify-between my-1"
			>
				<a href="/{type}/{s.id}" target="_blank">
					<p class="truncate">{s.name}</p>
				</a>
				<div 
					class="hover:badge-error" 
					on:click={() => {
						selects.splice(selects.indexOf(s), 1);
						selects = selects;
					}}>
					<DeleteIcon size="20" />
				</div>
			</div>
			{#if relation}
				{#if relation === 'honor'}
					Position: <input type="text">
					Category: <input type="text">
				{:else if relation === 'shop'}
					Playable: <input type="checkbox">
					Obtainable: <input type="checkbox">
				{/if}
			{/if}
		{/each}
	</div>
</div>