<script lang=ts>
	import type { TypeName } from '$lib/datatypes';
	import {getVarPrefix} from '$lib/supabase'
	import { SearchIcon } from 'svelte-feather-icons';

	export let type: TypeName
	export let searchString: string = ''
	let dropdownOpen = false;
	let searchedData: any[] = []

	let typingTimer: ReturnType<typeof setTimeout>
	let isTyping: boolean = false

	function startTyping() {
		isTyping = true
		clearTimeout(typingTimer)
	}

	function stopTyping() {
		clearTimeout(typingTimer)
		typingTimer = setTimeout(search, 300)
	}

	async function search() {
		const res = await fetch(`/api/${type}?search=${searchString}`);
		if (res.ok) {
			const data = await res.json();
			searchedData = data.slice(0, 3).map((d) => ({
				id: d[getVarPrefix(type) + '_ID'],
				name: d[getVarPrefix(type) + '_name'],
				name_th: d[getVarPrefix(type) + '_name_th']
			}));
		}
		else
			searchedData = ['hey']
		isTyping = false
		dropdownOpen = true
	}


</script>
<div class="flex flex-col gap-1 w-72">
	<div class="dropdown">
		<!-- svelte-ignore a11y-label-has-associated-control -->
		<label tabindex="0">
			<div class="form-control">
				<div class="input-group">
					<input
						type="text"
						placeholder="Type here"
						class="input input-bordered w-72"
						bind:value={searchString}
						on:keyup={() => stopTyping()}
						on:keydown={()=> startTyping()}
					/>
					<div class="btn" class:loading={isTyping}>
						<SearchIcon size="20"/>
					</div>
				</div>
			</div>
		</label>
		<ul
			tabindex="0"
			class="shadow menu dropdown-content bg-base-100 rounded-box w-72 py-2"
			class:hidden={!dropdownOpen || !searchString}
		>
			{#if searchedData}
				<li>
					<p class="text-sm text-warning">We find these similar names.<br>Please confirm that you are adding a new entry.</p>
				</li>
			{/if}
			{#each searchedData || [] as d}
				<li>
					<div class="btn btn-ghost btn-xs">
						<a href="/{type}/{d.id}" target="_blank">
							{d.name || ''} {d.name_th || ''}
						</a>
					</div>
				</li>
			{/each}
			{#if searchedData}
				<li>
					<div class="btn btn-xs btn-success" on:click={()=>dropdownOpen = false}>Yes, I'm adding a new entry.</div>
				</li>
			{/if}
		</ul>
	</div>
</div>
