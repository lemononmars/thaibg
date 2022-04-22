<script context=module lang=ts>
   import {from, addToSubmission, getTableName} from '$lib/supabase'
   import type {Person} from '$lib/datatypes'
   
   export async function load({params, session}) {
      const {user} = session
      const type = getTableName(params.type)
      // BETTER: save a hard copy as a JSON template
      const res = await fetch(`/api/${params.type}/1`)
      if(!res.ok) return {status:404, message:'no data to fetch'}
      let blankData = await res.json()
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

   // filter out some keys, like ID and slug that needs to be generated on server or Supabase
   keys = keys.map((k)=>k.slice(k.indexOf('_')+1,k.length))
   keys = keys.filter((k)=>
      (!k.endsWith('ID') && !k.endsWith('slug'))
   )
   keys = keys.sort((a,b)=> a.localeCompare(b))
   // TODO: remove unused keys

   let submitState = 0
   let submitted = false

   async function handleSubmit(){
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
   // especially image!
</script>

<Seo title="Create {type}"/>

<h1>Create new {type}</h1>
{JSON.stringify(blankData)}
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
   </div>
   <div class="divider"></div>
   <div class="justify-self-end mx-2">Comment</div>
   <textarea 
      class="textarea textarea-bordered" 
      placeholder="comment to admin"
      bind:value={comment}
   /><br>
   {#if submitState == 0}
      <div class="btn" on:click|preventDefault={handleSubmit}>Submit</div>
   {:else if submitState == 1}
      <p>Submitting.... please wait</p>
   {:else if submitState == 2}
      <p>Your submission has been received. Please wait until we approve it</p>
      <p>Refresh the page if you want to submit another one!</p>
   {:else}
      <p>There was an error. Please try again</p>
      <div class="btn" on:click|preventDefault={handleSubmit}>Submit</div>
   {/if}
</form>




