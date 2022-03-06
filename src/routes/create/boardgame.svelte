<script lang="ts" context="module">
   import {from} from '$lib/supabase'

   export async function load({ session }) {
       const { user } = session
       const {data:types, error:error_2} = await from('Type').select('Type_ID, Type_name')
       const {data:categories, error:error_3} = await from('Category').select('Category_ID, Cat_name')
       const {data:mechanics, error:error_4} = await from('Mechanics').select('Mech_ID, Mech_name')
       const {data:publishers, error:error_5} = await from('Publisher').select('Publisher_ID, Publisher_name')
       const {data:artists, error:error_7} = await from('Artist').select('Artist_ID, Artist_name, Artist_name_th')
       const {data:designers, error:error_6} = await from('Designer').select('Designer_ID, Designer_name, Designer_name_th')
       if(user.role !== 'authenticated' || error_2) {
         return {
            redirect: "/boardgame",
            status: 303
            }
       }
       return {
           props: {
               types,
               mechanics,
               publishers,
               categories,
               designers,
               artists,
               user
           }
       };
   }
</script>

<script lang="ts">
   import Seo from '$lib/components/SEO.svelte'
   import {DeleteIcon, SearchIcon} from 'svelte-feather-icons'

   export let user, types, publishers, categories, mechanics, designers, artists
   let data = {
      Type: types.map((t)=>t.Type_name),
      Mechanic: mechanics.map((t)=>t.Mech_name),
      Publisher: publishers.map((t)=>t.Publisher_name),
      Categorie: categories.map((t)=>t.Cat_name),
      Designer: designers.map((t)=>t.Designer_name + (t.Designer_name_th? ' (' + t.Designer_name_th + ')':'')),
      Artist: artists.map((t)=>t.Artist_name + (t.Artist_name_th? ' (' + t.Artist_name_th + ')':'')),
   }
   let loading = false
   const basicCategories = [
      {cat:'TBG_name_th', text:'ชื่อไทย', type:'text'},
      {cat:'TBG_name', text:'ชื่อภาษาอังกฤษ', type:'text'},
      {cat:'TBG_released', text:'ปีที่ผลิต', type:'number'},
      {cat:'TBG_link', text:'ลิงก์เว็บหลัก',type:'text'},
      {cat:'BGG_ID', text:'ID บนเว็บไซต์ BGG', type:'text'},
      {cat:'TBG_age', text:'อายุผู้เล่นขั้นต่่ำ', type:'number'},
      {cat:'TBG_weight', text:'ความหนัก', type:'number'},
   ]
   const pairedCategories =[
      {cat:'TBG_player_min', text:'ผู้เล่นน้อยสุด', type:'number'},
      {cat:'TBG_player_max', text:'ผู้เล่นมากสุด', type:'number'},
      {cat:'TBG_playtime_min', text:'ใช้เวลาเล่นน้อยสุด', type:'number'},
      {cat:'TBG_playtime_max', text:'ใช้เวลาเล่นมากสุด', type:'number'},
   ]
   const advancedCategories = [
      {cat:'Designer', text:'ออกแบบโดย',type:'text'},
      {cat:'Publisher', text:'ผลิตโดย',type:'text'},
      {cat:'Artist', text:'ภาพประกอบโดย',type:'text'},
      {cat:'Type', text:'ประเภท',type:'text'},
      {cat:'Mech', text:'กลไก',type:'text'},
      {cat:'Cat', text:'หมวดหมู่',type:'text'},
   ]
   let basicInput = {}
   let search = {}
   basicCategories.forEach((c)=>basicInput[c.cat] = '')
   pairedCategories.forEach((c)=>basicInput[c.cat] = '')
   advancedCategories.forEach((c)=>{
      basicInput[c.cat] = []
      search[c.cat] = ''
   })
   $: dataFiltered = [] // only filter current search
      
   function filterData(k:string){
      dataFiltered = data[k].filter((d)=>d.toLowerCase().includes(search[k].toLowerCase())).splice(-20)
      dataFiltered = dataFiltered
   }

   function add(cat, text){
      basicInput[cat] = [...basicInput[cat], text]
      search[cat] = ''
   }

   async function submit(){
      // TODO: make a post request instead? call endpoints?
      return 
      loading = true
      const dummyID = 'SUBMISSION' + ('0000' + Math.floor(Math.random()*10000)).slice(-5)
      basicInput['TBG_ID'] = dummyID
      basicInput['TBG_show'] = false
      basicInput['TBG_slug'] = basicInput['TBG_name'].toLowerCase().replace(/\s/g,'-').replace(/[^\w\s\-]/gi,'')
      await from('Boardgame').insert([
         basicInput,
      ])

      if(basicInput['Designer'].length > 0) {
         await from('Designer_Relation').insert(
            basicInput['Designer'].map((d)=>({
               TBG_ID: dummyID,
               Designer_ID: designers.filter((ds)=>ds.Designer_name === d)
            }))
         )
      }
   }
