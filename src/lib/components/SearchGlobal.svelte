<script lang=ts>
	import { getVarPrefix } from '$lib/supabase';
	import { SearchIcon } from 'svelte-feather-icons';
	import {_} from 'svelte-i18n'
	import Spinner from './Spinner.svelte';
	import RoleButton from './RoleButton.svelte';

	interface simpleData {
		id: number,
		name?: string,
		name_th?: string
	}
	
	const searchTypes = ['boardgame', 'person', 'publisher', 'shop', 'contentcreator', 'mechanics']
	let searchPromise: Record<string, Promise<any>> = {};
	searchTypes.forEach(t => {
		searchPromise[t] = null
	})

	const DISPLAY_LIMIT = 5
	let searchString: string = '';

	let typingTimer: ReturnType<typeof setTimeout>
	let isTyping = false

	function startTyping() {
		isTyping = true
		clearTimeout(typingTimer)
	}

	function stopTyping() {
		clearTimeout(typingTimer)
		typingTimer = setTimeout(()=> {
			searchTypes.forEach(t => {
				searchPromise[t] = search(t)
			})
			isTyping = false
		}
		, 500)
	}

	async function search(type: string) {
		const res = await fetch(`/api/${type}?search=${searchString}`);
		if (res.ok) {
			const data = await res.json();
			const count = data.length
			const simpleData = data.slice(0, DISPLAY_LIMIT).map((d) => ({
				id: d[getVarPrefix(type) + '_ID'],
				name: d[getVarPrefix(type) + '_name'],
				name_th: d[getVarPrefix(type) + '_name_th']
			}));
			return {simpleData, count}
		}
		return {simpleData: [], count: 0}
	}

</script>

<div class="flex flex-col w-full">
	<div class="flex flex-row my-4">
		<label class="input-group">
			<input
				type="text"
				placeholder={"What are you looking for?"}
				class="input input-bordered w-full"
				bind:value={searchString}
				on:keyup={() => stopTyping()}
				on:keydown={()=> startTyping()}
			/>
			<div class="btn"><SearchIcon size="20"/></div>
		</label>
	</div>

	{#each searchTypes as st}
	<div class="flex flex-row">
		<div>
			<RoleButton role={st}/>
		</div>
		{#await searchPromise[st]}
			<Spinner />
		{:then data}
			{#if data && !isTyping}
				<ul
					class="p-2 shadow rounded-box w-full"
					class:hidden={searchString.length == 0}
				>
				{#each data.simpleData as d}
					<li><a href="/{st}/{d.id}">
						<p class="truncate">
							{d.name || ''}{d.name && d.name_th? ' - ' : ''}{d.name_th || ''}
						</p>
					</a></li>
				{:else}
					<li class="text-error">No result</li>
				{/each}
				{#if data.count > DISPLAY_LIMIT}
					<li><a href="/{st}?search={searchString}"><div class="btn btn-outline btn-xs btn-info">{data.count - DISPLAY_LIMIT} more...</div></a></li>
				{/if}
				</ul>
			{/if}
			{/await}
			<div class="divider"></div>
		</div>
	{/each}
</div>