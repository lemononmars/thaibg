<script lang='ts'>
    import TBGAlogo from '$lib/assets/TBGA-logo-color.png'
    import {_, locale} from 'svelte-i18n'

    const boardgameMenu = [
        {path: '/boardgame',title:$_('navbar.boardgame.list')},
        {path: '/type',title:$_('navbar.boardgame.type')},
        {path: '/mechanics',title:$_('navbar.boardgame.mechanics')},
        {path: '/category',title:$_('navbar.boardgame.category')},
    ]
    const peopleMenu = [
        {path: '/person?role=Designer',title:$_('navbar.person.designer')},
        {path: '/person?role=Artist',title:$_('navbar.person.artist')},
        {path: '/person?role=Graphicdesigner', title:$_('navbar.person.graphicdesigner')},
        {path: '/manufacturer',title:$_('navbar.person.manufacturer')},
    ]
    const supporterMenu = [
        {path: '/publisher',title:$_('navbar.supporter.publisher')},
        {path: '/sponsor',title:$_('navbar.supporter.sponsor')},
        {path: '/person?role=Creator',title:$_('navbar.supporter.creator')},
        {path: '/shop', title:$_('navbar.supporter.shop')}
    ]
    const activityMenu = [
        {path: '/event',title:$_('navbar.activity.event')},
        {path: '/honor',title:$_('navbar.activity.honor')},
        {path: '/content',title:$_('navbar.activity.content')},
    ]
    const websiteMenu = [
        {path: '/about',title:$_('navbar.website.about')},
        {path: '/legal',title:$_('navbar.website.legal')},
        {path: '/contact',title:$_('navbar.website.contact')},
    ]

    const menuTitles = [$_('navbar.boardgame._'), $_('navbar.person._'), $_('navbar.supporter._'), $_('navbar.activity._'), $_('navbar.website._')]
    const menus = [boardgameMenu, peopleMenu, supporterMenu, activityMenu, websiteMenu]
</script>

<footer class="mx-auto w-screen max-w-7xl sm:px-6 lg:px-8 p-10 footer bg-base-200 text-base-content">
    <div>
        <img class="h-20" src={TBGAlogo} alt="logo">
        <p>Thailand Board Game <br> Association</p>
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