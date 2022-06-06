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

<div class="overflow-x-auto w-full py-20">
	<table class="table w-full">
		<thead>
			<tr>
				{#each tableInfo.headers as t}
					<th>{t}</th>
				{/each}
			</tr>
		</thead>
		<!-- Table body -->
		<tbody>
			{#each data as d}
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
