<script context=module lang=ts>
	import { getSubmissionPackage, TypeSubmissionAllowed } from '$lib/datatypes';
	import type { SubmissionPackage } from '$lib/datatypes';
	import { fromBucket, getVarPrefix } from '$lib/supabase';
	import type { SubmissionData } from '$lib/supabase';
	import type {Alert} from '$lib/alert/alert.type'
	import {handleAlert} from '$lib/alert/alert.store'

	export async function load({ session, params, fetch }) {
		const type = params.type;
		const { user } = session

		const adminSettings = await fetch('/api/adminsettings')
		const data = await adminSettings.json()

		// redirect if
		// * type is invalid 
		// * creating a new entry is not allowed
		// * creating a new entry is allowed for registered user, not guest
		if (!TypeSubmissionAllowed.includes(type) 
			|| (!data[0].allowCreate)
			|| (!data[0].allowGuestCreate && !user)) {

			let newAlert: Alert = {
				type: 'error',
				text: ''
			}
			if(!TypeSubmissionAllowed.includes(type))	
				newAlert.text = `${type} is not a valid page.`
			else if(!data[0].allowCreate) 
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
				data: getSubmissionPackage(type),
				type: type
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
</script>

<script lang="ts">
	import Seo from '$lib/components/SEO.svelte';
	import { user, getCurrUserProfile } from '$lib/user';
	import Spinner from '$lib/components/Spinner.svelte';
	import MultipleSelect from '$lib/components/MultipleSelect.svelte';
	import SearchMultipleSelect from '$lib/components/SearchMultipleSelect.svelte';
	import UploadPicture from '$lib/components/UploadPicture.svelte';
	import SveltyPicker from 'svelty-picker';
	import { _ } from 'svelte-i18n';

	export let data: SubmissionPackage, type: string; // from load fucntion
	const { submission, keys, relations, selects, multiselects, required } = data; // destruct

	// create an array for each relation
	let relationMultiSelects: Record<string, string[]> = {};
	relations.forEach((r) => (relationMultiSelects[r] = []));

	// extra info
	let comment: string;
	const pictureKeys = keys.filter((k) => k.includes('picture')); // in case there are more than one picture
	let pictureFiles: Record<string, File> = {};
	pictureKeys.forEach((k) => (pictureFiles[k] = null));

	// show user a page based on the submission state
	const enum State {
		START,
		SUBMITTING,
		SUCCESS,
		ERROR
	}
	let submitState: State = State.START;
	let canSubmit: boolean 
	$: canSubmit = !required || required.every(r => !!submission[r])

	async function handleSubmit() {
		if (submitState != State.START && submitState != State.ERROR) return;
		if (!canSubmit) {
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
			rolesSubmission: {},
			relations: relationMultiSelects,
			pageType: type,
			id,
			username,
			type: 'new',
			comment
		});
		if (res.ok) {
			submitState = State.SUCCESS;
			const newAlert: Alert = {
				type: 'success',
				text: 'Successfully submitted!'
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

<Seo title="Create {type}" />

<div class="bg-base-200 m-4 rounded-3xl">
<div class="bg-error text-error py-4 my-4 mx-auto rounded-t-3xl">
<h1>{$_('page.create._')} {$_(`keyword.${type}`)}</h1>
</div>
<!-- <div class="text-gray-500">
{JSON.stringify(submission)}
{JSON.stringify(relationMultiSelects)}
</div> -->
{#if submitState == State.START || submitState == State.ERROR}
	<form>
		<div class="flex flex-col lg:flex-row lg:gap-10 place-items-start p-4">
			<div class="grid grid-cols-1 lg:grid-cols-3 items-center gap-2">
				<!-- display the appropriate input type, based on key's name and selects/multiselects array-->
				{#each keys as k}
					<div class="justyfi-self-start lg:justify-self-end mx-2 flex flex-row gap-2">
						<div>{$_(`key.${k}`)}</div>
						<div class="text-error">{required?.includes(k)? '*' : ''}</div>
					</div>
					<div class="justify-self-start lg:col-span-2">
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
						{:else if k.includes('_time')}
							<SveltyPicker
								inputClasses="form-control"
								format="yyyy-mm-dd"
								bind:value={submission[k]}
							/>
						{:else if k.includes('show')}
							<input type="checkbox" bind:checked={submission[k]} class="checkbox"/>
						{:else if k.includes('description')}
							<textarea class="textarea textarea-bordered" bind:value={submission[k]} />
						{:else}
							<input type="text" class="input input-bordered" bind:value={submission[k]} />
						{/if}
					</div>
				{/each}
			</div>
			<div class="lg:divider lg:divider-vertical" />
			<div>
				<div class="divider block lg:hidden" />
				<div class="flex flex-col justify-center">
					{#each relations as r}
						<SearchMultipleSelect bind:selects={relationMultiSelects[r]} type={r} />
					{/each}
				</div>
			</div>
		</div>
	</form>
	<div class="divider" />
	<div class="justify-self-end mx-2">{$_('page.create.comment')}</div>
	<textarea
		class="textarea textarea-bordered"
		placeholder={$_('page.create.comment')}
		bind:value={comment}
	/><br />
	{#if submitState == State.START}
		<div class="tooltip" data-tip={canSubmit? "":"please fill in all required fields"}>
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
</div>



{#if submitState == State.SUBMITTING}
	<p>{$_('page.create.status.submitting')}</p>
	<Spinner />
{:else if submitState == State.SUCCESS}
	<p>{$_('page.create.status.success')}</p>
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
		@apply w-8;
	}

	textarea {
		@apply w-72;
	}
</style>
