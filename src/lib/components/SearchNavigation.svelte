<script lang="ts">
import { _ } from 'svelte-i18n';

	import RoleButton from './RoleButton.svelte';

	const pageGroup1 = ['boardgame'];
	const pageGroup2 = [
		'designer',
		'graphicdesigner',
		'artist',
		'playtester',
		'rulebookeditor',
		'producer',
	]
	const pageGroup3 = [
		'publisher',
		'manufacturer',
		'sponsor',
		'shop',
		'contentcreator',
	];
</script>

<div class="grid grid-cols-4 md:grid-cols-6 lg:grid-rows-2 justify-center gap-1 m-2">
	{#each pageGroup1 as role}
		<a href="/{role}" class="link-primary">
			<RoleButton {role}/>
		</a>
	{/each}
	{#each pageGroup2 as role}
	<a href="/{role}" class="link-accent">
		<RoleButton {role}/>
	</a>
	{/each}
	{#each pageGroup3 as role}
		<a href="/{role}" class="link-secondary">
			<RoleButton {role}/>
		</a>
	{/each}
</div>
