<script lang="ts" context="module">
	import { getVarPrefix } from '$lib/supabase';
	import { getDataTableColumns, getSubmissionPackage } from '$lib/datatypes';
	import type { Organization, OrganizationRole, Boardgame, Content, OrganizationRelation, TypeName } from '$lib/datatypes';

	export async function load({ params, fetch }) {
		let {id, role} = params;
		let organizationData: Organization

		if(role === 'organization'){
			const res = await fetch(`/api/organization/${id}`);
			// redirect to the default page

			const data = await res.json()
			if (!res.ok || (data && data.length == 0)) {
				
				return {
					status: 303,
					redirect: `/organization`
				};
			}

			organizationData = data
		}
		else {
			const res = await fetch(`/api/${role}/${id}/organization`);
			// redirect to the default page
			const data = await res.json()
			if (!res.ok || (data && data.length == 0)) {
				return {
					status: 303,
					redirect: `/${role}`
				};
			}
			organizationData = data[0]
		}

		return {
			props: {
				organizationData,
				role,
				roleID: id
			}
		};
	}

	export async function getRoleData(role: string, roleID: number): Promise<OrganizationRole> {
		const res = await fetch(`/api/${role}/${roleID}`);
		if (!res) return null;
		const roleData = await res.json();
		return roleData
	}

	export async function getContentData(role: string, roleID: number) {
		// for contentcreator, grab contents
		// otherwise (publisher, sponsor, manufacturer, shop), grab board games
		const contentType = role === 'contentcreator'? 'content' : 'boardgame';
		const res = await fetch(`/api/${role}/${roleID}/${contentType}`);
		if (!res.ok) return [];
		const contentData = await res.json();
		return contentData
	}
</script>

<script lang="ts">
	import Seo from '$lib/components/SEO.svelte';
	import Spinner from '$lib/components/Spinner.svelte';
	import { onMount } from 'svelte';
	import ContactLinks from '$lib/components/ContactLinks.svelte';
	import EditButton from '$lib/components/EditButton.svelte';
	import { _ } from 'svelte-i18n';
	import DataViewer from '$lib/components/DataViewer.svelte';
	import GoogleMapEmbed from '$lib/components/GoogleMapEmbed.svelte'
	import Picture from '$lib/components/Picture.svelte';
	import ShopRelationTable from '$lib/components/ShopRelationTable.svelte';

	export let organizationData: Organization, role: string, roleID: number;
	const orgRelation = organizationData.Organization_relation // already parsed from fetch
	let availableRoles = <OrganizationRelation[]>Object.keys(orgRelation).filter(k=> 
		orgRelation[k] && orgRelation[k].length > 0
	)
	let activeRole: string, activeRoleID: number

	if(role === 'organization') {
		activeRole = availableRoles[0]
		activeRoleID = orgRelation[activeRole][0]
	}
	else {
		activeRole = role
		activeRoleID = roleID
	}
	$: activeRolePrefix = getVarPrefix(activeRole)

	const nonKeys = ['picture', 'slug', 'show', 'link', 'description']
	let activeRoleKeys = getKeys() // move link to the bottom of the page

	let roleDataPromise: Promise<OrganizationRole>;
	let contentDataPromise: Promise<Boardgame[] | Content[]>

	onMount(async () => {
		reloadData()
	});

	async function reloadData() {
		roleDataPromise = getRoleData(activeRole, activeRoleID);
		contentDataPromise = getContentData(activeRole, activeRoleID);
	}

	async function changeRole(idx: number) {
		activeRole = availableRoles[idx] as OrganizationRelation;
		activeRoleID = orgRelation[activeRole][0]
		activeRoleKeys = getKeys()
		reloadData()
	}

	async function changeRoleID(id: number) {
		activeRoleID = id
		reloadData()
	}

	function getKeys(){
		const r = activeRole as TypeName
		return getSubmissionPackage(r).keys.filter(k => 
			nonKeys.every(
				kk => !k.includes(kk)
			)
		)
	}
</script>

<Seo title="Organization" />

