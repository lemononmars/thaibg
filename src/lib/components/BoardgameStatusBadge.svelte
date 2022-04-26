<script lang=ts>
	import { SendIcon, ShoppingCartIcon, SettingsIcon, PauseIcon } from 'svelte-feather-icons';
	import type { BoardgameStatus } from '$lib/datatypes';
	import { _ } from 'svelte-i18n';

	export let status: BoardgameStatus;
	export let showText: boolean = false;
	export let size: string = '2x';
	$: statusText = $_('boardgame.status.' + status);

	const BoardgameStatusIconMap = {
		unpublished: PauseIcon,
		pending: PauseIcon,
		planned: SendIcon,
		prototype: SettingsIcon,
		published: ShoppingCartIcon
	};
</script>

<div class="flex flex-row items-center gap-2">
	<div class="tooltip" data-tip={statusText}>
		<svelte:component this={BoardgameStatusIconMap[status]} {size} class="text-info" />
	</div>
	{#if showText}
		<p>{statusText}</p>
	{/if}
</div>
