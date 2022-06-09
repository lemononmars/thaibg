<script lang=ts context=module>
	import { from, getVarPrefix, findNewUniqueID, fromBucket, getTableName } from '$lib/supabase';
	import { handleAlert} from '$lib/alert'
	import type {Alert} from '$lib/alert/alert.type'

	interface Settings {
		requireApproval: boolean,
		allowCreate: boolean,
		allowGuestCreate: boolean,
		allowEdit: boolean,
		allowGuestEdit: boolean,
		lastCache: Date,
	}

	export async function load({ session, fetch }) {
		const { user } = session;
		// TODO: use admin role
		if (user?.role !== 'authenticated') {
			const newAlert: Alert = {
				type: 'error',
				text: 'You are not allowed to access this admin page.'
			}
			handleAlert(newAlert)
			return {
				status: 303,
				redirect: '/'
			};
		}

		const res = await fetch('/api/adminsettings')
		const settings = await res.json()

		return {
			props: {
				settings: settings[0]
			}
		};
	}

	async function getSubmission(){
		const {data, error} = await from('Submission').select('*');
		if (error) return []

		data.sort((a,b)=> {return b.Submission_date.localeCompare(a.Submission_date)})
		return data
	}

	async function getReport(){
		const res = await fetch('/api/report')
		if(!res.ok) return []

		const data = await res.json()
		return data.filter(d=>!d.Report_status)
	}

	export async function approval(approved: string, id: number): Promise<Response> {
		const res = await fetch('/api/post/admin', {
         method: 'POST',
         cache: 'default',
         credentials: 'same-origin',
         headers: {
            'Content-Type': 'application/json'
         },
         body: JSON.stringify({
				approved, 
				id
			})
      })
		return res;
	}

	export async function saveSettings(settings: Settings) {
		const res = await fetch('/api/post/adminsettings', {
         method: 'POST',
         cache: 'default',
         credentials: 'same-origin',
         headers: {
            'Content-Type': 'application/json'
         },
         body: JSON.stringify(
				settings
			)
      })
		return res;
	}
</script>

