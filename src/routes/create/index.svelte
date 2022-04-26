<script lang="ts">
	import { _ } from 'svelte-i18n';
	
	$: boardgameMenu = [
		{ path: 'boardgame', title: $_('navbar.boardgame._') },
		// { path: 'category', title: $_('navbar.boardgame.category') } // to be added as tags
	];
	// add person somewhere ?
	$: creatorMenu = [
		{ path: 'designer', title: $_('designer') },
		{ path: 'graphicdesigner', title: $_('graphicdesigner') },
		{ path: 'artist', title: $_('artist') },
		{ path: 'playtester', title: $_('playtester') },
		{ path: 'rulebookeditor', title: $_('rulebookeditor') },
		{ path: 'manufacturer', title: $_('manufacturer') },
	];
	$: supporterMenu = [
		{ path: 'shop', title: $_('shop._') },
		{ path: 'contentcreator', title: $_('contentcreator') },
		{ path: 'publisher', title: $_('publisher') },
		{ path: 'investor', title: $_('investor') }
	];
	$: activityMenu = [
		{ path: 'content', title: $_('content._') },
		{ path: 'honor', title: $_('honor') },
		{ path: 'event', title: $_('event') },
		// { path: 'crowdfunding', title: $_('crowdfunding') }
	];

	$: menus = [boardgameMenu, creatorMenu, supporterMenu, activityMenu]
	$: menuTitles = [$_('boardgame._'), $_('navbar.creator._'), $_('navbar.supporter._'), $_('navbar.activity._')]
</script>

<h1>Create new entry</h1>
<div class="flex flex-row justify-center gap-4 mx-auto w-full">
	{#each menus as menu, idx}
		{#if idx != 0}
			<div class="divider divider-vertical" />
		{/if}
		<div>
			<h2>{menuTitles[idx]}</h2>
			{#each menu as link}
				<a href="/create/{link.path}">{link.title}</a><br />
			{/each}
		</div>
	{/each}
</div>
