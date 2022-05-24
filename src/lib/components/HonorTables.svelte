<script lang="ts">
	import type { Boardgame, HonorRelation } from '$lib/datatypes';
	import {HonorPosition} from '$lib/datatypes'
	import { _ } from 'svelte-i18n';
	import {onMount} from 'svelte'
import Spinner from './Spinner.svelte';

	export let honorID: number
	let isLoading: boolean = true
	interface HonorRelationInner extends Boardgame{
		Honor_Relation: HonorRelation
	}
	
	let honorRelation: HonorRelationInner[]
	let honorCategories: string[] = []

	onMount(async()=>{
		const resRelation = await fetch(`/api/honor/${honorID}/boardgame`);
		if (!resRelation.ok) return { status: 404, message: 'not found' };

		honorRelation = await resRelation.json();
		honorRelation = honorRelation.sort(
			(a, b) => HonorPosition.indexOf(a.Honor_Relation[0].Honor_position) - HonorPosition.indexOf(b.Honor_Relation[0].Honor_position)
		);
		honorCategories = [
			...new Set(honorRelation.map((h) => h.Honor_Relation[0].Honor_category))
		];
		isLoading = false
	})
</script>

<div class="text-left w-full">
	{#if isLoading}
		<Spinner/>
	{:else}
		<h2>Winners</h2>
		{#each honorCategories as hc}
			{hc ? 'Category: ' + hc : ''}
			<div class="overflow-x-auto">
				<table class="table table-zebra">
					<!-- head -->
					<thead>
						<tr>
							<th>Position</th>
							<th>Board game</th>
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
	{/if}
</div>
