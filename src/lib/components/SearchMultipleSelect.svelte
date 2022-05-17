<script lang=ts>
	import { getVarPrefix } from '$lib/supabase';
	import { SearchIcon, DeleteIcon } from 'svelte-feather-icons';
	import {_} from 'svelte-i18n'
import type { TimeFormatter } from 'svelte-i18n/types/runtime/types';
	import RoleButtonSearch from './RoleButtonAdd.svelte';
	import Spinner from './Spinner.svelte';

	export let selects = [];
	export let type: string;

	interface simpleData {
		id: number,
		name?: string,
		name_th?: string
	}

	let searchString: string = '';
	let searchedData: simpleData[];
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

<div class="flex flex-row">
	<RoleButtonSearch role={type}/>
	<div class="flex flex-col mx-auto gap-1">
		<div class="dropdown mb-4">
			<!-- svelte-ignore a11y-label-has-associated-control -->
			<label tabindex="0">
				<div class="form-control">
					<!-- <label class="label text-sm">{$_(`keyword.${type}`)}</label> -->
					<div class="input-group input-sm">
						<input
							type="text"
							placeholder={"Search " + $_(`keyword.${type}`)}
							class="input input-bordered w-70"
							bind:value={searchString}
							on:keyup={() => stopTyping()}
							on:keydown={()=> startTyping()}
						/>
						<div class="btn">
							<SearchIcon size="20" />
						</div>
					</div>
				</div>
			</label>
			<ul
				tabindex="0"
				class="p-2 shadow menu dropdown-content bg-base-100 rounded-box w-72 mt-4"
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
						<li><div class="btn btn-outline btn-error"> <a href="/create/{type}" target="_blank">Create {type}</a></div></li>
					{/each}
					{#if searchedData.length > 15}
						<li><div class="btn btn-outline btn-info">{searchedData.length - 15} more...</div></li>
					{/if}
				{/if}
			</ul>
		</div>
		{#each selects as s}
			<div
				class="badge hover:badge-error gap-2 ml-3"
				on:click={() => {
					selects.splice(selects.indexOf(s), 1);
					selects = selects;
				}}
			>
				{s.name}
				<DeleteIcon size="20" />
			</div>
		{/each}
	</div>
</div>