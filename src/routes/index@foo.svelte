<script context=module lang="ts">
	export async function load({ fetch }) {
		const res = await fetch('/api/stats');
		const stats = await res.json();
		return {
			props: {
				stats
			}
		};
	}

	export async function getEvents() {
		const res = await fetch('/api/event');
		const data = await res.json();
		return { events: data.slice(-3) };
	}

	export async function getContents() {
		const res = await fetch('/api/content?select=ID,name,slug,type,media,links');
		const data = await res.json();
		return { contents: data.slice(-8) };
	}

	export async function getHotnessBoardgames() {
		const resBG = await fetch('/api/boardgame?select=ID,name,name_th,picture,slug,description');
		const dataBG = await resBG.json();
		const numBoardgames = dataBG.length;
		const NUM_BOARDGAMES_SHOWN = 10;
		let bgindex = [];

		// DEMO: take 10 random games from the list
		// TODO: use actual measure
		while (bgindex.length < NUM_BOARDGAMES_SHOWN || bgindex.length >= numBoardgames) {
			const randomIdx = Math.floor(Math.random() * numBoardgames);
			if (!bgindex.includes(randomIdx)) bgindex = [...bgindex, randomIdx];
		}
		return { boardgames: bgindex.map((idx) => dataBG[idx]) };
	}

	export async function getDevelopers() {
		// Person IDs for First, Poom and X
		let res = await from('Person').select('*').filter('Person_ID', 'in', '(8,10,11)');
		let sorted = res.data.sort((a, b) => a.Person_ID - b.Person_ID);
		return { developers: sorted };
	}
</script>

<script lang="ts">
	import Seo from '$lib/components/SEO.svelte';
	import Spinner from '$lib/components/Spinner.svelte';
	import { from } from '$lib/supabase';
	import { onMount } from 'svelte';
	import BoardgameCard from '$lib/components/BoardgameCard.svelte';
	import PersonCard from '$lib/components/PersonCard.svelte';
	import {
		ChevronRightIcon,
		ChevronLeftIcon,
	} from 'svelte-feather-icons';
	import ContentCard from '$lib/components/ContentCard.svelte';
	import EventCard from '$lib/components/EventCard.svelte';
	import { _ } from 'svelte-i18n';
	import Supporters from '$lib/assets/logos'
	import heroImage from '$lib/assets/logos/database main image.svg'
	import TBGIcons from '$lib/assets/icons/TBGIcons.svelte'
	import ContactLinks from '$lib/components/ContactLinks.svelte';

	export let stats;
	let promiseEvents, promiseContents, promiseBoardgames, promiseDevs;
	onMount(async () => {
		promiseEvents = getEvents();
		promiseContents = getContents();
		promiseBoardgames = getHotnessBoardgames();
		promiseDevs = getDevelopers();
	});
	const boardgameCarouselWidth = 600;
	const shuffleSupporters = shuffle(Supporters)

	let bgCarousel;
	function scrollCarousel(mult: number) {
		bgCarousel.scrollLeft += boardgameCarouselWidth * mult;
	}

	function shuffle(a: Array<any>) {
		let indices: number[] = a.map((_, idx: number) => idx)
		const l = indices.length
		for(var i = 0; i < l-1; i ++) {
			let index = Math.floor((l-i) * Math.random())
			let temp = indices[i]
			indices[i] = indices[l-index-1]
			indices[l-index-1] = temp
		}
		return indices.map(i=>a[i])
	}
</script>

<Seo title="Home" />
<div class="flex flex-col lg:flex-row w-screen bg-base-300 lg:pt-10 px-4 lg:px-60 justify-between">
	<div class="flex flex-col order-first lg:order-none text-center lg:justify-center w-full lg:w-1/3 place-self-center pb-4">
		<h1>{$_('page.home.welcome.intro')}</h1>
		<div class="grid grid-cols-3 items-start py-4">
			<div class="flex flex-col place-items-center">
				<TBGIcons type={'boardgame'} class="w-16 aspect-square"/>
				<div class="text-3xl">{stats.boardgame}</div>
				<div><a href="/boardgame">{$_('page.home.welcome.boardgames')}</a></div>
			</div>
			<div class="flex flex-col place-items-center">
				<TBGIcons type={'person'} class="w-16 aspect-square"/>
				<div class="text-3xl">{stats.person}</div>
				<div><a href="/person" class="text-accent">{$_('page.home.welcome.people')}</a></div>
			</div>
			<div class="flex flex-col place-items-center">
				<TBGIcons type={'organization'} class="w-16 aspect-square"/>
				<div class="text-3xl">{stats.organization}</div>
				<div ><a href="/organization" class="text-secondary">{$_('keyword.organization')}</a></div>
			</div>
		</div>
		<p class="text-md text-secondary">
			{$_('page.home.welcome.text1')} <br />
			{$_('page.home.welcome.text2')}
		</p>
		<div class="flex flex-col items-center justify-center mt-4 gap-2 w-full">
			<a href="/add"><div class="btn btn-wide btn-secondary">{$_('page.home.welcome.contribute')}</div></a>
			<a href="/recentchanges"><div class="btn btn-ghost btn-wide">{$_('page.home.welcome.recentchanges')}</div></a>
		</div>
	</div>

	<div class="order-last lg:order-none flex items-end lg:w-2/3">
		<img src={heroImage} alt="hero" >
	</div>
