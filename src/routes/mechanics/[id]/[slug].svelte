<script lang="ts" context="module">
	export async function load({ params }) {
		const res = await fetch(`/api/mechanics/${params.id}`)
		const data = await res.json()
		return {
			props: {
				mechanicsData: res.ok? data : null
			}
		};
	}

	export async function getBoardgames(id: number){
		const res = await fetch(`/api/mechanics/${id}/boardgame`)
		const data = await res.json()
		
		if(res.ok)
			return data[0]
		else
			return []
	}
</script>

<script lang="ts">
	import Seo from '$lib/components/SEO.svelte';
	import Spinner from '$lib/components/Spinner.svelte';
	import { onMount } from 'svelte';
	import BoardgameCard from '$lib/components/BoardgameCard.svelte';
	import { getImageURL, getDefaultImageURL } from '$lib/supabase';
	import type {Mechanics, Boardgame} from '$lib/datatypes'
	import {_} from 'svelte-i18n'

	export let mechanicsData: Mechanics;
	let promiseBoardgame: Promise<Boardgame[]>
	onMount(async () => {
		promiseBoardgame = getBoardgames(mechanicsData?.Mech_ID)
	});
</script>

<Seo title="Mechanics" />
<div class="flex flex-col justify-center items-center relative">
	<div class="w-full text-left m-4 flex flex-col">
		<div class="flex flex-col lg:flex-row lg:gap-4 w-full p-8 border-2 shadow-lg rounded-xl">
			<img
				src={getImageURL('mechanics', mechanicsData.Mech_picture)}
				alt="image of {mechanicsData.Mech_name}"
				class="w-72 aspect-auto"
				on:error|once={(ev) => (ev.target.src = getDefaultImageURL('mechanics'))}
			/>
			<div>
				<h1>{mechanicsData.Mech_name}</h1>
				<div>
					<h2>Category</h2>
					<p>{$_(`mechanics.${mechanicsData.Mech_category}`)}</p>
				</div>
				<div>
					<h2>Description</h2>
					<p>{@html mechanicsData.Mech_description || $_('incomplete')}</p>
				</div>
				<div>
					<h2>Link</h2>
					{#if mechanicsData.Mech_link}
						<a href={mechanicsData.Mech_link} target="_blank">{mechanicsData.Mech_link}</a>
					{:else}
						{$_('incomplete')}
					{/if}
				</div>
			</div>
		</div>
		<h2>Board games with this mechanics</h2>
		{#await promiseBoardgame}
			<Spinner/>
		{:then res}
			{#if res}
				<div class="w-full text-center mb-4 grid grid-cols-2 lg:grid-cols-4 gap-4">
					{#each res as bg}
						<BoardgameCard {bg} />
					{/each}
				</div>
			{:else}
				{$_('incomplete')}
			{/if}
		{:catch error}
			{error}
		{/await}
	</div>
</div>
