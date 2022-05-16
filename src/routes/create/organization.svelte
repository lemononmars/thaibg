<script context=module lang=ts>
	import { getSubmissionPackage } from '$lib/datatypes';
	import type { SubmissionPackage } from '$lib/datatypes';
	import { fromBucket, getVarPrefix, createSlug } from '$lib/supabase';
	import type {SubmissionData} from '$lib/supabase'
	import type {Alert} from '$lib/alert/alert.type'
	import {handleAlert} from '$lib/alert/alert.store'

	export async function load({ session, fetch }) {
		const { user } = session

		const adminSettings = await fetch('/api/adminsettings')
		const data = await adminSettings.json()

		// redirect if
		// * type is invalid 
		// * creating a new entry is not allowed
		// * creating a new entry is allowed for registered user, not guest
		if ((!data[0].allowCreate)
			|| (!data[0].allowGuestCreate && !user)) {

			let newAlert: Alert = {
				type: 'error',
				text: ''
			}
			if(!data[0].allowCreate) 
				newAlert.text = 'Creating a new entry is not allowed. Please contact admin.'
			else 
				newAlert.text = 'Please login to create a new entry.'
			handleAlert(newAlert)

			return {
				status: 303,
				redirect: '/create/'
			};
		}

		return {
			props: {
				data: getSubmissionPackage('organization'),
			}
		};
	}

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

	// TODO: make this a post request?
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

	export async function getNewOrganization(id: number){
		const newOrganization = await fetch(`/api/organization/${id}`)
		const data = await newOrganization.json()
		return data
	}
</script>