<script lang=ts>
	import Spinner from "$lib/components/Spinner.svelte";
	import { goto } from '$app/navigation';
	import Seo from '$lib/components/SEO.svelte';
	import {organizationRoles, personRoles, type Boardgame, type Content } from '$lib/datatypes';

	export let settings: Settings;
	// to be paginated?

	let isCaching: boolean = false
	let isSaving: boolean = false
	let loadingStatus: string = ''
	const allCacheRoles: string[]  = [...personRoles, ...organizationRoles]
	let selectedCacheRoles: string[] = allCacheRoles
	let adminPanels: string[] = ['settings', 'submission', 'report', 'maintenance', 'exit']
	let currentPanel: string = 'settings'

	let PromiseReport: Promise<any>
	let PromiseSubmission: Promise<any>

	const submissionTableInfo = {
		headers: ['ID', 'Type', 'Page type', 'Username', 'Date', 'Content', 'Relations'],
		body: [
			'id',
			'Submission_type',
			'Submission_page_type',
			'Submission_username',
			'Submission_date',
			'Submission_content',
			'Submission_relations'
		]
	};

	const reportTableInfo = {
		headers: ['ID', 'URL', 'Date', 'Content'],
		body: [
			'id',
			'Report_url',
			'Report_time',
			'Report_content',
		]
	};

	async function decision(a: string, id: number) {
		let res = await approval(a, id);
		let newAlert: Alert
		if (res.ok)
			newAlert = {
				type: 'success',
				text: 'successfully ' + a + ' !'
			}
		else newAlert  = {
				type: 'error',
				text: res.statusText
			}
		handleAlert(newAlert)
	}

	async function createCache(){
		isCaching = true
		// do stuff
		// const roles = personRoles
		const TBGminimize = ({TBG_ID, TBG_name, TBG_name_th})=> ({TBG_ID, TBG_name, TBG_name_th})
		const Contentminimize = ({Content_ID, Content_name})=> ({Content_ID, Content_name})
		for(const role of selectedCacheRoles) {
			const res = await fetch(`/api/${role}`)
			const data = await res.json()

			let newCache = []
			const rolePrefix = getVarPrefix(role)

			for(const d in data) {
				loadingStatus = role + ' #' + d
				const roleID = data[d][rolePrefix + '_ID']
				const countingType = role === 'contentcreator'? 'content' : 'boardgame'
				const res2 = await fetch(`/api/${role}/${roleID}/${countingType}`)
				let data2 = await res2.json()
				
				if(role !== 'contentcreator') {
					let latestTBG = {}
					let latestReleased: string | number = '-'

					data2 = data2?.filter((a:Boardgame)=>a.TBG_status === 'published') || []
					const numTBG = data2.length
					if(numTBG > 0) {
						const sortedTBG = data2
							.sort((a:Boardgame, b:Boardgame)=>{
								if(b.TBG_released === a.TBG_released)
									return b.TBG_ID - a.TBG_ID
								return b.TBG_released - a.TBG_released
							})
						latestReleased = sortedTBG[0].TBG_released
						latestTBG = TBGminimize(sortedTBG[0])
					}

					// we only need to insert id and cache
					newCache = [...newCache, {
						[rolePrefix + '_ID']: roleID,
						[rolePrefix + '_cache']: {
							numTBG,
							latestTBG,
							latestReleased
						}
					}]
				}
				else {
					const latestContent = data2.length > 0? data2.sort((a:Content, b:Content)=> {
						return b.Content_ID - a.Content_ID
					})[0] : {}
					newCache = [...newCache, {
						Contentcreator_ID: roleID,
						Contentcreator_cache: {
							numContent: data2.length,
							latestContent: Contentminimize(latestContent),
						}
					}]
				}
			}

			const {error} = await from(getTableName(role)).upsert(newCache, {returning: 'minimal'})
		}

		const {error} = await from('Admin_Settings').upsert([{id:1, lastCache: new Date()}])
		loadingStatus = 'Done!'
		isCaching = false
	}

	async function handleSave() {
		isSaving = true
		// make sure the policy agrees
		if(!settings.allowCreate)
			settings.allowGuestCreate = false
		if(!settings.allowEdit)
			settings.allowGuestEdit = false

		const res = await saveSettings(settings)
		let newAlert: Alert
		if(res.ok) 
			newAlert = {
				type: 'success',
				text: 'Settings saved!'
			}
		else
			newAlert = {
				type: 'success',
				text: res.statusText
			}
		handleAlert(newAlert)
		isSaving = false
	}

	async function closeReport(id: number) {
		isSaving = true
		const {error} = await from('Report').upsert([
			{
				id,
				Report_status: true
			}
		])
		if(error) throw(error)

		isSaving = false
	}

	async function changePanel(panel: string) {
		if(panel === 'submission')
			PromiseSubmission = getSubmission()
		if(panel === 'report')
			PromiseReport = getReport()
		if(panel === 'exit')
			goto('/')
		currentPanel = panel
	}

</script>

