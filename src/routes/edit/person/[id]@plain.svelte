<script context=module lang=ts>
	import { getSubmissionPackage, personRoles, type AdminSettings, type Person } from '$lib/datatypes';
	import type { SubmissionPackage } from '$lib/datatypes';
	import { generateSlug, fromBucket, getVarPrefix } from '$lib/supabase';
	import type { SubmissionData } from '$lib/supabase'
	import type {Alert} from '$lib/alert/alert.type'
	import {handleAlert} from '$lib/alert/alert.store'

	export async function load({ session, fetch, params }) {
		const {id} = params;
		const { user } = session

		const res = await fetch('/api/adminsettings')
		const adminSettings = await res.json()
		const res2 = await fetch(`/api/person/${id}`)
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

		let currentRolesData = []
		for(const role of personRoles) {
			const rolePrefix = getVarPrefix(role)
			const roleID = (currentData[rolePrefix + '_ID'])
			if(roleID) {
				const resRole = await fetch(`/api/${role}/${roleID}`)
				currentRolesData = [...currentRolesData, {
					type: role,
					data: await resRole.json()
				}]
			}
		}

		return {
			props: {
				submissionPackage: getSubmissionPackage('person'),
				currentData,
				currentRolesData,
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
	import { fly } from 'svelte/transition'
	import { quintOut } from 'svelte/easing'
	import { _ } from 'svelte-i18n';
	import { EditIcon , MinusCircleIcon, ChevronLeftIcon, ChevronRightIcon } from 'svelte-feather-icons';
	import RoleButton from '$lib/components/RoleButton.svelte';
	import InputEditForm from '$lib/components/InputEditForm.svelte';
	import CreateCard from '../_createCard.svelte'
	import InputForm from '$lib/components/InputForm.svelte';

	export let submissionPackage: SubmissionPackage,
		adminSettings: AdminSettings,
		currentData: Person,
		currentRolesData
	const type: string = 'person';
	let { submission, keys, relations, selects, multiselects, required } = submissionPackage; // destruct
	const varPrefix = getVarPrefix(type)
	const currentDataID = currentData[varPrefix + '_ID']

	// add Person_ID to submission
	submission[varPrefix + '_ID'] = currentDataID

	// create an array for each relation
	let relationMultiSelects: Record<string, string[]> = {};
	relations.forEach((r) => (relationMultiSelects[r] = []));

	// create an array for each relation
	interface RoleObject {
		type: string,
		data: Record<string, any>
	}

	// add existing role data
	let rolesAdded: RoleObject[] = currentRolesData

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
	$: canSubmit = required.every(r => !!submission[r] || !!currentData[r]) &&
		(submission.Person_name || currentData.Person_name || submission.Person_name_th || currentData.Person_name_th)

	let step: number = 0
	let dir: number = 1

	function addRole(role: string) {
		if(rolesAdded.some(r=>r.type === role)) {
			const newAlert: Alert = {
				type: 'error',
				text: 'You can only have one ' +  role + '!'
			}
			handleAlert(newAlert)
			return
		}

		const rolePrefix = getVarPrefix(role)
		const newRoleData = {
			[`${rolePrefix}_name`]: currentData.Person_name,
			[`${rolePrefix}_name_th`]: currentData.Person_name_th,
			[`${rolePrefix}_show`]: currentData.Person_show
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
		const required = roleSubmissionPackage[editingRoleType].required
		if (required && required.some((k: string) => !rolesAdded[editingRoleIndex]['data'][k])) {
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
		const slug = generateSlug(submission[typePrefix + '_name'])
		submission[typePrefix + '_slug'] = slug;

		const pictureFile = submission.Person_picture
		if(pictureFile && (typeof pictureFile !== 'string')) {
			const newPictureURL = await uploadpicture("person", pictureFile, slug);
			submission.Person_picture = newPictureURL
			for(const r in rolesAdded) {
				const roleType = rolesAdded[r]['type']
				const rolePrefix = getVarPrefix(roleType)
				rolesAdded[r]['data'][rolePrefix + '_picture'] = newPictureURL
			}
		}
		else {
			// also add the same image url to other roles
			for(const r in rolesAdded) {
				const roleType = rolesAdded[r]['type']
				const rolePrefix = getVarPrefix(roleType)
				rolesAdded[r]['data'][rolePrefix + '_picture'] = currentData.Person_picture
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
			pageType: 'person',
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

	function scrollTop() {
		window.scroll({ top: 0, behavior: 'smooth' });
	}
</script>

<Seo title="Edit person" />
{#if submitState == State.START || submitState == State.ERROR}
<ul class="steps w-full fixed top-0 -translate-x-1/2 glass z-10">
	<li class="step" class:step-primary={step >= 0} on:click={()=>step = 0}>Edit basic info</li>
	<li class="step" class:step-primary={step >= 1} on:click={()=>step = 1}>Edit role info</li>
	<li class="step" class:step-primary={step >= 2} on:click={()=>step = 2}>Submit</li>
 </ul>
<div class="h-16"></div>
{#if step == 0}
	<CreateCard bind:dir title={$_('page.edit._') + $_(`keyword.${type}`)}>
		<InputEditForm
			{submissionPackage}
			bind:inputs={submission}
			{currentData}
		/>
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
	<CreateCard bind:dir title={$_('page.add.add_roles')}>
		<!-- display person roles-->
		<!-- <p class="break-words w-screen">{JSON.stringify(currentData)} {JSON.stringify(rolesAdded)}</p> -->
		{#if (editingRoleIndex == -1)}
			<div class="flex flex-col justify-center items-center py-4" in:fly={{ duration: 1000, y: 20, easing: quintOut }} >
				<div class="grid grid-rows-2 lg:grid-rows-1 grid-flow-col justify-center gap-1 m-1">
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
						<div class="tooltip" data-tip="remove" class:invisible={currentRolesData.some(d => {return r.type === d.type})}>
							<div 
								class="btn bg-error" 
								on:click={()=>removeRole(ridx)}
								
							>
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
				{#if currentRolesData[editingRoleIndex]}
					<InputEditForm
						submissionPackage={editingRolePackage}
						bind:inputs={rolesAdded[editingRoleIndex]['data']}
						currentData={currentRolesData[editingRoleIndex]['data']}
					>
						<span slot="header">
							Editing {$_(`keyword.${editingRoleType}`)}
						</span>
					</InputEditForm>
				{:else}
					<InputForm
						submissionPackage={editingRolePackage}
						bind:inputs={rolesAdded[editingRoleIndex]['data']}
						{type}
					>
						<span slot="header">
							Adding {$_(`keyword.${editingRoleType}`)}
						</span>
					</InputForm>
				{/if}
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
	<a href="/person/{currentDataID}">{currentData.Person_name || currentDataID.Person_name_th}</a>
	<br>
	<p>{$_('page.add.status.submitmore')}</p><a href='/'>Return home</a>
{:else if submitState == State.ERROR}
	<p class="text-red">{$_('page.add.status.error')}</p>
	<div class="btn" on:click|preventDefault={handleSubmit}>{$_('page.add.submit')}</div>
{/if}
</div>