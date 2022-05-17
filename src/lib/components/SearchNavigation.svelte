<script lang="ts">
	import RoleButtonSearch from './RoleButtonSearch.svelte';

	const pageGroup1 = [{ name: 'boardgame', url: '/boardgame' }];
	const pageGroup2 = [
		{ name: 'designer', url: '/person?role=designer' },
		{ name: 'graphicdesigner', url: '/person?role=graphicdesigner' },
		{ name: 'artist', url: '/person?role=artist' },
		{ name: 'playtester', url: '/person?role=playtester' },
		{ name: 'manufacturer', url: '/manufacturer' },
		{ name: 'rulebookeditor', url: '/person?role=rulebookeditor' },
		{ name: 'producer', url: '/person?role=producer' }
	];
	const pageGroup3 = [
		{ name: 'shop', url: '/shop' },
		{ name: 'contentcreator', url: '/contentcreator' },
		{ name: 'publisher', url: '/publisher' },
		{ name: 'sponsor', url: '/sponsor' }
	];
</script>

<div class="flex flex-wrap justify-center gap-1 m-2">
	{#each pageGroup1 as p}
		<a href={p.url} class="link-primary">
			<RoleButtonSearch role={p.name}/>
		</a>
	{/each}
	{#each pageGroup2 as p}
		<a href={p.url} class="link-accent">
			<RoleButtonSearch role={p.name}/>
		</a>
	{/each}

	{#each pageGroup3 as p}
		<a href={p.url} class="link-secondary">
			<RoleButtonSearch role={p.name}/>
		</a>
	{/each}
</div>
