<script context=module>
	export async function load({ fetch }) {
		const res = await fetch('/api/shop');
		if (!res.ok) return { status: 404, message: 'cannot find any shop' };
		const data = await res.json();
		return {
			props: {
				shops: data
			}
		};
	}
</script>

<script lang="ts">
	import Seo from '$lib/components/SEO.svelte';
	import { ChevronDownIcon, ChevronUpIcon } from 'svelte-feather-icons';
	import Searchbar from '$lib/components/SearchBar.svelte';
	import { fly } from 'svelte/transition';
	import { quintOut } from 'svelte/easing';
	import { _ } from 'svelte-i18n';
	import DataView from '$lib/components/DataView.svelte';
	import type { Shop } from '$lib/datatypes';
	import {ShopTypeArray, ShopStatusArray} from '$lib/datatypes/organizationRoles/Shop'

	export let shops: Shop[];
	export let search: string; // from url params

	const optionShopStatus = ['all', ...ShopStatusArray];
	const optionShopType = ['all', ...ShopTypeArray]
	let optionStatusSelect: number = 0;
	let optionTypeSelect: number = 0;
	let sorted = 0;
	let searchString = search || '';

	$: shopsFiltered = shops.filter(
		(s) =>
			(optionTypeSelect == 0 || s.Shop_type?.includes(optionShopType[optionTypeSelect])) &&
			(optionStatusSelect == 0 || s.Shop_status === optionShopStatus[optionStatusSelect]) &&
			(searchString === '' ||
				s.Shop_name?.toLowerCase().includes(searchString.toLowerCase())
			)
	);
	$: shopsSorted = shopsFiltered.sort((a, b) => compare(sorted, a, b));

	function compare(s: number, a: Shop, b: Shop) {
		if (s == 0) return a.Shop_name?.localeCompare(b.Shop_name);
		else return b.Shop_name?.localeCompare(a.Shop_name);
	}

	let showAdvancedFilter = false;

	function resetSearch() {
		optionStatusSelect = 0
		optionTypeSelect = 0
		searchString = '';
	}

	const tableInfo = {
		headers: ['Status', 'Province', 'Type'],
		body: ['Shop_status', 'Shop_province', 'Shop_type']
	};
</script>

<Seo title="Shop" />
<div class="flex flex-col justify-center mx-auto">
	<DataView data={shopsSorted} type="shop" {tableInfo}>
		<!-- Search box -->
		<div class="flex flex-row items-center gap-4">
			<Searchbar placeholder="Search shop (en/th)" bind:searchString />
			<div class="btn gap-2" on:click={() => (showAdvancedFilter = !showAdvancedFilter)}>
				Advanced Filter
				{#if showAdvancedFilter}
					<ChevronUpIcon size="1x" />
				{:else}
					<ChevronDownIcon size="1x" />
				{/if}
			</div>
		</div>
		<!-- Advanced filter (hidden by default) -->
		{#if showAdvancedFilter}
			<div transition:fly={{ duration: 400, y: -20, easing: quintOut }} class="m-2">
				<div class="flex flex-row items-center gap-2">
					<div class="flex flex-col justify-center">
						<h3>status</h3>
						<div class="btn-group">
							{#each optionShopStatus as status, idx}
								<div
									class="btn btn-xs"
									class:btn-active={idx == optionStatusSelect}
									on:click={() => (optionStatusSelect = idx)}
								>
									{status}
								</div>
							{/each}
						</div>
					</div>
					<div class="flex flex-col justify-center">
						<h3>type</h3>
						<div class="btn-group">
							{#each optionShopType as type, idx}
								<div
									class="btn btn-xs"
									class:btn-active={idx == optionTypeSelect}
									on:click={() => (optionTypeSelect = idx)}
								>
									{type}
								</div>
							{/each}
						</div>
					</div>
				</div>
			</div>
		{/if}
	</DataView>

	{#if shopsSorted?.length == 0}
		<div>
			No result. Try <div class="btn btn-outline" on:click={resetSearch}>resetting</div>
			 your search query.
		</div>
	{/if}
</div>
