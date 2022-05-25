<script lang="ts">
	import { getTypeIcon	} from '$lib/assets/icons'
	import {PlusCircleIcon, SearchIcon} from 'svelte-feather-icons'
	import {_} from 'svelte-i18n'

	type iconType = 'search' | 'add'
	export let role: string
	export let icon: iconType = 'search'
	export let text: string = role
	const icons = {
		'search': SearchIcon,
		'add': PlusCircleIcon,
	}

	const roleIcon = getTypeIcon(role)

</script>

<div 
	class="flex flex-col w-24 border-2 bg-base-100 rounded-md hover:scale-110 group"
>
	<div class="relative">
		<div class="group-hover:opacity-20 transition duration-1000">
			<object 
				type="image/svg+xml"
				data={roleIcon} 
				class="logo"
				aria-label="logo"
			/>
		</div>
		<!-- svelte-ignore a11y-missing-attribute -->
		<a>
			<div class="text-success absolute top-0 m-1 text-opacity-0 group-hover:text-opacity-100 transition duration-500">
				<svelte:component this={icons[icon]}/>
			</div>
		</a>
	</div>
	<div class="h-10 align-center">
		<p class="text-sm text-center text-base-content">{role==='add'?$_('page.create._'):''}{$_(`keyword.${text}`)}</p>
	</div>
</div>
