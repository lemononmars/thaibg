<script lang="ts">
    import { signOut } from '$lib/user'
    import { user } from '$lib/user'
    import { HomeIcon, PlayCircleIcon, UserIcon, InfoIcon, ToolIcon} from 'svelte-feather-icons'
    import ToggleTheme from '$lib/components/ToggleTheme.svelte'

    const groups = [
        'Boardgames',
        'People',
        'Developers',
        'ETC'
    ]

    const subgroupBoardgames = [
        {path: '/boardgame',title:'Boardgame'},
        {path: '/type',title:'Type'},
        {path: '/mechanics',title:'Mechanics'},
        {path: '/category',title:'Category'},
    ]
    const subgroupPeople = [
        {path: '/designer',title:'Designer'},
        {path: '/artist',title:'Artist'},
        {path: '/influencer',title:'Influencer'},
    ]
    const subgroupDeveloper = [
        {path: '/publisher',title:'Publisher'},
        {path: '/sponsor',title:'Sponsor'},
        {path: '/printing',title:'Printing'},
    ]
    const subgroupETC = [
        {path: '/event',title:'Event'},
        {path: '/award',title:'Award'},
        {path: '/retailer',title:'Retailer'},
    ]
    const subgroups = [subgroupBoardgames, subgroupPeople, subgroupDeveloper, subgroupETC]
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
        <div class="items-stretch hidden lg:flex lg:flex-row items-center">
            <a rel="prefetch" href="/"><span><HomeIcon size=20 class="mx-2"/> Home</span></a>
                {#each groups as g, idx} 
                    <div class="dropdown dropdown-hover">        
                        <label tabindex="0" class="m-1 btn">
                            {#if idx == 0} <PlayCircleIcon size=20 class="mx-2"/>
                                {:else if idx == 1} <UserIcon size=20 class="mx-2"/>
                                {:else if idx == 2} <ToolIcon size=20 class="mx-2"/>
                                {:else if idx == 3} <InfoIcon size=20 class="mx-2"/>
                            {/if} 
                            {g}
                        </label>
                        <ul tabindex="0" class="p-2 shadow menu dropdown-content bg-neutral text-neutral-content rounded-box w-52">
                            {#each subgroups[idx] as sg}
                                <li><a href="{sg.path}">{sg.title}</a></li>
                            {:else}
                                <p>huh</p>
                            {/each}
                        </ul>
                    </div>
                {/each}
        </div>
    </div> 
    <div class="flex-none hidden lg:flex">
        <ToggleTheme/>
    </div> 
    <div class="flex-none gap-4 hidden lg:flex lg:flex-row">
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
                    Join Us
                </a>
            </div>
        {/if}
    </div>
</div>
<style lang="postcss">
</style>