<Seo title="Admin" />
<div class="flex flex-col lg:flex-row w-full h-screen border-2 ">
	<div class="flex flex-row lg:flex-col bg-base-300">
		{#each adminPanels as p}
			<div class="btn" class:btn-active={currentPanel === p} on:click={()=>changePanel(p)}>
				{p}
			</div>
		{/each}
	</div>
	<div class="p-4 overflow-x-auto">
		{#if currentPanel === 'settings'}
			<div class="flex flex-col gap-2 content-start text-left">
				<div><input type="checkbox" class="checkbox" bind:checked={settings.requireApproval}> Admin approval require </div>
				<div><input type="checkbox" class="checkbox" bind:checked={settings.allowCreate}> Allow create</div>
				{#if settings.allowCreate}
					<div> <input type="checkbox" class="checkbox" bind:checked={settings.allowGuestCreate}> Allow guest create</div>
				{/if}
				<div><input type="checkbox"  class="checkbox" bind:checked={settings.allowEdit}> Allow edit</div>
				{#if settings.allowEdit}
					<div> <input type="checkbox"  class="checkbox" bind:checked={settings.allowGuestEdit}> Allow guest edit</div>
				{/if}
				<div class="btn" on:click={handleSave} class:loading={isSaving}>Save settings</div>
			</div>
		{:else if currentPanel === 'submission'}
			{#await PromiseSubmission}
				<Spinner/>
			{:then data}
				<table class="table w-full table-compact table-zebra">
					<thead>
						<tr>
							{#each submissionTableInfo.headers as t}
								{#if t === 'Content' || t === 'Relations'}
									<th class="w-80">{t}</th>
								{:else}
									<th>{t}</th>
								{/if}
								{/each}
							<th>Decision</th>
						</tr>
					</thead>
					<!-- Table body -->
					<tbody>
						{#each data as d}
							<tr>
								{#each submissionTableInfo.body as t}
									<td class="shrink">
										{#if t !== 'Submission_content' && t !== 'Submission_relations'}
											{d[t] ? ('' + d[t]).substring(0, 10) : '-'}
										{:else if d[t]}
											<div
												tabindex="0"
												class="collapse collapse-arrow border border-base-300 bg-base-100 rounded-box"
											>
												<div class="collapse-title text-xl font-medium truncate">
													{d[t]}
												</div>
												<div class="collapse-content">
													{#each d[t].split(',') as w}
														<p class="whitespace-pre-wrap">{w}</p>
													{/each}
												</div>
											</div>
										{/if}
									</td>
								{/each}
								<td>
									<div class="dropdown dropdown-end">
										<div tabindex="0" class="btn m-1">Decision</div>
										<ul
											tabindex="0"
											class="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52 z-20"
										>
											<li>
												<div class="btn btn-success" on:click={() => decision('approved', d.id)}>
													Approve
												</div>
											</li>
											<li>
												<div class="btn btn-error" on:click={() => decision('rejected', d.id)}>
													Reject
												</div>
											</li>
											<li>
												<div class="btn btn-info" on:click={() => decision('pending', d.id)}>
													Pending
												</div>
											</li>
										</ul>
									</div>
								</td>
							</tr>
						{/each}
					</tbody>
				</table>
			{/await}
		{:else if currentPanel === "report"}
			{#await PromiseReport}
				<Spinner/>
			{:then data}
				<table class="table w-full table-compact table-zebra">
					<thead>
						<tr>
							{#each reportTableInfo.headers as t}
								<th>{t}</th>
							{/each}
							<th>Status</th>
						</tr>
					</thead>
					<!-- Table body -->
					<tbody>
						{#each data as d}
							<tr>
								{#each reportTableInfo.body as t}
									<td class="whitespace-pre-wrap">
										{#if t === 'Report_url'}
											<a href={d[t]} target="_blank">{d[t].slice(d[t].indexOf('com/')+4)}</a>
										{:else}
											{d[t]}
										{/if}
									</td>
								{/each}
								<td>
									<div class="btn" 
										class:btn-disable={d.Report_status} 
										class:loading={isSaving}
										on:click={()=>closeReport(d.id)}
									>{d.Report_status? 'Close': 'Open'}</div>
								</td>
							</tr>
						{/each}
					</tbody>
				</table>
			{/await}
		{:else if currentPanel === "maintenance"}
			<div>Last cache: {settings.lastCache} </div>
			<div class="flex flex-col text-left">
				<div class='btn btn-xs' on:click={()=>selectedCacheRoles = allCacheRoles}> Select all</div>
				<div class='btn btn-xs' on:click={()=>selectedCacheRoles = []}> Deselect all</div>
				<div class="divider"></div>
				{#each allCacheRoles as r}
					<label>
						<input type=checkbox bind:group={selectedCacheRoles} value={r}> {r}
					</label>
				{/each}
			</div>
			<div class="btn" on:click={createCache} class:loading={isCaching}> Cache now</div>
			{loadingStatus}
		{/if}
	</div>
</div>
