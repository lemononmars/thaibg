<script lang="ts" context="module">
	import { getVarPrefix } from '$lib/supabase';
	import { personRoles } from '$lib/datatypes';
	import type { Person, PersonRole, Boardgame } from '$lib/datatypes';

	export async function load({ params, url, fetch }) {
		const res = await fetch(`/api/person/${params.id}`);
		if (!res.ok) return { status: 404 };
		let person: Person;
		person = await res.json();

		return {
			props: {
				person,
				role: url.searchParams.get('role')
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
	import { getImageURL, getDefaultImageURL } from '$lib/supabase';
	import Seo from '$lib/components/SEO.svelte';
	import Spinner from '$lib/components/Spinner.svelte';
	import { onMount } from 'svelte';
	import BoardgameCard from '$lib/components/BoardgameCard.svelte';
	import DataViewer from '$lib/components/DataViewer.svelte';
	import ContactLinks from '$lib/components/ContactLinks.svelte';
	import EditButton from '$lib/components/EditButton.svelte';
	import { _ } from 'svelte-i18n';

	export let person: Person, role: string;
	let activeroleTitles = personRoles.map((r) => !!person[getVarPrefix(r) + '_ID']);
	let activeTab = 0;
	if (role) activeTab = personRoles.indexOf(role);
	// response to url ?role=Designer
	else if (activeroleTitles.indexOf(true)) activeTab = activeroleTitles.indexOf(true);
	// first non-empty role
	else activeTab = 0; // if all else fails, just use first index

	let rolePromise: Promise<any>;

	onMount(async () => {
		rolePromise = getRoleContent(personRoles[activeTab], person);
	});

	async function changeTab(idx: number) {
		activeTab = idx;
		if (activeroleTitles[activeTab]) rolePromise = getRoleContent(personRoles[activeTab], person);
	}
</script>

<Seo title="Person" />

<div class="w-full h-60">
	<img src="https://picsum.photos/800/600" class="object-cover w-full h-60" alt="cover" />
</div>

<div class="flex flex-col lg:flex-row justify-center items-start relative">
	<!-- First column: person's name, bio, and contacts-->
	<div class="text-left p-2 flex flex-col -mt-32 w-full lg:w-1/4 px-2">
		<div class="avatar">
			<div class="h-72 mask mask-circle hover:scale-110 duration-200 mx-auto">
				<img
					src={getImageURL('person', person.Person_picture)}
					alt="image of {person.Person_name}"
					on:error|once={(ev) => (ev.target.src = getDefaultImageURL('person'))}
				/>
			</div>
		</div>
		<div>
			<h1>{person.Person_name}</h1>
			<h2>{person.Person_name_th ? '(' + person.Person_name_th + ')' : ''}</h2>
			<h3>Bio</h3>
			<p>{@html person.Person_description || '-'}</p>
			<ContactLinks
				links={person.Person_link}
				email={person.Person_email}
			/>
			<EditButton type={'person'} id={person.Person_ID}/>
		</div>
	</div>

	<div class="flex flex-col w-full lg:w-3/4 text-left p-2 justify-center">
		<div class="tabs w-full m-10 mx-auto flex-grow">
			{#each personRoles as r, idx}
				{#if activeroleTitles[idx]}
					<!-- svelte-ignore a11y-missing-attribute -->
					<a
						class="tab tab-lg tab-bordered text-xl"
						class:text-success={!!activeroleTitles[idx]}
						class:tab-active={idx == activeTab}
						class:text-bold={idx == activeTab}
						on:click={() => changeTab(idx)}
					>
						{$_(`keyword.${r}`)}
					</a>
				{/if}
			{/each}
		</div>
		<div class="flex flex-col justify-center">
			{#await rolePromise}
				<Spinner />
			{:then res}
				{#if res}
					<div>
						<h2>{$_(`keyword.${personRoles[activeTab]}`)}'s Name</h2>
						<p>{res.name || '-'}</p>
						<h2>{$_(`keyword.${personRoles[activeTab]}`)}'s Description</h2>
						<p>{@html res.description || '-'}</p>
						{#if personRoles[activeTab] === 'rulebookeditor'}
							<h2>Languages</h2>
							<p>{res.language}</p>
						{/if}
						<EditButton type={personRoles[activeTab]} id={res.id}/>
					</div>

					<div class="divider" />

					<h2>Board games created by this {$_(personRoles[activeTab])}</h2>
					<DataViewer data={res.contents} type="boardgame"/>
					<!-- <div class="w-full text-center mb-4 grid grid-cols-2 lg:grid-cols-3 gap-4">
						{#each res.contents as bg}
							<BoardgameCard {bg} />
						{:else}
							-
						{/each}
					</div> -->
				{/if}
			{:catch}
				<p>Server is unavailable. Try again later.</p>
			{/await}
		</div>
	</div>
</div>