<script lang="ts">
	import Seo from '$lib/components/SEO.svelte';
	import { user, getCurrUserProfile } from '$lib/user';
	import Spinner from '$lib/components/Spinner.svelte';
	import MultipleSelect from '$lib/components/MultipleSelect.svelte';
	import { fly } from 'svelte/transition'
	import { quintOut } from 'svelte/easing'
	import UploadPicture from '$lib/components/UploadPicture.svelte';
	import { _ } from 'svelte-i18n';
	import { EditIcon, MinusCircleIcon } from 'svelte-feather-icons';
	import PlainCard from '$lib/components/PlainCard.svelte';
	import AddRoleButton from '$lib/components/AddRoleButton.svelte';

	export let data: SubmissionPackage; // from load fucntion
	const type: string = 'organization';
	const { submission, keys, relations, selects, multiselects, required } = data; // destruct

	// create an array for each relation
	interface RoleObject {
		type: string,
		pictureFile: File,
		data: Record<string, any>
	}
	let rolesAdded: RoleObject[] = [];

	// extra info
	let comment: string;
	let pictureFiles: Record<string, File> = {Organization_picture: null} // might also have a cover picture in the future

	const roleSubmissionPackage = {
		'manufacturer': getSubmissionPackage('manufacturer'),
		'shop': getSubmissionPackage('shop'),
		'sponsor': getSubmissionPackage('sponsor'),
		'publisher': getSubmissionPackage('publisher'),
		'contentcreator': getSubmissionPackage('contentcreator'),
	}
	let editingRoleIndex: number = -1;
	$: editingRoleType = rolesAdded[editingRoleIndex]?.type
	let editingRolePackage: SubmissionPackage

	// show user a page based on the submission state
	const enum State {
		START,
		SUBMITTING,
		SUCCESS,
		ERROR
	}
	let submitState = State.START;
	let canSubmit: boolean = false
	$: canSubmit = submission.Organization_name

	// these are used so that we can display a link to the newly created entry right away
	let newIndex: number
	let promiseNewOrganization: Promise<any>

	function addRole(role:string) {
		const prefix = getVarPrefix(role)
		const newRoleData = {
			[`${prefix}_name`]: submission.Organization_name,
		}
		const newRole: RoleObject = {
			type: role,
			pictureFile: pictureFiles.Organization_picture,
			data: newRoleData
		}
		rolesAdded = [...rolesAdded, newRole]
		rolesAdded = rolesAdded
	}

	function removeRole(idx: number) {
		rolesAdded.splice(idx, 1)
		rolesAdded = rolesAdded
		editingRoleIndex = -1
		scrollTop()
	}

	function handleExpand(idx: number) {
		editingRolePackage = roleSubmissionPackage[rolesAdded[idx]['type']]
		editingRoleIndex = idx
	}
	
	function handleSave () {
		const roleType = rolesAdded[editingRoleIndex]['type']
		const required = roleSubmissionPackage[roleType].required
		if (required && !required.every((k: string) => !!rolesAdded[editingRoleIndex]['data'][k])) {
			const missingFields = required?.filter((k: string) => !rolesAdded[editingRoleIndex]['data'][k]).join(',')
			const newAlert: Alert = {
				type: 'error',
				text: 'please fill all required fields: ' +  missingFields
			}
			handleAlert(newAlert)
			return
		}

		editingRoleIndex = -1
		scrollTop()
	}

	async function handleSubmit() {
		if (submitState != State.START && submitState != State.ERROR) return;
		if (required && !required.every(r => !!submission[r])) {
			const missingFields = required?.filter(r => !submission[r]).join(',')
			const newAlert: Alert = {
				type: 'error',
				text: 'please fill all required fields: ' +  missingFields
			}
			handleAlert(newAlert)
			return
		}

		const typePrefix = getVarPrefix(type)

		if (!submission[typePrefix + '_name'] && !submission[typePrefix + '_name_th']) {
			const newAlert: Alert = {
				type: 'error',
				text: 'please enter either English or Thai name'
			}
			handleAlert(newAlert)
			return
		}

		submitState = State.SUBMITTING;
		scrollTop()

		// attach submitter's info
		let id = 'guest',
			username = 'guest';
		if ($user) {
			const { data, error } = await getCurrUserProfile();
			id = error || !data ? 'guest' : data.id;
			username = error || !data ? 'guest' : data.username;
		}

		// generate a slug based on name (english)
		// if only Thai name (_name_th) exists, treat it as no name
		// might have to manually fix it in admin panel
		const slug = createSlug(submission[typePrefix + '_name'])
		submission[typePrefix + '_slug'] = slug

		// rename picture with random ID for hashing purpose
		for (const pf in Object.keys(pictureFiles)) {
			if(pictureFiles[pf]) {
				const randomID = Math.floor(Math.random() * 1000);
				const randomIDString = ('000' + randomID).slice(-4);
				const pictureSlug = slug + '-' + randomIDString;
				submission[pf] = pictureSlug
				const pictureType = pf.substring(0, pf.indexOf('_'))
				await uploadpicture(pictureType, pictureFiles[pf], pictureSlug);
			}
		}

		for (const r in rolesAdded) {
			if(rolesAdded[r]['pictureFile']) {
				const randomID = Math.floor(Math.random() * 1000);
				const randomIDString = ('000' + randomID).slice(-4);

				const type = rolesAdded[r]['type']
				const prefix = getVarPrefix(type)
				const slug = createSlug(rolesAdded[r]['data'][prefix + '_name'])
				const pictureSlug = slug + '-' + randomIDString
				rolesAdded[r]['data'][prefix + '_picture'] = pictureSlug
				await uploadpicture(type, rolesAdded[r]['pictureFile'], pictureSlug)
			}
		}

		// convert the shape of rolesAdded
		// from [{type: 'shop'}, {type:'manufacturere'}, ...]
		// to {shop: [{}, {}, ...], manufacturer: [{}, ...]}
		const rs = {}
		for(const r of rolesAdded) {
			if(!rs[r.type])
				rs[r.type] = [r.data]
			else
				rs[r.type] = [... rs[r.type], r.data]
		}

		let res = await postSubmission({
			content: submission,
			rolesSubmission: rs,
			relations: {},
			pageType: type,
			id,
			username,
			type: 'new',
			comment
		});
		if (res.ok) {
			submitState = State.SUCCESS;
			const resBody = await res.json()
			newIndex = resBody.index
			promiseNewOrganization = getNewOrganization(newIndex)
			const newAlert: Alert = {
				type: 'success',
				text: 'Successfully submitted! with:' + newIndex
			}
			handleAlert(newAlert)
		}
		else {
			submitState = State.ERROR;
			const newAlert: Alert = {
				type: 'error',
				text: 'There was an error: ' + JSON.stringify(res.body)
			}
			handleAlert(newAlert)
		}
	}

	function scrollTop() {
		window.scroll({ top: 0, behavior: 'smooth' });
	}
