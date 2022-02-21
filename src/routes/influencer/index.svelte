<script lang="ts">
   import Seo from '$lib/components/SEO.svelte'
   import {from} from '$lib/supabase'
   import {onMount} from 'svelte'
   import Spinner from '$lib/components/Spinner.svelte'
   import {SearchIcon} from 'svelte-feather-icons'
   import PersonLink from '$lib/components/PersonLink.svelte'
   import {DIR_IMAGE, URL_BLANK_PERSON_IMAGE} from '$lib/constants'
   
   let influencers = []
   onMount(async () => {
      let {data, error} = await from('Influencer').select('*').eq('Influencer_show', true)
      influencers = data.map((i)=>({
         id: i.Influencer_ID,
         name: i.Influencer_name_th, // change to eng?
         slug: i.Influencer_slug,
         picture: DIR_IMAGE + '/influencer/' + (i.Influencer_picture || URL_BLANK_PERSON_IMAGE),
         type: 'influencer'
      }))

      if(error) throw(error)
   })
   
</script>

<Seo title="Influencer"/>
<div class="flex flex-col justify-center items-center relative">
   <div class="form-control m-4">
      <div class="relative">
        <input type="text" placeholder="Search influencer" class="w-full pr-16 input input-primary input-bordered"> 
        <button class="absolute top-0 right-0 rounded-l-none btn btn-primary"><SearchIcon size=20/></button>
      </div>
   </div> 
   <div class="w-full text-center mb-4 grid grid-cols-2 lg:grid-cols-4 gap-4">
      {#each influencers as i}
         <PersonLink {...i}/>
      {:else}
         <Spinner/>
      {/each}
   </div>
</div>