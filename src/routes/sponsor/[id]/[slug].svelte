<script lang="ts" context="module">
	export async function load({ session, params, fetch }) {
		const { user } = session;
		const res = await fetch(`/api/sponsor/${params.id}`);
		if (!res.ok) return { status: 404 };

		const data = await res.json();
		return {
			props: {
				user,
				sponsorData: data || null
			}
		};
	}

	export async function getBoardgames(ID: number) {
		const res = await fetch(`/api/sponsor/${ID}/boardgame`);
		if (!res.ok) return { status: 404, error: 'no board game found' };

		const data = res.json();
		return data;
	}
</script>

<script lang="ts">
	import Seo from '$lib/components/SEO.svelte';
	import Spinner from '$lib/components/Spinner.svelte';
	import { onMount } from 'svelte';
	import type { Sponsor, Boardgame } from '$lib/datatypes';
	import BoardgameCard from '$lib/components/BoardgameCard.svelte';
	import { getImageURL, getDefaultImageURL } from '$lib/supabase';
	import EditButton from '$lib/components/EditButton.svelte';
	import { _ } from 'svelte-i18n';

	export let sponsorData: Sponsor;
	let boardgameData: Promise<Boardgame[]>;
	onMount(async () => {
		boardgameData = getBoardgames(sponsorData.Sponsor_ID);
	});
</script>

<Seo title="sponsor" />
<div class="flex flex-row justify-center mt-4">
	<div class="flex flex-col w-full lg:w-1/4 text-left m-4">
		<img
			src={getImageURL('sponsor', sponsorData.Sponsor_picture)}
			alt="image of {sponsorData.Sponsor_name}"
			class="w-72 mask mask-circle-2"
			on:error|once={(ev) => (ev.target.src = getDefaultImageURL('sponsor'))}
		/>
		<div>
			<h1>{sponsorData.Sponsor_name || 'No title'}</h1>
			<div>
				<h2>Description</h2>
				<p>{@html sponsorData.Sponsor_description || 'N/A'}</p>
			</div>
			<div>
				{#if sponsorData.Sponsor_link}
					<h2>Official link:</h2>
					<a href={sponsorData.Sponsor_link} target="_blank">{sponsorData.Sponsor_link}</a
					>
				{/if}
			</div>
			<EditButton type="sponsor" id={sponsorData.Sponsor_ID}/>
		</div>
		</div>
		<!-- <div>{likes.length}</div> -->

		<div class="text-left w-full lg:w-3/4">
			<h2>Sponsoring</h2>
			{#await boardgameData}
				<Spinner />
			{:then boardgames}
				{#if boardgames}
					<div class="grid grid-cols-2 lg:grid-cols-3 gap-4">
						{#each boardgames as bg}
							<BoardgameCard {bg} />
						{:else}
							{$_('incomplete')}
						{/each}
					</div>
				{/if}
			{/await}
		</div>
</div>
