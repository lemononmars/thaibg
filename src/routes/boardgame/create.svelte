<script lang="ts" context="module">
   import {from} from '$lib/supabase'

   export async function load({ session }) {
       const { user } = session
       const {data, error} = await from('Boardgame').select('*')
       console.log(data.length)
       if(user.role !== 'authenticated' || error) {
         return {
            redirect: "/boardgame",
            status: 303
            }
       }
       return {
           props: {
               id: data.length,
               user
           }
       };
   }
</script>

<script lang="ts">
   import Seo from '$lib/components/SEO.svelte'
   import {PlusCircleIcon} from 'svelte-feather-icons'

   export let user, id
   let loading = false
   const basicCategories = [
      {cat:'TBG_name_th', text:'ชื่อไทย', type:'text'},
      {cat:'TBG_name', text:'ชื่อภาษาอังกฤษ', type:'text'},
      {cat:'TBG_released', text:'ปีที่ผลิต', type:'number'},
      {cat:'Publisher_name', text:'ชื่อค่ายเกม',type:'text'},
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
      {cat:'Designer_name', text:'ชื่อนักออกแบบ',type:'text'},
      {cat:'Artist_name', text:'ชื่อศิลปิน',type:'text'},
      {cat:'Type_name', text:'ประเภท',type:'text'},
      {cat:'Mech_name', text:'กลไก',type:'text'},
   ]
   let basicInput = {}, advancedInput = {}
   basicCategories.forEach((c)=>basicInput[c.cat] = '')
   pairedCategories.forEach((c)=>basicInput[c.cat] = '')
   advancedCategories.forEach((c)=>basicInput[c.cat] = [])

   async function submit(){
      // TODO: make a post request
      loading = true
      basicInput['TBG_ID'] = 'TBG' + ('0000' + (id+1)).slice(-4)
      basicInput['TBG_show'] = false
      basicInput['TBG_slug'] = basicInput['TBG_name'].toLowerCase().replace(/\s/g,'-').replace(/[^\w\s\-]/gi,'')
      const { data, error } = await from('Boardgame')
         .insert([
            basicInput,
         ])
      if(error) alert(error.message)
      else alert("added!")
   }
</script>

<Seo title="Create Boardgame"/>

<div class="flex grid grid-cols-3 flex-row place-items-start">
   <div class="overflow-x-auto m-auto">
      <table class="table table-compact w-max">
         <tbody>
            {#each basicCategories as c}
               <tr>
                  <td>{c.text}</td>
                  <td>
                     {#if c.type === 'text'}
                        <input type="text" class="input input-bordered w-70" bind:value={basicInput[c.cat]}>
                     {:else}
                        <input type="number" class="input input-bordered w-70" bind:value={basicInput[c.cat]}>
                     {/if}
                  </td>
               </tr>
            {/each}
         </tbody>
      </table>
   </div>

   <div class="overflow-x-auto m-auto">
      <table class="table table-compact w-max">
         <tbody>
            {#each pairedCategories as c, idx}
               <tr>
                  <td>{c.text}</td>
                  <td>
                     <input type="number" class="input input-bordered w-70" bind:value={basicInput[c.cat]}>
                  </td>
               </tr>
            {/each}
         </tbody>
      </table>
   </div>

   <div class="overflow-x-auto justify-center m-auto">
      <table class="table table-compact w-max">
         <tbody>
            {#each advancedCategories as c}
               <tr>
                  <td>{c.text}</td>
                  <td><input type="text" class="input input-bordered w-70" bind:value={basicInput[c.cat]}></td>
                  <div class="btn" on:click={()=>{}}><PlusCircleIcon size=20/></div>
               </tr>
            {/each}
         </tbody>
      </table>
   </div>
   <input
     class="sr-only"
      type="file"
      id="single"
      accept="image/*"
      disabled={loading}
    />
</div>

<p>{JSON.stringify(basicInput)}</p>
<div class="btn" on:click={submit}>Submit</div>
