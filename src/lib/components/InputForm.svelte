<script lang=ts>
   import {_} from 'svelte-i18n'
   import GoogleMapFinder from './GoogleMapFinder.svelte';
   import MultipleSelect from './MultipleSelect.svelte';
   import UploadPicture from './UploadPicture.svelte';

   export let inputs: Record<string, any>
   export let submissionPackage: Record<string, any>
   const {keys, selects, multiselects, required} = submissionPackage

   let needMap: boolean = false
   const locationKeyArray = keys.filter((k:string) => k.includes("location"))
   let locationKey: string
   if(locationKeyArray.length > 0) {
      needMap = true
      locationKey = locationKeyArray[0]
      inputs[locationKey] = {formatted_address: "No selection"}
   }
   let openMapModal: boolean = false

   function handleLocationSelect(event: any) {
      openMapModal = false
      // assuming there is only one TYPE_location key
      inputs[locationKey] = event.detail.place
   }
</script>

<div class="grid grid-cols-1 lg:grid-cols-3 items-center align-center gap-2 py-4">
   <div class="lg:col-span-3">
      <slot name="header"/>
   </div>
   {#each keys as k}
      <div class="justify-self-start self-start lg:justify-self-end mx-2 flex flex-row gap-2">
         <div>{$_(`key.${k}`)}</div>
         {#if required?.includes(k)}
            <div class="text-error">*</div>
         {/if}
      </div>
      <div class="justify-self-start lg:col-span-2">
         {#if selects[k]}
            <select class="select select-bordered" bind:value={inputs[k]}>
               <option disabled selected value={null}>{$_('page.add.select')}</option>
               {#each selects[k] as opt}
                  <option value={opt}>{$_(`option.${opt}`)}</option>
               {/each}
            </select>
         {:else if multiselects[k]}
            <MultipleSelect selectOptions={multiselects[k]} bind:selects={inputs[k]} />
         {:else if k.includes('_picture')}
            <UploadPicture key={k} bind:pictureFile={inputs[k]} />
         {:else if k.includes('_location')}
            <div class="flex flex-col gap-2">
               <div class="btn btn-accent" on:click={()=>openMapModal = true}>Select in Google Map</div>
               <textarea 
                  class="textarea textarea-bordered" 
                  placeholder="Select in Google Map first"
                  bind:value={inputs[k].formatted_address}
               />
            </div>
         {:else if k.includes('show')}
            <input type="checkbox" bind:checked={inputs[k]} class="checkbox" />
         {:else if k.includes('description')}
            <textarea class="textarea textarea-bordered" bind:value={inputs[k]} />
         {:else if k.includes('_links')}
            <MultipleSelect bind:selects={inputs[k]} />
         {:else}
            <input type="text" class="input input-bordered" bind:value={inputs[k]} />
         {/if}
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
