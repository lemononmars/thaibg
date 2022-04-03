<script context=module lang=ts>
   import {addToSubmission, fromBucket} from '$lib/supabase'
   import SveltyPicker from 'svelty-picker'

   let myDate = ''
   
   // TODO: make it a post request
   export async function postSubmission(data){
      let res = await addToSubmission(data)
      return res
   }

   export async function uploadImage(file, fileName) {
      // TODO: convert file? resize?
      let { data, error: updateError } = await fromBucket('images')
         .upload(`event/${fileName}`, file, {
            upsert: false
         })

      if (updateError) {
         throw updateError
      }
   }
</script>

<script lang="ts">
   import Seo from '$lib/components/SEO.svelte'
   import {user, getCurrUserProfile} from '$lib/user'
   import type {EventSubmission} from '$lib/datatypes'
   import {EventSubmissionKeys, EventTypeArray, EventRelationArray} from '$lib/datatypes'
   import Spinner from '$lib/components/Spinner.svelte';
   import SearchMultipleSelect from '$lib/components/SearchMultipleSelect.svelte'
   import UploadImage from '$lib/components/UploadImage.svelte'

   let submission = <EventSubmission>{}
   let eventRelationSelects = EventRelationArray.map((r)=>
      ({[r]:[]})
   ) 
   let submitState = 0
   let submitted = false
   let comment: string
   let imageFile

   async function handleSubmit(){
      submitState = 1
      let id = 'guest', username = 'guest'
      if(user) {
         let {data, error} = await getCurrUserProfile()
         id = (error || !data) ? 'guest': data.id
         username = (error || !data) ? 'guest': data.username
      }

      // rename image
      const slug = submission?.Event_name + `${Math.floor(Math.random() * 100)}` + imageFile.type.split('/')[1]
      submission.Event_picture = slug
      await uploadImage(imageFile, slug)

      let res = await postSubmission({
         content: submission, 
         pageType: 'Event', 
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
</script>

<Seo title="Create event"/>

<h1>Create new event</h1>
{JSON.stringify(submission)}
<form>
   <div class="grid grid-cols-2 items-center" class:hidden={submitted}>
      {#each EventSubmissionKeys as k}
         <div class="justify-self-end mx-2">{k}</div>
         <div class="justify-self-start">
            {#if typeof submission[k] === 'number'}
               <input type="number" 
                  class="input input-bordered" 
                  bind:value={submission[k]}
               >
            {:else if k === 'Event_type'}
               <select class="select select-bordered" bind:value={submission[k]}>
                  <option disabled selected>Select an event type</option>
                  {#each EventTypeArray as e}
                     <option>{e}</option>
                  {/each}
               </select>
            {:else if k === 'Event_picture'}
               <UploadImage bind:imageFile/>
            {:else if (k === 'Event_time_end' || k === 'Event_time_start')}
               <SveltyPicker inputClasses="form-control" format="yyyy-mm-dd" bind:value={submission[k]}/>
            {:else if k === 'Event_show'}
               <input type="checkbox" bind:checked={submission['Event_show']} class="checkbox">
            {:else}
               <input type="text" 
                  class="input input-bordered" 
                  bind:value={submission[k]}
               >
            {/if}
         </div>
      {/each}
   </div>
   <div class="flex flex-col justify-center">
      {#each EventRelationArray as r}
         <SearchMultipleSelect bind:selects={eventRelationSelects[r]} 
         type={r}/>
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
   {/if}
</form>

{#if submitState == 1}
   <p>Submitting.... please wait</p>
   <Spinner/>
{:else if submitState == 2}
   <p>Your submission has been received. Please wait until we approve it</p>
   <p>Refresh the page if you want to submit another one!</p>
{:else if submitState == 3}
   <p>There was an error. Please try again</p>
   <div class="btn" on:click|preventDefault={handleSubmit}>Submit</div>
{/if}

<style>
   input{
      @apply w-72
   }

   select{
      @apply w-72
   }

   input.checkbox{
      @apply w-10
   }
</style>