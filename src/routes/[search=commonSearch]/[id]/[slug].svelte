<script lang="ts" context="module">
	import { getImageURL, getDefaultImageURL, getVarPrefix } from '$lib/supabase';

	export async function load({ params, fetch }) {
		const {id, search: type} = params
		const res = await fetch(`/api/${type}/${id}`);
		if (!res.ok) 
			return { 
				status: 404, 
				message: `${type} with ID ${id} does not exist.` 
			};

		const data = await res.json();
		return {
			props: {
				pageData: data,
				pageID: id,
				pageType: type
			}
		};
	}

	export async function getRelations(pageType: string, relationType: string, id: number) {
		const res = await fetch(`/api/${pageType}/${id}/${relationType}`);
		if (!res.ok)
			return { 
				status: 404, 
				message: `cannot find any ${relationType} associated with that ${pageType}`
			};
		let data = await res.json();
		return data;
	}
</script>

<script lang="ts">
	import Seo from '$lib/components/SEO.svelte';
	import Spinner from '$lib/components/Spinner.svelte';
	// import BoardgameCard from '$lib/components/BoardgameCard.svelte';
	// import OrganizationCard from '$lib/components/OrganizationCard.svelte';
	// import ContentCard from '$lib/components/ContentCard.svelte';
	import HonorTables from '$lib/components/HonorTables.svelte';
	import Social from '$lib/components/Social.svelte';
	import { LinkIcon} from 'svelte-feather-icons';
	import { onMount } from 'svelte';
	import type { TypeName } from '$lib/datatypes';
	import {getSubmissionPackage} from '$lib/datatypes'
	import {_} from 'svelte-i18n'
	import EditButton from '$lib/components/EditButton.svelte';
	import DataViewer from '$lib/components/DataViewer.svelte';
import ContactLinks from '$lib/components/ContactLinks.svelte';

	export let pageData, pageID: number, pageType: TypeName;
	let prefix = getVarPrefix(pageType)
	const nonKeys = ['picture', 'slug', 'show', 'name', 'link'] // move link to the bottom of the page
	const keys = getSubmissionPackage(pageType).keys.filter(k => 
		nonKeys.every(
			kk => !k.includes(kk)
		)
	)
	
	let relations: TypeName[]
	if(pageType === 'contentcreator')
		relations = ['content']
	else if(pageType === 'content')
		relations = ['boardgame', 'contentcreator']
	else if(pageType === 'honor')
		relations = []	// use HonorTables component instead
	else
		relations = ['boardgame']
	
	let promiseRelations: Record<string, Promise<any[]>> = {}
	relations.forEach((r) => promiseRelations[r] = null)

	onMount(async () => {
		for(const r in promiseRelations)
			promiseRelations[r] = getRelations(pageType, r, pageID)
	});

	let youtubeID: string;
	if((pageType === 'content') && pageData.Content_link?.includes('youtube'))
		youtubeID = pageData.Content_link.slice(pageData.Content_link.indexOf('=')+1)
</script>

<Seo title="{pageType}" />
<div class="flex flex-col lg:flex-row text-left gap-6 p-4">
	<!-- first column-->
	<div class="flex flex-col w-full lg:w-1/5 max-w-none gap-2">
		<div class="avatar hover:scale-110 transition duration-200 mx-auto">
			<div class="w-60 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
				<img
					src={getImageURL(pageType, pageData[prefix + '_picture'])}
					alt="image of {pageData[prefix + '_name']}"
					on:error|once={(ev) => (ev.target.src = getDefaultImageURL(pageType))}
				/>
			</div>
		</div>

		<h1>{pageData[prefix + '_name'] || pageData[prefix + '_name_th']}</h1>
		<h2>{pageData[prefix + '_name'] ? pageData[prefix + '_name_th'] || '': ''} </h2>
		<div class="divider" />
		{#each keys as k}
			<h2>{$_(`key.${k}`)}</h2>
			{#if k === 'Content_link'}
				{#if youtubeID}
				<iframe width="300" height="200" src="https://www.youtube.com/embed/{youtubeID}?controls=0" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
				{:else}
					<a href={pageData.Content_link} target="_blank">{pageData.Content_link}</a>
				{/if}
			{:else}
				<p class="whitespace-pre-wrap">{pageData[k] || $_('incomplete')}</p>
			{/if}
		{/each}
		<div class="divider" />
		{#if pageData[prefix + '_link']}
			<ContactLinks links={pageData[prefix + '_link']}/>
		{/if}
		<div class="flex flex-row items-center gap-2">
			<h2>Share:</h2> 
			<Social url={pageData[prefix + '_link']} title={pageData[prefix + '_name']} />
		</div>
		<h2>Edit this page:
			<EditButton type={pageType} id={pageData[prefix + '_ID']}/>
		</h2>
	</div>
	<!-- second column-->
	<div class="flex flex-col w-full gap-4">
		{#each relations as r}
			<h1>List of {$_(`keyword.${r}`)} related to {pageData[prefix + '_name'] || pageData[prefix + '_name_th']}</h1>
			{#await promiseRelations[r]}
				<Spinner />
			{:then data}
				{#if data}
					<DataViewer {data} type={r} dataTableColumns={{headers:[], body:[]}} listView="grid"/>
				{/if}
			{/await}
		{/each}

		{#if pageType === 'honor'}
			<HonorTables honorID={pageID}/>
		{/if}
	</div>
</div>
