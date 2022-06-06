<script lang=ts context=module>

	export async function load({ fetch }) {
		const res = await fetch('/api/mechanics')
      const data = await res.json()
		return {
			props: {
				data
			}
		};
	}
</script>

<script lang="ts">
	import Seo from '$lib/components/SEO.svelte';
	import Spinner from '$lib/components/Spinner.svelte';
	import ListCard from '$lib/components/ListCard.svelte';
	import { MechanicsCategoriesArray } from '$lib/datatypes'
	import type { Mechanics } from '$lib/datatypes'
	import {_} from 'svelte-i18n';

	export let data: Mechanics[];
	let categorizedMechanics = MechanicsCategoriesArray.reduce((prev,curr) => 
		({
			...prev, [curr]: []
		}), 
		{}
	)
		
	const mechanics = data
		.sort((a:Mechanics,b:Mechanics) => {return a.Mech_name.localeCompare(b.Mech_name)})
		.map((m: Mechanics) => ({
			category: m.Mech_category,
			data: {
				id: m.Mech_ID,
				name: m.Mech_name,
				slug: m.Mech_slug,
				picture: m.Mech_picture,
				type: 'mechanics'
			}
		}));

	mechanics.forEach(m => {
		categorizedMechanics[m.category] = [... categorizedMechanics[m.category], m]
	})

</script>

<Seo title="Mechanics" />
<div class="flex flex-col justify-center items-center">
	<h1>{$_('keyword.mechanics')}</h1>
	<div class="flex flex-row gap-2 flex-wrap">
		{#each MechanicsCategoriesArray as cat} 
			<a href="#{cat}"><div class="btn">{$_(`mechanics.${cat}`)}</div></a>
		{/each}
	</div>
	{#each MechanicsCategoriesArray as cat} 
		<h2 id="{cat}">{$_(`mechanics.${cat}`)}</h2>
		<div class="w-full text-center mb-16 grid grid-cols-1 lg:grid-cols-3 gap-4">
			{#each categorizedMechanics[cat] as m}
				<ListCard {...m.data}/>
			{:else}
				<Spinner />
			{/each}
		</div>
	{/each}
</div>
