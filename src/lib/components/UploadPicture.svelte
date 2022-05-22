<script lang=ts>
	import {onMount} from 'svelte'
	import {PlusCircleIcon, XCircleIcon, RefreshCwIcon} from 'svelte-feather-icons'
	export let pictureFile: File;
	export let key: string;
	let displaypicture: HTMLImageElement;

	onMount(async ()=>{
		if(pictureFile) {
			displaypicture.onload = () => {
			URL.revokeObjectURL(displaypicture.src);
		};
		displaypicture.src = URL.createObjectURL(pictureFile);
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
		displaypicture.src = URL.createObjectURL(pictureFile);
	}
</script>


<div class="relative">
	<label for={key}>
		<div class="w-40 h-40 aspect-square btn btn-outline">
			{#if pictureFile}
				<img class="object-scale-down" src="#" alt="img" bind:this={displaypicture} />
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

