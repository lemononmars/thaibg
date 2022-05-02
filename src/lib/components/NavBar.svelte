<!-- <script lang="ts" context="module">
    export async function load({ session }) {
        const { user } = session
        return {
            props: {
                user
            }
        };
    }
</script> -->
<script lang="ts">
	import { _, locale, locales, isLoading } from 'svelte-i18n';
	import { getAvatar, getCurrUserProfile } from '$lib/user/profile';
	import { user, signOut } from '$lib/user';
	import {
		ChevronDownIcon,
		MenuIcon,
		UserIcon,
		SearchIcon,
		ChevronUpIcon
	} from 'svelte-feather-icons';
	import { URL_DICEBEAR } from '$lib/constants';
	import ToggleTheme from '$lib/components/ToggleTheme.svelte';
	import { fly } from 'svelte/transition';
	import TBGAlogo from '$lib/assets/TBGA-logo-color.png';
	import { onMount } from 'svelte';

	//export let user

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
		{ path: '/shop', title: $_('keyword.shop') },
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

	const languageName = {
		en: 'ENG',
		th: 'ไทย'
	};
	let avatar;
	onMount(async () => {
		if ($user) {
			const { data, error } = await getCurrUserProfile();
			if (!error) avatar = getAvatar(data.avatar_url);
			else avatar = URL_DICEBEAR + 'randombear' + '.svg';
		}
	});

	let scrollY: number, mouseY: number;

	function scrollTop() {
		window.scroll({ top: 0, behavior: 'smooth' });
	}

	function mouseMove(event: MouseEvent) {
		mouseY = event.clientY;
	}
</script>

<svelte:window bind:scrollY on:mousemove={mouseMove} />

{#if scrollY < 40 || mouseY < 300}
	<div class="navbar mb-2 bg-base-300 w-screen" transition:fly={{ y: -10, duration: 500 }}>
		<div class="navbar-start">
			<div class="dropdown">
				<div class="flex-none lg:hidden">
					<label for="my-nav-drawer" class="btn btn-square btn-ghost">
						<MenuIcon size="20" />
					</label>
				</div>
			</div>
			<div class="hidden lg:flex lg:flex-row items-center gap-4">
				<div>
					<img class="h-20" src={TBGAlogo} alt="logo" />
				</div>
				<div class="flex flex-col">
					<a rel="prefetch link-hover" href="/">
						<div class="text-secondary text-sm">{$_('navbar.title.tbg')}</div>
						<div class="text-primary text-2xl">{$_('navbar.title.db')}</div>
					</a>
				</div>
			</div>
		</div>
		<div class="navbar-center hidden lg:flex gap-4">
			<div class="dropdown dropdown-hover">
				<span tabindex="0" class="hover:text-warning flex flex-row items-center">
					{$_('navbar.boardgame._')}
					<ChevronDownIcon size="20" />
				</span>
				<ul tabindex="0" class="p-2 shadow menu dropdown-content w-52 bg-warning">
					{#each boardgameMenu as m}
						<li><a href={m.path} class="text-warning-content">{m.title}</a></li>
					{/each}
				</ul>
			</div>
			<div class="dropdown dropdown-hover">
				<span tabindex="0" class="hover:text-success flex flex-row items-center">
					{$_('navbar.creator._')}
					<ChevronDownIcon size="20" />
				</span>
				<ul tabindex="0" class="p-2 shadow menu dropdown-content w-52 bg-success">
					{#each creatorMenu as m}
						<li><a href={m.path} class="text-success-content">{m.title}</a></li>
					{/each}
				</ul>
			</div>
			<div class="dropdown dropdown-hover">
				<span tabindex="0" class="hover:text-error flex flex-row items-center">
					{$_('navbar.supporter._')}
					<ChevronDownIcon size="20" />
				</span>
				<ul tabindex="0" class="p-2 shadow menu dropdown-content w-52 bg-error">
					{#each supporterMenu as m}
						<li><a href={m.path} class="text-error-content">{m.title}</a></li>
					{/each}
				</ul>
			</div>
			<div class="dropdown dropdown-hover">
				<span tabindex="0" class="hover:text-warning flex flex-row items-center">
					{$_('navbar.activity._')}
					<ChevronDownIcon size="20" />
				</span>
				<ul tabindex="0" class="p-2 shadow menu dropdown-content w-52 bg-warning">
					{#each activityMenu as m}
						<li><a href={m.path} class="text-warning-content">{m.title}</a></li>
					{/each}
				</ul>
			</div>
		</div>
		<!-- Right side: language, theme, search, profile-->
		<div class="navbar-end flex flex-row items-center gap-4 px-4">
			<div>
				{#if !$isLoading}
					<select class="select select-md max-w-xs" bind:value={$locale}>
						{#each $locales as l}
							<option value={l} selected>{languageName[l]}</option>
						{/each}
					</select>
				{/if}
			</div>
			<div class="hidden lg:visible">
				<ToggleTheme />
			</div>
			<div class="dropdown dropdown-hover dropdown-end">
				<!-- svelte-ignore a11y-label-has-associated-control -->
				<label tabindex="0" class="m-1 btn"><SearchIcon size="20" /></label>
				<ul tabindex="0" class="p-2 shadow menu dropdown-content w-52">
					<input type="text" placeholder="search" class="bg-neutral text-bg-content" />
				</ul>
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
