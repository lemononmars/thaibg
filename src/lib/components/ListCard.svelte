<script lang="ts">
	import Picture from '$lib/components/Picture.svelte'
	export let 
		id: number,
		slug: string,
		picture: string,
		name: string,
		type: string;
</script>

<a href="/{type}/{id}/{slug}">
	<div
		class="card card-side bg-base-100 shadow-xl transition ease-in-out hover:opacity-80 hover:-translate-y-0 hover:scale-105 duration-300 items-center"
	>
		<figure>
			<Picture {type} {picture} height={20}/>
		</figure>
		<div class="card-body">
			<p class="line-clamp-2">{name}</p>
		</div>
	</div>
</a>
