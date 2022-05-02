<script lang="ts">
	import { _ } from 'svelte-i18n';

	$: pageGroup1 = [{ name: $_('boardgame._'), url: '/boardgame' }];
	$: pageGroup2 = [
		{ name: $_('keyword.designer'), url: '/person?role=designer' },
		{ name: $_('keyword.graphicdesigner'), url: '/person?role=graphicdesigner' },
		{ name: $_('keyword.artist'), url: '/person?role=artist' },
		{ name: $_('keyword.playtester'), url: '/person?role=playtester' },
		{ name: $_('keyword.manufacturer'), url: '/manufacturer' },
		{ name: $_('keyword.rulebookeditor'), url: '/person?role=rulebookeditor' },
		{ name: $_('keyword.producer'), url: '/person?role=producer' }
	];
	$: pageGroup3 = [
		{ name: $_('keyword.shop'), url: '/shop' },
		{ name: $_('keyword.contentcreator'), url: '/person?role=contentcreator' },
		{ name: $_('keyword.publisher'), url: '/publisher' },
		{ name: $_('keyword.sponsor'), url: '/sponsor' }
	];
</script>

<div class="flex flex-wrap justify-center rgap-4 m-2">
	<div class="btn-group">
		{#each pageGroup1 as p}
			<button class="btn">
				<a href={p.url} class="link-primary">
					{p.name}
				</a>
			</button>
		{/each}
	</div>
	<div class="btn-group">
		{#each pageGroup2 as p}
			<button class="btn">
				<a href={p.url} class="link-accent">
					{p.name}
				</a>
			</button>
		{/each}
	</div>

	<div class="btn-group">
		{#each pageGroup3 as p}
			<button class="btn">
				<a href={p.url} class="link-secondary">
					{p.name}
				</a>
			</button>
		{/each}
	</div>
</div>
