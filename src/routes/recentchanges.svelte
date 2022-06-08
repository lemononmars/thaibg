<script lang=ts context=module>
   import type {SubmissionPublic} from '$lib/datatypes'

	export async function load({ fetch }) {
		const res = await fetch('/api/submission')
      const data = await res.json()

      data.sort((a: SubmissionPublic,b: SubmissionPublic)=> {
         return b?.Submission_date.toString()
            .localeCompare(a?.Submission_date.toString())
      })

		return {
			props: {
				data,
			}
		};
	}
</script>

<script lang=ts>
	export let data: SubmissionPublic[]

	$: filteredData = data.slice(0, numEntries)
	let numEntries: number = 20
	let numEntriesAllowed: number[] = [20, 50, 100]

	const tableInfo = {
		headers: ['Type', 'Page type', 'ID', 'Username', 'Date', 'Status'],
		body: [
			'Submission_type',
			'Submission_page_type',
         'Submission_page_ID',
			'Submission_username',
			'Submission_date',
			'Submission_status',
		]
	};
</script>


<div class="overflow-x-clip w-full py-20">
	<div class="btn-group my-2">
		<button class="btn btn-ghost btn-disabled btn-xs">Show</button>
		{#each numEntriesAllowed as n}
			<button 
				class="btn btn-xs" 
				class:btn-active={numEntries == n}
				on:click={()=>numEntries = n}
			>{n}</button>
		{/each}
	 </div>
	<table class="table w-full table-compact table-zebra">
		<thead>
			<tr>
				{#each tableInfo.headers as t}
					<th>{t}</th>
				{/each}
			</tr>
		</thead>
		<!-- Table body -->
		<tbody>
			{#each filteredData as d}
				<tr>
					{#each tableInfo.body as t}
                  <td class="break-words">
                     {#if t === 'Submission_page_ID' && d.Submission_page_ID}
                        <a href="/{d.Submission_page_type}/{d.Submission_page_ID}" target="_blank">
                              {d.Submission_page_ID}
                           </a>
                     {:else if t === 'Submission_date'}
                        {d[t]?.toString()}
                     {:else}
                        {d[t] ? ('' + d[t]) : '-'}
                     {/if}
                  </td>
               {/each}
				</tr>
			{/each}
		</tbody>
	</table>
</div>
