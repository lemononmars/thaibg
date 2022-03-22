<script lang='ts'>
    import TBGAlogo from '$lib/assets/TBGA-logo-color.png'
    import {_} from 'svelte-i18n'

    $: boardgameMenu = [
        {path: '/boardgame',title:$_('navbar.boardgame.list')},
        {path: '/type',title:$_('navbar.boardgame.type')},
        {path: '/mechanics',title:$_('navbar.boardgame.mechanics')},
        {path: '/category',title:$_('navbar.boardgame.category')},
    ]
    $: creatorMenu = [
        {path: '/person?role=designer',title:$_('designer')},
        {path: '/person?role=graphicdesigner', title:$_('graphicdesigner')},
        {path: '/person?role=artist',title:$_('artist')},
        {path: '/person?role=playtester', title:$_('playtester')},
        {path: '/manufacturer',title:$_('manufacturer')},
        {path: '/person?role=rulebookeditor', title:$_('rulebookeditor')},
    ]
    $: supporterMenu = [
        {path: '/shop', title:$_('shop')},
        {path: '/person?role=contentcreator',title:$_('contentcreator')},
        {path: '/publisher',title:$_('publisher')},
        {path: '/investor',title:$_('investor')},
    ]
    $: activityMenu = [
        {path: '/content',title:$_('content._')},
        {path: '/honor',title:$_('honor')},
        {path: '/event',title:$_('event')},
        {path: '/crowdfunding',title:$_('crowdfunding')},
    ]
    $: websiteMenu = [
        {path: '/about',title:$_('navbar.website.about')},
        {path: '/termofuse',title:$_('navbar.website.termofuse')},
        {path: '/contact',title:$_('navbar.website.contact')},
    ]

    $: menuTitles = [$_('navbar.boardgame._'), $_('navbar.creator._'), $_('navbar.supporter._'), $_('navbar.activity._'), $_('navbar.website._')]
    $: menus = [boardgameMenu, creatorMenu, supporterMenu, activityMenu, websiteMenu]
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