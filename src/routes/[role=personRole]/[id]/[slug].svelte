<script lang="ts" context="module">
	/*
		This whole page is identical to /person/ID/SLUG
	*/
	import { getVarPrefix } from '$lib/supabase';
	import { personRoles, getDataTableColumns } from '$lib/datatypes';
	import type { Person, PersonRole, Boardgame } from '$lib/datatypes';

	export async function load({ params, fetch }) {
		let {id, role} = params;
		let person: Person

		if(role === 'person') {
			const res = await fetch(`/api/person/${params.id}`);
			if (!res.ok) return { status: 404 };
			person = await res.json();
		}
		else {
			const res = await fetch(`/api/${role}/${id}/person`);
			// redirect to the default page
			const data = await res.json()
			if (!res.ok || (data && data.length == 0))
				return {
					status: 303,
					redirect: `/${role}`
				};
			person = data[0]
		}
		
		return {
			props: {
				person,
				role
			}
		};
	}

	export async function getRoleContent(role: string, person: Person) {
		let personData: PersonRole;
		let contents: Boardgame[];
		let returnedData = [];
		const roleVarPrefix = getVarPrefix(role)

		// grab role information
		const id = person[roleVarPrefix + '_ID'];
		let res = await fetch(`/api/${role}/${id}`);
		if (!res) return { status: res.status };
		personData = await res.json();

		// get the list of board games
		const dataType = 'boardgame';
		res = await fetch(`/api/${role}/${id}/${dataType}`);
		if (!res.ok) return { status: res.status };
		contents = await res.json();

		// rename keys regardless of roles
		const infoKeys = ['description', 'name', 'name_th', 'language', 'slug', 'link'];
		infoKeys.forEach((i) => (returnedData[i] = personData[roleVarPrefix + '_' + i]));
		returnedData['id'] = personData[roleVarPrefix + '_ID'];
		returnedData['contents'] = contents;
		return returnedData;
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
	import Picture from '$lib/components/Picture.svelte';

	export let person: Person, role: string;
	let activeRoleTitles = personRoles.filter((r) => !!person[getVarPrefix(r) + '_ID']);
	let activeRole: string = role
	if (role === 'person') 
		activeRole = activeRoleTitles[0]

	let rolePromise: Promise<any>;

	onMount(async () => {
		rolePromise = getRoleContent(activeRole, person);
	});

	async function changeTab(role: string) {
		activeRole = role;
		rolePromise = getRoleContent(activeRole, person);
	}
</script>

<Seo title="Person" />

<div class="w-full h-60">
	<img src="https://picsum.photos/800/600" class="object-cover w-full h-60" alt="cover" />
</div>

<div class="flex flex-col lg:flex-row justify-center items-start relative">
	<!-- First column: person's name, bio, and contacts-->
	<div class="text-left p-2 flex flex-col -mt-32 w-full lg:w-1/4 px-2">
		<Picture type='person' picture={person.Person_picture} height={72}/>
		<div>
			<h1>{person.Person_name}</h1>
			<h2>{person.Person_name_th ? '(' + person.Person_name_th + ')' : ''}</h2>
			<h3>Bio</h3>
			<p>{@html person.Person_description || '-'}</p>
			<ContactLinks
				links={person.Person_links}
				email={person.Person_email}
			/>
			<EditButton type={'person'} id={person.Person_ID}/>
		</div>
	</div>

	<div class="flex flex-col w-full lg:w-3/4 text-left p-2 justify-center">
		<div class="tabs w-full m-10 mx-auto flex-grow">
			{#each activeRoleTitles as r, idx}
				<!-- svelte-ignore a11y-missing-attribute -->
				<a
					class="tab tab-lg tab-bordered text-xl"
					class:text-success={!!activeRoleTitles[idx]}
					class:tab-active={r === activeRole}
					class:text-bold={r === activeRole}
					on:click={() => changeTab(r)}
				>
					{$_(`keyword.${r}`)}
				</a>
			{/each}
		</div>
		<div class="flex flex-col justify-center">
			{#await rolePromise}
				<Spinner />
			{:then res}
				{#if res}
					<div>
						<h2>{$_(`keyword.${activeRole}`)}'s Name</h2>
						<p>{res.name || '-'}</p>
						<h2>{$_(`keyword.${activeRole}`)}'s Description</h2>
						<p>{@html res.description || '-'}</p>
						{#if activeRole === 'rulebookeditor'}
							<h2>Languages</h2>
							<p>{res.language}</p>
						{/if}
						<EditButton type={activeRole} id={res.id}/>
					</div>

					<div class="divider" />

					<h2>Board games created by this {$_(activeRole)}</h2>
					<DataViewer 
						data={res.contents} 
						type="boardgame"
						dataTableColumns={getDataTableColumns('boardgame')}
						numColumns={3}
					/>
				{/if}
			{:catch}
				<p>Server is unavailable. Try again later.</p>
			{/await}
		</div>
	</div>
</div>
