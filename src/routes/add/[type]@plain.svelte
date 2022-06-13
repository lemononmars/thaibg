<script context=module lang=ts>
	import { getSubmissionPackage, TypeSubmissionAllowed } from '$lib/datatypes';
	import type { SubmissionPackage, AdminSettings } from '$lib/datatypes';
	import { fromBucket, getVarPrefix, generateSlug } from '$lib/supabase';
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
				newAlert.text = 'Please login to add a new entry.'
			handleAlert(newAlert)

			return {
				status: 303,
				redirect: '/add/'
			};
		}

		return {
			props: {
				data: getSubmissionPackage(type),
				type,
				adminSettings
			}
		};
	}

   // HURRAY ! It runs on server now
	// TODO: make sure nothing breaks in production
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

	export async function getNewType(type: string, id: number){
		const newBoardgame = await fetch(`/api/${type}/${id}`)
		const data = await newBoardgame.json()
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

	export let data: SubmissionPackage, 
		type: string, // from load fucntion
		adminSettings: AdminSettings;
	let {submission, relations, required} = data; // destruct
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
			await uploadpicture(type, pictureFile, slug);
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

<Seo title="{$_('page.add._')} {type}" />

<div class="bg-base-200 m-4 rounded-3xl">
	<div class="bg-error py-4 mx-auto rounded-t-3xl">
		<div class="text-content-error text-2xl">
			{#if $locale?.includes('en')}
				{$_('page.add._')} {$_('page.add.new')} {$_(`keyword.${type}`)}
			{:else}
				{$_('page.add._')}{$_(`keyword.${type}`)}{$_('page.add.new')}
			{/if}
		</div>
	</div>
	<div class="text-gray-500">
	</div>
		{#if submitState == State.START || submitState == State.ERROR}
			<form>
				<div class="flex flex-col lg:flex-row lg:gap-10 place-items-start p-4">
					<InputForm
						submissionPackage={data}
						bind:inputs={submission}
					>
						<span name="header">
							Edit
						</span>
					</InputForm>
					<div class="divider divider-vertical"/>
					<div class="flex flex-col justify-center">
						{#each relations as r}
							<SearchMultipleSelect 
								bind:selects={relationMultiSelects[r]} 
								type={r} 
								relation={type}
							/>
						{/each}
					</div>
				</div>
			</form>
			<div class="divider" />
			{#if adminSettings.requireApproval}
			<div class="justify-self-end mx-2">{$_('page.add.comment')}</div>
				<textarea
					class="textarea textarea-bordered"
					placeholder={$_('page.add.comment')}
					bind:value={comment}
				/><br />
			{/if}
			{#if submitState == State.START}
				<div class="tooltip" data-tip={canSubmit? "":"please fill in all required fields"}>
					<div 
						class="btn" 
						on:click|preventDefault={handleSubmit}
						class:btn-disabled={!canSubmit}
					>
						{$_('page.add.submit')}
					</div>
				</div>
			{/if}
		{/if}
	</div>



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