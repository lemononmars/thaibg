<script lang="ts">
	import type { Boardgame, ShopRelation } from '$lib/datatypes';
	import { _ } from 'svelte-i18n';
	import {onMount} from 'svelte'
	import Spinner from './Spinner.svelte';
	import {EditIcon, SaveIcon, SearchIcon, XCircleIcon, CheckCircleIcon} from 'svelte-feather-icons'
	import Picture from './Picture.svelte';
	import { handleAlert } from '$lib/alert';

	export let id: number
	export let edit: boolean = false
	let isLoading: boolean = true
	interface ShopRelationInner extends Boardgame{
		Shop_Relation: ShopRelation
	}
	
	let shopRelation: ShopRelationInner[] = []
	let newShopRelation: any[] = []

	interface simpleData {
		id: number,
		name?: string,
		name_th?: string
	}

	onMount(async()=>{
		const resRelation = await fetch(`/api/shop/${id}/boardgame?select=ID,name,name_th,picture`);
		if (!resRelation.ok) return { status: 404, message: 'not found' };

		shopRelation = await resRelation.json();
		if(edit)
			newShopRelation = shopRelation.map(hr=> (
				{
					...hr.Shop_Relation[0], 
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
		newShopRelation = [...newShopRelation, {
			Shop_ID: id,
			TBG_ID: data.id,
			TBG_name: data.name,
			TBG_name_th: data.name_th,
			Shop_TBG_playable: true,
			Shop_TBG_obtainable: true,
		}]
		searchString = '';
		revealOptions = false
	}

	function startEditing(){
		// reshape relation table
		newShopRelation = shopRelation.map(hr=> (
			{
				...hr.Shop_Relation[0], 
				TBG_name: hr.TBG_name,
				TBG_name_th: hr.TBG_name_th
			}
		))
		edit = true
	}

	async function handleSubmit(){
		submitting = true
		const reshapeData = ({id, Shop_ID, TBG_ID, Shop_TBG_playable, Shop_TBG_obtainable}) => ({id, Shop_ID, TBG_ID, Shop_TBG_playable, Shop_TBG_obtainable})

		const res = await fetch('/api/post/shopTable', {
         method: 'POST',
         cache: 'default',
         credentials: 'same-origin',
         headers: {
            'Content-Type': 'application/json'
         },
         body: JSON.stringify(newShopRelation.map(hr => reshapeData(hr)))
      })

		if(res.ok)
			handleAlert( {
				type: 'success',
				text: 'done! ' + JSON.stringify(res.body)
			})
		else
		handleAlert( {
				type: 'error',
				text: 'something went wrong... ' + JSON.stringify(res.body)
			})
		edit = false
		submitting = false
	}
</script>

<div class="flex flex-col gap-4 justify-center text-center w-full">
	{#if isLoading}
		<Spinner/>
	{:else}
		{#if !edit}
			<div class="overflow-x-auto">
				<table class="table table-zebra mx-auto w-full">
					<!-- head -->
					<thead>
						<tr>							
							<th>Image</th>
							<th>Board game</th>
							<th>Playable</th>
							<th>Obtainable</th>
						</tr>
					</thead>
					<tbody>
						{#each shopRelation as h}
						<tr>
								<td><Picture type='boardgame' picture={h.TBG_picture} mask="square" height={20}/></td>
								<td>
									{#if h.TBG_ID}
										<a href="/boardgame/{h.TBG_ID}">{h.TBG_name}</a>
									{:else}
										{h.TBG_name}
									{/if}
								</td>
								<td>
									{#if h.Shop_Relation[0].Shop_TBG_playable}
										<CheckCircleIcon class="text-success" size="2x"/>
									{:else}
										<XCircleIcon class="text-error" size="2x"/>
									{/if}
								</td>
								<td>
									{#if h.Shop_Relation[0].Shop_TBG_obtainable}
										<CheckCircleIcon class="text-success" size="2x"/>
									{:else}
										<XCircleIcon class="text-error" size="2x"/>
									{/if}
								</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
			<div>
				<div class="tooltip" data-tip="edit this shop">
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
							<th>Playable</th>
							<th>Obtainable</th>
						</tr>
					</thead>
					<tbody>
						{#each newShopRelation as s}
							<tr>
								<td><a href="/boardgame/{s.TBG_ID}" target="_blank">{s.TBG_name ? s.TBG_name : s.TBG_name_th}</a></td>
								<td><input type="checkbox" class="checkbox" bind:checked={s.Shop_TBG_playable}></td>
								<td><input type="checkbox" class="checkbox" bind:checked={s.Shop_TBG_obtainable}></td>
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
