<script lang="ts">
	import type { Boardgame, HonorRelation } from '$lib/datatypes';
	import {HonorPosition} from '$lib/datatypes'
	import { _ } from 'svelte-i18n';
	import {onMount} from 'svelte'
	import Spinner from './Spinner.svelte';
	import {EditIcon, SaveIcon, SearchIcon, XCircleIcon} from 'svelte-feather-icons'
	import Picture from './Picture.svelte';
	import { handleAlert } from '$lib/alert';
	import type { Alert } from '$lib/alert/alert.type';

	export let id: number
	export let edit: boolean = false
	let isLoading: boolean = true
	interface HonorRelationInner extends Boardgame{
		Honor_Relation: HonorRelation
	}
	
	let honorRelation: HonorRelationInner[] = []
	let honorCategories: string[] = []

	let newHonorRelation: any[] = []

	interface simpleData {
		id: number,
		name?: string,
		name_th?: string
	}

	onMount(async()=>{
		const resRelation = await fetch(`/api/honor/${id}/boardgame?select=ID,name,name_th,picture`);
		if (!resRelation.ok) return { status: 404, message: 'not found' };

		honorRelation = await resRelation.json();
		honorRelation = honorRelation.sort(
			(a, b) => HonorPosition.indexOf(a.Honor_Relation[0].Honor_position) - HonorPosition.indexOf(b.Honor_Relation[0].Honor_position)
		);

		honorCategories = [
			...new Set(honorRelation.map((h) => h.Honor_Relation[0].Honor_category))
		];

		if(edit)
			newHonorRelation = honorRelation.map(hr=> (
				{
					...hr.Honor_Relation[0], 
					TBG_name: hr.TBG_name,
					TBG_name_th: hr.TBG_name_th
				}
			))
		isLoading = false
	})

	
	let searchString: string = '';
	let searchedData: simpleData[];
	let searchCount: number = 0;

	let typingTimer: ReturnType<typeof setTimeout>
	let isTyping: boolean = false
	let revealOptions: boolean = false
	let submitting: boolean = false

	function startTyping() {
		isTyping = true
		clearTimeout(typingTimer)
	}

	function stopTyping() {
		clearTimeout(typingTimer)
		typingTimer = setTimeout(search, 300)
	}

	async function search() {
		const res = await fetch(`/api/boardgame?search=${searchString}`);
		if (res.ok) {
			const data = await res.json();
			searchCount = data.length
			searchedData = data.slice(0, 15).map((d) => ({
				id: d.TBG_ID,
				name: d.TBG_name,
				name_th: d.TBG_name_th
			}));
		}
		isTyping = false
	}

	function select(data: simpleData) {
		// add to table
		newHonorRelation = [...newHonorRelation, {
			Honor_ID: id,
			TBG_ID: data.id,
			TBG_name: data.name,
			TBG_name_th: data.name_th,
			Honor_position: null,
			Honor_category: null,
		}]
		searchString = '';
		revealOptions = false
	}

	function startEditing(){
		// reshape relation table
		newHonorRelation = honorRelation.map(hr=> (
			{
				...hr.Honor_Relation[0], 
				TBG_name: hr.TBG_name,
				TBG_name_th: hr.TBG_name_th
			}
		))
		edit = true
	}

	async function handleSubmit(){
		submitting = true
		const reshapeData = ({id, Honor_ID, TBG_ID, Honor_position, Honor_category}) => ({id, Honor_ID, TBG_ID, Honor_position, Honor_category})

		const res = await fetch('/api/post/honorTable', {
         method: 'POST',
         cache: 'default',
         credentials: 'same-origin',
         headers: {
            'Content-Type': 'application/json'
         },
         body: JSON.stringify(newHonorRelation.map(hr => reshapeData(hr)))
      })

		const submitAlert: Alert = {
			type: 'success',
			text: 'done! ' + JSON.stringify(res.body)
		}
		handleAlert(submitAlert)
		edit = false
		submitting = false
	}
</script>

