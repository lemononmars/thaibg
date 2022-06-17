<script lang="ts">
	import Picture from '$lib/components/Picture.svelte'

	import { getVarPrefix } from '$lib/supabase';
	export let object: any = false;
	export let type: string;
	export let comment: string = '';

	const prefix = getVarPrefix(type)
	let id: number = 0, slug: string = 'uncredited', picture: string = '', name: string ='uncredited'
	if(object) {
		id = object[prefix + '_ID'];
		slug = object[prefix + '_slug'];
		picture = object[prefix + '_picture']
		name = object[prefix + '_name'] || object[prefix + '_name_th'] || 'untitled';
	}

</script>

<div class="flex flex-row items-center gap-4 pt-2">
	<Picture {type} {picture} height={20} class="ring ring-primary ring-offset-base-100 ring-offset-2 mask mask-circle"/>
	<div>
		<a href="/{type}/{id}/{slug}"> {name}</a>
		<p>{comment}</p>
	</div>
</div>
