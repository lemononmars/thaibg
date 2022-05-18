<script lang="ts">
	import { TypeNamesArray, personRoles } from '$lib/datatypes';
	import {onMount} from 'svelte'

	import { getImageURL, getDefaultImageURL, getVarPrefix } from '$lib/supabase';
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
			
			if(personRoles.includes(type)) {
				pictureType = 'person'
				const res = await fetch(`/api/${type}/${id}/person?select=picture`)
				const data = await res.json()
				picture = data[0]['Person_picture']
				console.log(picture)
			}
			else {
				pictureType = type
				picture = object[prefix + '_picture']
			}
			name = object[prefix + '_name'] || object[prefix + '_name_th'] || 'untitled';
		}
	})
</script>

<div class="flex flex-row items-center gap-4 pt-2">
	<div class="avatar">
		<div
			class="w-16 h-16 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2 hover:scale-105 duration-300"
		>
			<img
				src={getImageURL(pictureType, picture)}
				alt="avatar"
				class="object-contain"
				on:error|once={(ev) => (ev.target.src = getDefaultImageURL(type))}
			/>
		</div>
	</div>
	<div>
		<a href="/{type}/{id}/{slug}{roleQuery}"> {name}</a>
		<p>{comment}</p>
	</div>
</div>
