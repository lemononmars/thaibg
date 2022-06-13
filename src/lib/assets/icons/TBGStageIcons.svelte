<script lang=ts>
   import icons from './iconStrings'
   import {BoardgameStatusArray} from '$lib/datatypes/'
   import { _ } from 'svelte-i18n';

   export let 
      status: string = '',
      showText: boolean = false
   
   const index: number = BoardgameStatusArray.includes(status) ? 
         BoardgameStatusArray.indexOf(status) : 0
   const icon = icons.stage[index+1] 
</script>

<div class="flex flex-col content-center text-center w-fit">
   <div class="aspect-auto">
      <svg 
         class={$$props.class} 
         viewBox="0 0 500 500" xmlns="http://www.w3.org/2000/svg"
         width="100" height="100"
      >
         {@html icon}
      </svg>
   </div>
   {#if showText}
      <p class="text-xs">{$_('boardgame.status.' + BoardgameStatusArray[index])}</p>
   {/if}
</div>