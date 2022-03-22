
<script lang=ts context=module>
   import {from} from '$lib/supabase'
   import {getAvatar, getUserProfile, getCurrUserProfile} from '$lib/user/profile'
   
   export async function getComments(type: string, ID: number){
      if(type === 'boardgame')
         type = 'TBG'
      const {data, error} = await from('Comment').select('*').eq(`${type}_ID`, ID)
      if(error) 
         return{comments: []}
      
      let comments = data
      if(data) {
         for(let c in comments)  {
            // fetch username and profile pic
            const {data: data1, error} = await getUserProfile(data[c].Comment_user_ID)
            if(error) {throw(error)}
            const url = await getAvatar(data1.avatar_url)
            comments[c]['Comment_avatar_url'] = url
            comments[c]['Comment_username'] = data1.username
         }
      }
      return {comments}
   }
// /** @type {import('@sveltejs/kit').RequestHandler} */
//    export async function post({request, params}){
//       const {data, error} = from('Comment')
//          .insert([
//             {
//                TBG_ID: params.id,
//                Comment_text: request.text(),
//                Comment_user_ID: '001'
//             }
//          ])

//       if(error)
//          return {
//             status:400
//          }

//       return {
//          status:200,
//          body:{
//             message: 'posted!',
//             data
//          }
//       }
//    }
</script>
<script lang=ts>
   import {onMount} from 'svelte'
   import Spinner from '$lib/components/Spinner.svelte'
   import { user } from '$lib/user';
   import { _} from 'svelte-i18n';
   export let type: string, ID: number

   let promiseComments
   let yourAvatarURL
   let yourUsername
   let guest = true
   onMount(async ()=>{
      promiseComments = getComments(type, ID)
      const {data, error} = await getCurrUserProfile()
      if(data)
         guest = false
      yourUsername = data.username
      yourAvatarURL = await getAvatar(data.avatar_url)
   })
</script>

<h3>{$_('comment._')}</h3>
<div class="my-4">
{#await promiseComments}
   <Spinner/>
{:then res}
   {#if res}
      {#each res.comments as c}
         <div class="flex flex-row items-center border-2 border-primary p-2 gap-2 rounded-lg bg-base-200">
            <div class="flex flex-col justify-center gap-1 text-center m-2">
               <div class="avatar">
                  <div class=" w-20 h-20 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                     <img src="{c.Comment_avatar_url}" alt="user avatar">
                  </div>
               </div>
            </div>
            <div class="text-left flex flex-col gap-1">
               <div class="text-base-content">{c.Comment_username} ({c.Comment_date})</div>
               <div>{c.Comment_text}</div>
            </div>
         </div>
      {:else}
         <p>{$_('comment.not_found')}</p>
      {/each}
   {/if}
   {#if guest}
      <div>
         <a href="/auth">{$_('auth.sign_in')}</a> {$_('comment.to_add')}
      </div>
   {:else}
      <div class="flex flex-row gap-4 my-2">
         <div class="flex flex-col justify-center text-center w-30">
            <div class="avatar">
               <div class=" w-20 h-20 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                  <img src="{yourAvatarURL}" alt="user avatar">
               </div>
            </div>
            <div>{yourUsername}</div>
         </div>
         <div class="w-full">
            <div class="form-control" method="post">
               <textarea class="textarea h-24 textarea-bordered" placeholder="{$_('comment.add')}"></textarea>
               <div class="btn" type="submit">{$_('comment.submit')}</div>
            </div>
         </div>
      </div>
   {/if}
{/await}
</div>