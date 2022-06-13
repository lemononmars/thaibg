<script lang=ts>
   import TBGIcons from '$lib/assets/icons/TBGIcons.svelte'
   import {_} from 'svelte-i18n'
   export let 
      type: string, 
      description: string,
      width: number = 1

   const widthRatio = width == 1 ? '1/4':'1/2'
</script>

<div class="flex flex-col lg:flex-row justify-center lg:rounded-md lg:shadow-xl p-4 lg:w-{widthRatio} lg:h-72">
   <div class="flex flex-col w-full lg:w-fit">
      <!--img src={icon} alt="{type}" class="h-32 object-contain"-->
      <TBGIcons class="h-32 mx-auto" {type}/>
      <div class="h-20">
         <h3>{$_(`keyword.${type}`)}</h3>
         <div class="text-xs h-20">{description}</div>
      </div>
      <a href="/add/{type}" target="_blank">
         <div class="btn btn-block btn-secondary mx-auto">{$_('page.add._')}</div>
      </a>
   </div>
   {#if width == 2}
      <div class="divider lg:divider-vertical"/>
      <div class="flex flex-col lg:h-60 lg:w-2/3">
         <slot/>
      </div>
   {/if}
   <div class="divider lg:hidden"></div>
</div>