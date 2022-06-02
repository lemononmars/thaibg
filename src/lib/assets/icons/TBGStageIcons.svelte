<script lang=ts>
   import icons from './iconStrings'
   import {BoardgameStatusArray} from '$lib/datatypes/'
   import { _ } from 'svelte-i18n';

   export let 
      stage: number = 1,
      showText: boolean = false
   const icon = icons.stage[stage]
</script>

<svg 
   class={$$props.class + " fill-info"} 
   viewBox="0 0 500 500" xmlns="http://www.w3.org/2000/svg"
>
   {@html icon}
</svg>

{#if showText}
   {$_('boardgame.status.' + BoardgameStatusArray[stage-1])}
{/if}