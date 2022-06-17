<script lang="ts">
	import {EditIcon} from 'svelte-feather-icons'
	export let type: string;
	export let id: number;
	export let url: string = `/edit/${type}/${id}`
</script>

<div>
	<div class="tooltip" data-tip="edit this {type}">
		<a href="{url}" target="_blank">
			<div class="btn btn-square btn-secondary">
				<EditIcon size="2x" />
			</div>
		</a>
	</div>
</div>