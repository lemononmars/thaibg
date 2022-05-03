<script lang=ts context=module>
	import { from } from '$lib/supabase';

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
		if (user?.role !== 'authenticated')
			return {
				status: 401,
				redirect: '/'
			};
		
		const {data: submissionData, error: error1 } = await from('Submission').select('*').eq('Submission_status', 'pending');
		if (error1) throw error1;
		const res = await fetch('/api/adminsettings')
		const settings = await res.json()
		if (!res.ok) throw res.statusText

		return {
			props: {
				data: submissionData,
				settings: settings[0]
			}
		};
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
	import {alerts, handleAlert} from '$lib/alert'
	import type {Alert} from '$lib/alert/alert.type'
	export let data, settings: Settings;
	// to be paginated?

	let isCaching: boolean = false
	let isSaving: boolean = false

	const tableInfo = {
		headers: ['ID', 'Type', 'Page type', 'Username', 'Date', 'Content', 'Relation'],
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

	function createCache(){
		isCaching = true
		// do stuff
		setTimeout(()=> {
			const newAlert: Alert = {
					type: 'success',
					text: 'Cache completed!'
				}
			handleAlert(newAlert)
			isCaching = false
			}, 1000
		)
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
</script>

<div class="overflow-x-auto w-full py-20">
	<div class="flex flew-col gap-2">
		<div>Admin approval require <input type="checkbox" class="checkbox" bind:checked={settings.requireApproval}></div>
		<div>Allow create <input type="checkbox" class="checkbox" bind:checked={settings.allowCreate}></div>
		{#if settings.allowCreate}
			<div>Allow guest create <input type="checkbox" class="checkbox" bind:checked={settings.allowGuestCreate}></div>
		{/if}
		<div>Allow edit <input type="checkbox"  class="checkbox" bind:checked={settings.allowEdit}></div>
		{#if settings.allowEdit}
			<div>Allow guest edit <input type="checkbox"  class="checkbox" bind:checked={settings.allowGuestEdit}></div>
		{/if}
		<div>Last cache: {settings.lastCache} <div class="btn" on:click={createCache} class:loading={isCaching}>Cache now</div></div>
		<div class="btn" on:click={handleSave} class:loading={isSaving}>Save settings</div>
	</div>
	<table class="table w-full">
		<thead>
			<tr>
				{#each tableInfo.headers as t}
					<th>{t}</th>
				{/each}
				<th>Decision</th>
			</tr>
		</thead>
		<!-- Table body -->
		<tbody>
			{#each data as d}
				<tr>
					{#each tableInfo.body as t}
						<td>
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
											<p>{w}</p>
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
</div>
