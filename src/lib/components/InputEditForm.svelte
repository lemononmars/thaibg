<script lang=ts>
   import { EditIcon, SaveIcon } from 'svelte-feather-icons';
   import {_} from 'svelte-i18n'
   import GoogleMapFinder from './GoogleMapFinder.svelte';
   import MultipleSelect from './MultipleSelect.svelte';
   import UploadPicture from './UploadPicture.svelte';

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
      inputs[locationKey] = {formatted_address: "No selection"}
   }
   let openMapModal: boolean = false
   let editingKey: string = ''
	let editingContent: any

   function handleLocationSelect(event: any) {
      openMapModal = false
      // assuming there is only one TYPE_location key
      inputs[locationKey] = event.detail.place
   }

   // only update input if the data gets changed
   function handleEdit(k: string) {
		if(editingKey === k) {
			if(editingContent !== currentData[k]) {
				inputs[k] = currentData[k]
            isEditted[k] = true
         }
			editingKey = null
		}
		else if(!editingKey) {
			editingContent = currentData[k]
			editingKey = k
		}
	}
</script>

<div class="grid grid-cols-1 lg:grid-cols-3 items-center align-center gap-2 py-4">
   <div class="lg:col-span-3">
      <slot name="header"/>
   </div>
   {#each keys as k}
      <div class="justify-between items-center lg:justify-self-end mx-2 flex flex-row gap-2">
         <div>{$_(`key.${k}`)}</div>
         {#if required?.includes(k)}
            <div class="text-error">*</div>
         {/if}
         <!-- edit buttons -->
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
      <div class="justify-self-start lg:gap-4 lg:col-span-2 flex flex-row align-top">
         {#if selects[k]}
            <select class="select select-bordered" bind:value={currentData[k]} disabled={editingKey !== k}>
               <option disabled selected value={null}>{$_('page.create.select')}</option>
               {#each selects[k] as opt}
                  <option value={opt}>{$_(`option.${opt}`)}</option>
               {/each}
            </select>
         {:else if multiselects[k]}
            <MultipleSelect selectOptions={multiselects[k]} bind:selects={currentData[k]} disabled={editingKey !== k}/>
         {:else if k.includes('_picture')}
            <UploadPicture key={k} bind:pictureFile={currentData[k]}/>
         {:else if k.includes('_location')}
            <div class="flex flex-col gap-2">
               <div class="btn btn-accent" on:click={()=>openMapModal = true}>Select in Google Map</div>
               <textarea 
                  class="textarea textarea-bordered" 
                  placeholder="Select in Google Map first"
                  bind:value={currentData[k].formatted_address}
               />
            </div>
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