<div class="w-full h-60">
	<img src="https://picsum.photos/800/600" class="object-cover w-full h-60" alt="cover" />
</div>
<div class="flex flex-col lg:flex-row justify-center items-start relative">
	<!-- First column: Organization's name, bio, and contacts-->
	<div class="text-left p-2 flex flex-col -mt-32 w-full lg:w-1/4 px-2">
		<Picture type='organization' picture={organizationData.Organization_picture}/>
		<div>
			<h1>{organizationData.Organization_name}</h1>
			<h3>Bio</h3>
			<p class="whitespace-pre-wrap">{@html organizationData.Organization_description || '-'}</p>
			<ContactLinks
				links={organizationData.Organization_links}
			/>
			<EditButton type={'organization'} id={organizationData.Organization_ID}/>
		</div>
	</div>

	<div class="divider lg:hidden w-full"></div>
	<!-- Second column: role tabs-->
	<div class="flex flex-col w-full lg:w-3/4 text-left p-2">
		<div class="tabs w-full mx-auto flex-grow">
			{#each availableRoles as r, idx}
				<!-- svelte-ignore a11y-missing-attribute -->
				<a
					class="tab tab-lg tab-bordered text-xl text-success"
					class:tab-active={r === activeRole}
					class:text-b={r === activeRole}
					on:click={() => changeRole(idx)}
				>
					{$_(`keyword.${r}`)}
				</a>
			{/each}
		</div>
		<div class="tabs w-full mx-auto flex-grow">
			{#each orgRelation[activeRole] as id, idx}
				<!-- svelte-ignore a11y-missing-attribute -->
				<a
					class="tab tab-lg tab-bordered text-xl text-success"
					class:tab-active={id === activeRoleID}
					class:text-b={id === activeRoleID}
					on:click={() => changeRoleID(id)}
				>
					#{idx + 1}
				</a>
			{/each}
		</div>
		<div class="flex flex-col justify-center">
			{#await roleDataPromise}
				<Spinner />
			{:then res}
				{#if res}
					<div class="flex flex-col">
						<div class="flex flex-col lg:flex-row gap-4 mt-2">
							<Picture type={activeRole} picture={res[activeRolePrefix + '_picture']} height={32}/>
							<div>
							{#each activeRoleKeys as k}
								<h2>{$_(`key.${k}`)}</h2>
								{#if k.includes("location")}
									{#if res[activeRolePrefix + '_location']?.location}
										<div class="h-60 w-full mx-auto">
											<GoogleMapEmbed 
												place={res[activeRolePrefix + '_location']} 
												name={res[activeRolePrefix + '_name']} 
												id={res[activeRolePrefix + '_ID']}
												width={300}
												height={200}
											/>
										</div>
									{/if}
									<p class="text-sm">{res[k]? res[k].formatted_address : $_('incomplete')}</p>
								{:else}
									<p class="whitespace-pre-wrap">{res[k] || $_('incomplete')}</p>
								{/if}
							{/each}
							</div>
						</div>
						<div class="flex flex-col gap-2 place-content-start">
							<ContactLinks
								links={res[activeRolePrefix + '_links']}
							/>
							<EditButton type={activeRole} id={activeRoleID}/>
							<h2>{$_(`key.${activeRolePrefix + '_description'}`)}</h2>
							<p class="whitespace-pre-wrap">{res[activeRolePrefix + '_description']}</p>
						</div>
					</div>
				{/if}
			{:catch}
				<p>Server is unavailable. Try again later.</p>
			{/await}

			{#await contentDataPromise}
				<Spinner />
			{:then res}
				{#if res}
					{#if activeRole === 'shop'}
						<ShopRelationTable id={activeRoleID}/>
					{:else}
						<DataViewer 
							data={res} 
							type={activeRole === 'contentcreator'? 'content' : 'boardgame'}
							dataTableColumns={getDataTableColumns(activeRole === 'contentcreator'? 'content' : 'boardgame')}
							numColumns={3}
						/>
					{/if}
				{/if}
			{:catch}
				<p>Server is unavailable. Try again later.</p>
			{/await}
		</div>
	</div>
</div>
