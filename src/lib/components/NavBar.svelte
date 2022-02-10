<script lang="ts">
    import { page, url } from '$app/stores'
    import { signOut } from '$lib/user'
    import { user } from '$lib/user'
    import { HomeIcon, PlayCircleIcon, UserIcon, InfoIcon, MenuIcon} from 'svelte-feather-icons'
    import ToggleTheme from '$lib/components/ToggleTheme.svelte'

    const paths = [
        {path: '/', icon:0, title:'Home'},
        {path: '/boardgame', icon:1, title:'Boardgame'},
        {path: '/designer', icon:2, title:'Designer'},
        {path: '/about', icon:3, title: 'About'}
    ]
</script>


<div class="navbar mb-2 shadow-lg bg-neutral text-neutral-content rounded-box">
    <div class="flex-none lg:hidden">
        <label for="my-nav-drawer" class="btn btn-square btn-ghost">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="inline-block w-6 h-6 stroke-current">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
            </svg>
        </label>
    </div>  
    <div class="flex-1 px-2 mx-2">
        <div class="items-stretch hidden gap-4 flex-row items-center lg:flex">
            {#each paths as p} 
                {#if p.icon == 0} <HomeIcon size=20/>
                    {:else if p.icon == 1} <PlayCircleIcon size=20/>
                    {:else if p.icon == 2} <UserIcon size=20/>
                    {:else if p.icon == 3} <InfoIcon size=20/>
                {/if}
                <a rel="prefetch" href="{p.path}" class:active={new URL($page.url).pathname === p.path}>
                    {p.title}
                </a>
            {/each}
        </div>
    </div> 
    <div class="flex-none">
        <ToggleTheme/>
    </div> 
    <div class="flex-none gap-4">
        {#if $user}
            <div>
                <a rel="prefetch" href="/profile/">
                    {$user.email}
                </a>
            </div>
            <div><button class="" on:click={() => signOut()}>Sign Out</button></div>
        {:else}
            <div>
                <a rel="prefetch" href="/auth" title="Sign In">
                    Sign In
                </a>
            </div>
            <div>
                <a rel="prefetch" href="/auth?reg=true" title="Sign Up">
                    Sign Up
                </a>
            </div>
        {/if}
    </div>
</div>
<style lang="postcss">
</style>
