<script lang=ts>
   import {_} from 'svelte-i18n'
   import MultipleSelect from './MultipleSelect.svelte';
   import UploadPicture from './UploadPicture.svelte';
   import RichTextEditor from './RichTextEditor.svelte';

   export let inputs: Record<string, any>
   export let submissionPackage: Record<string, any>
   const {keys, selects, multiselects, required} = submissionPackage
</script>

<div class="grid grid-cols-1 lg:grid-cols-3 items-center align-center gap-2 py-4">
   <div class="lg:col-span-3">
      <slot name="header"/>
   </div>
   {#each keys as k}
      <div class="justify-self-start lg:justify-self-end mx-2 flex flex-row gap-2">
         <div>{$_(`key.${k}`)}</div>
         {#if required?.includes(k)}
            <div class="text-error">*</div>
         {/if}
      </div>
      <div class="justify-self-start lg:col-span-2 ">
         {#if selects[k]}
            <select class="select select-bordered" bind:value={inputs[k]}>
               <option disabled selected value={null}>{$_('page.create.select')}</option>
               {#each selects[k] as opt}
                  <option value={opt}>{$_(`option.${opt}`)}</option>
               {/each}
            </select>
         {:else if multiselects[k]}
            <MultipleSelect selectOptions={multiselects[k]} bind:selects={inputs[k]} />
         {:else if k.includes('_picture')}
            <UploadPicture key={k} bind:pictureFile={inputs[k]} />
         {:else if k.includes('show')}
            <input type="checkbox" bind:checked={inputs[k]} class="checkbox" />
         {:else if k.includes('description')}
            <!-- <RichTextEditor/> -->
            <textarea class="textarea textarea-bordered" bind:value={inputs[k]} />
         {:else if k.includes('_link')}
            <MultipleSelect bind:selects={inputs[k]} />
         {:else}
            <input type="text" class="input input-bordered" bind:value={inputs[k]} />
         {/if}
      </div>
   {/each}
</div>

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
