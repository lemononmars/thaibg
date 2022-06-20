<script lang="ts">
	import DatabaseLogo from '$lib/assets/logos/THBDDB-Logo.png'
	import { _ } from 'svelte-i18n';

	const boardgameMenu = ['boardgame', 'type', 'mechanics', 'category'];
	const personMenu = ['person', 'designer','graphicdesigner','artist','playtester','rulebookeditor','producer'];
	const organizationMenu = ['organization', 'publisher','manufacturer','sponsor','shop','contentcreator'];
	const activityMenu = ['content','honor','event'];
	const websiteMenu = ['about','termofuse','contact', 'glossary']

	const menuTitles = ['boardgame', 'person', 'organization', 'activity', 'website']
	const menus = [boardgameMenu, personMenu, organizationMenu, activityMenu, websiteMenu]
</script>

<footer
	class="mx-auto w-screen p-10 footer bg-base-200 text-base-content grid-cols-2 lg:grid-cols-none"
>
	<div class="justify-center">
		<a href="/">
			<div>
				<img class="h-20 " src={DatabaseLogo} alt="logo" />
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
