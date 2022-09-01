<script lang=ts>
   import { EditIcon, SaveIcon } from 'svelte-feather-icons';
   import {_} from 'svelte-i18n'
   import GoogleMapFinder from './GoogleMapFinder.svelte';
   import MultipleSelect from './MultipleSelect.svelte';
   import UploadPicture from './UploadPicture.svelte';
   import { createEventDispatcher } from 'svelte';

   const dispatch = createEventDispatcher();

   function toggleEdit(state:boolean) {
      dispatch('updateEditState', state);
   }

   export let inputs: Record<string, any>
   export let submissionPackage: Record<string, any>
   export let currentData: Record<string, any>

   const {keys, selects, multiselects, required} = submissionPackage
   const isEditted: Record<string,boolean> = {}
   const sampleKey: string = Object.keys(keys)[0]
   const type: string = sampleKey.slice(0, sampleKey.indexOf('_'))

   // prepare keys
   keys.forEach((k:string)=> {
      isEditted[k] = false
   })

   let needMap: boolean = false
   const locationKeyArray = keys.filter((k:string) => k.includes("location"))
   let locationKey: string

   if(locationKeyArray.length > 0) {
      needMap = true
      locationKey = locationKeyArray[0]
      inputs[locationKey] = {formatted_address: ""}
      if(!currentData[locationKey])
         currentData[locationKey] = {formatted_address: ""}
   }
   let openMapModal: boolean = false
   let editingKey: string = ''
	let editingContent: any

   function handleLocationSelect(event: any) {
      openMapModal = false
      // assuming there is only one TYPE_location key
      inputs[locationKey] = event.detail.place
      currentData[locationKey] = event.detail.place
   }

   // only update input if the data gets changed
   function handleEdit(k: string) {
      // save
		if(editingKey === k) {
			if(k === locationKey || editingContent !== currentData[k]) {
				inputs[k] = currentData[k]
            isEditted[k] = true
         }
			editingKey = null
         toggleEdit(false)
		}
      // start editing
		else if(!editingKey) {
			editingContent = currentData[k]
			editingKey = k
         toggleEdit(true)
		}
	}
   
   function handleUpload(k: string) {
      inputs[k] = currentData[k]
   }
</script>

<div class="grid grid-cols-1 lg:grid-cols-3 content-start gap-2 py-4">
   <div class="lg:col-span-3">
      <slot name="header"/>
   </div>
   {#each keys as k}
      <div class="justify-between items-center lg:justify-self-end mx-2 flex flex-row gap-2">
         <div class="flex flex-row align-text-center">
            {$_(`key.${k}`)}
            {#if required?.includes(k)}
               <p class="text-error">*</p>
            {/if}
         </div>
         {#if !k.includes('_picture')}
            <div 
               class="btn btn-outline btn-xs" 
               on:click={()=>handleEdit(k)} 
               class:bg-success={editingKey === k}
               class:text-success={isEditted[k]}
               class:invisible={editingKey && editingKey !== k}
            >
               {#if editingKey === k}
                  <SaveIcon size=12/>
               {:else}
                  <EditIcon size=12/>
               {/if}
            </div>
         {/if}
      </div>
      <div class="justify-self-start lg:gap-4 lg:col-span-2 flex flex-row mx-auto lg:mx-0">
         {#if selects[k]}
            <select class="select select-bordered" bind:value={currentData[k]} disabled={editingKey !== k}>
               <option disabled selected value={null}>{$_('page.add.select')}</option>
               {#each selects[k] as opt}
                  <option value={opt}>{$_(`option.${opt}`)}</option>
               {/each}
            </select>
         {:else if multiselects[k]}
            <MultipleSelect selectOptions={multiselects[k]} bind:selects={currentData[k]} disabled={editingKey !== k}/>
         {:else if k.includes('_picture')}
            <UploadPicture key={k} bind:pictureFile={currentData[k]} on:pictureUploaded={()=>handleUpload(k)}/>
         {:else if k.includes('_location')}
            <div class="flex flex-col gap-2">
               <div 
                  class="btn btn-accent" 
                  on:click={()=>openMapModal = true}
                  class:btn-ghost={editingKey !== k}
                  class:btn-disabled={editingKey !== k}
               >Select in Google Map</div>
               <textarea 
                  class="textarea textarea-bordered" 
                  placeholder="Select in Google Map first"
                  bind:value={currentData[k].formatted_address}
                  disabled={editingKey !== k}
               />
            </div>
         {:else if k.includes('_time')}
            <input type="date" class="input"  disabled={editingKey !== k} bind:value={currentData[k]}/>
         {:else if k.includes('show')}
            <input type="checkbox" bind:checked={currentData[k]} class="checkbox" disabled={editingKey !== k}/>
         {:else if k.includes('description')}
            <textarea class="textarea textarea-bordered" bind:value={currentData[k]} disabled={editingKey !== k}/>
         {:else if k.includes('_links')}
            <MultipleSelect bind:selects={currentData[k]} disabled={editingKey !== k}/>
         {:else}
            <input type="text" class="input input-bordered" bind:value={currentData[k]} disabled={editingKey !== k}/>
         {/if}
         <!-- show icon if the field has been editted -->
      </div>
   {/each}
</div>

{#if needMap}
   <input type="checkbox" id="map-modal" class="modal-toggle"/>
   <div class="modal modal-bottom sm:modal-middle w-full h-full p-10 flex flex-col" class:modal-open={openMapModal}>
      <GoogleMapFinder on:select={handleLocationSelect}/>
      <div class="btn btn-warning" on:click={()=>openMapModal = false}>Close</div>
   </div>
{/if}

<style>
	input {
		@apply w-72;
	}

	select {
		@apply w-72;
	}

	input.checkbox {
		@apply w-5;
	}

	textarea {
		@apply w-72;
	}
</style>
