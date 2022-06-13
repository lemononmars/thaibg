<script context=module lang=ts>
	import { getSubmissionPackage } from '$lib/datatypes'
	import {
		BoardgameDatabaseKeys1,
		BoardgameDatabaseKeys2,
		BoardgamePersonRelation,
		BoardgameInfoRelation,
		BoardgameProperties,
		BoardgameETCRelation,
	} from '$lib/datatypes/Boardgame'

	import type { SubmissionPackage, AdminSettings, Boardgame } from '$lib/datatypes';
	import { fromBucket, getVarPrefix } from '$lib/supabase';
	import type { SubmissionData } from '$lib/supabase'
	import type {Alert} from '$lib/alert/alert.type'
	import {handleAlert} from '$lib/alert/alert.store'

	export async function load({ fetch, params, session }) {
		const {id} = params;
		const { user } = session

		const res = await fetch('/api/adminsettings')
		const adminSettings = await res.json()
		const res2 = await fetch(`/api/boardgame/${id}`)
		const currentData = await res2.json()

		// redirect if
		// * type is invalid 
		// * creating a new entry is not allowed
		// * creating a new entry is allowed for registered user, not guest
		if ((!adminSettings[0].allowEdit)
			|| (!adminSettings[0].allowGuestEdit && !user)) {

			let newAlert: Alert = {
				type: 'error',
				text: ''
			}
			if(!adminSettings[0].allowEdit) 
				newAlert.text = 'Editing a new entry is not allowed. Please contact admin.'
			else 
				newAlert.text = 'Please login to edit an entry.'
			handleAlert(newAlert)

			return {
				status: 303,
				redirect: '/'
			};
		}

		return {
			props: {
				submissionPackage: getSubmissionPackage('boardgame'),
				currentData,
				adminSettings
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

	export async function uploadpicture(type: string, file: File, slug: string): Promise<string> {
		// TODO: convert file? resize?
		const randomID = Math.floor(Math.random() * 1000);
		const randomIDString = ('000' + randomID).slice(-4);
		const pictureSlug = slug + '-' + randomIDString;

		let { error: updateError } = await fromBucket('images').upload(
			`${type}/${pictureSlug}`,
			file,
			{
				upsert: false
			}
		);

		if (updateError) throw updateError;
		return pictureSlug
	}
</script>

<script lang="ts">
	import Seo from '$lib/components/SEO.svelte';
	import { user, getCurrUserProfile } from '$lib/user';
	import Spinner from '$lib/components/Spinner.svelte';
	import { _ } from 'svelte-i18n';
	import InputEditForm from '$lib/components/InputEditForm.svelte';
	import SearchMultipleSelect from '$lib/components/SearchMultipleSelect.svelte';
	import CreateCard from '../_createCard.svelte'
	import { ChevronLeftIcon, ChevronRightIcon } from 'svelte-feather-icons';
	import {onMount} from 'svelte'

	export let submissionPackage: SubmissionPackage,
		adminSettings: AdminSettings,
		currentData: Boardgame
	const type: string = 'boardgame';
	let { submission, keys, relations, selects, multiselects, required } = submissionPackage; // destruct
	const varPrefix = getVarPrefix(type)
	const currentDataID = currentData[varPrefix + '_ID']

	// for edit
	submission[varPrefix + '_ID'] = currentDataID

	// create an array for each relation
	let relationMultiSelects: Record<string, string[]> = {};
	relations.forEach((r) => (relationMultiSelects[r] = []));

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
		(submission.TBG_name || currentData.TBG_name || submission.TBG_name_th || currentData.TBG_name_th)

	// use these to display the newly created boardgame right away!
	let step: number = 0
	let dir: number = 1
	const stepTitles = [
		'Edit General info',
		'Edit Board game specific info',
		'Edit developers',
		'Edit other relations',
		'Submit'
	]

	async function handleSubmit() {
		if (submitState != State.START && submitState != State.ERROR) return;
		if (required && !canSubmit) {
			const missingFields = required?.filter(r => !submission[r]).join(',')
			const newAlert: Alert = {
				type: 'error',
				text: 'please fill all required fields: ' +  missingFields
			}
			handleAlert(newAlert)
			return
		}

		submitState = State.SUBMITTING;
		const typePrefix = getVarPrefix(type)

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

		const slug = currentData[varPrefix + '_slug']
		// rename picture with random ID for hashing purpose
		const pictureFile = submission.TBG_picture
		if(pictureFile && (typeof pictureFile !== 'string')) {
			submission.TBG_picture = await uploadpicture(type, pictureFile, slug);
		}

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

<Seo title="Create boardgame" />

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
			submissionPackage={
				{...submissionPackage, 
					keys:BoardgameDatabaseKeys1}
			}
			bind:inputs={submission}
			{currentData}
		>
		</InputEditForm>
	</CreateCard>

	<div class="tooltip" data-tip={canSubmit? "":"please fill in either English or Thai name"}>
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
		<InputEditForm
		submissionPackage={
			{...submissionPackage, 
				keys:BoardgameDatabaseKeys2}
		}
			bind:inputs={submission}
			{currentData}
		>
		</InputEditForm>
		<div class="grid lg:grid-cols-3 gap-y-4">
			{#each BoardgameProperties as r}
				<SearchMultipleSelect bind:selects={relationMultiSelects[r]} type={r} />
			{/each}
		</div>
	</CreateCard>
	<div class="btn" on:click={()=>{step--; dir = -1}}>Prev</div>
	<div class="btn" on:click={()=>{step++; dir = 1}}>Next</div>
{:else if step == 2}
	<CreateCard bind:dir title={stepTitles[2]}>
		<div class="grid lg:grid-cols-3 gap-y-4">
			{#each BoardgamePersonRelation as r}
				<SearchMultipleSelect bind:selects={relationMultiSelects[r]} type={r} />
			{/each}
			{#each BoardgameInfoRelation as r}
				<SearchMultipleSelect bind:selects={relationMultiSelects[r]} type={r} />
			{/each}
		</div>
	</CreateCard>
	<div class="btn" on:click={()=>{step--; dir = -1}}>Prev</div>
	<div class="btn" on:click={()=>{step++; dir = 1}}>Next</div>
{:else if step == 3}
	<CreateCard bind:dir title={stepTitles[3]}>
		<div class="grid grid-cols2 lg:grid-cols-3 gap-y-4">
			{#each BoardgameETCRelation as r}
				<SearchMultipleSelect bind:selects={relationMultiSelects[r]} type={r} />
			{/each}
		</div>
	</CreateCard>
	<div class="btn" on:click={()=>{step--; dir = -1}}>Prev</div>
	<div class="btn" on:click={()=>{step++; dir = 1}}>Next</div>
{:else if step == 4}
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

<div>
{#if submitState == State.SUBMITTING}
	<p>{$_('page.add.status.submitting')}</p>
	<Spinner />
{:else if submitState == State.SUCCESS}
	<p>{$_('page.add.status.success')}</p>
	<p>Go back to <a href="/{type}/{currentData[getVarPrefix(type) + '_ID']}" class="text-info"> {currentData.TBG_name}</a></p>
	
	<br>
	<p>{$_('page.add.status.submitmore')}</p><div class="btn" href="./add/{type}">Here</div>
{:else if submitState == State.ERROR}
	<p class="text-red">{$_('page.add.status.error')}</p>
	<div class="btn" on:click|preventDefault={handleSubmit}>{$_('page.add.submit')}</div>
{/if}
</div>