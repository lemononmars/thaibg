<script lang=ts>
	import { DeleteIcon, PlusCircleIcon } from 'svelte-feather-icons';
	import {_} from 'svelte-i18n'

	export let selects: string[] = []
	let inputString: string = ''

	function addLink() {
		selects = [...selects, inputString]
		inputString = ''
	}
</script>

<div class="flex flex-col items-center">
	<div class="flex flex-row w-full">
		<input type="text" class="input" bind:value={inputString}>
		<button class="btn" on:click={addLink}> <PlusCircleIcon size="10"/> </button>
	</div>
	{#each selects as s, idx}
		<div
			class="badge badge-outline w-full justify-between my-1"
		>
			{s}
			<div 
				class="hover:badge-error" 
				on:click={() => {
					selects.splice(idx, 1);
					selects = selects;
				}}
			>
				<DeleteIcon size="20" />
			</div>
		</div>
	{/each}
</div>