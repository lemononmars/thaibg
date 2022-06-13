<script lang="ts">
	import { getImageURL,} from '$lib/supabase';
	import Picture from '$lib/components/Picture.svelte'
	export let id: number;
	export let slug: string;
	export let picture: string;
	export let name: string;
	export let type: string;

	// import {getImageURL, getDefaultImageURL, getVarPrefix} from '$lib/supabase'
	// export let object, type
	// const typeVar = getVarPrefix(type) //capitalize first letter

	// let id = object[typeVar + '_ID']
	// let slug = object[typeVar + '_slug']
	// let picture = object[typeVar + '_picture']
	// let name = object[typeVar + '_name'] || object[typeVar + '_name_th']
</script>

<a href="/{type}/{id}/{slug}">
	<div
		class="card card-side bg-base-100 shadow-xl transition ease-in-out hover:opacity-80 hover:-translate-y-0 hover:scale-105 duration-300 items-center"
	>
		<figure>
			<Picture {type} {picture} height={20}/>
		</figure>
		<div class="card-body">
			<p class="truncate">{name}</p>
		</div>
	</div>
</a>
