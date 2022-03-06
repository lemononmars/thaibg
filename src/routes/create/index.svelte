<script lang="ts">
   import {_} from 'svelte-i18n'
   const types1 = ['boardgame', 'publisher', 'sponsor', 'manufacturer']
   const types2 = ['person' ,'designer', 'artist', 'graphicdesigner', 'playtester', 'contentcreator']
   const types3 = ['shop', 'event', 'content', 'honor']
</script>

<h1>Create new entry</h1>
<div class="flex flex-row justify-center gap-4 mx-auto w-full">
   <div>
      <h2>{$_('navbar.boardgame._')}</h2>
      {#each types1 as t}
         <a href="/create/{t}">{$_(`${t}`)}</a><br>
      {/each}
   </div>
   
   <div class="divider divider-vertical"></div>
   <div>
      <h2>{$_('navbar.person._')}</h2>
      {#each types2 as t}
         <a href="/create/{t}">{$_(`${t}`)}</a><br>
      {/each}
   </div>
   <div class="divider divider-vertical"></div>

   <div>
      <h2>{$_('navbar.activity._')}</h2>
      {#each types3 as t}
         <a href="/create/{t}">{$_(`${t}`)}</a><br>
      {/each}
   </div>
</div>