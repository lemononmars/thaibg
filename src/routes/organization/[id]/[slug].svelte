<script lang="ts" context="module">
	export async function load({ params, fetch }) {
		const res = await fetch(`/api/organization/${params.id}`);
		
		if (!res.ok) return { status: 404 };
		const data = await res.json();

		return {
			props: {
				organizationData: data || null
			}
		};
	}

	export async function getOrgRelation(IDs: number[], type: string) {
		let datas = []
		for(const id of IDs) {
			const res = await fetch(`/api/${type}/${id}`);
			const data = await res.json();
			datas = [...datas, data]
		}
		return datas
	}
</script>

<script lang="ts">
	import Seo from '$lib/components/SEO.svelte';
	import {_} from 'svelte-i18n'
	import type {Organization} from '$lib/datatypes'
	import {organizationRoles} from '$lib/datatypes'
	import {getVarPrefix} from '$lib/supabase'
	import Spinner from '$lib/components/Spinner.svelte';
	import { onMount } from 'svelte';
	import DataViewer from '$lib/components/DataViewer.svelte'
	import { getImageURL, getDefaultImageURL } from '$lib/supabase';
	import ContactLinks from '$lib/components/ContactLinks.svelte';
	import EditButton from '$lib/components/EditButton.svelte';

	export let organizationData: Organization
	let orgRelations: Record<string, number[]> = JSON.parse(organizationData.Organization_relation)
	let filteredOrgRelations: Record<string, number[]> = {}

	// filter only non-empty relations
	Object.keys(orgRelations).forEach(r => {
		if(orgRelations[r].length > 0)
			filteredOrgRelations[r] = orgRelations[r]
	})
	const orgRelationKeys: string[] = Object.keys(filteredOrgRelations)

	let activeTab = 0;
	$: activeRole = orgRelationKeys[activeTab]

	let promises: Record<string, Promise<any>[]> = {}
	orgRelationKeys.forEach(k=>promises[k] = null)
	onMount(async () => {
		for(const key of orgRelationKeys) {
			promises[key] = await getOrgRelation(filteredOrgRelations[key], key);
		}
	});

	async function changeTab(idx: number) {
		activeTab = idx;
	}
</script>

<Seo title="organization" />
<div class="flex flex-col justify-center items-center relative">
	<div class="w-full text-left m-4 flex flex-col">
		{#if !organizationData}
			Invalid organization ID!
		{:else}
			<div class="flex flex-col lg:flex-row lg:gap-4 w-full p-8 border-2 shadow-lg rounded-xl">
				<div class="w-full lg:w-1/4">
					<div class="avatar hover:scale-110 transition duration-200 mx-auto">
						<div class="h-60 aspect-square rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
							<img
								src={getImageURL('organization', organizationData.Organization_picture)}
								alt="image of {organizationData.Organization_name}"
								on:error|once={(ev) => (ev.target.src = getDefaultImageURL('organization'))}
							/>
						</div>
					</div>
					<ContactLinks links={organizationData.Organization_links}/>
					<div>
						<h3>Edit: </h3>
						<EditButton type="organization" id={organizationData.Organization_ID}/>
					</div>
				</div>
				<div class="w-full lg:w-3/4">
					<h1>{organizationData.Organization_name}</h1>
					
					<h2>Description</h2>
					<p class="whitespace-pre-wrap break-words">{@html organizationData.Organization_description || 'N/A'}</p>
				</div>

			</div>

			<div class="flex flex-col w-full mx-auto text-left p-2 justify-center">
				<div class="tabs w-full m-10 mx-auto flex-grow">
					{#each orgRelationKeys as r, idx}
						<!-- svelte-ignore a11y-missing-attribute -->
						<a
							class="tab tab-lg tab-bordered text-xl text-success"
							class:tab-active={idx == activeTab}
							class:text-bold={idx == activeTab}
							on:click={() => changeTab(idx)}
						>
							{$_(`keyword.${r}`)}
						</a>
					{/each}
				</div>
				<div class="flex flex-col justify-center">
					{#await promises[activeRole]}
						<Spinner />
					{:then res}
						{#if res}
							<h2>{$_(`keyword.${activeRole}`)}</h2>
							<DataViewer listView={"grid"} data={res} type={activeRole}/>
						{/if}
					{/await}
				</div>
			</div>
		{/if}
	</div>
</div>
