<script lang="ts">   
   import {_, locale} from 'svelte-i18n'

   $: pageGroup1 = [
      {name: $_('boardgame'), url: '/boardgame'},
      {name: $_('designer'), url: '/person?role=Designer'},
      {name: $_('manufacturer'), url: '/manufacturer'},
      {name: $_('graphicdesigner'), url: '/person?role=Graphicdesigner'},
      {name: $_('playtester'), url: '/person?role=Playtester'}
   ]
   $: pageGroup2 = [
      {name: $_('shop'), url: '/shop'},
      {name: $_('contentcreator'), url: '/person?role=Creator'},
      {name: $_('publisher'), url: '/publisher'},
   ]
</script>

<div class="flex flex-row gap-2 m-2">
   <div class="btn-group">
      {#each pageGroup1 as p}
         <button class="btn">
            <a href="{p.url}" class="link-accent">
               {p.name}
            </a>
         </button>
      {/each}
   </div>
   <div class="btn-group">
      {#each pageGroup2 as p}
      <button class="btn">
         <a href="{p.url}" class="link-secondary">
            {p.name}
         </a>
      </button>
      {/each}
   </div>
</div>
