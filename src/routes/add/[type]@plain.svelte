<script context=module lang=ts>
	import { getSubmissionPackage, TypeSubmissionAllowed } from '$lib/datatypes';
	import type { SubmissionPackage, AdminSettings } from '$lib/datatypes';
	import { uploadPicture, getVarPrefix, generateSlug } from '$lib/supabase';
	import type { SubmissionData } from '$lib/supabase';
	import type {Alert} from '$lib/alert/alert.type'
	import {handleAlert} from '$lib/alert/alert.store'

	export async function load({ session, params, fetch }) {
		const type = params.type;
		const { user } = session

		const res = await fetch('/api/adminsettings')
		const adminSettings = await res.json()

		// redirect if
		// * type is invalid 
		// * creating a new entry is not allowed
		// * creating a new entry is allowed for registered user, not guest
		if (!TypeSubmissionAllowed.includes(type) 
			|| (!adminSettings[0].allowCreate)
			|| (!adminSettings[0].allowGuestCreate && !user)) {

			let newAlert: Alert = {
				type: 'error',
				text: ''
			}
			if(!TypeSubmissionAllowed.includes(type))	
				newAlert.text = `${type} is not a valid page.`
			else if(!adminSettings[0].allowCreate) 
				newAlert.text = 'Creating a new entry is not allowed. Please contact admin.'
			else 
				newAlert.text = 'Please login to add a new entry.'
			handleAlert(newAlert)

			return {
				status: 303,
				redirect: '/add/'
			};
		}

		return {
			props: {
				submissionPackage: getSubmissionPackage(type),
				type,
				adminSettings
			}
		};
	}

	export async function postSubmission(data: SubmissionData): Promise<Response> {
      return await fetch('/api/post/submission', {
         method: 'POST',
         cache: 'default',
         credentials: 'same-origin',
         headers: {
            'Content-Type': 'application/json'
         },
         body: JSON.stringify(data)
      })
	}

	export async function getNewType(type: string, id: number){
		const newType = await fetch(`/api/${type}/${id}`)
		const data = await newType.json()
		return data
	}
</script>

<script lang="ts">
	import Seo from '$lib/components/SEO.svelte';
	import { user, getCurrUserProfile } from '$lib/user';
	import Spinner from '$lib/components/Spinner.svelte';
	import InputForm from '$lib/components/InputForm.svelte';
	import SearchMultipleSelect from '$lib/components/SearchMultipleSelect.svelte'
	import PlainCard from '$lib/components/PlainCard.svelte'
	import { _, locale } from 'svelte-i18n';
	import CreateCard from './_createCard.svelte'
	import { ChevronLeftIcon } from 'svelte-feather-icons';

	export let submissionPackage: SubmissionPackage, 
		type: string, // from load fucntion
		adminSettings: AdminSettings;
	let {submission, relations, required} = submissionPackage; // destruct

	const typePrefix = getVarPrefix(type)
	submission[typePrefix + '_show'] = true

	// create an array for each relation
	let relationMultiSelects: Record<string, string[]> = {};
	relations.forEach((r) => (relationMultiSelects[r] = []));

	// extra info
	let comment: string;

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

	// use these to display the newly created boardgame right away!
	let newIndex: number
	let promiseNewType: Promise<any>
	let step: number = 0
	let dir: number = 1
	const stepTitles = [
		'Add general info',
		'Add relations',
		'Submit'
	]

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

		if (!submission[getVarPrefix(type) + '_name']) {
			const newAlert: Alert = {
				type: 'error',
				text: 'please enter a name'
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

		const slug = generateSlug(submission[typePrefix + '_name'])
		submission[typePrefix + '_slug'] = slug

		// rename picture with random ID for hashing purpose
		const pictureFile = submission[typePrefix + '_picture']
		if(pictureFile) {
			submission[typePrefix + '_picture'] = 
			await uploadPicture(type, pictureFile, slug);
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
			const resBody = await res.json()
			newIndex = resBody.index
			promiseNewType = getNewType(type, newIndex)
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
			console.log(JSON.stringify(res.body))
		}
	}
</script>

<Seo title="{$_('page.add._')}{type}" />

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
		<form>
			<div class="flex flex-col lg:flex-row lg:gap-10 place-items-start p-4">
				<InputForm
					{submissionPackage}
					bind:inputs={submission}
				>
				</InputForm>
			</div>
		</form>
	</CreateCard>
	<div class="tooltip" data-tip={canSubmit? "":"please fill all required fields:"}>
		<div 
			class="btn"
			on:click|preventDefault={()=>{step++; dir = 1}}
			class:btn-disabled={!canSubmit}
		>
			Next
		</div>
	</div>
{:else if step == 1}
	<CreateCard bind:dir title={stepTitles[1]}>
		<div class="grid grid-cols2 lg:grid-cols-3 gap-y-4">
			{#each relations as r}
				<SearchMultipleSelect bind:selects={relationMultiSelects[r]} type={r} />
			{/each}
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
	{#await promiseNewType then res}
		{#if res}
			<div class="mx-auto">
				<PlainCard object={res} {type}/>
			</div>
		{/if}
	{/await}
	<p>{$_('page.add.status.submitmore')}</p><div class="btn" href="./add/{type}">Here</div>
{:else if submitState == State.ERROR}
	<p class="text-red">{$_('page.add.status.error')}</p>
	<div class="btn" on:click|preventDefault={handleSubmit}>{$_('page.add.submit')}</div>
{/if}