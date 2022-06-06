<script lang=ts context=module>
   import type {SubmissionPublic} from '$lib/datatypes'

	export async function load({ fetch }) {
		const res = await fetch('/api/submission')
      const data = await res.json()

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
		headers: ['ID', 'Type', 'Page type', 'Username', 'Date', 'Content'],
		body: [
			'id',
			'Submission_type',
			'Submission_page_type',
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
							{d[t] ? ('' + d[t]) : '-'}
						</td>
					{/each}
				</tr>
			{/each}
		</tbody>
	</table>
</div>
