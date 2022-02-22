<script lang="ts" context="module">

    export async function load({ session }) {
        const { user } = session
        return {
            props: {
                user
            }
        };
    }
</script>

<script lang="ts">
  
  import Seo from '$lib/components/SEO.svelte'
  import Spinner from '$lib/components/Spinner.svelte'
  import {from} from '$lib/supabase'
  import {onMount} from 'svelte'
  import PersonLink from '$lib/components/PersonLink.svelte'
  import BoardgameLink from '$lib/components/BoardgameLink.svelte'
  import {DIR_IMAGE, URL_BLANK_IMAGE} from '$lib/constants'

   export let user
   let boardgames
   let designers
   let artists
   let contents
   let loaded = false
   // let artists

   onMount(async ()=>{
      let res = await from('Designer')
         .select('*')
         .eq('Designer_show', true)
      const d = res.data[Math.floor(Math.random()*res.data.length)]
      designers = {
        id: d.Designer_ID,
        name: d.Designer_name,
        slug: d.Designer_slug,
        picture: DIR_IMAGE + '/designer/' + (d.Designer_picture || URL_BLANK_IMAGE),
        type: 'designer'
      }
      res = await from('Artist')
         .select('*')
         .eq('Artist_show', true)
      const a = res.data[Math.floor(Math.random()*res.data.length)]
      artists = {
        id: a.Artist_ID,
        name: a.Artist_name,
        slug: a.Artist_slug,
        picture: DIR_IMAGE + '/artist/' + (a.Artist_picture || URL_BLANK_IMAGE),
        type: 'artist'
      }
      res = await from('Boardgame')
         .select('*')
         .eq('TBG_show', true)
      const bg = res.data[Math.floor(Math.random()*res.data.length)]
      boardgames = bg
      res = await from('Content')
         .select('*')
      contents = res.data
      loaded = true
   })
</script>

<Seo title="Home"/>
<div class="grid grid-cols-2 lg:grid-cols-4 lg:gap-4">
    <div>
      <h2>Hot board game</h2>
        {#if loaded}
          <BoardgameLink bg={boardgames}/>
        {:else}
          <Spinner/>
        {/if}
    </div>

  <div>
    <h2>Hot designer</h2>
    {#if loaded}
      <PersonLink {...designers}/>
    {:else}
      <Spinner/>
    {/if}
  </div>

  <div>
    <h2>Hot Artist</h2>
    {#if loaded}
      <PersonLink {...artists}/>
    {:else}
        <Spinner/>
    {/if}
  </div>

  <div class="col-span-2 text-left">
    <h2>Latest Contents</h2>
    {#if loaded}
      {#each contents as c}
        <div class="badge">{c.Content_channel}</div>
        <a href="{c.Content_link}" class="text-ellipsis" target="_blank">{c.Content_name}</a> <br>
      {:else}
        <p>Nothing to see</p>
      {/each}
    {:else}
      <Spinner/>
    {/if}
  </div>

  <div class="col-span-2 text-left">
    <h2>Upcoming Events</h2>
    {#if loaded}
      {#each contents as c}
        <div class="badge">{c.Content_channel}</div>
        <a href="{c.Content_link}" class="text-ellipsis" target="_blank">{c.Content_name}</a> <br>
        {:else}
        <p>Nothing to see</p>
      {/each}
    {:else}
      <Spinner/>
    {/if}
  </div>
</div>