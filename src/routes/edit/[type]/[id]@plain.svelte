<script context=module lang=ts>
	import { getSubmissionPackage, TypeSubmissionAllowed, multilinksAllowedList } from '$lib/datatypes';
	import type { SubmissionPackage, AdminSettings } from '$lib/datatypes';
	import { fromBucket, getVarPrefix } from '$lib/supabase';
	import type { SubmissionData } from '$lib/supabase';
	import type {Alert} from '$lib/alert/alert.type'
	import { handleAlert} from '$lib/alert/alert.store'

	export async function load({ session, params, fetch }) {
		const {type, id} = params;
		const { user } = session

		const adminSettings = await fetch('/api/adminsettings')
		const data = await adminSettings.json()
		const res = await fetch(`/api/${type}/${id}`)
		const currentData = await res.json()

		// redirect if
		// * type is invalid 
		// * editing a new entry is not allowed
		// * editing a new entry is allowed for registered user, not guest
		if (!TypeSubmissionAllowed.includes(type) 
			|| (!data[0].allowEdit)
			|| (!data[0].allowGuestEdit && !user)) {

			let newAlert: Alert = {
				type: 'error',
				text: ''
			}
			if(!TypeSubmissionAllowed.includes(type))	
				newAlert.text = `${type} is not a valid page.`
			else if(!data[0].allowEdit) 
				newAlert.text = 'Editing a new entry is not allowed. Please contact admin.'
			else 
				newAlert.text = 'Please login to edit an entry.'
			handleAlert(newAlert)

			return {
				status: 303,
				redirect: '/create/'
			};
		}

		return {
			props: {
				data: getSubmissionPackage(type),
				currentData,
				type,
				adminSettings
			}
		};
	}

   // HURRAY ! It runs on server now
	// TODO: make sure nothing breaks in production
	export async function postSubmission(data: SubmissionData): Promise<Response> {
      const res = await fetch('/api/post/submission', {
         method: 'POST',
         cache: 'default',
         credentials: 'same-origin',
         headers: {
            'Content-Type': 'application/json'
         },
         body: JSON.stringify(data)
      })
		return res;
	}

	export async function uploadpicture(type: string, file: File, fileName: string) {
		// TODO: convert file? resize?
		let { error: updateError } = await fromBucket('images').upload(
			`${type}/${fileName}`,
			file,
			{
				upsert: false
			}
		);

		if (updateError) throw updateError;
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
	import { user, getCurrUserProfile } from '$lib/user';
	import Spinner from '$lib/components/Spinner.svelte';
	import MultipleSelect from '$lib/components/MultipleSelect.svelte';
	import SearchMultipleSelect from '$lib/components/SearchMultipleSelect.svelte';
	import UploadPicture from '$lib/components/UploadPicture.svelte';
	import SveltyPicker from 'svelty-picker';
	import {EditIcon, RefreshCcwIcon, SaveIcon} from 'svelte-feather-icons'
	import {getImageURL, getDefaultImageURL} from '$lib/supabase'
	import { _ } from 'svelte-i18n';
	import {onMount} from 'svelte'

	export let data: SubmissionPackage, 
		type: string, 
		currentData, // from load function
		adminSettings: AdminSettings
	const { submission, keys, relations, selects, multiselects } = data; // destruct
	const varPrefix = getVarPrefix(type)
	const currentDataID = currentData[varPrefix + '_ID']

	// create an array for each relation
	let relationMultiSelects: Record<string, string[]> = {};
	relations.forEach((r) => (relationMultiSelects[r] = []));
	let loadingRelationalData = true

	// populate it with relational data
	keys.forEach(k=>{
		if(selects[k] || multiselects[k] || k.includes('link'))
			submission[k] = currentData[k]
	})
	onMount(async ()=>{
		for(const r of relations) {
			const res = await fetch(`/api/${type}/${currentDataID}/${r}`)
			const data =  await res.json()
			const relationPrefix = getVarPrefix(r)
			if(!res.ok)
				handleAlert({
					type: 'error',
					text: r + ' ' + res.statusText
				})
			else {
				relationMultiSelects[r] = data.map((d)=>({
					id: d[relationPrefix + '_ID'],
					name: d[relationPrefix + '_name'],
					name_th: d[relationPrefix + '_name_th']
				}))
			}
		}
		loadingRelationalData = false
	})

	// extra info
	let comment: string;
	const pictureKeys = keys.filter((k) => k.includes('picture')); // in case there are more than one picture
	let pictureFiles: Record<string, File> = {};
	pictureKeys.forEach((k) => (pictureFiles[k] = null));

	// 
	let editingKey: string = ''
	let editingContent: any
	// show user a page based on the submission state
	const enum State {
		START,
		SUBMITTING,
		SUCCESS,
		ERROR
	}
	let submitState = State.START;

	async function handleSubmit() {
		if (submitState != State.START && submitState != State.ERROR) return;
		submitState = State.SUBMITTING;

		// attach submitter's info
		let id = 'guest',
			username = 'guest';
		if ($user) {
			const { data, error } = await getCurrUserProfile();
			id = error || !data ? 'guest' : data.id;
			username = error || !data ? 'guest' : data.username;
		}

		const slug = currentData[varPrefix + '_slug']
		// rename picture with random ID for hashing purpose
		for (const pf in pictureFiles) {
			if(pictureFiles[pf]) {
				const randomID = Math.floor(Math.random() * 1000);
				const randomIDString = ('000' + randomID).slice(-4);
				submission[pf] = slug + randomIDString;
				await uploadpicture(type, pictureFiles[pf], slug + randomIDString);
			}
		}

		// also add current data's ID so that we don't need to find it again
		let res = await postSubmission({
			content: {
				...submission, [varPrefix + '_ID']: currentDataID
			},
			rolesSubmission: {},
			relations: relationMultiSelects,
			pageType: type,
			id,
			username,
			type: 'edit',
			comment
		});
		let newAlert: Alert;
		if (res.ok) {
			submitState = State.SUCCESS;
			newAlert = {
				type: 'success',
				text: 'Successfully submitted!'
			}
		}
		else {
			submitState = State.ERROR;
			newAlert = {
				type: 'error',
				text: 'There was an error:' + JSON.stringify(res.body)
			}
		}
		handleAlert(newAlert)
	}

	function handleEdit(k: string) {
		if(editingKey === k) {
			if(editingContent !== currentData[k])
				submission[k] = currentData[k]
			editingKey = null
		}
		else if(!editingKey) {
			editingContent = currentData[k]
			editingKey = k
		}
	}
</script>

<Seo title="Edit {type}" />

<svelte:window on:beforeunload={(e)=> {e.returnValue = '...'; return '...'}}/>

<h1>{$_('page.edit._')} {$_(`keyword.${type}`)}</h1>
<div class="text-gray-500">
<!-- {JSON.stringify(submission)}
{JSON.stringify(relationMultiSelects)} -->
</div>
{#if submitState == State.START || submitState == State.ERROR}
	<form>
		<div class="flex flex-col lg:grid lg:grid-cols-3 items-center gap-2">
			<!-- display the appropriate input type, based on key's name and selects/multiselects array-->
			{#each keys as k}
				<div class="justify-self-start lg:justify-self-end mx-2 flex flex-row gap-2">
					<div>{$_(`key.${k}`)}</div>
				</div>
				<div class="justify-self-center">
					{#if selects[k]}
						<select class="select select-bordered" bind:value={currentData[k]}>
							<option disabled selected value={null}>{$_('page.create.select')}</option>
							{#each selects[k] as opt}
								<option value={opt}>{$_(`option.${opt}`)}</option>
							{/each}
						</select>
					{:else if multiselects[k]}
						<MultipleSelect selectOptions={multiselects[k]} bind:selects={submission[k]} />
					{:else if k.includes('_picture')}
						<UploadPicture key={k} bind:pictureFile={pictureFiles[k]} />
					{:else if k.includes('_time')}
						<SveltyPicker
							inputClasses="form-control"
							format="yyyy-mm-dd"
							bind:value={currentData[k]}
						/>
					{:else if k.includes('show')}
						<input type="checkbox" bind:checked={currentData[k]} class="checkbox" disabled={editingKey !== k}/>
					{:else if k.includes('description')}
						<textarea class="textarea textarea-bordered" bind:value={currentData[k]} disabled={editingKey !== k}/>
					{:else if k.includes('link') 
						&& multilinksAllowedList.includes(k.slice(0,k.indexOf('_'))?.toLowerCase())}
						<MultipleSelect bind:selects={submission[k]} />
					{:else}
						<input type="text" class="input input-bordered" bind:value={currentData[k]} disabled={editingKey !== k}/>
					{/if}
				</div>
				<div class="justify-self-start break-all flex flex-row items-center gap-2">
					{#if k.includes('_picture')}
						<img
							src={getImageURL(type, currentData[k])}
							class="object-cover h-40 aspect-auto group-hover:scale-120"
							alt="{type}"
							on:error|once={(ev) => (ev.target.src = getDefaultImageURL(type))}
						/>
					{:else}
						<div 
							class="btn" on:click={()=>handleEdit(k)} 
							class:bg-success={editingKey === k}
							class:invisible={editingKey && editingKey !== k}
						>
							{#if editingKey === k}
								<SaveIcon size=12/>
							{:else}
								<EditIcon size=12/>
							{/if}
						</div>
						{#if submission[k]}
							<div class="text-success"><RefreshCcwIcon size=20/></div>
						{/if}
					{/if}
				</div>
			{/each}
		</div>
		<div class="divider" />
		{#if loadingRelationalData}
			<Spinner/>
		{:else}
			<div class="lg:w-1/2 grid grid-cols-2 justify-center mx-auto" >
				{#each relations as r}
					<SearchMultipleSelect bind:selects={relationMultiSelects[r]} type={r} relation={type} />
				{/each}
			</div>
		{/if}
		<div class="divider" />
		{#if adminSettings.requireApproval}
			<div class="justify-self-end mx-2">{$_('page.create.comment')}</div>
			<textarea
				class="textarea textarea-bordered"
				placeholder={$_('page.create.comment')}
				bind:value={comment}
			/><br />
		{/if}
		{#if submitState == State.START}
			<div class="btn" on:click|preventDefault={handleSubmit}>{$_('page.create.submit')}</div>
		{/if}
	</form>
{/if}

{#if submitState == State.SUBMITTING}
	<p>{$_('page.create.status.submitting')}</p>
	<Spinner />
{:else if submitState == State.SUCCESS}
	<p>{$_('page.create.status.success')}</p>
	<p>Go back to <a href="/{type}/{currentData[getVarPrefix(type) + '_ID']}" class="text-info"> {currentData[getVarPrefix(type) + '_name']}</a></p>
{:else if submitState == State.ERROR}
	<p class="text-red">{$_('page.create.status.error')}</p>
	<div class="btn" on:click|preventDefault={handleSubmit}>{$_('page.create.submit')}</div>
{/if}

<style>
	input {
		@apply w-72;
	}

	select {
		@apply w-72;
	}

	input.checkbox {
		@apply w-10;
	}

	textarea {
		@apply w-72;
	}
</style>
