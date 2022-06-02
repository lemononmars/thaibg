<script lang=ts>
   import {_} from 'svelte-i18n'
   import TBGIcons from '$lib/assets/icons/TBGIcons.svelte'
   export let type: string, description: string
</script>

<div class="flex flex-row place-items-center mb-2 gap-2">
   <div class="flex flex-col justify-left w-1/4">
      <TBGIcons class="h-16" {type}/>
      <h3 class="text-xs -mt-2">{$_(`keyword.${type}`)}</h3>
   </div>
   <div class="text-xs text-left w-1/2">{description}</div>
   <a href="/create/{type}" target="_blank">
      <div class="btn btn-secondary">{$_('page.create._')}</div>
   </a>
</div>