<script lang="ts">
	import TBGAlogo from '$lib/assets/TBGA-logo-color.png';
	//import TBGAlogo from '$lib/assets/mascot.png';
	import { _ } from 'svelte-i18n';

	const boardgameMenu = ['boardgame', 'type', 'mechanics', 'category'];
	const personMenu = ['designer','graphicdesigner','artist','playtester','rulebookeditor','producer'];
	const organizationMenu = ['publisher','manufacturer','sponsor','shop','contentcreator'];
	const activityMenu = ['content','honor','event'];
	const websiteMenu = ['about','termofuse','contact', 'glossary']

	const menuTitles = ['boardgame', 'person', 'organization', 'activity', 'website']
	const menus = [boardgameMenu, personMenu, organizationMenu, activityMenu, websiteMenu]
</script>

<footer
	class="mx-auto w-screen p-10 footer bg-base-200 text-base-content"
>
	<div class="justify-center">
		<a href="/">
			<div>
				<img class="h-20" src={TBGAlogo} alt="logo" />
				<div class="w-30 break-words">{$_('navbar.title.tbg')}</div>
				<div class="w-30 break-words">{$_('navbar.title.db')}</div>
			</div>
		</a>
	</div>
	{#each menuTitles as mt, idx}
		<div class="columns-2">
			<span class="footer-title">{$_(`keyword.${mt}`)}</span>
			{#each menus[idx] as m}
				<a href="/{m}" alt={m} class="link link-hover">
					{$_(`keyword.${m}`)}
				</a>
			{/each}
		</div>
	{/each}
</footer>
