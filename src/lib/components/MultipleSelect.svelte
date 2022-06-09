<script lang=ts>
	import { PlusCircleIcon, DeleteIcon } from 'svelte-feather-icons';

	export let selectOptions: string[] = [];
	export let selects: string[] = [];
	export let disabled:boolean = false
	if(!selects)
		selects = []

	let searchString = '';
	let dropdownOpen = false;

	$: filteredOptions = selectOptions?.filter(
		(s) => !selects?.includes(s) && s?.toLowerCase().includes(searchString?.toLowerCase())
	);

	function handleKeyPress(event: KeyboardEvent) {
		if (event.code != "Enter") return;
		addNewSelect()
	}

	function clickSelect(s: string) {
		searchString = s
		addNewSelect()
	}
	function addNewSelect() {
		if(disabled || !searchString) return;

		// sanitize link: remove http:// prefix
		if(searchString.includes('//'))
			searchString = searchString.slice(searchString.indexOf('//') + 2)

		selects = [...selects, searchString];
		searchString = '';
		dropdownOpen = false;
	}

	function remove(s: any) {
		if(disabled) return
		selects.splice(selects.indexOf(s), 1);
		selects = selects;
	}
</script>

<div class="flex flex-col mx-auto gap-1 max-w-content">
	<div class="dropdown mb-4">
		<!-- svelte-ignore a11y-label-has-associated-control -->
		<label tabindex="0">
			<div class="form-control">
				<div class="input-group input-sm">
					<input
						type="text"
						placeholder="Type here"
						class="input input-bordered w-70"
						bind:value={searchString}
						on:keypress={handleKeyPress}
						on:focus={() => (dropdownOpen = true)}
						{disabled}
					/>
					<div class="btn" on:click={addNewSelect}>
						<PlusCircleIcon size="20" />
					</div>
				</div>
			</div>
		</label>
		<ul
			tabindex="0"
			class="mt-6 shadow menu dropdown-content bg-base-100 rounded-box w-72"
			class:hidden={!dropdownOpen}
		>
			{#each filteredOptions as d}
				<li>
					<div class="btn btn-ghost btn-xs" on:click={() => clickSelect(d)}>
						{d}
					</div>
				</li>
			{:else}
				<li>
					<div class="btn btn-outline btn-xs btn-info" on:click={addNewSelect}>
						Add "{searchString}"
					</div>
				</li>
			{/each}
		</ul>
	</div>
	{#each selects as s}
		<div
			class="badge gap-2 w-full justify-between"
			class:hover:badge-error={!disabled}
			on:click={() => remove(s)}
		>
			<p class="w-60 truncate">{s}</p>
			<DeleteIcon size="20" />
		</div>
	{/each}
</div>
