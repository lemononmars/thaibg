<script lang="ts">
	import {getVarPrefix } from '$lib/supabase';
	import Picture from '$lib/components/Picture.svelte';
	import type {OrganizationRole, TypeName} from '$lib/datatypes'

	export let organization: OrganizationRole;
	export let role: TypeName;
	const typeVar = getVarPrefix(role); //capitalize first letter

	let id = organization[typeVar + '_ID'];
	let slug = organization[typeVar + '_slug'];
	let picture = organization[typeVar + '_picture'];
	let name = organization[typeVar + '_name'] || organization[typeVar + '_name_th'];
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
			<Picture type='organization' {picture} height={64} mask="square"/>
		</figure>
		<div class="card-body">
			<h2 class="card-title line-clamp-3 text-sm lg:text-lg">{name}</h2>
		</div>
	</div>
</a>
