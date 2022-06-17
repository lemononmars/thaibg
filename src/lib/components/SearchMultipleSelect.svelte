<script lang=ts>
	import { getVarPrefix } from '$lib/supabase';
	import { ChevronDownIcon, DeleteIcon, SearchIcon } from 'svelte-feather-icons';
	import {_} from 'svelte-i18n'
	import Spinner from './Spinner.svelte';
	import { getTypeIcon	} from '$lib/assets/icons'
	import {onMount} from 'svelte'
	
	interface simpleData {
		id: number,
		name?: string,
		name_th?: string
	}

	export let selects = [];
	export let type: string;
	let staticData: simpleData[] = []
	const staticTypes = ['type', 'category', 'mechanics']
	const isStatic: boolean = staticTypes.includes(type)


	onMount(async()=>{
		if(isStatic) {
			const res = await fetch(`/api/${type}`);
			if (res.ok) {
				const data = await res.json();
				staticData = data.map((d) => ({
					id: d[getVarPrefix(type) + '_ID'],
					name: d[getVarPrefix(type) + '_name'],
					name_th: d[getVarPrefix(type) + '_name_th']
				})).sort((a,b)=>{
					return a.name?.localeCompare(b.name)
				});
				searchedData = staticData
			}
		}
	})

	const typeIcon = getTypeIcon(type)

	let searchString: string = '';
	let searchedData: simpleData[];
	let searchCount: number = 0;

	let typingTimer: ReturnType<typeof setTimeout>
	let isTyping: boolean = false
	let revealOptions: boolean = false

	function startTyping() {
		isTyping = true
		if(!isStatic)
			searchedData = []
		clearTimeout(typingTimer)
	}

	function stopTyping() {
		clearTimeout(typingTimer)
		if(isStatic) 
			search()
		else
			typingTimer = setTimeout(search, 300)
	}

	async function search() {
		if(isStatic) {
			searchedData = staticData.filter(d=>
				d.name?.includes(searchString) || d.name_th?.includes(searchString)
			)
		}
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
		revealOptions = false
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
								placeholder={isStatic? "Select": "Search"}
								class="input input-xs input-bordered w-36"
								bind:value={searchString}
								on:keyup={() => stopTyping()}
								on:keydown={()=> startTyping()}
							/>
							<div class="btn btn-xs" on:click={()=>revealOptions = !revealOptions}>
								{#if isStatic}
									<ChevronDownIcon size="20"/>
								{:else}
									<SearchIcon size="20"/>
								{/if}
							</div>
						</label>
					</div>
				</div>
			</label>
			<ul
				tabindex="0"
				class="p-2 shadow menu dropdown-content bg-base-100 rounded-box w-full h-80 overflow-auto"
				class:hidden={searchString.length == 0 && !revealOptions}
			>
				{#if isTyping}
					<li><Spinner /></li>
				{:else if searchedData}
					{#each searchedData as d}
						<li>
							<div class="btn btn-ghost btn-xs" on:click={() => select(d)}>
								{d.name || ''}{d.name && d.name_th? ' - ' : ''}{d.name_th || ''}
							</div>
						</li>
					{:else}
						{#if !isStatic}
							<li><div class="btn btn-outline btn-error btn-xs text-left"> <a href="/add/{type}" target="_blank">Create new {type}</a></div></li>
						{:else}
						<li><div class="btn btn-outline btn-error btn-xs text-left"> Not found </div></li>
						{/if}
					{/each}
					{#if searchCount > 15 && !isStatic}
						<li><div class="btn btn-outline btn-info btn-xs btn-disabled">{searchCount - 15} more...</div></li>
					{/if}
				{/if}
			</ul>
		</div>
		{#each selects as s}
			<div
				class="badge badge-outline w-full justify-between my-1"
			>
				<a href="/{type}/{s.id}" target="_blank">
					<p class="truncate">{s.name || s.name_th}</p>
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
		{/each}
	</div>
</div>