</script>

<Seo title="Create Boardgame"/>

<div class="grid grid-flow-row flex-wrap place-items-start">
   {#each basicCategories as c}
      <div class="form-control">
         <!-- svelte-ignore a11y-label-has-associated-control -->
         <label class="label">
            <span class="label-text">{c.text}</span>
         </label>
         <!-- svelte-ignore a11y-label-has-associated-control -->
         <label class="label">
            {#if c.type === 'text'}
               <input type="text" class="input input-bordered" bind:value={basicInput[c.cat]}>
            {:else}
               <input type="number" class="input input-bordered" bind:value={basicInput[c.cat]}>
            {/if}
         </label>
      </div>
   {/each}
         
   <div class="form-control">
      <!-- svelte-ignore a11y-label-has-associated-control -->
      <label class="label">
         <span class="label-text">จำนวนผู้เล่น</span>
      </label>
      <label class="input-group input-group-sm">
         <input type="number" placeholder="น้อยสุด" class="input input-bordered w-24" bind:value={basicInput['TBG_player_min']}>
         <span>-</span>
         <input type="number" placeholder="มากสุด" class="input input-bordered w-24" bind:value={basicInput['TBG_player_max']}>
         <span>คน</span>
      </label>
   </div>
   <div>
      <!-- svelte-ignore a11y-label-has-associated-control -->
      <label class="label">
         <span class="label-text">ใช้เวลาเล่น</span>
      </label>
      <label class="input-group input-group-sm">
         <input type="number" placeholder="น้อยสุด" class="input input-bordered w-24" bind:value={basicInput['TBG_playtime_min']}>
         <span>-</span>
         <input type="number" placeholder="มากสุด" class="input input-bordered w-24" bind:value={basicInput['TBG_playtime_max']}>
         <span>นาที</span>
      </label>
   </div>

   {#each advancedCategories as c}
      <div class="dropdown mb-4">
         <!-- svelte-ignore a11y-label-has-associated-control -->
         <label tabindex="0">
            <div class="form-control">
               <label class="label text-sm">{c.text}</label>
               <div class="input-group input-sm">
                  <input 
                     type="text" 
                     placeholder="พิมพ์เพื่อค้นหา" 
                     class="input input-bordered w-70" 
                     bind:value={search[c.cat]}
                     on:keyup={(e)=>filterData(c.cat)}
                  >
                  <div class="btn">
                     <SearchIcon size=20/>
                  </div>
               </div>
            </div>
         </label>
         <ul tabindex="0" class="p-2 shadow menu dropdown-content bg-base-100 rounded-box w-52" 
            class:hidden={search[c.cat]==0}
         >
            {#each dataFiltered as d}
            <li><div class="btn btn-ghost" on:click={()=>add(c.cat, d)}>
               {d}
            </div></li>
            {:else}
               <li><div class="btn btn-outline btn-error">หาไม่เจอ</div></li>
            {/each}
         </ul>
      </div>
      {#each basicInput[c.cat] as i}
         <div class="badge m-1 hover:badge-error" on:click={()=>{
            basicInput[c.cat].splice(basicInput[c.cat].indexOf(i),1)
            basicInput = basicInput  
         }}>
            <DeleteIcon size=20/>{i} 
         </div>
      {/each}
   {/each}
   <input
     class="sr-only"
      type="file"
      id="single"
      accept="image/*"
      disabled={loading}
    />
</div>

<div class="btn" on:click={submit}>Submit</div>
