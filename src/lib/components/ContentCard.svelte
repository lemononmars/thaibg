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

	const actionText: string = getActionText(media)

	function getActionText(text:string) {
		switch(text) {
			case 'video': return 'watch'
			case 'article': return 'read'
			case 'podcast': return 'listen'
			case 'file': return 'download'
			default: return 'open'
		}
	}

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
			<h2 class="card-title line-clamp-2">
				{name}
			</h2>
			<div class="flex flex-row">
				<div class="badge">
					<svelte:component this={iconComponents[media]}/>
					{$_('content.media.' + media)}
				</div>
				<div class="badge badge-outline">{$_('content.type.' + type)}</div>
			</div>
			<div class="card-actions justify-between h-20">
				{#await promiseContentcreatorImageURLs then pictures}
					<div class="avatar-group -space-x-6">
						{#each pictures || [] as picture}
							<Picture type={'contentcreator'} {picture} height={20} class="avatar relative"/>
						{/each}
					</div>
				{/await}
				{#each links || [] as l}
					<a class="btn" href="//{l}" target="_/">
						{actionText}
					</a>
				{/each}
			</div>
		</div>
	</div>
</a>
