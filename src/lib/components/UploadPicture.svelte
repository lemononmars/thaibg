<script lang=ts>
	import {onMount} from 'svelte'
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

<label class="btn btn-sm" for={key}
	>{pictureFile ? 'Replace the picture' : 'Upload a picture'}</label
>
{#if pictureFile}
	<div class="btn btn-sm" on:click={() => (pictureFile = null)}>Remove</div>
{/if}
<input
	class="sr-only"
	type="file"
	id={key}
	accept="picture/*"
	bind:value={pictureFile}
	on:change={change}
/>
{#if pictureFile}
	<img class="w-48 aspect-auto" src="#" alt="img" bind:this={displaypicture} />
{/if}
