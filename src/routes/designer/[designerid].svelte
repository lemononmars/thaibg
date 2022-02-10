<script lang="ts" context="module">
   import {from} from '$lib/supabase'

   export async function load({ session, params }) {
       const { user } = session
       const {data, error} = await from('designer').select('*').eq('id', params.designerid)
       if(error) {}
       return {
           props: {
               user,
               found: data.length >= 1,
               data: data[0] || ""
           }
       };
   }
</script>

<script lang="ts">
   import Seo from '$lib/components/SEO.svelte'
   import Spinner from '$lib/components/Spinner.svelte'

   export let user, found, data
</script>

<Seo title="Designer"/>
<div class="flex flex-col justify-center items-center relative">
   <div class="w-full text-center mb-4 flex flex-col place-items-center">
      {#if !found}
         Invalid ID!
      {:else}
         {#if data}
            <div>
               <h1>{data.name}</h1><br>
               Past works:
               <div class="w-full text-center mb-4 flex flex-row justify-left items-center">
                  {#each data.boardgame as bg}
                     <a href="/boardgame/{bg.id}">
                        <div class="card shadow-xl image-full">
                           <figure>
                              <img src="https://picsum.photos/300/300" alt="cover of {bg.name}">
                           </figure> 
                           <div class="justify-end card-body">
                              <h2 class="card-title">{bg.name}</h2> 
                           </div>
                        </div> 
                     </a>
                  {:else}
                     N/A
                  {/each}
               </div>
               <p>{data.profile}</p>
            </div>
         {:else}
            <Spinner/>
         {/if}
      {/if}
      {#if user && !user.guest}
         <button class="btn">Suggest edit</button>
      {/if}
   </div>
</div>