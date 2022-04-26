<script lang=ts>
	import { SearchIcon, DeleteIcon } from 'svelte-feather-icons';

	export let selectOptions = [];
	export let selects = [];
	let searchString = '';
	let dropdownOpen = false;

	$: filteredOptions = selectOptions.filter(
		(s) => !selects.includes(s) && s.includes(searchString)
	);

	function select(data) {
		selects = [...selects, data];
		searchString = '';
		dropdownOpen = false;
	}

	function addNewSelect(event) {
		if (event.keyCode != 13) return;

		selects = [...selects, searchString];
		searchString = '';
		dropdownOpen = false;
	}
</script>

<div class="flex flex-col mx-auto">
	<div class="dropdown mb-4">
		<!-- svelte-ignore a11y-label-has-associated-control -->
		<label tabindex="0">
			<div class="form-control">
				<div class="input-group input-sm">
					<input
						type="text"
						placeholder="พิมพ์เพื่อค้นหา"
						class="input input-bordered w-70"
						bind:value={searchString}
						on:keypress={addNewSelect}
						on:focus={() => (dropdownOpen = true)}
					/>
					<div class="btn">
						<SearchIcon size="20" />
					</div>
				</div>
			</div>
		</label>
		<ul
			tabindex="0"
			class="p-2 shadow menu dropdown-content bg-base-100 rounded-box w-72"
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
			class="badge hover:badge-error gap-2"
			on:click={() => {
				selects.splice(selects.indexOf(s), 1);
				selects = selects;
			}}
		>
			{s}
			<DeleteIcon size="20" />
		</div>
	{/each}
</div>
