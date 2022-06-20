<script lang=ts context=module>
	import type {Type} from '$lib/datatypes'

	export async function load({fetch}) {
		const res = await fetch('/api/type')
		const data = await res.json()

		const res2 = await fetch('/api/type/relation')
		const data2 = await res2.json()

		const counts = {}
		for(const t of data2) {
			if(!counts[t.Type_ID]) counts[t.Type_ID] = 0
			counts[t.Type_ID]++
		}

		let types = data.map((t:Type) => ({
			id: t.Type_ID,
			name: t.Type_name + ` (${counts[t.Type_ID] || 0})`,
			slug: t.Type_slug,
			type: 'category'
		}));

		return  {
			props: {
				types,
			}
		};
	}
</script>

<script lang="ts">
	import Seo from '$lib/components/SEO.svelte';
	import ListCard from '$lib/components/ListCard.svelte';
	import {_} from 'svelte-i18n'

	export let types = [];
</script>

<Seo title="Type" />
<div class="flex flex-col justify-center items-center relative">
	<h1>{$_('keyword.type')}</h1>
	<div class="w-full text-center mb-4 grid grid-cols-2 lg:grid-cols-3 gap-4">
		{#each types as ds}
			<ListCard {...ds} />
		{/each}
	</div>
</div>