</script>

<Seo title="Create organization" />

<!-- <div class="text-gray-500">
	{JSON.stringify(submission)} <br>
	roles added: {JSON.stringify(rolesAdded)} <br>
	{JSON.stringify(pictureFiles)}
</div> -->
{#if submitState == State.START || submitState == State.ERROR}
<div class="flex flex-col lg:flex-row lg:gap-4">
<div class="bg-base-200 m-4 rounded-3xl mx-auto w-screen lg:w-1/2 max-w-fit">
	<div class="bg-error text-error py-4 mx-auto rounded-t-3xl">
		<h1>{$_('page.create._')} {$_(`keyword.${type}`)}</h1>
	</div>
	
	<form>
		<div class="flex flex-col lg:flex-row lg:gap-10 place-items-start p-4">
			<div class="grid grid-cols-1 lg:grid-cols-3 items-center gap-2">
				<!-- display the appropriate input type, based on key's name and selects/multiselects array-->
				{#each keys as k}
					<div class="justify-self-start lg:justify-self-end mx-2 flex flex-row gap-2">
						<div>{$_(`key.${k}`)}</div>
						<div class="text-error">{required?.includes(k)? '*' : ''}</div>
					</div>
					<div class="justify-self-start lg:col-span-2 ">
						{#if selects[k]}
							<select class="select select-bordered" bind:value={submission[k]}>
								<option disabled selected value={null}>{$_('page.create.select')}</option>
								{#each selects[k] as opt}
									<option value={opt}>{$_(`option.${opt}`)}</option>
								{/each}
							</select>
						{:else if multiselects[k]}
							<MultipleSelect selectOptions={multiselects[k]} bind:selects={submission[k]} />
						{:else if k.includes('_picture')}
							<UploadPicture key={k} bind:pictureFile={pictureFiles[k]} />
						{:else if k.includes('show')}
							<input type="checkbox" bind:checked={submission[k]} class="checkbox" />
						{:else if k.includes('description')}
							<textarea class="textarea textarea-bordered" bind:value={submission[k]} />
						{:else}
							<input type="text" class="input input-bordered" bind:value={submission[k]} />
						{/if}
					</div>
				{/each}
			</div>
		</div>
	</form>
</div>
<div class="lg:divider lg:divider-vertical"/>
<div class="bg-base-200 m-4 rounded-3xl mx-auto w-screen lg:max-w-lg">
	<div class="bg-error text-error py-4 mx-auto rounded-t-3xl">
		<h1>{$_('page.create.add_roles')}</h1>
	</div>
	<!-- display organization roles-->
	{#if (editingRoleIndex == -1)}
		<div class="flex flex-col justify-center items-center" in:fly={{ duration: 1000, y: 20, easing: quintOut }} >
			<div class="flex flex-row gap-1 m-1">
				{#each relations as role}
					<div on:click={()=>addRole(role)}><AddRoleButton {role}/></div>
				{/each}
			</div>
			{#each rolesAdded as r, ridx}
				<div class="flex flex-row justify-between items-center border-2 my-1 p-1" in:fly>
					<div class="tooltip" data-tip="edit">
						<div 
							class="btn bg-success" 
							on:click={()=>handleExpand(ridx)}
						>	
							<EditIcon size=20/>
						</div>
					</div>
					<div class="w-60 text-sm truncate">
						<p class="font-bold">{$_(`keyword.${r.type}`)}</p>
						<p>{r.data[getVarPrefix(r.type) + '_name'] || ''}</p>
					</div>
					<div class="tooltip" data-tip="remove">
						<div class="btn bg-error" on:click={()=>removeRole(ridx)}>
							<MinusCircleIcon size=20/>
						</div>
					</div>
				</div>
			{/each}
		</div>
	{/if}
	
	<!-- edit a parcitular organization role -->
	{#if (editingRoleIndex > -1)}
		<div in:fly={{ duration: 1000, y: -20, easing: quintOut }} class="m-2">
			<div class="grid grid-cols-1 lg:grid-cols-3 items-center gap-2">
				<div class="col-span-3">Editing {editingRoleType}</div>
				<!-- display the appropriate input type, based on key's name and selects/multiselects array-->
				{#each editingRolePackage.keys as k}
					<div class="justify-self-start lg:justify-self-end mx-2 flex flex-row gap-2">
						<div>{$_(`key.${k}`)}</div>
						<div class="text-error">{editingRolePackage.required?.includes(k)? '*' : ''}</div>
					</div>
					<div class="justify-self-start lg:col-span-2 ">
						{#if editingRolePackage.selects[k]}
							<select class="select select-bordered" bind:value={rolesAdded[editingRoleIndex]['data'][k]}>
								<option disabled selected value={null}>{$_('page.create.select')}</option>
								{#each editingRolePackage.selects[k] as opt}
									<option value={opt}>{$_(`option.${opt}`)}</option>
								{/each}
							</select>
						{:else if editingRolePackage.multiselects[k]}
							<MultipleSelect selectOptions={editingRolePackage.multiselects[k]} bind:selects={rolesAdded[editingRoleIndex]['data'][k]} />
						{:else if k.includes('_picture')}
							<UploadPicture key={k} bind:pictureFile={rolesAdded[editingRoleIndex]['pictureFile']} />
						{:else if k.includes('show')}
							<input type="checkbox" bind:checked={rolesAdded[editingRoleIndex]['data'][k]} class="checkbox" />
						{:else if k.includes('description')}
							<textarea class="textarea textarea-bordered" bind:value={rolesAdded[editingRoleIndex]['data'][k]} />
						{:else}
							<input type="text" class="input input-bordered" bind:value={rolesAdded[editingRoleIndex]['data'][k]} />
						{/if}
					</div>
				{/each}
				<div class="btn btn-error col-span-1" on:click={()=>removeRole(editingRoleIndex)}> Remove	</div>
				<div class="btn btn-success col-span-2" on:click={handleSave}> Save	</div>
			</div>
		</div>
	{/if}
</div>
</div>
	<div class="divider" />	
	<div class="justify-self-end mx-2">{$_('page.create.comment')}</div>
	<textarea
		class="textarea textarea-bordered"
		placeholder={$_('page.create.comment')}
		bind:value={comment}
	/><br />
	{#if submitState == State.START}
	<div class="tooltip" data-tip={canSubmit? "":"please fill in either English or Thai name"}>
		<div 
			class="btn" 
			on:click|preventDefault={handleSubmit}
			class:btn-disabled={!canSubmit}
		>
			{$_('page.create.submit')}
		</div>
	</div>
{/if}
{/if}

<div>
{#if submitState == State.SUBMITTING}
	<p>{$_('page.create.status.submitting')}</p>
	<Spinner />
{:else if submitState == State.SUCCESS}
	<p>{$_('page.create.status.success')}</p>
	{#await promiseNewOrganization then res}
		{#if res}
			<div class="mx-auto">
				<PlainCard object={res} type={"organization"}/>
			</div>
		{/if}
	{/await}
	
	<br>
	<p>{$_('page.create.status.submitmore')}</p><div class="btn" href="./create/{type}">Here</div>
{:else if submitState == State.ERROR}
	<p class="text-red">{$_('page.create.status.error')}</p>
	<div class="btn" on:click|preventDefault={handleSubmit}>{$_('page.create.submit')}</div>
{/if}
</div>

<style>
	input {
		@apply w-72;
	}

	select {
		@apply w-72;
	}

	input.checkbox {
		@apply w-5;
	}

	textarea {
		@apply w-72;
	}
</style>
