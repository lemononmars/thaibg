<script lang="ts" context="module">
	export async function load({ params, fetch }) {
		const res = await fetch(`/api/manufacturer/${params.id}`);
		if (!res.ok) return { status: 404, message: 'not found' };
		const data = await res.json();

		return {
			props: {
				manufacturerData: data
			}
		};
	}

	export async function getBoardgames(ID: number) {
		const res = await fetch(`/api/manufacturer/${ID}/boardgame`);
		if (!res.ok) return [];

		const data = await res.json();
		return data;
	}
</script>

<script lang="ts">
	import Seo from '$lib/components/SEO.svelte';
	import Spinner from '$lib/components/Spinner.svelte';
	import { onMount } from 'svelte';
	import BoardgameCard from '$lib/components/BoardgameCard.svelte';
	import { getImageURL } from '$lib/supabase';

	export let manufacturerData;
	let promiseBoardgames: Promise<any>;

	onMount(async () => {
		promiseBoardgames = getBoardgames(manufacturerData.Manufacturer_ID);
	});
</script>

<Seo title="Printing" />
<div class="flex flex-col justify-center items-center relative">
	<div class="w-full text-left m-4 flex flex-col">
		<div class="flex flex-col lg:flex-row lg:gap-4 w-full p-8 border-2 shadow-lg rounded-xl">
			<img
				src={getImageURL('manufacturer', manufacturerData.Manufacturer_picture)}
				alt="image of {manufacturerData.Manufacturer_name}"
				class="w-72 mask mask-circle"
			/>
			<div>
				<h1>{manufacturerData.Manufacturer_name}</h1>
				<ul>
					<li>Location: {manufacturerData.Manufacturer_location || 'N/A'}</li>
					<li>
						Official link:
						{#if manufacturerData.Manufacturer_link}
							<a href={manufacturerData.Manufacturer_link} target="_blank"
								>{manufacturerData.Manufacturer_link}</a
							>
						{:else}
							N/A
						{/if}
					</li>
				</ul>
			</div>
		</div>
		<!-- <div>{likes.length}</div> -->
		<div>
			<h2>Description</h2>
			<p>{@html manufacturerData.Manufacturer_description}</p>
		</div>
		<div class="divider" />
		<h2>Manufactures for the following board games</h2>
		<div class="w-full text-center mb-4 grid grid-cols-2 lg:grid-cols-4 gap-4">
			{#await promiseBoardgames}
				<Spinner />
			{:then boardgames}
				{#if boardgames}
					{#each boardgames || [] as bg}
						<BoardgameCard {bg} />
					{:else}
						No board games
					{/each}
				{/if}
			{/await}
		</div>
	</div>
</div>
