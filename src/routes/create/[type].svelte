<script context=module lang=ts>
   import {from, addToSubmission} from '$lib/supabase'
   
   export async function load({params, session}) {
      const typeLower = params.type
      const {user} = session
      const type = typeLower[0].toUpperCase() + typeLower.slice(1, typeLower.length)
      // BETTER: save a hard copy as a JSON template
      const {data, error} = await from(type).select('*').eq(`${type}_ID`, 1)
      if(error)
         throw(error)

      let blankData = data[0]
      let keys = Object.keys(blankData)
      keys.forEach((k)=>blankData[k]='')
      return {
         props:{
            user,
            blankData,
            type,
            keys
         }
      }
   }

   // TODO: make it a post request
   export async function postSubmission(data){
      let res = await addToSubmission(data)
      return res
   }
</script>

<script lang="ts">
   import Seo from '$lib/components/SEO.svelte'
   import {getCurrUserProfile} from '$lib/user/profile'

   export let blankData, type, keys, user
   let comment = ''
   keys = keys.map((k)=>k.slice(k.indexOf('_')+1,k.length))
   keys = keys.filter((k)=>
      (!k.endsWith('ID') && !k.endsWith('slug'))
   )
   keys = keys.sort((a,b)=> a.localeCompare(b))
   // TODO: remove unused keys

   let submitState = 0
   let submitted = false

   async function submitEntry(){
      submitState = 1
      let id = 'guest', username = 'guest'
      if(user) {
         let {data, error} = await getCurrUserProfile()
         id = (error || !data) ? 'guest': data.id
         username = (error || !data) ? 'guest': data.username
      }

      let res = await postSubmission({
         content: blankData, 
         pageType: type, 
         id,
         username,
         type: 'new',
         comment
      })
      if(res.status === 'success') {
         submitState = 2
         submitted = true
      }
      else
         submitState = 3
   }

   // TODO: translate keys and add input type
</script>

<Seo title="Create {type}"/>

<h1>Create new {type}</h1>
<form>
   <div class="grid grid-cols-2 items-center" class:hidden={submitted}>
      {#each keys as k}
         <div class="justify-self-end mx-2">{k}</div>
         <div class="justify-self-start">
            <input type="text" 
               class="input input-bordered" 
               bind:value={blankData[k]}
            >
         </div>
      {/each}
      <div class="justify-self-end mx-2">Comment (to admin)</div>
         <div class="justify-self-start">
            <input type="text" 
               class="input input-bordered" 
               bind:value={comment}
            >
         </div>
   </div>
   {#if submitState == 0}
      <div class="btn" on:click|preventDefault={submitEntry}>Submit</div>
   {:else if submitState == 1}
      <p>Submitting.... please wait</p>
   {:else if submitState == 2}
      <p>Your submission has been received. Please wait until we approve it</p>
      <p>Refresh the page if you want to submit another one!</p>
   {:else}
      <p>There was an error. Please try again</p>
      <div class="btn" on:click|preventDefault={submitEntry}>Submit</div>
   {/if}
</form>




