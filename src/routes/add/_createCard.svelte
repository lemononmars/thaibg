<script lang=ts>
   import {fly} from 'svelte/transition'
   export let dir: number = 1
   export let title: string 
</script>

<div class="bg-base-200 rounded-3xl w-screen lg:w-2/3 lg:mx-auto my-2" in:fly={{x:200*dir, duration:1000}}>
   <div class="bg-error text-error-content py-4 mx-auto rounded-t-3xl">
      <p class="text-2xl">{title}</p>
   </div>
   <div class="p-2">
      <slot/>
   </div>
</div>