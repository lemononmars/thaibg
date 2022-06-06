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

<div class="flex flex-col content-center">
<svg 
   class={$$props.class + " fill-info"} 
   viewBox="0 0 500 500" xmlns="http://www.w3.org/2000/svg"
>
   {@html icon}
</svg>

{#if showText}
   <p class="text-xs">{$_('boardgame.status.' + BoardgameStatusArray[index])}</p>
{/if}
</div>