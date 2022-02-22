<script lang="ts">
   import Seo from '$lib/components/SEO.svelte'
   import {from} from '$lib/supabase'
   import {onMount} from 'svelte'
   import Spinner from '$lib/components/Spinner.svelte'
   import {SearchIcon} from 'svelte-feather-icons'
   import DesignerLink from '$lib/components/PersonLink.svelte'
   import {DIR_IMAGE, URL_BLANK_IMAGE} from '$lib/constants'
   
   let designers = []
   onMount(async () => {
      let {data, error} = await from('Designer').select('*').eq('Designer_show', true)
      if(error) throw(error)
      designers = data.map((d)=>({
         id: d.Designer_ID,
         name: d.Designer_name,
         slug: d.Designer_slug,
         picture: DIR_IMAGE + '/designer/' + (d.Designer_picture || URL_BLANK_IMAGE),
         type: 'designer'
      }))

      
   })

   let sorted = 0
   let searchString = ""
   let sortBtnTextArray = ["None", "Year (ascending)", "Year (descending)", "Title (A-Z)", "Title (Z-A)", "Title (่ก-ฮ)", "Title (ฮ-ก)"]
   $: sortBtnText = "Sorted by: " + sortBtnTextArray[sorted]
   $: designersFiltered = designers.filter((bg)=> 
         bg.Designer_name?.toLowerCase().includes(searchString.toLowerCase())
      )
   $: designersSorted = designersFiltered.sort((a,b)=> compare(sorted, a, b))

   function compare(s: number, a, b) {
      if(s == 1) return a.Designer_name.localeCompare(b.Designer_name, 'en')
      if(s == 2) return b.Designer_name.localeCompare(a.Designer_name, 'en')
      if(s == 3) return a.Designer_name_th?.localeCompare(b.Designer_name_th, 'th')
      if(s == 4) return b.Designer_name_th?.localeCompare(a.Designer_name_th, 'th')
   }
   
</script>

<Seo title="Designer"/>
<div class="flex flex-col justify-center items-center relative">
   <div class="form-control m-4 flex flex-row items-center">
      <div class="relative">
        <input type="text" placeholder="Search designer" class="w-full pr-16 input input-primary input-bordered"> 
        <button class="absolute top-0 right-0 rounded-l-none btn btn-primary"><SearchIcon size=20/></button>
      </div>
      <div class="flex-1 dropdown">
         <div tabindex="0" class="m-1 btn">{sortBtnText}</div> 
         <ul tabindex="0" class="p-2 shadow menu dropdown-content bg-base-100 rounded-box w-52">
            {#each sortBtnTextArray as s, idx}
               <li>
                  <a on:click|preventDefault={() => sorted = idx} href=null>{s}</a>
               </li> 
            {/each}
         </ul>
      </div>
   </div> 

   <div class="w-full text-center mb-4 grid grid-cols-2 lg:grid-cols-4 gap-4">
      {#each designers as ds}
         <DesignerLink {...ds}/>
      {:else}
         <Spinner/>
      {/each}
   </div>
</div>