<script lang="ts" context="module">
	export async function load({ params, fetch }) {
		const res = await fetch(`/api/honor/${params.id}`);
		if (!res.ok) return { status: 404, message: 'not found' };

		const data = await res.json();
		const resRelation = await fetch(`/api/honor/${params.id}/boardgame`);

		if (!resRelation.ok) return { status: 404, message: 'not found' };
		const dataRelation = await resRelation.json();
		return {
			props: {
				honorData: data,
				honorRelation: dataRelation
			}
		};
	}
</script>

<script lang="ts">
	import Seo from '$lib/components/SEO.svelte';
	import { getImageURL, getDefaultImageURL } from '$lib/supabase';
	import type { Honor } from '$lib/datatypes';
	import { user } from '$lib/user';
	import { _ } from 'svelte-i18n';

	export let honorData: Honor;
	export let honorRelation;

	const honorCategories = [
		...new Set(honorRelation.map((h) => h.Honor_Relation[0].Honor_category))
	];
	honorRelation = honorRelation.sort(
		(a, b) => a.Honor_Relation[0].Honor_order - b.Honor_Relation[0].Honor_order
	);
</script>

<Seo title="Honor" />
<div class="flex flex-row">
	<div class="flex flex-col w-full lg:w-1/4 text-left m-4">
		<img
			src={getImageURL('honor', honorData.Honor_picture)}
			alt="image of {honorData.Honor_name}"
			class="w-72 h-72 mask mask-circle object-contain hover:scale-105"
			on:error|once={(ev) => (ev.target.src = getDefaultImageURL('honor'))}
		/>
		<h1>{honorData.Honor_name}</h1>
		<h2>{honorData.Honor_name_th ? '(' + honorData.Honor_name_th + ')' : ''}</h2>
		{#if honorData.Honor_link}
			<a href={honorData.Honor_link} target="_blank">{honorData.Honor_link}</a>
		{:else}
			N/A
		{/if}
		<h2>Description</h2>
		<p>{@html honorData.Honor_description || $_('incomplete')}</p>
		<div class="divider" />
		<!-- social share-->
		{#if user}
			<button class="btn">Suggest edit</button>
		{/if}
	</div>
	<div class="text-left w-full lg:w-3/4">
		<h2>Winners</h2>
		{#each honorCategories as hc}
			{hc ? 'Category: ' + hc : ''}
			<div class="overflow-x-auto">
				<table class="table table-zebra">
					<!-- head -->
					<thead>
						<tr>
							<th>Award</th>
							<th>Game</th>
						</tr>
					</thead>
					<tbody>
						{#each honorRelation as h}
							<tr>
								{#if h.Honor_Relation[0].Honor_category === hc}
									<td>{h.Honor_Relation[0].Honor_position}</td>
									<td>
										{#if h.TBG_ID}
											<a href="/boardgame/{h.TBG_ID}">{h.TBG_name}</a>
										{:else}
											{h.TBG_name}
										{/if}
									</td>
								{/if}
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		{/each}
	</div>
</div>
