<script lang="ts">
	import { _ } from 'svelte-i18n';
	
	const boardgameMenu = [
		'boardgame',
		'category'
	];
	// add person somewhere ?
	const creatorMenu = [
		'person',
		/*'designer',
		'graphicdesigner',
		'artist',
		'playtester',
		'rulebookeditor',
		'producer'*/
		//'manufacturer',
	];
	const supporterMenu = [
		'organization'
		//'shop',
		//'contentcreator',
		//'publisher',
		//'sponsor',
	];
	const activityMenu = [
		'content',
		'honor',
		'event',
		// 'crowdfunding'
	];

	const menus = [boardgameMenu, creatorMenu, supporterMenu, activityMenu]
	$: menuTitles = [$_('boardgame._'), $_('navbar.creator._'), $_('navbar.supporter._'), $_('navbar.activity._')]
</script>

<h1>Create new entry</h1>
<div class="flex flex-col lg:flex-row justify-center gap-4 mx-auto w-full">
	{#each menus as menu, idx}
		{#if idx != 0}
			<div class="divider divider-vertical" />
		{/if}
		<div>
			<h2>{menuTitles[idx]}</h2>
			{#each menu as link}
				<a href="/create/{link}">{$_(`keyword.${link}`)}</a><br />
			{/each}
		</div>
	{/each}
</div>
