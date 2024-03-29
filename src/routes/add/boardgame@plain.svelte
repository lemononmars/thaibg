<script context=module lang=ts>
	import { getSubmissionPackage, type AdminSettings } from '$lib/datatypes';
	import {
		BoardgameDatabaseKeys1,
		BoardgameDatabaseKeys2,
		BoardgamePersonRelation,
		BoardgameInfoRelation,
		BoardgameProperties,
		BoardgameETCRelation,
	} from '$lib/datatypes/Boardgame'

	import type { SubmissionPackage, TypeName } from '$lib/datatypes';
	import { generateSlug, uploadPicture, getVarPrefix } from '$lib/supabase';
	import type { SubmissionData } from '$lib/supabase'
	import type {Alert} from '$lib/alert/alert.type'
	import {handleAlert} from '$lib/alert/alert.store'

	export async function load({ session, fetch }) {
		const { user } = session

		const res = await fetch('/api/adminsettings')
		const adminSettings = await res.json()

		// redirect if
		// * type is invalid 
		// * creating a new entry is not allowed
		// * creating a new entry is allowed for registered user, not guest
		if ((!adminSettings[0].allowCreate)
			|| (!adminSettings[0].allowGuestCreate && !user)) {

			let newAlert: Alert = {
				type: 'error',
				text: ''
			}
			if(!adminSettings[0].allowCreate) 
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
				submissionPackage: getSubmissionPackage('boardgame'),
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

	export async function getNewBoardgame(id: number){
		const newBoardgame = await fetch(`/api/boardgame/${id}`)
		const data = await newBoardgame.json()
		return data
	}
</script>

<script lang="ts">
	import Seo from '$lib/components/SEO.svelte';
	import { user, getCurrUserProfile } from '$lib/user';
	import { _ } from 'svelte-i18n';
	import BoardgameCard from '$lib/components/BoardgameCard.svelte';
	import InputForm from '$lib/components/InputForm.svelte';
	import SearchMultipleSelect from '$lib/components/SearchMultipleSelect.svelte';
	import CreateCard from './_createCard.svelte'
	import { ChevronLeftIcon, ChevronRightIcon } from 'svelte-feather-icons';
	import SubmissionStatus from '$lib/components/SubmissionStatus.svelte';

	export let submissionPackage: SubmissionPackage; // from load fucntion
	export let adminSettings: AdminSettings
	const type: TypeName = 'boardgame';
	let {relations, submission, required} = submissionPackage
	
	// create an array for each relation
	let relationMultiSelects: Record<string, string[]> = {};
	relations.forEach((r) => (relationMultiSelects[r] = []));

	submission.TBG_show = true // default = show

	// extra info
	let comment: string;

	// show user a page based on the submission state
	const enum State {
		START,
		SUBMITTING,
		SUCCESS,
		ERROR
	}
	let submitState = State.START;
	let canSubmit: boolean = false
	$: canSubmit = submission.TBG_name || submission.TBG_name_th

	// use these to display the newly created boardgame right away!
	let newIndex: number
	let promiseNewBoardgame: Promise<any>
	let step: number = 0
	let dir: number = 1
	const stepTitles = [
		'Add general info',
		'Add board game specific info',
		'Add developers',
		'Add other relations',
		'Submit'
	]

	async function handleSubmit() {
		if (submitState != State.START && submitState != State.ERROR) return;
		if (required && !required.every(r => !!submission[r])) {
			const missingFields = required.filter(r => !submission[r]).join(',')
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
		const slug = generateSlug(submission[typePrefix + '_name'])
		submission[typePrefix + '_slug'] = slug;

		const pictureFile = submission.TBG_picture
		if(pictureFile)
			submission.TBG_picture = await uploadPicture("boardgame", pictureFile, slug);
		const coverPictureFile = submission.TBG_picture_cover
		if(coverPictureFile)
			submission.TBG_picture_cover = await uploadPicture("boardgame", coverPictureFile, slug);

		let res = await postSubmission({
			content: submission,
			rolesSubmission: {},
			relations: relationMultiSelects,
			pageType: type,
			id,
			username,
			type: 'new',
			comment,
			consent
		});
		if (res.ok) {
			submitState = State.SUCCESS;
			const resBody = await res.json()
			newIndex = resBody.index
			promiseNewBoardgame = getNewBoardgame(newIndex)
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

	let consent:boolean[] = [true, false, false]
</script>

<Seo title="Create boardgame" />
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
						submissionPackage={
							{...submissionPackage, 
								keys:BoardgameDatabaseKeys1}
						}
						{type}
						bind:inputs={submission}
					>
						<span name="header">
							Edit
						</span>
					</InputForm>
				</div>
			</form>
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
			<form>
				<div class="flex flex-col lg:flex-row lg:gap-10 place-items-start p-4">
					<InputForm
					submissionPackage={
						{...submissionPackage, 
							keys:BoardgameDatabaseKeys2}
					}
						bind:inputs={submission}
						{type}
					>
					</InputForm>
				</div>
			</form>
			<div class="grid lg:grid-cols-3 gap-y-4">
				{#each BoardgameProperties as r}
					<SearchMultipleSelect bind:selects={relationMultiSelects[r]} type={r} />
				{/each}
			</div>
		</CreateCard>
		<div class="btn" on:click={()=>{step--; dir = -1}}>
			Prev <ChevronLeftIcon size=20/>
		</div>
		<div class="btn" on:click={()=>{step++; dir = 1}}>
			Next <ChevronRightIcon size=20/>
		</div>
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
		<div class="btn" on:click={()=>{step--; dir = -1}}>
			Prev <ChevronLeftIcon size=20/>
		</div>
		<div class="btn" on:click={()=>{step++; dir = 1}}>
			Next <ChevronRightIcon size=20/>
		</div>
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
			<table class="table-auto text-left border-separate border-spacing-2">
				<tbody>
					<tr class="border">
						<td class="p-2"><input type="checkbox" bind:checked={consent[0]} class="checkbox shrink" /></td> 
						<td>{$_('consent.publish')}</td>
					</tr>
					<tr class="border">
						<td class="p-2"><input type="checkbox" bind:checked={consent[1]} class="checkbox shrink" /></td> 
						<td>{$_('consent.forward')}</td>
					</tr>
					<tr class="border">
						<td class="p-2"><input type="checkbox" bind:checked={consent[2]} class="checkbox shrink" /></td> 
						<td>{$_('consent.opendata')}</td>
					</tr>
				</tbody>
			</table>
		</CreateCard>
		<div class="btn hover:-translate-x-4" on:click={()=>{step = 1; dir = -1}}>Prev <ChevronLeftIcon size=20/></div>
		<div 
			class="btn btn-success" 
			on:click|preventDefault={handleSubmit}
		>
			{$_('page.add.submit')}
		</div>
	{/if}
{:else}
	<SubmissionStatus type={'boardgame'} {submitState} submissionType={'new'} requireApproval={adminSettings.requireApproval}>
		{#await promiseNewBoardgame then res}
			{#if res}
				<div class="mx-auto">
					<BoardgameCard bg={res}/>
				</div>
			{/if}
		{/await}
	</SubmissionStatus>
{/if}