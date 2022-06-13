<script lang="ts">
	import { TypeNamesArray, personRoles } from '$lib/datatypes';
	import Picture from '$lib/components/Picture.svelte'
	import {onMount} from 'svelte'

	import { getVarPrefix } from '$lib/supabase';
	export let object;
	export let type: string;
	export let comment: string = '';

	let id = 0,
		slug = '',
		picture = '',
		name = 'invalid',
		prefix = '',
		roleQuery = '';
	let pictureType = ''

	onMount(async () => {
		if (object && TypeNamesArray.includes(type)) {
			prefix = getVarPrefix(type);
			
			id = object[prefix + '_ID'];
			slug = object[prefix + '_slug'];
			picture = object[prefix + '_picture']
			pictureType = personRoles.includes(type) ? 'person' : type
			name = object[prefix + '_name'] || object[prefix + '_name_th'] || 'untitled';
		}
	})
</script>

<div class="flex flex-row items-center gap-4 pt-2">
	<Picture type={pictureType} {picture} height={20} class="ring ring-primary ring-offset-base-100 ring-offset-2 mask mask-circle"/>
	<div>
		<a href="/{type}/{id}/{slug}{roleQuery}"> {name}</a>
		<p>{comment}</p>
	</div>
</div>
