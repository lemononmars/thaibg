<script lang=ts context=module>
   import {from, changeSubmissionStatus} from '$lib/supabase'

    export async function load({session}){
       const {user} = session
       if(user.role !== 'authenticated')
         return {
            status: 303,
            redirect: '/'
         }
      const {data, error} = await from('Submission').select('*').eq('Submission_status', 'pending')
      if(error) throw error
      return {
         props:
         {data}
      }
    }

    export async function approval(approved: string, id: number){
      return changeSubmissionStatus(id, approved)
    }
</script>

<script lang=ts>

   export let data
   // to be paginated?

   const tableInfo = {
      headers: ['ID', 'Type', 'Page type', 'Username','Date', 'Content'],
      body:['id', 'Submission_type', 'Submission_page_type', 'Submission_username', 'Submission_date', 'Submission_content']
   }

   async function decision(a: string, id: number) {
      let res = await approval(a, id)
      if(res.status === 'success')
         alert('successfully' +  a + '!')
   }
</script>

<div class="overflow-x-auto w-full py-20">
   <table class="table w-full">
      <thead>
         <tr>
            {#each tableInfo.headers as t}
               <th>{t}</th>
            {/each}
            <th>Decision</th>
         </tr>
      </thead>
      <!-- Table body -->
      <tbody>
         {#each data as d}
            <tr>
               {#each tableInfo.body as t}
                  <td>
                     {#if t !== 'Submission_content'}
                        {d[t]? (d[t]) : '-'}  
                     {:else}
                        <div tabindex="0" class="collapse collapse-arrow border border-base-300 bg-base-100 rounded-box">
                           <div class="collapse-title text-xl font-medium truncate">
                              {d[t]}
                           </div>
                           <div class="collapse-content"> 
                              {#each d[t].split(',') as w}
                                 <p>{w}</p>
                              {/each}
                           </div>
                        </div>
                     {/if}
                  </td>
               {/each}
               <td>
                  <div class="dropdown dropdown-end">
                     <label tabindex="0" class="btn m-1">Decision</label>
                     <ul tabindex="0" class="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52 z-20">
                       <li><div class="btn btn-success" on:click={()=>decision('approved', d.id)}>Approve</div></li>
                        <li><div class="btn btn-error" on:click={()=>decision('rejected', d.id)}>Reject</div></li>
                     </ul>
                   </div>
               </td>
            </tr>
         {/each}
      </tbody>
   </table>
</div>