<script lang="ts">
   import Seo from '$lib/components/SEO.svelte'
   import {from} from '$lib/supabase'
   import {onMount} from 'svelte'
   import Spinner from '$lib/components/Spinner.svelte'
   import {SearchIcon} from 'svelte-feather-icons'

   let boardgames = []
   onMount(async () => {
      let {data, error} = await from('boardgame').select('*')
      boardgames = data
      if(error) {}
   })
   
</script>

<Seo title="Boardgame"/>
<div class="flex flex-col justify-center items-center relative">
   <div class="form-control m-4">
      <div class="relative">
        <input type="text" placeholder="Search board game" class="w-full pr-16 input input-primary input-bordered"> 
        <button class="absolute top-0 right-0 rounded-l-none btn btn-primary"><SearchIcon size=20/></button>
      </div>
    </div> 
    <div class="w-full text-center mb-4 grid grid-cols-2 lg:grid-cols-4 gap-4">
      {#each boardgames as bg}
         <a href="./boardgame/{bg.id}">
         <div class="card shadow-xl image-full">
            <figure>
               <img src="https://picsum.photos/300/300" alt="cover of {bg.title}">
            </figure> 
            <div class="justify-end card-body">
               <h2 class="card-title">{bg.title} ({bg.year || "unknown"})</h2> 
            </div>
          </div> 
         </a>
      {:else}
         <Spinner/>
      {/each}
   </div>
</div>