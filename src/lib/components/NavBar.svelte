<script lang="ts" context="module">
    export async function load({ session }) {
        const { user } = session
        return {
            props: {
                user
            }
        };
    }
</script>

<script lang="ts">
    import { user, profile, signOut } from '$lib/user'
    import {ChevronDownIcon, MenuIcon, UserIcon, SearchIcon, ChevronUpIcon} from 'svelte-feather-icons'
    import { URL_DICEBEAR } from '$lib/constants'
    import ToggleTheme from '$lib/components/ToggleTheme.svelte'
    import {fly} from 'svelte/transition'

    const boardgameMenu = [
        {path: '/boardgame',title:'Thai Board Game List'},
        {path: '/type',title:'Types'},
        {path: '/mechanics',title:'Mechanics'},
        {path: '/category',title:'Categories'},
    ]
    const peopleMenu = [
        {path: '/designer',title:'Designers'},
        {path: '/artist',title:'Artists'},
        {path: '/graphicdesigner', title:'Graphic Designers'},
        {path: '/manufacturer',title:'Manufaturers'},
    ]
    const supporterMenu = [
        {path: '/publisher',title:'Publishers'},
        {path: '/sponsor',title:'Sponsors'},
        {path: '/contentcreator',title:'Content Creators'},
        {path: '/place', title:'Places'}
    ]
    const activityMenu = [
        {path: '/event',title:'Events'},
        {path: '/award',title:'Awards'},
        {path: '/content',title:'Contents'},
    ]

    const username = $profile.username ? $profile.username : ( user ? user?.email : 'Explorer' )
    const avatar_url = $profile.avatar_url ? $profile.avatar_url : URL_DICEBEAR + username + '.svg'
    let scrollY, mouseY

    function scrollTop(){
        window.scroll({top: 0, behavior: 'smooth'})
    }

    function mouseMove(event) {
        mouseY = event.clientY
    }
</script>

<svelte:window bind:scrollY on:mousemove={mouseMove}/>

{#if scrollY < 40 || mouseY < 300}
<div class="navbar mb-2 bg-base-300 w-screen" out:fly="{{ y: -10, duration: 500 }}" in:fly="{{ y: -10, duration: 500 }}">
    <div class="navbar-start">
        <div class="dropdown">
            <div class="flex-none lg:hidden">
                <label for="my-nav-drawer" class="btn btn-square btn-ghost">
                    <MenuIcon size="20"/>
                </label>
            </div>  
        </div>
        <div class="hidden lg:flex lg:flex-row items-center gap-4">
            <div>
                <img class="h-20" src="/static/TBGA-logo-color.png" alt="logo">
            </div>
            <div class="flex flex-col">
                <a rel="prefetch link-hover" href="/">
                    <div class="text-secondary text-sm">Thailand Board Game</div>
                    <div class="text-primary text-2xl">Database</div>
                </a>
            </div>
        </div>
    </div> 
    <div class="navbar-center hidden lg:flex gap-4">
        <div class="dropdown dropdown-hover">
            <label tabindex="0" class="hover:text-warning flex flex-row items-center">
                Board Game
                <ChevronDownIcon size="20"/>
            </label> 
            <ul tabindex="0" class="p-2 shadow menu dropdown-content w-52 bg-warning">
                {#each boardgameMenu as m}
                    <li><a href="{m.path}">{m.title}</a></li>
                {/each}
            </ul>
        </div>
        <div class="dropdown dropdown-hover">
            <span tabindex="0" class="hover:text-success flex flex-row items-center">
                People
                <ChevronDownIcon size="20"/>
            </span>
            <div tabindex="0" class="p-2 dropdown-content w-104 bg-success">
                <div class="menu flex flex-row ">
                    <div>
                        <ul class="p-2 shadow w-52">
                            {#each peopleMenu as m}
                                <li><a href="{m.path}">{m.title}</a></li>
                            {/each}
                        </ul>
                    </div>
                    <div class="divider dividier-horizontal"></div>
                    <div>
                        <ul class="p-2 shadow w-52">
                            {#each supporterMenu as m}
                                <li><a href="{m.path}">{m.title}</a></li>
                            {/each}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
        <div class="dropdown dropdown-hover">
            <span tabindex="0" class="hover:text-error flex flex-row items-center">
                Activities
                <ChevronDownIcon size="20"/>
            </span>
            <ul tabindex="0" class="p-2 shadow menu dropdown-content w-52 bg-error">
                {#each activityMenu as m}
                    <li><a href="{m.path}">{m.title}</a></li>
                {/each}
            </ul>
        </div>
    </div>
    

    <div class="navbar-end flex flex-row items-center gap-4 mx-4">
        <div>
            <ToggleTheme/>
        </div> 
        <div class="dropdown dropdown-hover dropdown-end">
            <label tabindex="0" class="m-1 btn"><SearchIcon size="20"/></label>
            <ul tabindex="0" class="p-2 shadow menu dropdown-content w-52 text-neutral">
              <input type="text" placeholder="search"/>
            </ul>
        </div>
 
        <div>
            {#if $user}
                <div class="dropdown dropdown-hover dropdown-end">
                    <label tabindex="0">
                        <div class="avatar">
                            <div class="w-12 h-12 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                                <img src="{avatar_url}" alt="user avatar"/>
                            </div>
                        </div>
                    </label>
                    <ul tabindex="0" class="p-2 shadow menu dropdown-content w-52 bg-info">
                        <li><a href="/profile">Profile</a></li>
                        <li><a on:click={signOut}>Sign Out</a></li>
                    </ul>
                </div>
            {:else}
                <a rel="prefetch btn" href="/auth" title="Sign In">
                    <UserIcon size="20"/>
                </a>
            {/if}
        </div>
    </div>
</div>
{:else}
    <div class="btn btn-secondary fixed right-0 bottom-0 m-4 rounded-full z-10" on:click|preventDefault={scrollTop}>
        <ChevronUpIcon size="20"/>
    </div>
{/if}