</div>

<div class="flex flex-col w-screen px-4 py-20">
	<h1 class="text-center">Upcoming Events</h1>
	<div class="grid grid-cols-2 lg:grid-cols-3 place-items-center">
		{#await promiseEvents}
			<Spinner />
		{:then res}
			{#if res}
				{#each res.events as event}
					<EventCard {event} />
				{:else}
					<p>No upcoming events. Stay tuned!</p>
				{/each}
			{/if}
		{/await}
	</div>
</div>

<div class="triangle-top"/>
<div class="flex flex-col lg:flex-row bg-info w-screen p-4 lg:px-20 ">
	<div class="flex flex-col text-left">
		<h2>Media</h2>
		<h1>Hotness Contents</h1>
		<a href="./content" alt="Content List" class="btn flex flex-row items-center"
			>see all <ChevronRightIcon size="20" /></a
		>
		<TBGIcons type={"content"} class="w-40 mx-auto"/>
	</div>
	<div class="flex-grow grid grid-cols-2 lg:grid-cols-4 gap-4 lg:p-10">
		{#await promiseContents}
			<Spinner />
		{:then res}
			{#if res}
				{#each res.contents as content}
					<ContentCard {content} />
				{/each}
			{/if}
		{/await}
	</div>
</div>
<div class="triangle-bottom"/>

<div class="flex flex-col w-screen lg:p-8">
	<div class="flex flex-row justify-between items-center">
		<div>
			<h1>Hotness Board Game</h1>
		</div>
		<div>
			<a href="./boardgame" alt="Thai Board Game List" class="btn flex flex-row items-center">
				see all <ChevronRightIcon size="20" />
			</a>
		</div>
	</div>
	<div class="relative">
		<div
			class="btn btn-accent absolute rounded-full left-0 top-1/2 z-10 opacity-20 hover:opacity-80"
			on:click={() => scrollCarousel(-1)}
			class:hidden={bgCarousel?.scrollLeft <= boardgameCarouselWidth}
		>
			<ChevronLeftIcon size="30" />
		</div>
		<div
			class="btn btn-accent absolute rounded-full right-0 top-1/2 z-10 opacity-20 hover:opacity-80"
			on:click={() => scrollCarousel(1)}
			class:hidden={bgCarousel?.scrollLeft >= 8 * boardgameCarouselWidth}
		>
			<ChevronRightIcon size="30" />
		</div>

		<div
			id="bg-carousel"
			class="flex flex-row flex-nowrap gap-4 p-4 overflow-x-scroll overflow-y-none snap-center scroll-smooth relative"
			bind:this={bgCarousel}
		>
			{#await promiseBoardgames}
				<Spinner />
			{:then res}
				{#if res}
					{#each res.boardgames as bg}
						<div class="snap-start flex-auto">
							<BoardgameCard {bg} />
						</div>
					{/each}
				{/if}
			{/await}
		</div>
	</div>
</div>

<!-- supporters -->
<div class="flex flex-col bg-secondary text-secondary-content w-screen py-4 px-4 lg:px-20 relative bubble">
	<h1 class="text-left my-4 text-secondary-content">Collaborators</h1>
	<div class="grid grid-rows-2 lg:grid-rows-1 grid-flow-col place-content-between gap-2">
		{#each shuffleSupporters as s}
			<div class="flex flex-col shrink gap-2 justify-center text-center mx-auto lg:mx-none w-30 lg:w-60">
				<div class="avatar hover:animate-bounce">
					<div class="mask mask-squircle">
						<img 
							src={s.image} 
							alt="logo">
					</div>
				</div>
				<div class="self-center">
					<p class="line-clamp-2 break-words">{s.name}</p>
					<ContactLinks links={s.links}/>
				</div>
			</div>
		{/each}
	</div>
</div>

<!-- database creators -->
<div class="flex flex-col w-screen py-4 px-4 lg:px-20 mt-40">
	<h1 class="text-left my-4">Team of Developers</h1>
	{#await promiseDevs}
		<Spinner />
	{:then res}
		{#if res}
			<div class="grid grid-cols-2 lg:grid-cols-3 justify-start mx-auto gap-4">
				{#each res.developers as d, idx}
					{@const developerRoles = ['UI Designer', 'Web Developer', 'Data Engineer']}
					<div>
						<PersonCard person={d}/>
						<div class="my-4">{developerRoles[idx]}</div>
					</div>
				{/each}
			</div>
		{/if}
	{/await}
</div>


<!-- <div class="relative bg-error skew-y-12 h-60 -translate-y-80 -z-10"></div>
<div class="relative bg-error h-60 -z-10 -translate-y-96"></div> -->

<style>
	.bubble::after {
		content: '';
		border-bottom-left-radius: 50% 100%;
		border-bottom-right-radius: 50% 100%;
		position: absolute;
		bottom: 0;
		left: 0;
		height: 20%;
		width: 100%;
		background-color: hsl(var(--s));
		z-index: -1;
		transform: translate(0, 100%)
	}

	.triangle-bottom {
		background-image: linear-gradient(to bottom right, hsl(var(--in)) 50%, hsl(var(--b1)) 50%);
		height: 100px;
	}

	.triangle-top {
		background-image: linear-gradient(to top left, hsl(var(--in)) 50%, hsl(var(--b1)) 50%);
		height: 100px;
	}
</style>