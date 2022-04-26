<script lang=ts>
	import { PlayIcon, XCircleIcon, PauseIcon } from 'svelte-feather-icons';
	import type { ShopStatus } from '$lib/datatypes';
	import { _ } from 'svelte-i18n';

	export let status: ShopStatus;
	export let showText: boolean = false;
	export let size: string = '2x';
	$: statusText = $_('shop.status.' + status);

	const ShopStatusIconMap = {
		active: PlayIcon,
		inactive: PauseIcon,
		closed: XCircleIcon
	};

	const ShopStatusIcon = ShopStatusIconMap[status];

	const ShopStatusColorMap = {
		active: 'success',
		inactive: 'info',
		closed: 'warning'
	};

	const ShopStatusColor = 'text-' + ShopStatusColorMap[status];
</script>

<div class="flex flex-row items-center gap-2">
	<div class="tooltip" data-tip={statusText}>
		<svelte:component this={ShopStatusIcon} {size} class={ShopStatusColor} />
	</div>
	{#if showText}
		<p>{statusText}</p>
	{/if}
</div>
