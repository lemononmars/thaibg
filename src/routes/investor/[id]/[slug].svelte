<script lang="ts" context="module">
	import { from } from '$lib/supabase';

	export async function load({ session, params, fetch }) {
		const { user } = session;
		const res = await fetch(`/api/investor/${params.id}`);
		if (!res.ok) return { status: 404 };

		const data = await res.json();
		return {
			props: {
				user,
				investorData: data || null
			}
		};
	}

	export async function getBoardgames(ID: number) {
		const res = await fetch(`/api/investor/${ID}/boardgame`);
		if (!res.ok) return { status: 404, error: 'no board game found' };

		const data = res.json();
		return data;
	}
</script>

<script lang="ts">
	import Seo from '$lib/components/SEO.svelte';
	import Spinner from '$lib/components/Spinner.svelte';
	import { onMount } from 'svelte';
	import BoardgameCard from '$lib/components/BoardgameCard.svelte';
	import { getImageURL, getDefaultImageURL } from '$lib/supabase';

	export let user, investorData;
	let promiseBoardgame;
	onMount(async () => {
		promiseBoardgame = await getBoardgames(investorData.Investor_ID);
	});
</script>

<Seo title="investor" />
<div class="flex flex-col justify-center items-center relative">
	<div class="w-full text-left m-4 flex flex-col">
		{#if !investorData}
			Invalid investor ID!
		{:else}
			<div class="flex flex-col lg:flex-row lg:gap-4 w-full p-8 border-2 shadow-lg rounded-xl">
				<img
					src={investorData.Investor_thumbnail_url}
					alt="image of {investorData.Investor_name}"
					class="w-72 mask mask-hexagon-2"
				/>
				<div>
					<h1>{investorData.Investor_name}</h1>
					<h2>{investorData.Investor_name_th ? '(' + investorData.Investor_name_th + ')' : ''}</h2>
					<ul>
						<li>
							Official link:
							{#if investorData.Investor_link}
								<a href={investorData.Investor_link} target="_blank">{investorData.Investor_link}</a
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
				<p>{@html investorData.Investor_description || 'N/A'}</p>
			</div>
			<div class="divider" />
			{#await promiseBoardgame}
				<Spinner />
			{:then res}
				{#if res}
					<h2>Boardgames invested by {investorData.Investor_name}</h2>
					<div class="w-full text-center mb-4 grid grid-cols-2 lg:grid-cols-4 gap-4">
						{#each res as bg}
							<BoardgameCard {bg} />
						{:else}
							N/A
						{/each}
					</div>
				{/if}
			{/await}
		{/if}
		{#if user && !user.guest}
			<button class="btn">Suggest edit</button>
		{/if}
	</div>
</div>
