<script lang="ts" context="module">
	export async function load({ session, params, fetch }) {
		const { user } = session;
		const res = await fetch(`/api/organization/${params.id}`);
		
		if (!res.ok) return { status: 404 };

		const data = await res.json();
		console.log(data)
		return {
			props: {
				user,
				organizationData: data || null
			}
		};
	}

	export async function getOrgRelation(ID: number, type: string) {
		const res = await fetch(`/api/organization/${ID}/${type}`);
		if (!res.ok) return { status: 404, error: 'no board game found' };

		const data = res.json();
		return data;
	}
</script>

<script lang="ts">
	import Seo from '$lib/components/SEO.svelte';
	import Spinner from '$lib/components/Spinner.svelte';
	import { onMount } from 'svelte';
	import PlainCard from '$lib/components/PlainCard.svelte';
	import { getImageURL, getDefaultImageURL } from '$lib/supabase';
	import EditButton from '$lib/components/EditButton.svelte';

	export let user, organizationData;
	let orgRelationKeys = Object.keys(
		JSON.parse(organizationData.Organization_relation)
	)
	let promises: Record<string, Promise<any>> = {}
	orgRelationKeys.forEach(k=>promises[k] = new Promise((res, rej)=>{}))
	onMount(async () => {
		for(const key of orgRelationKeys) {
			promises[key] = await getOrgRelation(organizationData.Organization_ID, key);
		}
	});
</script>

<Seo title="organization" />
<div class="flex flex-col justify-center items-center relative">
	<div class="w-full text-left m-4 flex flex-col">
		{#if !organizationData}
			Invalid organization ID!
		{:else}
			<div class="flex flex-col lg:flex-row lg:gap-4 w-full p-8 border-2 shadow-lg rounded-xl">
				<img
					src={getImageURL('organization', organizationData.Organization_picture)}
					alt="image of {organizationData.Organization_name}"
					class="w-72 mask mask-circle-2"
					on:error|once={(ev) => (ev.target.src = getDefaultImageURL('organization'))}
				/>
				<div>
					<h1>{organizationData.Organization_name}</h1>
					<h2>{organizationData.Organization_name_th ? '(' + organizationData.Organization_name_th + ')' : ''}</h2>
					<ul>
						<li>
							Official link:
							{#if organizationData.Organization_link}
								<a href={organizationData.Organization_link} target="_blank">{organizationData.Organization_link}</a
								>
							{:else}
								N/A
							{/if}
						</li>
					</ul>
					<h2>Description</h2>
					<p>{@html organizationData.Organization_description || 'N/A'}</p>
				</div>

			</div>
			<!-- <div>{likes.length}</div> -->
			<div class="divider" />
			<h2> Organization's relation</h2>
			{organizationData.Organization_relation} 
			{orgRelationKeys}
			{#each orgRelationKeys as key}
				{#await promises[key]}
					<Spinner />
				{:then res}
					{#if res}
						<h2>{key}</h2>
						<div class="w-full text-center mb-4 grid grid-cols-2 lg:grid-cols-4 gap-4">
							{#each res as obj}
								<PlainCard object={obj} type={key}/>
							{:else}
								N/A
							{/each}
						</div>
					{/if}
				{/await}
			{/each}
		{/if}
		{#if user && !user.guest}
			<EditButton type={'organization'} id={organizationData.Organization_ID}/>
		{/if}
	</div>
</div>
