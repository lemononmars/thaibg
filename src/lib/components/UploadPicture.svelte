<script lang=ts>
	import {onMount} from 'svelte'
	import {PlusCircleIcon, XCircleIcon, RefreshCwIcon} from 'svelte-feather-icons'
	import { getImageURL} from '$lib/supabase'
	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();
	
	export let pictureFile: File | string;
	export let key: string;
	let type = key.slice(0,key.indexOf('_'))
	let displaypicture: HTMLImageElement;

	onMount(async ()=>{
		if(pictureFile) {
			if(typeof pictureFile === 'string') {
				displaypicture.src = getImageURL(type, pictureFile)
			}
			else {
				displaypicture.onload = () => {
					URL.revokeObjectURL(displaypicture.src);
				}
				displaypicture.src = URL.createObjectURL(pictureFile as File);
			}
		}
	})

	function change(event: any) {
		const target = event.target;
		if (!target!.files || target.files.length == 0) {
			throw 'You must select an picture to upload.';
		}
		pictureFile = target.files[0];
		displaypicture.onload = () => {
			URL.revokeObjectURL(displaypicture.src);
		};
		displaypicture.src = URL.createObjectURL(pictureFile as File);

		// let the parent knows so they can upload it
		dispatch('pictureUploaded', {});
	}
</script>
<div class="relative">
	<label for={key}>
		<div class="w-40 h-40 aspect-square btn btn-outline">
			{#if pictureFile}
				<img class="w-40 h-40 object-contain" src="#" alt="img" bind:this={displaypicture} />
				<div class="absolute top-0 p-4 m-auto text-info opacity-0 hover:opacity-100 transition duration-500">
					<RefreshCwIcon/>
				</div>
			{:else}
				<PlusCircleIcon/>
			{/if}
		</div>
	</label>
	{#if pictureFile}
		<div class="absolute top-2 right-2 w-8 h-8 text-error rounded " on:click={() => (pictureFile = null)}>
			<XCircleIcon/>
		</div>
	{/if}
</div>

<input
	class="sr-only"
	type="file"
	id={key}
	accept="picture/*"
	bind:value={pictureFile}
	on:change={change}
/>

