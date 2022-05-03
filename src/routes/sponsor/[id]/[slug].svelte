<script lang="ts" context="module">
	import { from } from '$lib/supabase';

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
	import BoardgameCard from '$lib/components/BoardgameCard.svelte';
	import { getImageURL, getDefaultImageURL } from '$lib/supabase';
	import EditButton from '$lib/components/EditButton.svelte';

	export let user, sponsorData;
	let promiseBoardgame;
	onMount(async () => {
		promiseBoardgame = await getBoardgames(sponsorData.Sponsor_ID);
	});
</script>

<Seo title="sponsor" />
<div class="flex flex-col justify-center items-center relative">
	<div class="w-full text-left m-4 flex flex-col">
		{#if !sponsorData}
			Invalid sponsor ID!
		{:else}
			<div class="flex flex-col lg:flex-row lg:gap-4 w-full p-8 border-2 shadow-lg rounded-xl">
				<img
					src={getImageURL('sponsor', sponsorData.Sponsor_picture)}
					alt="image of {sponsorData.Sponsor_name}"
					class="w-72 mask mask-hexagon-2"
				/>
				<div>
					<h1>{sponsorData.Sponsor_name}</h1>
					<h2>{sponsorData.Sponsor_name_th ? '(' + sponsorData.Sponsor_name_th + ')' : ''}</h2>
					<ul>
						<li>
							Official link:
							{#if sponsorData.Sponsor_link}
								<a href={sponsorData.Sponsor_link} target="_blank">{sponsorData.Sponsor_link}</a
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
				<p>{@html sponsorData.Sponsor_description || 'N/A'}</p>
			</div>
			<div class="divider" />
			{#await promiseBoardgame}
				<Spinner />
			{:then res}
				{#if res}
					<h2>Boardgames invested by {sponsorData.Sponsor_name}</h2>
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
			<EditButton type={'sponsor'} id={sponsorData.Sponsor_ID}/>
		{/if}
	</div>
</div>
