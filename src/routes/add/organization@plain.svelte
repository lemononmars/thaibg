<script context=module lang=ts>
	import { getSubmissionPackage, organizationRoles } from '$lib/datatypes';
	import type { SubmissionPackage, AdminSettings, TypeNameOrganizationRole } from '$lib/datatypes';
	import { uploadPicture, getVarPrefix, generateSlug } from '$lib/supabase';
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
				newAlert.text = 'Please login to add a new entry.'
			handleAlert(newAlert)

			return {
				status: 303,
				redirect: '/add/'
			};
		}

		return {
			props: {
				submissionPackage: getSubmissionPackage('organization'),
				adminSettings
			}
		};
	}

</script>

<script lang="ts">
	import Seo from '$lib/components/SEO.svelte';
	import { user, getCurrUserProfile } from '$lib/user';
	import Spinner from '$lib/components/Spinner.svelte';
	import { fly } from 'svelte/transition'
	import { quintOut } from 'svelte/easing'
	import { _ } from 'svelte-i18n';
	import { ChevronLeftIcon, ChevronRightIcon, EditIcon, MinusCircleIcon } from 'svelte-feather-icons';
	import PlainCard from '$lib/components/PlainCard.svelte';
	import RoleButton from '$lib/components/RoleButton.svelte';
	import InputForm from '$lib/components/InputForm.svelte';
	import CreateCard from './_createCard.svelte'
	import SubmissionStatus from '$lib/components/SubmissionStatus.svelte';

	export let submissionPackage: SubmissionPackage; // from load fucntion
	export let adminSettings: AdminSettings
	const type: string = 'organization';
	let { submission, keys, relations, selects, multiselects, required } = submissionPackage; // destruct
	submission.Organization_show = true // special case: default is true

	// create an array for each relation
	interface RoleObject {
		type: string,
		data: Record<string, any>
	}
	let rolesAdded: RoleObject[] = [];

	// extra info
	let comment: string;

	let roleSubmissionPackage = {}
	organizationRoles.forEach((r:TypeNameOrganizationRole) => roleSubmissionPackage[r] = getSubmissionPackage(r))

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
	let step: number = 0
	let dir: number = 1

	function addRole(role:string) {
		const rolePrefix = getVarPrefix(role)
		const newRoleData = {
			[`${rolePrefix}_name`]: submission.Organization_name,
			[`${rolePrefix}_picture`]: submission.Organization_picture,
			[`${rolePrefix}_show`]: true
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
		const slug = generateSlug(submission[typePrefix + '_name'])
		submission[typePrefix + '_slug'] = slug

		// upload organization's picture
		const pictureFile = submission.Organization_picture
		if(pictureFile && (typeof pictureFile !== 'string')) {
			submission.Organization_picture = 
			await uploadPicture("organization", pictureFile, slug);
		}

		// upload each role's picture individually
		for (const r in rolesAdded) {
			const roleType = rolesAdded[r]['type']
			const rolePictureFile = rolesAdded[r]['data'][getVarPrefix(roleType) + '_picture']
			if(rolePictureFile) {
				const rolPrefix = getVarPrefix(roleType)
				const slug = generateSlug(rolesAdded[r]['data'][rolPrefix + '_name'])
				rolesAdded[r]['data'][rolPrefix + '_slug'] = slug
				rolesAdded[r]['data'][rolPrefix + '_picture'] = 
				await uploadPicture(roleType, rolePictureFile, slug)
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

	export async function getNewOrganization(id: number){
		const newOrganization = await fetch(`/api/organization/${id}`)
		const data = await newOrganization.json()
		return data
	}

	function scrollTop() {
		window.scroll({ top: 0, behavior: 'smooth' });
	}
</script>

<Seo title="Create organization" />
{#if submitState == State.START || submitState == State.ERROR}
<ul class="steps w-screen fixed top-0 -translate-x-1/2 glass z-10">
	<li class="step" class:step-primary={step >= 0}>Basic info</li>
	<li class="step" class:step-primary={step >= 1}>Role info</li>
	<li class="step" class:step-primary={step >= 2}>Submit</li>
 </ul>
 <div class="h-16"></div>
{#if step == 0}
	<CreateCard bind:dir title={$_('page.add._') + " " + $_(`keyword.${type}`)}>
		<form>
			<div class="flex flex-col lg:flex-row lg:gap-10 place-items-start p-4">
				<InputForm
					{submissionPackage}
					bind:inputs={submission}
					type={'organization'}
				>
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
	<CreateCard bind:dir title={$_('page.add.add_roles')}>
	<!-- display organization roles-->
	{#if (editingRoleIndex == -1)}
		<div class="flex flex-col justify-center items-center py-2" in:fly={{ duration: 1000, y: 20, easing: quintOut }} >
			<div class="grid grid-rows-2 lg:grid-rows-1 grid-flow-col justify-center gap-1 m-1">
				{#each relations as role}
					<div on:click={()=>addRole(role)}><RoleButton {role} icon={"add"}/></div>
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
			<InputForm
				submissionPackage={editingRolePackage}
				bind:inputs={rolesAdded[editingRoleIndex]['data']}
				{type}
			>
				<span slot="header">
					Editing {editingRoleType}
				</span>
			</InputForm>
			<div class="btn btn-error col-span-1" on:click={()=>removeRole(editingRoleIndex)}> Remove	</div>
			<div class="btn btn-success col-span-2" on:click={handleSave}> Save	</div>
		</div>
	{/if}
	</CreateCard>
	<div class="btn" on:click={()=>{step = 0; dir = -1}}>Prev</div>
	<div class="btn" on:click={()=>{step = 2; dir = 1}}>Next</div>
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
{:else}
	<SubmissionStatus type={'boardgame'} {submitState} submissionType={'new'} requireApproval={adminSettings.requireApproval}>
		{#await promiseNewOrganization then res}
			{#if res}
				<div class="mx-auto">
					<PlainCard object={res} type={"organization"}/>
				</div>
			{/if}
		{/await}
	</SubmissionStatus>
{/if}