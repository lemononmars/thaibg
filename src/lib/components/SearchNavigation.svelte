<script lang="ts">
import { _ } from 'svelte-i18n';

	import RoleButtonSearch from './RoleButtonSearch.svelte';

	const pageGroup1 = ['boardgame'];
	const pageGroup2 = [
		'designer',
		'graphicdesigner',
		'artist',
		'playtester',
		'manufacturer',
		'rulebookeditor',
		'producer'
	]
	const pageGroup3 = [
		'shop',
		'contentcreator',
		'publisher',
		'sponsor'
	];
</script>

<div class="flex flex-wrap justify-center gap-1 m-2">
	{#each pageGroup1 as role}
		<a href="/{role}" class="link-primary">
			<RoleButtonSearch {role}/>
		</a>
	{/each}
	{#each pageGroup2 as role}
	<a href="/{role}" class="link-accent">
		<RoleButtonSearch {role}/>
	</a>
	{/each}
	{#each pageGroup3 as role}
		<a href="/{role}" class="link-secondary">
			<RoleButtonSearch {role}/>
		</a>
	{/each}
</div>
