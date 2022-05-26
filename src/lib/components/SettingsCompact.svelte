<script lang=ts>
   import {isLoading, locale, locales} from 'svelte-i18n'
	import ToggleTheme from '$lib/components/ToggleTheme.svelte';
   import {SettingsIcon} from 'svelte-feather-icons'
   import {fly} from 'svelte/transition'

   const languageName = {'th': 'ไทย', 'en': 'ENG'}
   let expand: boolean = false
</script>

<div class="flex flex-row items-center glass">
   {#if expand}
      <div in:fly={{x:20, duration:500}} class="flex flex-row">
         <ToggleTheme/>
         {#if !$isLoading}
            <select class="select select-md" bind:value={$locale}>
               {#each $locales as l}
                  <option value={l} selected>{languageName[l]}</option>
               {/each}
            </select>
         {/if}
      </div>
   {/if}
   <div class="btn m-1" on:click={()=> expand = !expand}>
      <SettingsIcon size="20"/>
   </div>
</div>

   