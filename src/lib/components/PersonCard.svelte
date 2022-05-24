<script lang="ts">
	import { getImageURL, getDefaultImageURL, getVarPrefix } from '$lib/supabase';
	import type {PersonRole} from '$lib/datatypes'

	export let person: PersonRole
	export let role: string = 'person';
	console.log(person)
	const prefix = getVarPrefix(role)

	let id = person[prefix + '_ID'];
	let slug = person[prefix + '_slug']
	let picture = getImageURL(role, person[prefix + '_picture']);
	let name = person[prefix + '_name']
	let name_th = person[prefix + '_name_th']
</script>

<a href="/{role}/{id}/{slug}">
	<div
		class="
			relative group card bg-base-100 card-compact shadow-xl 
			max-w-1/2 lg:w-64 pt-8 px-1 lg:px-0
			transition ease-in-out duration-30
			hover:opacity-80 hover:scale-105 group"
	>
		<figure>
			<img
				src={picture}
				class="object-cover w-full lg:h-64 aspect-square group-hover:scale-120 "
				alt="picture of {name}"
				on:error|once={(ev) => (ev.target.src = getDefaultImageURL('person'))}
			/>
		</figure>
		<div class="card-body">
			<h2 class="card-title truncate">{name || name_th || 'No name'}</h2>
			<h3 class="card-title truncate">{name ? name_th || '' : ''}</h3>
		</div>
	</div>
</a>
