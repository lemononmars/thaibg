<script lang=ts context=module>
	export async function load({ params, url, fetch }) {
		const res = await fetch(`/api/content`);
		if (!res.ok)
			return {
				status: 404,
				body: { message: 'no contents to load' }
			};

		const data = await res.json();
		return {
			props: {
				contents: data,
				search: url.searchParams.get('name')
			}
		};
	}
</script>

<script lang="ts">
	import Seo from '$lib/components/SEO.svelte';
	import Spinner from '$lib/components/Spinner.svelte';
	import { ChevronUpIcon, ChevronDownIcon } from 'svelte-feather-icons';
	import { fly } from 'svelte/transition';
	import { quintOut } from 'svelte/easing';
	import { _ } from 'svelte-i18n';
	import DataView from '$lib/components/DataView.svelte';
	import Searchbar from '$lib/components/SearchBar.svelte';
	import { ContentTypeArray, ContentMediaArray } from '$lib/datatypes';
	import type { Content } from '$lib/datatypes';

	export let contents: Content[];
	export let search: string;
	let optionType: number = 0;
	let optionMedia: number = 0;
	let ContentTypeFilter = ['all', ...ContentTypeArray];
	let ContentMediaFilter = ['all', ...ContentMediaArray];

	$: contentsFiltered = contents.filter(
		(c) =>
			(optionType == 0 || c.Content_type?.toLowerCase() === ContentTypeFilter[optionType]) &&
			(optionMedia == 0 || c.Content_media?.toLowerCase() === ContentMediaFilter[optionMedia]) &&
			(searchString === '' ||
				c.Content_name?.toLowerCase().includes(searchString.toLowerCase()) || // name or name_th contains the string
				c.Content_name?.includes(searchString))
	);

	let sorted = 0;
	let searchString = search || '';
	$: contentsSorted = contentsFiltered.sort((a, b) => compare(sorted, a, b));

	// TODO: allow advanced search settings
	function compare(s: number, a: Content, b: Content) {
		if (s == 0) return b.Content_name?.localeCompare(a.Content_name);
		else return a.Content_name?.localeCompare(b.Content_name);
	}

	let showAdvancedFilter = false;

	function resetSearch() {
		optionType = 0;
		optionMedia = 0;
		searchString = '';
	}

	const tableInfo = {
		headers: ['Type', 'Media'],
		body: ['Content_type', 'Content_media']
	};
</script>

<Seo title="Content" />
<div class="flex flex-col justify-center items-center relative mx-auto">
	<DataView data={contentsSorted} type="content" {tableInfo}>
		<!-- Search box -->
		<div class="flex flex-row items-center gap-4">
			<Searchbar placeholder="Search board game (en/th)" bind:searchString />
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
				<div class="flex flex-col gap-1">
					<div class="flex flex-row items-center gap-2">
						<h3>Type</h3>
						<div class="btn-group">
							{#each ContentTypeFilter as _, idx}
								<div
									class="btn btn-xs"
									class:btn-active={idx == optionType}
									on:click={() => (optionType = idx)}
								>
									{ContentTypeFilter[idx]}
								</div>
							{/each}
						</div>
					</div>
					<div class="flex flex-row items-center gap-2">
						<h3>Media</h3>
						<div class="btn-group">
							{#each ContentMediaFilter as _, idx}
								<div
									class="btn btn-xs"
									class:btn-active={idx == optionMedia}
									on:click={() => (optionMedia = idx)}
								>
									{ContentMediaFilter[idx]}
								</div>
							{/each}
						</div>
					</div>
				</div>
			</div>
		{/if}
	</DataView>
	{#if contentsSorted?.length == 0}
		<div>
			Try <div class="btn btn-outline" on:click={resetSearch}>resetting</div>
			 your search query.
		</div>
	{/if}
</div>
