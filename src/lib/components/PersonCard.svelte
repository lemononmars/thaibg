<script lang="ts">
	import { getImageURL, getDefaultImageURL } from '$lib/supabase';
	export let person;

	let id = person.Person_ID;
	let slug = person.Person_slug;
	let picture = getImageURL('person', person.Person_picture);
	let name = person.Person_name;
	let name_th = person.Person_name_th;
</script>

<a href="/person/{id}/{slug}">
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