<div class="flex flex-col gap-4 justify-center text-center">
	{#if isLoading}
		<Spinner/>
	{:else}
		{#if !edit}
			<h2>Winners</h2>
			{#each honorCategories as hc}
				{hc ? 'Category: ' + hc : ''}
				<div class="overflow-x-auto">
					<table class="table table-zebra mx-auto">
						<!-- head -->
						<thead>
							<tr>
								<th>Position</th>
								<th>Board game</th>
								<th>Image</th>
							</tr>
						</thead>
						<tbody>
							{#each honorRelation as h}
								<tr>
									{#if h.Honor_Relation[0].Honor_category === hc}
										<td>{h.Honor_Relation[0].Honor_position || '-'}</td>
										<td>
											{#if h.TBG_ID}
												<a href="/boardgame/{h.TBG_ID}">{h.TBG_name}</a>
											{:else}
												{h.TBG_name}
											{/if}
										</td>
										<td><Picture type='boardgame' picture={h.TBG_picture} mask="square" height={20}/></td> 
									{/if}
								</tr>
							{/each}
						</tbody>
					</table>
				</div>
			{/each}
			<div>
				<div class="tooltip" data-tip="edit this honor">
					<div class="btn btn-square btn-secondary" on:click={startEditing}>
						<EditIcon size="2x" />
					</div>
				</div>
			</div>
		{:else}
			<div class="overflow-x-auto my-4 ">
				<table class="table table-zebra table-compact mx-auto">
					<!-- head -->
					<thead>
						<tr>
							<th>Board game</th>
							<th>Category</th>
							<th>Position</th>
						</tr>
					</thead>
					<tbody>
						{#each newHonorRelation as h}
							<tr>
								<td><a href="/boardgame/{h.TBG_ID}" target="_blank">{h.TBG_name ? h.TBG_name : h.TBG_name_th}</a></td>
								<td><input type='text' class="input input-bordered" bind:value={h.Honor_category}></td>
								<td><select class="select select-bordered" bind:value={h.Honor_position }>
										<option disabled selected value={null}>{$_('page.add.select')}</option>
										{#each HonorPosition as opt}
											<option value={opt}>{opt}</option>
										{/each}
										<option value={'other'}>other</option>
								</select></td>
							</tr>
						{/each}
					</tbody>
				</table>
			
				<h2>Search and add new board game</h2>
				
				<div class="flex flex-col w-72 mx-auto my-4">
					<div class="dropdown">
						<!-- svelte-ignore a11y-label-has-associated-control -->
						<label tabindex="0">
							<div class="flex flex-row h-12">
								<div class="flex flex-col">
									<label class="input-group">
										<input
											type="text"
											placeholder={"Search"}
											class="input input-bordered w-72"
											bind:value={searchString}
											on:keyup={() => stopTyping()}
											on:keydown={()=> startTyping()}
										/>
										<div class="btn" on:click={()=>revealOptions = !revealOptions}>
											<SearchIcon size="20"/>
										</div>
									</label>
								</div>
							</div>
						</label>
						<ul
							tabindex="0"
							class="p-2 shadow menu dropdown-content bg-base-100 rounded-box w-full h-40 overflow-auto"
							class:hidden={searchString.length == 0 && !revealOptions}
						>
							{#if isTyping}
								<li><Spinner /></li>
							{:else if searchedData}
								{#each searchedData as d}
									<li>
										<div class="btn btn-ghost btn-xs" on:click={() => select(d)}>
											{d.name || ''}{d.name && d.name_th? ' - ' : ''}{d.name_th || ''}
										</div>
									</li>
								{:else}
									<li><div class="btn btn-outline btn-error btn-xs text-left"> Not found </div></li>
								{/each}
								{#if searchCount > 15}
									<li><div class="btn btn-outline btn-info btn-xs btn-disabled">{searchCount - 15} more...</div></li>
								{/if}
							{/if}
						</ul>
					</div>
				</div>

				<div>
					<div class="tooltip" data-tip="submit">
						<div class="btn btn-wide btn-success" on:click={handleSubmit} class:loading={submitting}>
							<SaveIcon size="2x" />
						</div>
					</div>
					<div class="tooltip" data-tip="cancle">
						<div class="btn btn-square btn-error" on:click={()=>edit = false}>
							<XCircleIcon size="2x"/>
						</div>
					</div>
				</div>
			</div>
		{/if}
	{/if}
</div>
