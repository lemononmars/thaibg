<script lang=ts context=module>
   import {from} from '$lib/supabase'

   export async function load() {
      let {data, error} = await from('Event').select('*')//.eq('Event_Show', true)

      if(error) 
         return {status: 404}
      return {
         props: {
            events: data,
         }
      }
   }
</script>
<script lang="ts">
   import Seo from '$lib/components/SEO.svelte'
   import SearchBar from '$lib/components/SearchBar.svelte'
   import DataView from '$lib/components/DataView.svelte'
   
   export let events
   let searchString = ''
   $: eventFiltered = events.filter((e)=> 
         (e.Event_name?.toLowerCase().includes(searchString.toLowerCase()) // name or name_th contains the string
            || e.Event_name_th?.includes(searchString))
      )
   const tableInfo = {
      headers: ['Start', 'End', 'Organizer'],
      body: ['Event_start', 'Event_end', 'Event_organizer']
   }
</script>

<Seo title="Event"/>
<div class="flex flex-col justify-center mx-auto">
   <DataView data={eventFiltered} type='event' {tableInfo}>
      <SearchBar placeholder="Search event (en/th)" bind:searchString/>
   </DataView>
</div>