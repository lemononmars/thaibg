<script>
	// @todo : change filename and functiom
	import { onMount } from 'svelte';
	let p = 0;
	let visible = false;
	onMount(() => {
		visible = true;
		function next() {
			p += 0.1;
			const remaining = 1 - p;
			if (remaining > 0.15) setTimeout(next, 500 / remaining);
		}
		setTimeout(next, 250);
	});
</script>

{#if visible}
	<div class="absolute top-0 left-0 w-screen h-2">
		<div
			class="absolute top-0 left-0 w-screen h-full bg-green-400 z-30"
			style="width: {p * 100}%; transition: width 0.4s"
		/>
	</div>
{/if}

{#if p >= 0.4}
	<div class="fade" />
{/if}

<style lang="postcss">
	.fade {
		position: fixed;
		width: 100%;
		height: 100%;
		background-color: rgba(255, 255, 255, 0.3);
		pointer-events: none;
		z-index: 998;
		animation: fade 0.4s;
	}
	@keyframes fade {
		from {
			opacity: 0;
		}
		to {
			opacity: 1;
		}
	}
</style>
