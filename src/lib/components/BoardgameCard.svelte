<script lang="ts">
	import type { Boardgame, Designer } from '$lib/datatypes';
	import Picture from './Picture.svelte';

	export let bg: Boardgame;

	let id: number = bg.TBG_ID;
	let slug: string = bg.TBG_slug;
	let picture: string = bg.TBG_picture;
	let name: string = bg.TBG_name || bg.TBG_name_th || '';
	let description: string = bg.TBG_description?.slice(0, 50) || '';

	let promiseDesignerImageURLs = getDesignerImageURLs(id);

	async function getDesignerImageURLs(id: number) {
		const res = await fetch(`/api/boardgame/${id}/designer`);
		if (!res.ok) return [];

		let data = await res.json();
		let URLs = data.map((d:Designer)=>
			d.Designer_picture
		)
		return URLs;
	}
</script>

<a href="/boardgame/{id}/{slug}">
	<div
		class="relative card card-compact  ratio-aspect w-40 lg:w-64 max-w-1/2 pt-8 px-0 bg-base-100 shadow-xl 
		transition ease-in-out hover:opacity-80 hover:scale-105 duration-30 group"
	>
		<figure>
			<Picture type='boardgame' height={64} {picture} mask="square"/>
		</figure>
		<div class="card-body">
			<h2 class="card-title line-clamp-2 break-words text-xs lg:text-xl">{name}</h2>
			<p class="line-clamp-2 break-words text-xs lg:text-base">{description}</p>
		</div>

		<div class="avatar-group -space-x-6 absolute top-0 right-0 m-1 ">
			{#await promiseDesignerImageURLs then pictures}
				{#each pictures as picture}
					<Picture type='designer' {picture} height={16}/>
				{:else}
					<div />
				{/each}
			{/await}
		</div>
	</div>
</a>

<style>
	.card {
		box-shadow: 0 0 1rem 5px rgb(0 0 0 / 0.05);
	}
</style>
