<script lang="ts">
	import SocialIcons from '@rodneylab/svelte-social-icons'
	export let 
		links: string[], 
		email:string = null;

	if(!links)
		links = []
	function getIcon(url: string){
		if(!url)
			return 'squarespace' as const
		if(url.includes('facebook'))
			return 'facebook' as const
		if(url.includes('twitter'))
			return 'twitter' as const
		if(url.includes('github'))
			return 'github' as const
		if(url.includes('youtube'))
			return 'youtube' as const
		if(url.includes('spotify'))
			return 'spotify' as const
		if(url.includes('discord'))
			return 'discord' as const
		if(url.includes('@'))
			return 'email' as const
		return 'squarespace' as const
	}
</script>

<div class="flex flex-col">
	<h3>Contact:</h3>
	<div class="flex flex-row items-center gap-1 flex-wrap">
		{#if email}
			<a href="mailto:{email}" target="_blank" class="hover:opacity-50 hover:-translate-y-2">
				<SocialIcons network="email" fgColor="#FFFFFF"/>
			</a>
		{/if}
		{#each links as l}
			<a href="//{l}" target="_blank" class="hover:opacity-50 hover:-translate-y-2">
				<SocialIcons network={getIcon(l)} fgColor="#FFFFFF"/>
			</a>
		{/each}
	</div>
</div>
