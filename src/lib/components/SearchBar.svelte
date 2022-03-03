<script lang="ts">
   import {SearchIcon} from 'svelte-feather-icons'
   export let placeholder
   export let searchString
</script>

<div class="form-control m-4">
   <div class="relative">
      <input 
         type="text" 
         bind:value={searchString} 
         {placeholder}
         class="w-full pr-16 input input-primary input-bordered"
      >
      <button class="absolute top-0 right-0 rounded-l-none btn btn-primary">
         <SearchIcon size=20/>
      </button>
   </div>
</div> 