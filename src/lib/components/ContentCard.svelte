<script lang="ts" context="module">

	import type { Content } from '$lib/datatypes';
	import {VideoIcon, FileTextIcon, MicIcon, Edit2Icon} from 'svelte-feather-icons'

	export async function getContentcreatorImageURLs(id: number) {
		const res = await fetch(`/api/content/${id}/contentcreator`);
		if (!res.ok) return []
		const data = await res.json();
		return data.map((d)=> d.Contentcreator_picture)
	}

	const iconComponents = {
		'video': VideoIcon,
		'article': Edit2Icon,
		'file': FileTextIcon,
		'podcast': MicIcon,
	}
</script>

<script lang="ts">
	import { onMount } from 'svelte';
	import { _ } from 'svelte-i18n';
	import Picture from './Picture.svelte';

	export let content: Content;
	const {
		Content_ID: id, 
		Content_media: media, 
		Content_type: type, 
		Content_name: name, 
		Content_links: links
	} = content

	console.log(content)

	let promiseContentcreatorImageURLs: Promise<string[]>;
	onMount(async () => {
		promiseContentcreatorImageURLs = getContentcreatorImageURLs(id);
	});
</script>

<a href="/content/{content.Content_ID}">
	<div
		class="relative card w-auto ratio-aspect lg:w-64 bg-base-100 card-compact shadow-xl transition ease-in-out hover:opacity-80 hover:scale-105 duration-30 group px-1 lg:px-0"
	>
		<div class="card-body">
			<h2 class="card-title truncate line-clamp-2">{name}</h2>
			<div class="flex flex-row">
				<div class="badge">
					<svelte:component this={iconComponents[media]}/>
					{$_('content.media.' + media)}
				</div>
				<div class="badge badge-outline">{$_('content.type.' + type)}</div>
			</div>
			<div class="card-actions justify-end h-20">
				{#each links || [] as l}
					<a class="btn" href="//{l}" target="_/">Link</a>
				{/each}
			</div>
		</div>

		<div class="-space-x-6 absolute bottom-0 left-0 m-2 ">
			{#await promiseContentcreatorImageURLs then pictures}
				{#if pictures}
					{#each pictures || [] as picture}
						<Picture type={'contentcreator'} {picture} height={20} class="avatar relative"/>
					{/each}
				{/if}
			{/await}
		</div>
	</div>
</a>
