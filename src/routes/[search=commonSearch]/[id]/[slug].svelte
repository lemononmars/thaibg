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

	export async function getBoardgames(type: string, id: number) {
		const res = await fetch(`/api/${type}/${id}/boardgame`);
		if (!res.ok)
			return { 
				status: 404, 
				message: 'cannot find any boardgame associated with that pageType' 
			};
		let data = await res.json();
		return data;
	}
</script>

<script lang="ts">
	import Seo from '$lib/components/SEO.svelte';
	import Spinner from '$lib/components/Spinner.svelte';
	import BoardgameCard from '$lib/components/BoardgameCard.svelte';
	import Social from '$lib/components/Social.svelte';
	import { LinkIcon} from 'svelte-feather-icons';
	import { onMount } from 'svelte';
	import type { Boardgame, TypeName } from '$lib/datatypes';
	import {getSubmissionPackage} from '$lib/datatypes'
	import {_} from 'svelte-i18n'
	import EditButton from '$lib/components/EditButton.svelte';

	export let pageData, pageID: number, pageType: TypeName;
	let prefix = getVarPrefix(pageType)
	const nonKeys = ['picture', 'slug', 'show', 'name']
	const keys = getSubmissionPackage(pageType).keys.filter(k => 
		nonKeys.every(
			kk => !k.includes(kk)
		)
	)

	let promiseBoardgames: Promise<Boardgame[]>;
	onMount(async () => {
		promiseBoardgames = getBoardgames(pageType, pageID);
	});
</script>

<Seo title="{pageType}" />
<div class="flex flex:col lg:flex-row text-left gap-6 mt-4">
	<!-- first column-->
	<div class="flex flex-col w-screen lg:w-2/5 max-w-none justify-center gap-2">
		<div class="mx-auto">
			<img
				src={getImageURL(pageType, pageData[prefix + '_picture'])}
				alt="image of {pageData[prefix + '_name']}"
				class="w-72"
				on:error|once={(ev) => (ev.target.src = getDefaultImageURL(pageType))}
			/>
		</div>

		<h1>{pageData[prefix + '_name'] || pageData[prefix + '_name_th']}</h1>
		<h2>{pageData[prefix + '_name'] ? pageData[prefix + '_name_th'] || '': ''} </h2>
		{#each keys as k}
			<h2>{$_(`key.${k}`)}</h2>
			<p>{pageData[k]}</p>
		{/each}
		<div class="divider" />

		<h2>Connect</h2>
		<div class="flex flex-row items-center gap-2">
			{#if pageData[prefix + '_link']}
				<Social url={pageData[prefix + '_link']} title={pageData[prefix + '_name']} />
				<div class="tooltip" data-tip="external link">
					<div class="btn btn-square">
						<a href={pageData[prefix + '_link']} target="_blank">
							<LinkIcon size="2x" />
						</a>
					</div>
				</div>
			{/if}
			<EditButton type={pageType} id={pageData[prefix + '_ID']}/>
		</div>
		
	</div>
	<!-- second column-->
	<div class="flex flex-col gap-4">
		{#await promiseBoardgames}
			<Spinner />
		{:then boardgames}
			{#if boardgames}
				<div class="w-full text-center mb-4 grid grid-cols-2 lg:grid-cols-3 gap-4">
					{#each boardgames as bg}
						<BoardgameCard {bg} />
					{:else}
						{$_('incomplete')}
					{/each}
				</div>
			{/if}
		{/await}
	</div>
</div>
