<script lang="ts" context="module">
	import { getVarPrefix } from '$lib/supabase';

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
</script>

<script lang="ts">
	import Seo from '$lib/components/SEO.svelte';
	import Spinner from '$lib/components/Spinner.svelte';
	import HonorRelationTable from '$lib/components/HonorRelationTable.svelte';
	import Social from '$lib/components/Social.svelte';
	import { onMount } from 'svelte';
	import type { TypeName } from '$lib/datatypes';
	import {getSubmissionPackage} from '$lib/datatypes'
	import {_} from 'svelte-i18n'
	import EditButton from '$lib/components/EditButton.svelte';
	import DataViewer from '$lib/components/DataViewer.svelte';
	import ContactLinks from '$lib/components/ContactLinks.svelte';
	import GoogleMapEmbed from '$lib/components/GoogleMapEmbed.svelte';
	import Picture from '$lib/components/Picture.svelte'
	import AddToCalendarButton from '$lib/components/AddToCalendarButton.svelte';

	export let pageData, pageID: number, pageType: TypeName;
	let prefix = getVarPrefix(pageType)
	const nonKeys = ['picture', 'slug', 'show', 'name', 'links'] // move link to the bottom of the page
	const allKeys = getSubmissionPackage(pageType).keys
	const filteredKeys = allKeys.filter(k => 
		nonKeys.every(
			kk => !k.includes(kk)
		)
	)
	
	let relations: TypeName[] = []
	const TBGrelationTypes = ['event', 'mechanics', 'type', 'category']
	if (pageType === 'content')
		relations = ['boardgame', 'contentcreator']
	else if (TBGrelationTypes.includes(pageType)) {
		relations = ['boardgame']
	}
	else
		relations = [] // for 'honor', use corresponding HonorRelationTable component instead
	
	let promiseRelations: Record<string, Promise<any[]>> = {}
	relations.forEach((r) => promiseRelations[r] = null)

	onMount(async () => {
		for(const r in promiseRelations)
			promiseRelations[r] = getRelations(pageType, r, pageID)
	});

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
	
	let pageName: string = pageData[prefix + '_name'] || pageData[prefix + '_name_th']

	function getYoutubeID(link: string){
		return link.slice(link.indexOf('=')+1)
	}
</script>

<Seo title="{pageType}" />
<div class="flex flex-col lg:flex-row text-left gap-6 p-4">
	<!-- first column-->
	<div class="flex flex-col w-full lg:w-1/5 max-w-none gap-2">
		{#if pageType !== 'content'}
			<Picture type={pageType} picture={pageData[prefix + '_picture']}/>
		{/if}
		<h1>{pageName}</h1>
		<h2>{pageData[prefix + '_name'] ? pageData[prefix + '_name_th'] || '': ''} </h2>
		<div class="divider" />
		{#each filteredKeys as k}
			<h2>{$_(`key.${k}`)}</h2>
			{#if k.includes("location")}
				{#if pageData[prefix + '_location']?.location}
					<div class="h-100 w-full">
						<GoogleMapEmbed 
							place={pageData[prefix + '_location']} 
							name={pageName} 
							id={pageID}
							width={250}
							height={150}
						/>
					</div>
				{/if}
				<p class="text-sm">{pageData[k]? pageData[k].formatted_address : $_('incomplete')}</p>
			{:else}
				<p class="whitespace-pre-wrap">{pageData[k] || $_('incomplete')}</p>
			{/if}
		{/each}
		{#if allKeys.includes('Content_links')}
			{#each pageData.Content_links as link}
				{#if link.includes('youtube')}
					<iframe width="250" height="150" 
						src="https://www.youtube.com/embed/{getYoutubeID(link)}?controls=0" 
						title="YouTube video player" 
						frameborder="0" 
						allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
						allowfullscreen
						class="mx-auto"
					/>
				{/if}
			{/each}
		{/if}
		<div class="divider" />
		{#if pageData[prefix + '_links']}
			<ContactLinks links={pageData[prefix + '_links']}/>
		{/if}
		{#if pageData[prefix + '_links'] && pageData[prefix + '_links'].length > 0}
			<div class="flex flex-row items-center gap-2">
				<h2>Share:</h2> 
				<Social url={pageData[prefix + '_links']} title={pageData[prefix + '_name']} />
			</div>
		{/if}
		{#if pageType === 'event'}
			<AddToCalendarButton 
				eventID={pageData.Event_ID}
				eventName={pageData.Event_name}
				location={pageData.Event_location?.formatted_address || '-'}
				date={pageData.Event_time_start + '/' + pageData.Event_time_end}
			/>
		{/if}
		{#if pageType !== 'mechanics'}
			<h2>Edit this page:
				<EditButton type={pageType} id={pageData[prefix + '_ID']}/>
			</h2>
		{/if}
	</div>
	<!-- second column-->
	<div class="flex flex-col w-full gap-4">

		{#if pageType === 'honor'}
			<HonorRelationTable id={pageID}/>
		{:else if pageType === 'content'}
			<div class="flex flex-row gap-1">
				<div class="w-1/2">
					<h1>{$_(`keyword.boardgame`)}</h1>
					{#await promiseRelations['boardgame']}
						<Spinner />
					{:then data}
						{#if data}
							<DataViewer 
								{data} 
								type={'boardgame'} 
								dataTableColumns={{headers:[], body:[]}} 
								listView="grid"
								numColumns={2}
								showPageNav={false}
							/>
						{/if}
					{/await}
				</div>
				<div class="w-1/2">
					<h1>{$_(`keyword.contentcreator`)}</h1>
					{#await promiseRelations['contentcreator']}
						<Spinner />
					{:then data}
						{#if data}
							<DataViewer 
								{data} 
								type={'contentcreator'} 
								dataTableColumns={{headers:[], body:[]}} 
								listView="grid"
								numColumns={2}
								showPageNav={false}
							/>
						{/if}
					{/await}
				</div>
			</div>
		{:else if TBGrelationTypes.includes(pageType)}
			<h1>{$_(`keyword.boardgame`)}</h1>
				{#await promiseRelations['boardgame']}
					<Spinner />
				{:then data}
					{#if data}
						<DataViewer 
							{data} 
							type={'boardgame'} 
							dataTableColumns={{headers:[], body:[]}} 
							listView="grid"
							numColumns={3}
						/>
					{/if}
				{/await}
			{/if}
	</div>
</div>
