<script lang="ts">
	//import TBGAlogo from '$lib/assets/TBGA-logo-color.png';
	import TBGAlogo from '$lib/assets/mascot.png';
	import { _ } from 'svelte-i18n';

	$: boardgameMenu = [
		{ path: '/boardgame', title: $_('navbar.boardgame.list') },
		{ path: '/type', title: $_('navbar.boardgame.type') },
		{ path: '/mechanics', title: $_('navbar.boardgame.mechanics') },
		{ path: '/category', title: $_('navbar.boardgame.category') }
	];
	$: creatorMenu = [
		{ path: '/person?role=designer', title: $_('keyword.designer') },
		{ path: '/person?role=graphicdesigner', title: $_('keyword.graphicdesigner') },
		{ path: '/person?role=artist', title: $_('keyword.artist') },
		{ path: '/person?role=playtester', title: $_('keyword.playtester') },
		{ path: '/manufacturer', title: $_('keyword.manufacturer') },
		{ path: '/person?role=rulebookeditor', title: $_('keyword.rulebookeditor') },
		{ path: '/person?role=producer', title: $_('keyword.producer') }
	];
	$: supporterMenu = [
		{ path: '/shop', title: $_('shop._') },
		{ path: '/person?role=contentcreator', title: $_('keyword.contentcreator') },
		{ path: '/publisher', title: $_('keyword.publisher') },
		{ path: '/sponsor', title: $_('keyword.sponsor') }
	];
	$: activityMenu = [
		{ path: '/content', title: $_('content._') },
		{ path: '/honor', title: $_('keyword.honor') },
		{ path: '/event', title: $_('keyword.event') },
		//{ path: '/crowdfunding', title: $_('keyword.crowdfunding') }
	];
	$: websiteMenu = [
		{ path: '/about', title: $_('navbar.website.about') },
		{ path: '/termofuse', title: $_('navbar.website.termofuse') },
		{ path: '/contact', title: $_('navbar.website.contact') }
	];

	$: menuTitles = [
		$_('navbar.boardgame._'),
		$_('navbar.creator._'),
		$_('navbar.supporter._'),
		$_('navbar.activity._'),
		$_('navbar.website._')
	];
	$: menus = [boardgameMenu, creatorMenu, supporterMenu, activityMenu, websiteMenu];
</script>

<footer
	class="mx-auto w-screen max-w-7xl sm:px-6 lg:px-8 p-10 footer bg-base-200 text-base-content"
>
	<div>
		<img class="h-20" src={TBGAlogo} alt="logo" />
		<div class="w-30 break-words">{$_('navbar.title.db')}</div>
	</div>
	{#each menuTitles as mt, idx}
		<div>
			<span class="footer-title">{mt}</span>
			{#each menus[idx] as m}
				<a href={m.path} alt={m.title} class="link link-hover">
					{m.title}
				</a>
			{/each}
		</div>
	{/each}
</footer>
