<script context=module lang=ts>
	import { getSubmissionPackage, personRoles, type AdminSettings } from '$lib/datatypes';
	import type { SubmissionPackage } from '$lib/datatypes';
	import { createSlug, fromBucket, getVarPrefix } from '$lib/supabase';
	import type { SubmissionData } from '$lib/supabase'
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
				submissionPackage: getSubmissionPackage('person'),
				adminSettings: data
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
	import { fly } from 'svelte/transition'
	import { quintOut } from 'svelte/easing'
	import { _ } from 'svelte-i18n';
	import { EditIcon , MinusCircleIcon, ChevronLeftIcon, ChevronRightIcon } from 'svelte-feather-icons';
	import PersonCard from '$lib/components/PersonCard.svelte';
	import RoleButton from '$lib/components/RoleButton.svelte';
	import InputForm from '$lib/components/InputForm.svelte';
	import CreateCard from './_createCard.svelte'

	export let submissionPackage: SubmissionPackage; // from load fucntion
	export let adminSettings: AdminSettings
	const type: string = 'person';
	let submission = submissionPackage.submission
	submission.Person_show = true // default = show

	// create an array for each relation
	interface RoleObject {
		type: string,
		data: Record<string, any>
	}
	let rolesAdded: RoleObject[] = [];

	let roleSubmissionPackage = {
		'artist': getSubmissionPackage('artist'),
		'designer': getSubmissionPackage('designer'),
		'graphicdesigner': getSubmissionPackage('graphicdesigner'),
		'playtester': getSubmissionPackage('playtester'),
		'producer': getSubmissionPackage('producer'),
		'rulebookeditor': getSubmissionPackage('rulebookeditor'),
	}
	let editingRoleIndex: number = -1;
	$: editingRoleType = rolesAdded[editingRoleIndex]?.type
	let editingRolePackage: SubmissionPackage

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
	$: canSubmit = submission.Person_name || submission.Person_name_th

	// use these to display the newly created person right away!
	let newIndex: number
	let promiseNewPerson: Promise<any>
	let step: number = 0
	let dir: number = 1

	function addRole(role: string) {
		if(rolesAdded.some(r=>r.type === role)) {
			const newAlert: Alert = {
				type: 'error',
				text: 'You have already added ' +  role + '!'
			}
			handleAlert(newAlert)
			return
		}

		const prefix = getVarPrefix(role)
		const newRoleData = {
			[`${prefix}_name`]: submission.Person_name,
			[`${prefix}_name_th`]: submission.Person_name_th,
			[`${prefix}_show`]: true
		}
		const newRole: RoleObject = {
			type: role,
			data: newRoleData
		}
		rolesAdded = [...rolesAdded, newRole]
		rolesAdded = rolesAdded

		// open the tab immediately
		editingRolePackage = roleSubmissionPackage[role]
		editingRoleIndex = rolesAdded.length - 1
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
		if (submissionPackage.required && !submissionPackage.required.every(r => !!submission[r])) {
			const missingFields = submissionPackage.required?.filter(r => !submission[r]).join(',')
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
		const slug = createSlug(submission[typePrefix + '_name'])
		submission[typePrefix + '_slug'] = slug;

		const pictureFile = submission.Person_picture
		if(pictureFile) {
			const newPictureURL = 
			await uploadpicture("person", pictureFile, slug);
			submission.Person_picture = newPictureURL

			// also add the same image url to other roles
			for(const r in rolesAdded) {
				const roleType = rolesAdded[r]['type']
				const rolePrefix = getVarPrefix(roleType)
				rolesAdded[r]['data'][rolePrefix + '_picture'] = newPictureURL
			}
		}

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

	function scrollTop() {
		window.scroll({ top: 0, behavior: 'smooth' });
	}
</script>

<Seo title="Create person" />
{#if submitState == State.START || submitState == State.ERROR}
<ul class="steps w-full fixed top-0 -translate-x-1/2 glass">
	<li class="step" class:step-primary={step >= 0} on:click={()=>step = 0}>Basic info</li>
	<li class="step" class:step-primary={step >= 1} on:click={()=>step = 1}>Role info</li>
	<li class="step" class:step-primary={step >= 2} on:click={()=>step = 2}>Submit</li>
 </ul>
<div class="h-16"></div>
{#if step == 0}
	<CreateCard bind:dir title={$_('page.create._') + " " + $_(`keyword.${type}`)}>
		<form>
			<div class="flex flex-col lg:flex-row lg:gap-10 place-items-start p-4">
				<InputForm
					{submissionPackage}
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
			class="btn hover:translate-x-4"
			on:click|preventDefault={()=>{step = 1; dir = 1}}
			class:btn-disabled={!canSubmit}
		>
			Next <ChevronRightIcon size=20/>
		</div>
	</div>
{:else if step == 1}
	<CreateCard bind:dir title={$_('page.create.add_roles')}>
		<!-- display organization roles-->
		{#if (editingRoleIndex == -1)}
			<div class="flex flex-col justify-center items-center py-4" in:fly={{ duration: 1000, y: 20, easing: quintOut }} >
				<div class="flex flex-row flex-wrap justify-center gap-1 m-1">
					{#each submissionPackage.relations as role}
						<div 
							on:click={()=>addRole(role)} 
							class="shadow-md"
							class:bg-success={rolesAdded.some(r=>r.type === role)}
						>
							<RoleButton {role} icon={"add"}/>
						</div>
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
			<div in:fly={{ duration: 1000, y: -20, easing: quintOut }} class="p-4">
				<InputForm
					submissionPackage={editingRolePackage}
					bind:inputs={rolesAdded[editingRoleIndex]['data']}
				>
					<span slot="header">
						Editing {$_(`keyword.${editingRoleType}`)}
					</span>
				</InputForm>
				<div class="btn btn-error col-span-1" on:click={()=>removeRole(editingRoleIndex)}> Remove	</div>
				<div class="btn btn-success col-span-2" on:click={handleSave}>Save</div>
			</div>
		{/if}
	</CreateCard>
	<div class="btn hover:-translate-x-4" on:click={()=>{step = 0; dir = -1; editingRoleIndex=-1}}> Prev <ChevronLeftIcon size=20/> </div>
	<div class="btn hover:translate-x-4" on:click={()=>{step = 2; dir = 1; editingRoleIndex=-1}}> Next <ChevronRightIcon size=20/> </div>
{:else if step == 2}
	<CreateCard bind:dir title={"Submit"}>
		{#if adminSettings.requireApproval}
			<div class="justify-self-end mx-2">{$_('page.create.comment')}</div>
			<textarea
				class="textarea textarea-bordered"
				placeholder={$_('page.create.comment')}
				bind:value={comment}
			/><br />
		{/if}
	</CreateCard>
	<div class="btn hover:-translate-x-4" on:click={()=>{step = 1; dir = -1}}>Prev <ChevronLeftIcon size=20/></div>
	<div 
		class="btn btn-success" 
		on:click|preventDefault={handleSubmit}
	>
		{$_('page.create.submit')}
	</div>
{/if}
{/if}

<div>
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
</div>