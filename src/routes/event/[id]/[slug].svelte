<script lang="ts" context="module">
	export async function load({ params, fetch }) {
		const res = await fetch(`/api/event/${params.id}`);
		if (!res.ok) return { status: 404, message: 'not found' };
		const data = await res.json();
		return {
			props: {
				eventData: data
			}
		};
	}

	export async function getBoardgames(EventID: number) {
		const res = await fetch(`/api/event/${EventID}/boardgame`);
		if (!res.ok) return { status: 404, message: 'not found' };
		const data = await res.json();
		return data;
	}
</script>

<script lang="ts">
	import Seo from '$lib/components/SEO.svelte';
	import Spinner from '$lib/components/Spinner.svelte';
	import BoardgameCard from '$lib/components/BoardgameCard.svelte';
	import { getImageURL, getDefaultImageURL } from '$lib/supabase';
	import type { Event, Boardgame } from '$lib/datatypes';
	import { user } from '$lib/user';
	import { onMount } from 'svelte';
	import EditButton from '$lib/components/EditButton.svelte';
	import { _ } from 'svelte-i18n';

	export let eventData: Event;

	let promiseBoardgames: Promise<Boardgame[]>;
	onMount(async () => {
		promiseBoardgames = getBoardgames(eventData.Event_ID);
	});
</script>

<Seo title="Event" />
<div class="flex flex-col lg:flex-row justify-center mt-4">
	<div class="flex flex-col w-full lg:w-1/4 text-left p-4">
		<img
			src={getImageURL('event', eventData.Event_picture)}
			alt="image of {eventData.Event_name}"
			class="w-72 mask mask-circle"
			on:error|once={(ev) => (ev.target.src = getDefaultImageURL('event'))}
		/>
		<div>
			<h1>{eventData.Event_name}</h1>
			<h2>Period</h2>
			<p>{eventData.Event_time_start || ''} - {eventData.Event_time_end || ''}</p>
			<h2>Location</h2>
			<p>{eventData.Event_location || $_('incomplete')}</p>
			<h2>Link</h2>
			{#if eventData.Event_link}
				<a href={eventData.Event_link} target="_blank">{eventData.Event_link}</a>
			{:else}
				{$_('incomplete')}
			{/if}
			<h2>Organizer</h2>
			<p>{eventData.Event_organizer || $_('incomplete')}</p>
			<h2>Description</h2>
			<p>{@html eventData.Event_description || $_('incomplete')}</p>
		</div>
		{#if user}
			<EditButton type={'event'} id={eventData.Event_ID}/>
		{/if}
	</div>
	<div class="text-center w-full lg:w-3/4">
		{#await promiseBoardgames}
			<Spinner />
		{:then boardgames}
			{#if boardgames}
				<h2>Board games available at this event</h2>
				<div class="grid grid-cols-2 lg:grid-cols-3 gap-1 lg:gap-4">
					{#each boardgames as bg}
						<BoardgameCard {bg} />
					{:else}
						None
					{/each}
				</div>
			{/if}
		{/await}
	</div>
</div>
