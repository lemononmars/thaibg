<!-- <script lang=ts context=module>
    export async function load({ session }) {
        const { user } = session
        return {
            props: {
                user,
            }
        };
    }
</script> -->

<script lang=ts>
	import { _, locale, locales, isLoading } from 'svelte-i18n';
	import { getAvatar, getCurrUserProfile } from '$lib/user/profile';
	import { user, signOut } from '$lib/user';
	import {
		ChevronDownIcon,
		MenuIcon,
		UserIcon,
		SearchIcon,
		ChevronUpIcon,
		AlertOctagonIcon,
		XIcon
	} from 'svelte-feather-icons';
	import { URL_DICEBEAR } from '$lib/constants';
	import ToggleTheme from '$lib/components/ToggleTheme.svelte';
	import { fly } from 'svelte/transition';
	import { onMount } from 'svelte';
	import { page } from '$app/stores'
	import { handleAlert} from '$lib/alert'
	import type {Alert} from '$lib/alert/alert.type'
	import SearchNavigation from './SearchNavigation.svelte';
	import SearchGlobal from './SearchGlobal.svelte';
	import RoleButton from '$lib/components/RoleButton.svelte';
	import DatabaseLogo from '$lib/assets/logos/THBDDB-Logo.png'

	//export let user

	const boardgameMenu = ['boardgame', 'type', 'mechanics', 'category'];
	const personMenu = ['designer','graphicdesigner','artist','playtester','rulebookeditor','producer'];
	const organizationMenu = ['publisher','manufacturer','sponsor','shop','contentcreator'];
	const activityMenu = ['content','honor','event'];
	const contributeMenu = ['boardgame','person','organization', 'content', 'event', 'honor']

	const menuTitles = ['boardgame', 'person', 'organization', 'activity', 'contribute']
	const menus = [boardgameMenu, personMenu, organizationMenu, activityMenu]

	const hoverColors = ['text-info', 'text-accent', 'text-secondary', 'text-base-300', 'text-warning']
	const menuColors = ['bg-info', 'bg-accent', 'bg-secondary', 'bg-base-300', 'bg-warning']

	const languageName = {
		en: 'ENG',
		th: 'ไทย'
	};
	let avatar: string | Promise<string>;

	onMount(async () => {
		if ($user) {
			const { data, error } = await getCurrUserProfile();
			if (!error) 
				avatar = getAvatar(data.avatar_url);
			else 
				avatar = URL_DICEBEAR + 'randombear' + '.svg';
		}
	});

	let scrollY: number, mouseY: number;

	function scrollTop() {
		window.scroll({ top: 0, behavior: 'smooth' });
	}

	function mouseMove(event: MouseEvent) {
		mouseY = event.clientY;
	}

	let openSearchModal: boolean = false
	let openReportModal: boolean = false
	let reportString: string = ''
	let isReporting: boolean = false

	let openHamburgerMenu: boolean = false
	let hoveringTab: number = -1

	async function handleReport() {
		isReporting = true
		let newAlert: Alert
		if(!reportString) {
			newAlert = {
				type: 'error',
				text: 'please enter your message' 
			}
			handleAlert(newAlert)
			isReporting = false
			return
		}
		const reportObject = {
			Report_url: $page.url,
			Report_content: reportString
		}
		const res = await fetch('/api/post/report', {
         method: 'POST',
         cache: 'default',
         credentials: 'same-origin',
         headers: {
            'Content-Type': 'application/json'
         },
         body: JSON.stringify(reportObject)
      })
		if (res.ok)
			newAlert = {
				type: 'success',
				text: 'Thank you! Your report has been received.'
			}
		else newAlert  = {
				type: 'error',
				text: res.statusText
			}
		handleAlert(newAlert)
		openReportModal = false
		isReporting = false
	}

	function closeReport(){
		openReportModal = false
	}

	function closeSearch() {
		openSearchModal = false
	}

	let tabTimeOut: ReturnType<typeof setTimeout>
	function openTab(index: number) {
		clearTimeout(tabTimeOut)
		if(hoveringTab != -1) {
			hoveringTab = -1
			tabTimeOut = setTimeout(() => {
				hoveringTab = index
			}, 200);
		}
		else
			hoveringTab = index
	}
</script>

<svelte:window bind:scrollY on:mousemove={mouseMove} />

