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
		return { contents: data.slice(-10) };
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
	import heroImage from '$lib/assets/logos/database main image.png'
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

	let bgCarousel;
	function scrollCarousel(mult: number) {
		bgCarousel.scrollLeft += boardgameCarouselWidth * mult;
	}
</script>

<Seo title="Home" />
<div class="flex flex-col lg:flex-row w-screen bg-base-200 pt-10 px-4 lg:px-60 lg:gap-10 -mt-24 justify-between">
	<div class="flex flex-col order-first lg:order-none text-center lg:justify-center w-full mt-24 lg:w-1/3">
		<h1>{$_('page.home.welcome.intro')}</h1>
		<div class="grid grid-cols-3 items-start py-4">
			<div class="flex flex-col place-items-center">
				<TBGIcons type={'boardgame'} class="w-12 aspect-square"/>
				<div class="text-2xl">{stats.boardgame}</div>
				<div><a href="/boardgame">{$_('page.home.welcome.boardgames')}</a></div>
			</div>
			<div class="flex flex-col place-items-center">
				<TBGIcons type={'person'} class="w-12 aspect-square"/>
				<div class="text-2xl">{stats.person}</div>
				<div><a href="/person">{$_('page.home.welcome.people')}</a></div>
			</div>
			<div class="flex flex-col place-items-center">
				<TBGIcons type={'organization'} class="w-12 aspect-square"/>
				<div class="text-2xl">{stats.organization}</div>
				<div><a href="/organization">{$_('keyword.organization')}</a></div>
			</div>
		</div>
		<p class="text-md text-secondary">
			{$_('page.home.welcome.text1')} <br />
			{$_('page.home.welcome.text2')}
		</p>
		<div class="flex flex-col items-center justify-center mt-4 gap-2 w-full">
			<a href="/add"><div class="btn btn-wide btn-secondary">{$_('page.home.welcome.contribute')}</div></a
			>
			<!-- <a href="/contact"><div class="btn btn-ghost btn-wide">{$_('page.home.welcome.contact')}</div></a> -->
			<a href="/recentchanges"><div class="btn btn-ghost btn-wide">{$_('page.home.welcome.recentchanges')}</div></a>
		</div>
	</div>

	<div class="order-last lg:order-none flex items-end lg:w-2/3">
		<img src={heroImage} alt="hero" class="object-contain">
	</div>
</div>

<div class="flex flex-col w-screen px-4 py-10">
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

<div class="flex flex-col lg:flex-row bg-base-300 w-screen p-4 lg:px-20">
	<div class="flex flex-col text-left">
		<h2>Media</h2>
		<h1>Hotness Contents</h1>
		<a href="./contents" alt="Content List" class="btn flex flex-row items-center"
			>see all <ChevronRightIcon size="20" /></a
		>
		<TBGIcons type={"content"} class="w-40 mx-auto"/>
	</div>
	<div class="flex-grow grid grid-cols-2 lg:grid-cols-3 gap-4 lg:p-10">
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

<div class="flex flex-col w-screen p-8">
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
			class:hidden={bgCarousel?.scrollLeft >= 9 * boardgameCarouselWidth}
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


<!-- {#await promiseBoardgames}
	<Spinner />
{:then res}
	{#if res}
	<Carousel
  particlesToShow={3}
  particlesToScroll={2}
>
		{#each res.boardgames as bg}
			<div class="snap-start flex-auto">
				<BoardgameCard {bg} />
			</div>
		{/each}
	</Carousel>
	{/if}

{/await} -->


<!-- supporters -->
<div class="flex flex-col bg-base-300 w-screen py-4 px-4 lg:px-20">
	<div>
		<h1 class="text-left my-4">Collaborators</h1>
	</div>
	<div class="flex flex-col lg:flex-row place-content-center gap-2">
		{#each Supporters as s}
			<div class="flex flex-col gap-2 justify-center mx-auto lg:mx-none">
				<div class="avatar hover:animate-bounce">
					<div class="w-60 mask mask-squircle">
						<img 
							src={s.image} 
							alt="logo">
					</div>
				</div>
				<div>
					<ContactLinks links={s.links}/>
				</div>
			</div>
		{/each}
	</div>
</div>

<!-- database creators -->
<div class="flex flex-col w-screen py-4 px-4 lg:px-20">
	<h1 class="text-left my-4">Team of Developers</h1>
	{#await promiseDevs}
		<Spinner />
	{:then res}
		{#if res}
			<div class="grid grid-cols-2 lg:grid-cols-3 justify-start mx-auto gap-4">
				{#each res.developers as d, idx}
					{@const developerRoles = ['UI Designer', 'Web Developer', 'Database Engineer']}
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
