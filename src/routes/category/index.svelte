<script lang=ts context=module>
	import type {Category} from '$lib/datatypes'
	export async function load({fetch}) {
		const res = await fetch('/api/category')
		const data = await res.json() 

		const res2 = await fetch('/api/category/relation')
		const data2 = await res2.json()

		const counts = {}
		for(const c of data2) {
			if(!counts[c.Category_ID]) counts[c.Category_ID] = 0
			counts[c.Category_ID]++
		}

		let categories = data.map((c:Category) => ({
			id: c.Category_ID,
			name: c.Category_name + ` (${counts[c.Category_ID] || 0})`,
			slug: c.Category_slug,
			picture: c.Category_picture,
			type: 'category'
		}));

		return  {
			props: {
				categories,
			}
		};
	}
</script>

<script lang="ts">
	import Seo from '$lib/components/SEO.svelte';
	import ListCard from '$lib/components/ListCard.svelte';
	import {_} from 'svelte-i18n'

	export let categories
</script>

<Seo title="Category" />
<div class="flex flex-col justify-center items-center relative">
	<h1>{$_('keyword.category')}</h1>
	<div class="w-full text-center mb-4 grid grid-cols-2 lg:grid-cols-3 lg:gap-4">
		{#each categories as ds}
			<ListCard {...ds} />
		{/each}
	</div>
</div>
