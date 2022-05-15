<script context=module lang=ts>
	import { getSubmissionPackage } from '$lib/datatypes';
	import type { SubmissionPackage } from '$lib/datatypes';
	import { fromBucket, getVarPrefix } from '$lib/supabase';
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
				data: getSubmissionPackage('person'),
			}
		};
	}

	// TODO: make sure nothing breaks in production
	export async function postSubmission(data): Promise<Response> {
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

	export async function getNewPerson(id: number){
		const newPerson = await fetch(`/api/person/${id}`)
		const data = await newPerson.json()
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
	import { EditIcon, PlusCircleIcon, MinusCircleIcon, InfoIcon } from 'svelte-feather-icons';
	import PersonCard from '$lib/components/PersonCard.svelte';

	export let data: SubmissionPackage; // from load fucntion
	const type: string = 'person';
	const { submission, keys, relations, selects, multiselects, required } = data; // destruct

	// create an array for each relation
	let rolesAdded: Record<string, any> = {};

	// extra info
	let comment: string;
	const pictureKeys = keys.filter((k) => k.includes('picture')); // in case there are more than one picture
	let pictureFiles: Record<string, File> = {};
	pictureKeys.forEach((k) => (pictureFiles[k] = null));

	let expandedRole: number = -1;
	let editingRole: string[] = []
	$: currentRole = relations[expandedRole] || ''
	$: currentRolePrefix = relations[expandedRole] ? getVarPrefix(relations[expandedRole]) : ''
	// TODO: use getSubmissionPackage to get all keys
	$: editingRole = [`${currentRolePrefix}_name`, `${currentRolePrefix}_name_th`, `${currentRolePrefix}_link`, `${currentRolePrefix}_description`, `${currentRolePrefix}_show`]
	// show user a page based on the submission state
	const enum State {
		START,
		SUBMITTING,
		SUCCESS,
		ERROR
	}
	let submitState = State.START;
	let canSubmit: boolean = false
	$: canSubmit = submission.Person_name || submission.Person_name_th
	let newIndex: number
	let promiseNewPerson: Promise<any>

	function handleExpand(idx: number) {
		if(!rolesAdded[relations[idx]]) {
			const prefix = getVarPrefix(relations[idx])
			const newRoleInfo = {
				[`${prefix}_name`]: submission.Person_name,
				[`${prefix}_name_th`]: submission.Person_name_th,
			}
			rolesAdded[relations[idx]] = [newRoleInfo] // make it an array to match other relational objects
		}
		else if (expandedRole == idx)
			expandedRole = -1
		else
			expandedRole = idx
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

		if (!submission[getVarPrefix(type) + '_name'] && !submission[getVarPrefix(type) + '_name_th']) {
			const newAlert: Alert = {
				type: 'error',
				text: 'please enter either English or Thai name'
			}
			handleAlert(newAlert)
			return
		}

		submitState = State.SUBMITTING;

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
		let name = submission[getVarPrefix(type) + '_name'];
		if (!name || name.length == 0) name = 'no-slug';

		const slug = name
			.toLowerCase()
			.replace(/\s/g, '-') // replace white spaces by dashes
			.replace(/[^\w\-]/g, ''); // remove non alphanumeric characters (except dashes of course)
		submission[getVarPrefix(type) + '_slug'] = slug;

		// rename picture with random ID for hashing purpose
		for (const pf in pictureFiles) {
			if(pictureFiles[pf]) {
				const randomID = Math.floor(Math.random() * 1000);
				const randomIDString = ('000' + randomID).slice(-4);
				submission[pf] = slug + randomIDString;
				await uploadpicture(type, pictureFiles[pf], slug + randomIDString);
			}
		}

		let res = await postSubmission({
			content: submission,
			relations: rolesAdded,
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
			promiseNewPerson = getNewPerson(newIndex)
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
</script>

<Seo title="Create person" />

<div class="text-gray-500">
	{JSON.stringify(submission)}
	{JSON.stringify(rolesAdded)}
	</div>
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
<div class="bg-base-200 m-4 rounded-3xl mx-auto w-screen lg:w-1/2 max-w-lg">
	<div class="bg-error text-error py-4 mx-auto rounded-t-3xl">
		<h1>{$_('page.create.add_roles')}</h1>
	</div>
	{#if (expandedRole == -1)}
		<div class="flex flex-col justify-center items-center" in:fly={{ duration: 400, y: -20, easing: quintOut }} >
			{#each relations as r, ridx}
				<div>
					<div class="btn-group my-2 group">
						<div 
							class="btn bg-base-200 hover:bg-success" 
							class:bg-success={!!rolesAdded[r]}
							on:click={()=>handleExpand(ridx)}
						>	
							{#if rolesAdded[r]}
								<div><EditIcon size=20/></div>
							{:else}
								<div><PlusCircleIcon size=20/></div>
							{/if}
						</div>
						<div
							class="btn w-48" class:bg-success={rolesAdded[r]}
						>
							{$_(`keyword.${r}`)}
						</div>
						<div 
							class="btn bg-base-200 hover:bg-error"
							class:bg-error={rolesAdded[r]}
						>
							{#if rolesAdded[r]}
								<div on:click={()=>{delete rolesAdded[r]; rolesAdded = rolesAdded}}>
									<MinusCircleIcon size=20/>
								</div>
							{:else}
								<div>
									<InfoIcon size=20/>
								</div>
							{/if}
						</div>
					</div>
				</div>
			{/each}
		</div>
	{/if}
	
	{#if (expandedRole > -1)}
		<div in:fly={{ duration: 400, y: -20, easing: quintOut }} class="m-2">
			<div class="grid grid-cols-1 lg:grid-cols-3 items-center gap-2">
				<div class="col-span-3">{$_(`keyword.${relations[expandedRole]}`)}</div>
				<!-- display the appropriate input type, based on key's name and selects/multiselects array-->
				{#each editingRole as k}
					<div class="justify-self-start lg:justify-self-end mx-2 flex flex-row gap-2">
						<div>{$_(`key.${k}`)}</div>
						<div class="text-error">{required?.includes(k)? '*' : ''}</div>
					</div>
					<div class="justify-self-start lg:col-span-2 ">
						{#if k.includes('show')}
							<input type="checkbox" bind:checked={rolesAdded[currentRole][0][k]} class="checkbox" />
						{:else if k.includes('description')}
							<textarea class="textarea textarea-bordered" bind:value={rolesAdded[currentRole][0][k]} />
						{:else}
							<input type="text" class="input input-bordered" bind:value={rolesAdded[currentRole][0][k]} />
						{/if}
					</div>
				{/each}
				<div class="btn btn-success col-span-3" on:click={()=>handleExpand(expandedRole)}> Save	</div>
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

{#if submitState == State.SUBMITTING}
	<p>{$_('page.create.status.submitting')}</p>
	<Spinner />
{:else if submitState == State.SUCCESS}
	<p>{$_('page.create.status.success')}</p>
	{#await promiseNewPerson then res}
		{#if res}
			<div class="mx-auto">
				<PersonCard person={res}/>
			</div>
		{/if}
	{/await}
	
	<br>
	<p>{$_('page.create.status.submitmore')}</p><div class="btn" href="./create/{type}">Here</div>
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
		@apply w-5;
	}

	textarea {
		@apply w-72;
	}
</style>
