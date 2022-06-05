<script lang=ts>
	import { PlusCircleIcon, DeleteIcon } from 'svelte-feather-icons';

	export let selectOptions: string[] = [];
	export let selects: string[] = [];
	if(!selects)
		selects = []

	let searchString = '';
	let dropdownOpen = false;

	$: filteredOptions = selectOptions?.filter(
		(s) => !selects?.includes(s) && s?.toLowerCase().includes(searchString?.toLowerCase())
	);

	function select(data: string) {
		selects = [...selects, data];
		searchString = '';
		dropdownOpen = false;
	}

	function addNewSelect(event: KeyboardEvent) {
		if (event.code != "Enter") return;

		selects = [...selects, searchString];
		searchString = '';
		dropdownOpen = false;
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
						on:keypress={addNewSelect}
						on:focus={() => (dropdownOpen = true)}
					/>
					<div class="btn">
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
					<div class="btn btn-ghost" on:click={() => select(d)}>
						{d}
					</div>
				</li>
			{:else}
				<li>
					<div class="btn btn-outline btn-info" on:click={() => select(searchString)}>
						Add "{searchString}"
					</div>
				</li>
			{/each}
		</ul>
	</div>
	{#each selects as s}
		<div
			class="badge hover:badge-error gap-2 w-full justify-between"
			on:click={() => {
				selects.splice(selects.indexOf(s), 1);
				selects = selects;
			}}
		>
			<p class="truncate">{s}</p>
			<DeleteIcon size="20" />
		</div>
	{/each}
</div>
