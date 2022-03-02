<script lang="ts">
    import Seo from '$lib/components/SEO.svelte'
    import {_, isLoading} from 'svelte-i18n'

</script>

{#if !$isLoading}
<Seo title="About"/>
<div class="flex flex-col justify-left text-left">
    <div>
        <h1>About</h1>
        <p>This site is created by me.</p>
        <div class="divider"></div>
        <h1>Todo list (sorted by priority)</h1>
        <ur>
            <li>Add detailed board game info (player count, mechanics, etc.)</li>
            <li>Add new categories (artist, manufacturer, publisher, award)</li>
            <li>Let users add and edit pages</li>
            <li>Display user profiles</li>
            <li>Be mobile friendlier</li>
            <li>Add API</li>
        </ur>
        <div class="divider"></div>
        <h1>Contact</h1>
        <p>e-mail: sakulbuth (at) gmail.com</p>
    </div>
</div>
{/if}