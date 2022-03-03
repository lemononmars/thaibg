<script lang='ts'>
    import TBGAlogo from '$lib/assets/TBGA-logo-color.png'
    import {_} from 'svelte-i18n'

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

    $: menuTitles = [$_('navbar.boardgame._'), $_('navbar.person._'), $_('navbar.supporter._'), $_('navbar.activity._'), $_('navbar.website._')]
    $: menus = [boardgameMenu, peopleMenu, supporterMenu, activityMenu, websiteMenu]
</script>

<footer class="mx-auto w-screen max-w-7xl sm:px-6 lg:px-8 p-10 footer bg-base-200 text-base-content">
    <div>
        <img class="h-20" src={TBGAlogo} alt="logo">
        <div class="w-30 break-words">{$_('TBGA')}</div>
    </div>
    {#each menuTitles as mt, idx} 
        <div>
            <span class="footer-title">{mt}</span> 
            {#each menus[idx] as m}
                <a href="{m.path}" alt="{m.title}" class="link link-hover">
                    {m.title}
                </a>
            {/each}
        </div>
    {/each}
  </footer>