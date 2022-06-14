<script lang="ts">
	import Picture from '$lib/components/Picture.svelte'

	import { getVarPrefix } from '$lib/supabase';
	export let object;
	export let type: string;
	export let comment: string = '';

	const prefix = getVarPrefix(type)
	const id = object[prefix + '_ID'];
	const slug = object[prefix + '_slug'];
	const picture = object[prefix + '_picture']
	const name = object[prefix + '_name'] || object[prefix + '_name_th'] || 'untitled';

</script>

<div class="flex flex-row items-center gap-4 pt-2">
	<Picture {type} {picture} height={20} class="ring ring-primary ring-offset-base-100 ring-offset-2 mask mask-circle"/>
	<div>
		<a href="/{type}/{id}/{slug}"> {name}</a>
		<p>{comment}</p>
	</div>
</div>
