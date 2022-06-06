<script lang="ts" context="module">
	import { getImageURL, getDefaultImageURL } from '$lib/supabase';
	export async function getContentcreatorImageURLs(id: number) {
		const res = await fetch(`/api/content/${id}/contentcreator`);
		if (!res.ok) return { status: 404, message: 'not found' };

		const data = await res.json();

		let URLs = [];
		for (const creator in data) {
			await fetch(`/api/contentcreator/${data[creator].Contentcreator_ID}/person`)
				.then((res) => res.json())
				.then((d) => (URLs = [...URLs, getImageURL('person', d[0]?.Person_picture)]));
		}
		return URLs;
	}
</script>

<script lang="ts">
	import { onMount } from 'svelte';
	import { _ } from 'svelte-i18n';

	export let content;
	let id = content.Content_ID;
	let media = content.Content_media;
	let type = content.Content_type;
	let name = content.Content_name;
	let link = content.Content_links;
	let picture = getImageURL('content', content.Content_picture);

	let promiseContentcreatorImageURLs;
	onMount(async () => {
		promiseContentcreatorImageURLs = getContentcreatorImageURLs(id);
	});
</script>

<a href="/content/{content.Content_ID}">
	<div
		class="relative card w-auto ratio-aspect lg:w-64 pt-8 bg-base-100 card-compact shadow-xl transition ease-in-out hover:opacity-80 hover:scale-105 duration-30 group px-1 lg:px-0"
	>
		<figure>
			<img
				src={picture}
				class="object-cover w-full lg:h-64 aspect-auto group-hover:scale-120 "
				alt="content thumbnail"
				on:error|once={(ev) => (ev.target.src = getDefaultImageURL('content'))}
			/>
		</figure>
		<div class="card-body">
			<h2 class="card-title truncate line-clamp-2">{name}</h2>
			<div class="flex flex-row">
				<div class="badge">{$_('content.media.' + media)}</div>
				<div class="badge badge-outline">{$_('content.type.' + type)}</div>
			</div>
			<div class="card-actions justify-end">
				<a class="btn" href={link} target="_/">Link</a>
			</div>
		</div>

		<div class="avatar-group -space-x-6 absolute top-0 right-0 m-1 ">
			{#await promiseContentcreatorImageURLs then URLs}
				{#if URLs}
					{#each URLs as url}
						<div class="relative avatar group-hover:animate-pulse">
							<div class="w-12">
								<img
									src={url}
									alt="Contentcreator thumbnail"
									on:error|once={(ev) => (ev.target.src = getDefaultImageURL('Contentcreator'))}
								/>
							</div>
						</div>
					{/each}
				{/if}
			{/await}
		</div>
	</div>
</a>
