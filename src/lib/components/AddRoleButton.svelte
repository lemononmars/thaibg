<script lang="ts">
	import { personRoles } from '$lib/datatypes';
	import {personIcon, organizationIcon, shopIcon} from '$lib/assets/icons'
	import {PlusCircleIcon} from 'svelte-feather-icons'
	import {_} from 'svelte-i18n'

	export let role: string
	let roleIcon: string = role === 'shop'?
		shopIcon :
			personRoles.includes(role)? 
				personIcon : 
				organizationIcon
</script>

<div 
	class="flex flex-col w-24 border-2 rounded-md hover:scale-110 group"
>
	<div class="relative">
		<div class="group-hover:opacity-20 transition duration-1000">
			<img 
				src={roleIcon} 
				alt="{role} image"
			/>
		</div>
		<!-- svelte-ignore a11y-missing-attribute -->
		<a>
			<div class="text-success absolute top-0 m-1 text-opacity-0 group-hover:text-opacity-100  transition duration-500">
				<PlusCircleIcon/>
			</div>
		</a>
	</div>
	<div class="h-10">
		<p class="text-sm">{$_(`keyword.${role}`)}</p>
	</div>
</div>
