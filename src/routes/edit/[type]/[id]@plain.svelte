<script context=module lang=ts>
	import { getSubmissionPackage, TypeSubmissionAllowed } from '$lib/datatypes';
	import type { SubmissionPackage, AdminSettings } from '$lib/datatypes';
	import { getVarPrefix, uploadPicture } from '$lib/supabase';
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
				redirect: '/add/'
			};
		}

		return {
			props: {
				submissionPackage: getSubmissionPackage(type),
				currentData,
				type,
				adminSettings
			}
		};
	}

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
</script>

<script lang="ts">
	import Seo from '$lib/components/SEO.svelte';
	import { user, getCurrUserProfile } from '$lib/user';
	import Spinner from '$lib/components/Spinner.svelte';
	import SearchMultipleSelect from '$lib/components/SearchMultipleSelect.svelte';
	import { _ } from 'svelte-i18n';
	import {onMount} from 'svelte'
	import InputEditForm from '$lib/components/InputEditForm.svelte';
	import CreateCard from '../_createCard.svelte'
	import { ChevronLeftIcon, ChevronRightIcon } from 'svelte-feather-icons';

	export let submissionPackage: SubmissionPackage, 
		type: string, 
		currentData: any, // from load function
		adminSettings: AdminSettings
	let { submission, keys, relations, selects, multiselects, required } = submissionPackage; // destruct
	const typePrefix = getVarPrefix(type)
	const currentDataID = currentData[typePrefix + '_ID']

	// for edit
	submission[typePrefix + '_ID'] = currentDataID

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

	// show user a page based on the submission state
	const enum State {
		START,
		SUBMITTING,
		SUCCESS,
		ERROR
	}
	let submitState = State.START;

	$: canSubmit = required.every(r => !!submission[r] || !!currentData[r]) &&
		(submission[typePrefix + '_name'] || currentData[typePrefix + '_name'])

	// use these to display the newly created boardgame right away!
	let step: number = 0
	let dir: number = 1
	const stepTitles = [
		'Edit General info',
		'Edit relations',
		'Submit'
	]

	async function handleSubmit() {
		if (submitState != State.START && submitState != State.ERROR) return;
		if (required && !canSubmit) {
			const missingFields = required?.filter(r => (!submission[r] && !currentData[r])).join(',')
			const newAlert: Alert = {
				type: 'error',
				text: 'please fill all required fields: ' +  missingFields
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

		const slug = currentData[typePrefix + '_slug']
		
		// assuming there is only one picture
		const pictureFile = submission[typePrefix + '_picture']
		if(pictureFile && (typeof pictureFile !== 'string')) {
			submission[typePrefix + '_picture'] = await uploadPicture(type, pictureFile, slug);
		}

		// also add current data's ID so that we don't need to find it again
		let res = await postSubmission({
			content: submission,
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
</script>

<Seo title="Edit {type}" />

<svelte:window on:beforeunload={(e)=> {
	if (submitState == State.SUCCESS)
		return '';
	e.returnValue = '...'; 
	return '...'
}}/>
	

{#if submitState == State.START || submitState == State.ERROR}
<ul class="steps w-screen fixed top-0 -translate-x-1/2 glass z-10">
	{#each stepTitles as s, idx}
		<li class="step text-xs lg:text-md" class:step-primary={step >= idx}>
			{s}
		</li>
	{/each}
 </ul>
<div class="h-16"></div>

{#if step == 0}
	<CreateCard bind:dir title={stepTitles[0]}>
		<InputEditForm
			{submissionPackage}
			bind:inputs={submission}
			{currentData}
		>
		</InputEditForm>
	</CreateCard>

	<div class="tooltip" data-tip={canSubmit? "":"please fill in all required fields"}>
		<div 
			class="btn"
			on:click|preventDefault={()=>{step++; dir = 1}}
			class:btn-disabled={!canSubmit}
		>
			Next <ChevronRightIcon size=20/>
		</div>
	</div>
{:else if step == 1}
	<CreateCard bind:dir title={stepTitles[1]}>
		<div class="grid grid-cols2 lg:grid-cols-3 gap-y-4">
			{#if loadingRelationalData}
				<Spinner/>
			{:else}
				{#each relations as r}
					<SearchMultipleSelect bind:selects={relationMultiSelects[r]} type={r} />
				{/each}
			{/if}
		</div>
	</CreateCard>
	<div class="btn" on:click={()=>{step--; dir = -1}}>Prev</div>
	<div class="btn" on:click={()=>{step++; dir = 1}}>Next</div>
{:else if step == 2}
	<CreateCard bind:dir title={"Submit"}>
		{#if adminSettings.requireApproval}
			<div class="justify-self-end mx-2">{$_('page.add.comment')}</div>
			<textarea
				class="textarea textarea-bordered"
				placeholder={$_('page.add.comment')}
				bind:value={comment}
			/><br />
		{/if}
	</CreateCard>
	<div class="btn hover:-translate-x-4" on:click={()=>{step = 1; dir = -1}}>Prev <ChevronLeftIcon size=20/></div>
	<div 
		class="btn btn-success" 
		on:click|preventDefault={handleSubmit}
	>
		{$_('page.add.submit')}
	</div>

{/if}
{/if}

{#if submitState == State.SUBMITTING}
	<p>{$_('page.add.status.submitting')}</p>
	<Spinner />
{:else if submitState == State.SUCCESS}
	<p>{$_('page.add.status.success')}</p>
	<p>Go back to <a href="/{type}/{currentData[getVarPrefix(type) + '_ID']}" class="text-info"> {currentData[getVarPrefix(type) + '_name']}</a></p>
{:else if submitState == State.ERROR}
	<p class="text-red">{$_('page.add.status.error')}</p>
	<div class="btn" on:click|preventDefault={handleSubmit}>{$_('page.add.submit')}</div>
{/if}