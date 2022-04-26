<script lang="ts">
	import { FacebookIcon, TwitterIcon, LinkIcon, MailIcon } from 'svelte-feather-icons';
	interface Links {
		website?: string;
		facebook?: string;
		twitter?: string;
		email?: string;
	}

	export let links: Links;
</script>

<div class="flex flex-row items-center gap-3">
	<h3>Connect:</h3>
	{#if links.website}
		<a href={links.website} target="_blank"><LinkIcon size="40" /></a>
	{/if}
	{#if links.facebook}
		<a href={links.facebook} target="_blank"><FacebookIcon size="40" /></a>
	{/if}
	{#if links.twitter}
		<a href={links.twitter} target="_blank"><TwitterIcon size="40" /></a>
	{/if}
	{#if links.email}
		<a href="mailto:{links.email}" target="_blank"><MailIcon size="40" /></a>
	{/if}
</div>