{#if scrollY < 40 || mouseY < 200}
	<div 
		class="navbar bg-base-300 w-screen" 
		transition:fly={{ y: -10, duration: 500 }}
	>
		<div class="navbar-start">
			<div 
				class="flex-none lg:hidden btn btn-square btn-ghost swap swap-rotate"
				on:click={()=>openHamburgerMenu = !openHamburgerMenu}
			>
				{#if openHamburgerMenu}
					<XIcon size="20" />
				{:else}
					<MenuIcon size="20" />
				{/if}
			</div>
			<a rel="prefetch link-hover" href="/">
				<div class="lg:flex lg:flex-row items-center gap-4">
					<img class="w-20 aspect-square" src={DatabaseLogo} alt="logo" />
					<div class="hidden lg:flex lg:flex-row items-center gap-4">
						<div class="flex flex-col">
							<div class="text-secondary text-sm">{$_('navbar.title.tbg')}</div>
							<div class="text-primary text-2xl">{$_('navbar.title.db')}</div>
						</div>
					</div>
				</div>
			</a>
		</div>
		<div class="navbar-center hidden lg:flex gap-4">
			{#each menuTitles as title, idx}
				<div 
					class="flex flex-row items-center hover:{hoverColors[idx]}  hover:{menuColors[idx]}"
					on:mouseover={()=>openTab(idx)}
					on:focus={()=> hoveringTab = hoveringTab}
				>
					{$_(`keyword.${title}`)}
					<ChevronDownIcon size="20" />
				</div>
			{/each}
		</div>
		<div class="navbar-center flex lg:hidden gap-4">
			<div class="btn" on:click={()=>openSearchModal=true}>
				<div><SearchIcon size="20" /></div>
			</div>
		</div>
		<!-- Right side: language, theme, search, profile-->
		<div class="navbar-end flex flex-row items-center place-items-center gap-4 px-4">
			<div class="hidden lg:flex lg:flex-row place-items-center">
				{#if !$isLoading}
					<select class="select select-md max-w-xs" bind:value={$locale}>
						{#each $locales as l}
							<option value={l} selected>{languageName[l]}</option>
						{/each}
					</select>
				{/if}
				<ToggleTheme />
				<div class="btn place-items-center" on:click={()=>openSearchModal=true}>
					<div><SearchIcon size="20" /></div>
				</div>
			</div>

			<div>
				{#if $user}
					<div class="dropdown dropdown-hover dropdown-end">
						<!-- svelte-ignore a11y-label-has-associated-control -->
						<label tabindex="0">
							{#await avatar}
								loading
							{:then avatar}
								<div class="avatar">
									<div
										class="w-12 h-12 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2"
									>
										<img src={avatar} alt="user avatar" />
									</div>
								</div>
							{/await}
						</label>
						<ul tabindex="0" class="p-2 shadow menu dropdown-content w-52 bg-info">
							<li><a href="/profile">{$_('auth.profile')}</a></li>
							<li><a on:click={signOut} href="/">{$_('auth.sign_out')}</a></li>
						</ul>
					</div>
				{:else}
					<a rel="prefetch btn" href="/auth" title="Sign In">
						<UserIcon size="20" />
					</a>
				{/if}
			</div>
		</div>
	</div>
	<!--area for dropdown menus-->
	{#if hoveringTab > -1}
		<div in:fly={{ y: -10, duration: 500 }}>
			{#each menus as menu, idx}
				{#if hoveringTab === idx}
					<div 
						class="flex flex-row gap-2 py-2 justify-center place-items-center w-screen bg-opacity-90 {menuColors[idx]}" 
						on:mouseleave={()=>hoveringTab=-1}
					>
						{#each menu as option}
							<a href="/{option}">
								<RoleButton role={option}/>
							</a>
						{/each}
					</div>
				{/if}
			{/each}
			{#if hoveringTab === 4}
				<div 
					class="flex flex-row gap-2 py-2 justify-center place-items-center w-screen bg-warning" 
					on:mouseleave={()=>hoveringTab=-1}
				>
					<a href="/create" target="_blank">
						<RoleButton role={"role"} text={"all"} icon={"add"}/>
					</a>
					{#each contributeMenu as option}
						<a href="/create/{option}" target="_blank">
							<RoleButton role={option} icon={"add"}/>
						</a>
					{/each}
				</div>
			{/if}
		</div>
	{/if}
	{#if openHamburgerMenu}
		<div 
			class="lg:hidden navbar flex flex-col justify-center bg-base-300 w-screen"
			transition:fly={{ y: -10, duration: 1000 }}
		>
			<div class="place-items-center">
				<SearchNavigation/>
			</div>
			<div class="flex flex-row">
				<ToggleTheme/>
				<div>
					{#if !$isLoading}
						<select class="select select-md max-w-xs" bind:value={$locale}>
							{#each $locales as l}
								<option value={l} selected>{languageName[l]}</option>
							{/each}
						</select>
					{/if}
				</div>
			</div>
			<div class="btn btn-block" on:click={()=>openHamburgerMenu = false}>
				<ChevronUpIcon size="20"/>
			</div>
		</div>
	{/if}
{:else}
	<div
		class="btn btn-secondary fixed right-0 bottom-0 m-4 rounded-full z-10 hover:-translate-y-2 duration-200"
		on:click|preventDefault={scrollTop}
	>
		<div class="tooltip" data-tip="top">
			<ChevronUpIcon size="15" />
		</div>
	</div>
{/if}

<div
	class="btn btn-accent fixed left-0 bottom-0 m-4 rounded-full z-10 hover:-translate-y-2 duration-200"
	on:click|preventDefault={()=>openReportModal = true}
>
	<div class="tooltip" data-tip="feedback">
		<AlertOctagonIcon size="15" />
	</div>
</div>

<!--report modal -->
<input type="checkbox" id="report-modal" class="modal-toggle"/>
<div class="modal modal-bottom sm:modal-middle" class:modal-open={openReportModal}>
	<div class="modal-box">
		<h1>Report / Suggestion</h1>
		<h2>URL</h2>
		{$page.url}
		<h2>Message</h2>
		<textarea class="textarea bg-base-300 w-full" placeholder="Tell us!" bind:value={reportString}></textarea>
		<div class="modal-action">
			<div class="btn" on:click={closeReport}>Cancel</div>
			<div class="btn btn-secondary" on:click={handleReport} class:loading={isReporting}>Send</div>
		</div>
	</div>
</div>

<!--search modal -->
<input type="checkbox" id="search-modal" class="modal-toggle"/>
<div class="modal modal-bottom sm:modal-middle" class:modal-open={openSearchModal}>
	<div class="modal-box">
		<div class="flex flex-row justify-between items-center">
			<div><h1>Search</h1></div>
			<div class="btn btn-secondary btn-sm" on:click={closeSearch}>X</div>
		</div>
		<SearchGlobal/>
		<div class="modal-action">
			<div class="btn btn-secondary" on:click={closeSearch}>Close</div>
		</div>
	</div>
</div>
