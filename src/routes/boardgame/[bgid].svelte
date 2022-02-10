<script lang="ts" context="module">
   import {from} from '$lib/supabase'

   export async function load({ session, params }) {
       const { user } = session
       const {data, error} = await from('boardgame').select('*').eq('id', params.bgid)
       if(error) {}
       return {
           props: {
               user,
               found: data.length >= 1,
               bg: data[0]
           }
       };
   }
</script>

<script lang="ts">
   import Seo from '$lib/components/SEO.svelte'
   import Spinner from '$lib/components/Spinner.svelte'

   export let user, found, bg
</script>

<Seo title="Designer"/>
<div class="flex flex-col justify-center items-center relative">
   <div class="w-full text-center mb-4 flex flex-col place-items-center">
      {#if !found}
         Invalid ID!
      {:else}
         {#if bg}
            <div>
               <h1>{bg.title} ({bg.year})</h1><br>
               Designer: 
               {#each bg.designer as d, idx} 
                  {#if idx > 0},{/if}
                  <a href="/designer/{d.id}">{d.name}</a>
               {:else} 
                  N/A
               {/each} <br>
               Artist: 
                  {#each bg.artist as a, idx} 
                     {#if idx > 0},{/if}
                     <p>{a}</p>
                  {:else}
                     N/A
                  {/each} <br>
               Publisher: <p>{bg.publisher}</p><br>
            </div>
            Description: 
            <p class="text-left">{@html bg.description}
            </p>
            <div>
               Links: 
                  {#each bg.link as l}
                     <a href="{l.url}">{l.label}</a>
                  {:else}
                     N/A
                  {/each}
            </div>
            <div>
               Videos: 
               <div class="flex flex-col lg:flex-row items-center lg:justify-center gap-4">
                  {#each bg.video as v}
                        <div class="flex flex-col justify-center"><iframe width="280" height="150" src="{v.url}" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
                        <p>{v.label}</p>
                     </div>
                  {:else}
                     N/A
                  {/each}
               </div>
            </div>
            <div>
               Reviews: 
                  {#each bg.review as r}
                     <a href="{r.url}">{r.label}</a>
                  {:else}
                     N/A
                  {/each}
            </div>
            {#if user && !user.guest}
               <button class="btn">Suggest edit</button>
            {/if}
         {:else}
            <Spinner/>
         {/if}
      {/if}
   </div>
</div>