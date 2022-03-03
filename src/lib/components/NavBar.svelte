<!-- <script lang="ts" context="module">
    export async function load({ session }) {
        const { user } = session
        return {
            props: {
                user
            }
        };
    }
</script> -->

<script lang="ts">
    import { _, locale, locales } from 'svelte-i18n'
    //import {getAvatar} from '$lib/user/profile'
    import { user, profile, signOut } from '$lib/user'
    import {ChevronDownIcon, MenuIcon, UserIcon, SearchIcon, ChevronUpIcon} from 'svelte-feather-icons'
    import { URL_DICEBEAR } from '$lib/constants'
    import ToggleTheme from '$lib/components/ToggleTheme.svelte'
    import {fly} from 'svelte/transition'
    import TBGAlogo from '$lib/assets/TBGA-logo-color.png'

    //export let user
    
    $: boardgameMenu = [
        {path: '/boardgame',title:$_('navbar.boardgame.list')},
        {path: '/type',title:$_('type')},
        {path: '/mechanics',title:$_('mechanics')},
        {path: '/category',title:$_('category')},
    ]
    $: peopleMenu = [
        {path: '/person?role=Designer',title:$_('designer')},
        {path: '/person?role=Artist',title:$_('artist')},
        {path: '/person?role=Graphicdesigner', title:$_('graphicdesigner')},
        {path: '/manufacturer',title:$_('manufacturer')},
    ]
    $: supporterMenu = [
        {path: '/publisher',title:$_('publisher')},
        {path: '/sponsor',title:$_('sponsor')},
        {path: '/person?role=Creator',title:$_('contentcreator')},
        {path: '/shop', title:$_('shop')}
    ]
    $: activityMenu = [
        {path: '/event',title:$_('event')},
        {path: '/honor',title:$_('honor')},
        {path: '/content',title:$_('content')},
    ]
    $: websiteMenu = [
        {path: '/about',title:$_('navbar.website.about')},
        {path: '/legal',title:$_('navbar.website.legal')},
        {path: '/contact',title:$_('navbar.website.contact')},
    ]

    let avatar = URL_DICEBEAR + 'randombear' + '.svg'
    // onMount (async ()=>{
    //     let { data: { username, website, avatar_url } , error } = await getCurrUserProfile()
    //     if(!error) {
    //         avatar = await getAvatar(avatar_url)
    //         avatar = URL_DICEBEAR + 'randombear' + '.svg'
    //         console.log('navbar', avatar, profile, username)
    //         profile.set({avatar_url: avatar})
    //     }
    //     else {
    //         avatar = URL_DICEBEAR + 'randombear' + '.svg'
    //     }
    // })
    
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
<div class="navbar mb-2 bg-base-300 w-screen" transition:fly="{{ y: -10, duration: 500 }}">
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
                <img class="h-20" src={TBGAlogo} alt="logo">
            </div>
            <div class="flex flex-col">
                <a rel="prefetch link-hover" href="/">
                    <div class="text-secondary text-sm">{$_('navbar.title.tbg')}</div>
                    <div class="text-primary text-2xl">{$_('navbar.title.db')}</div>
                </a>
            </div>
        </div>
    </div> 
    <div class="navbar-center hidden lg:flex gap-4">
        <div class="dropdown dropdown-hover">
            <!-- svelte-ignore a11y-label-has-associated-control -->
            <label tabindex="0" class="hover:text-warning flex flex-row items-center">
                {$_('navbar.boardgame._')}
                <ChevronDownIcon size="20"/>
            </label> 
            <ul tabindex="0" class="p-2 shadow menu dropdown-content w-52 bg-warning">
                {#each boardgameMenu as m}
                    <li><a href="{m.path}" class="text-warning-content">{m.title}</a></li>
                {/each}
            </ul>
        </div>
        <div class="dropdown dropdown-hover">
            <span tabindex="0" class="hover:text-success flex flex-row items-center">
                {$_('navbar.person._')}
                <ChevronDownIcon size="20"/>
            </span>
            <div tabindex="0" class="p-2 dropdown-content w-104 bg-success">
                <div class="menu flex flex-row ">
                    <div>
                        <ul class="p-2 shadow w-52">
                            {#each peopleMenu as m}
                                <li><a href="{m.path}" class="text-success-content">{m.title}</a></li>
                            {/each}
                        </ul>
                    </div>
                    <div class="divider dividier-horizontal"></div>
                    <div>
                        <ul class="p-2 shadow w-52">
                            {#each supporterMenu as m}
                                <li><a href="{m.path}" class="text-success-content">{m.title}</a></li>
                            {/each}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
        <div class="dropdown dropdown-hover">
            <span tabindex="0" class="hover:text-error flex flex-row items-center">
                {$_('navbar.activity._')}
                <ChevronDownIcon size="20"/>
            </span>
            <ul tabindex="0" class="p-2 shadow menu dropdown-content w-52 bg-error">
                {#each activityMenu as m}
                    <li><a href="{m.path}" class="text-error-content">{m.title}</a></li>
                {/each}
            </ul>
        </div>
    </div>

    <div class="navbar-end flex flex-row items-center gap-4 mx-4">
        <div>
            <select class="select select-md max-w-xs" bind:value={$locale}>
                {#each $locales as locale}
                  <option value={locale}>{locale}</option>
                {/each}
            </select>
        </div>
        <div>
            <ToggleTheme/>
        </div> 
        <div class="dropdown dropdown-hover dropdown-end">
            <!-- svelte-ignore a11y-label-has-associated-control -->
            <label tabindex="0" class="m-1 btn"><SearchIcon size="20"/></label>
            <ul tabindex="0" class="p-2 shadow menu dropdown-content w-52 text-neutral">
              <input type="text" placeholder="search"/>
            </ul>
        </div>
 
        <div>
            {#if $user}
                <div class="dropdown dropdown-hover dropdown-end">
                    <!-- svelte-ignore a11y-label-has-associated-control -->
                    <label tabindex="0">
                        <div class="avatar">
                            <div class="w-12 h-12 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                                <img src="{avatar}" alt="user avatar"/>
                            </div>
                        </div>
                    </label>
                    <ul tabindex="0" class="p-2 shadow menu dropdown-content w-52 bg-info">
                        <li><a href="/profile">Profile</a></li>
                        <li><a on:click={signOut} href="/">Sign Out</a></li>
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

    <div class="btn btn-secondary fixed right-0 bottom-0 m-4 rounded-full z-10 hover:-translate-y-2 duration-200"
        on:click|preventDefault={scrollTop}>
        <div class="tooltip" data-tip="top">
            <ChevronUpIcon size="15"/>  
        </div>
    </div>
{/if}