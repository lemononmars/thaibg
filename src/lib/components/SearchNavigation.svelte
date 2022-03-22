<script lang="ts">   
   import {_} from 'svelte-i18n'

   $: pageGroup1 = [
      {name: $_('boardgame._'), url: '/boardgame'},
   ]
   $: pageGroup2 = [
      {name: $_('designer'), url: '/person?role=designer'},
      {name: $_('graphicdesigner'), url: '/person?role=graphicdesigner'},
      {name: $_('artist'), url: '/person?role=artist'},
      {name: $_('playtester'), url: '/person?role=playtester'},
      {name: $_('manufacturer'), url: '/manufacturer'},
      {name: $_('rulebookeditor'), url: '/person?role=rulebookeditor'}
   ]
   $: pageGroup3 = [
      {name: $_('shop'), url: '/shop'},
      {name: $_('contentcreator'), url: '/person?role=contentcreator'},
      {name: $_('publisher'), url: '/publisher'},
      {name: $_('investor'), url: '/investor'},
   ]
</script>

<div class="flex flex-wrap justify-center rgap-4 m-2 flex">
   <div class="btn-group">
      {#each pageGroup1 as p}
         <button class="btn">
            <a href="{p.url}" class="link-primary">
               {p.name}
            </a>
         </button>
      {/each}
   </div>
   <div class="btn-group">
      {#each pageGroup2 as p}
         <button class="btn">
            <a href="{p.url}" class="link-accent">
               {p.name}
            </a>
         </button>
      {/each}
   </div>
   
   <div class="btn-group">
      {#each pageGroup3 as p}
      <button class="btn">
         <a href="{p.url}" class="link-secondary">
            {p.name}
         </a>
      </button>
      {/each}
   </div>
</div>
