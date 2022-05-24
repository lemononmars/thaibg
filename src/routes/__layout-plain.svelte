<script lang="ts">
	import '../global.css';
	import AlertList from '$lib/alert/AlertList.svelte';
	import { initialize } from '../i18n';
	import {isLoading, locale, locales} from 'svelte-i18n'
	import ToggleTheme from '$lib/components/ToggleTheme.svelte';

	initialize();
	const languageName = {'th': 'ไทย', 'en': 'ENG'}
</script>

<main class="w-full min-w-max h-full pt-4">
	<div class="fixed bottom-0 left-0 border-2 m-2">
		<ToggleTheme/>
		{#if !$isLoading}
			<select class="select select-md max-w-xs" bind:value={$locale}>
				{#each $locales as l}
					<option value={l} selected>{languageName[l]}</option>
				{/each}
			</select>
		{/if}
	</div>
	<AlertList />
	<slot/>
</main>