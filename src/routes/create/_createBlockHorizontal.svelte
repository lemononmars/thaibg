<script lang=ts>
   import {_} from 'svelte-i18n'
   export let icon, type: string, description: string
</script>

<div class="flex flex-row place-items-center mb-2 gap-2">
   <div class="flex flex-col w-1/4">
      <img src={icon} alt="{type}" class="h-16 object-contain">
      <h3 class="text-xs -mt-2">{$_(`keyword.${type}`)}</h3>
   </div>
   <div class="text-xs text-left w-1/2">{description}</div>
   <a href="/create/{type}" target="_blank">
      <div class="btn btn-secondary">{$_('page.create._')}</div>
   </a>
</div>