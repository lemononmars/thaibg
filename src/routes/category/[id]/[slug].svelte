<script lang="ts" context="module">
	import { from } from '$lib/supabase';

	export async function load({ session, params }) {
		const { user } = session;
		const { data, error } = await from('Category').select('*').eq('Category_ID', params.id);
		if (error) {
		}
		return {
			props: {
				user,
				catData: data[0] || null
			}
		};
	}

	export async function getBoardgames(id) {
		const { data, error } = await from('Boardgame')
			.select('*, Category_Relation!inner(*)')
			.eq('Category_Relation.Category_ID', id);

		return data;
	}
</script>

<script lang="ts">
	import Seo from '$lib/components/SEO.svelte';
	import Spinner from '$lib/components/Spinner.svelte';
	import BoardgameCard from '$lib/components/BoardgameCard.svelte';
	import { getImageURL, getDefaultImageURL } from '$lib/supabase';
	import { onMount } from 'svelte';

	export let user, catData;
	let promiseBoardgames;
	onMount(async () => {
		promiseBoardgames = getBoardgames(catData.Category_ID);
	});
</script>

<Seo title="Category" />
<div class="flex flex-col justify-center items-center relative">
	<div class="w-full text-left m-4 flex flex-col">
		{#if !catData}
			Invalid cateogry ID!
		{:else}
			<div class="flex flex-col lg:flex-row lg:gap-4 w-full p-8 border-2 shadow-lg rounded-xl">
				<img
					src={getImageURL('category', catData.Category_picture)}
					alt="image of {catData.Category_name}"
					class="w-72 mask mask-hexagon-2"
					on:error|once={(ev) => (ev.target.src = getDefaultImageURL('category'))}
				/>
				<div>
					<h1>{catData.Category_name}</h1>
					<h2>{catData.Category_name_th ? '(' + catData.Category_name_th + ')' : ''}</h2>
					<ul>
						<li>
							BGG link:
							{#if catData.Category_link}
								<a href={catData.Category_link} target="_blank">{catData.Category_link}</a>
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
				<p>{@html catData.Category_description}</p>
			</div>
			<div class="divider" />
			<h2>Boardgames in this category</h2>
			<div class="w-full text-center mb-4 grid grid-cols-2 lg:grid-cols-4 gap-4">
				{#await promiseBoardgames}
					<Spinner />
				{:then boardgames}
					{#if boardgames}
						{#each boardgames as bg}
							<BoardgameCard {bg} />
						{:else}
							None
						{/each}
					{/if}
				{/await}
			</div>
		{/if}
		{#if user && !user.guest}
			<button class="btn">Suggest edit</button>
		{/if}
	</div>
</div>
