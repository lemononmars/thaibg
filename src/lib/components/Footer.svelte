<script lang='ts'>
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
        {path: '/contentcreators',title:'Content Creators'},
        {path: '/place', title:'Places'}
    ]
    const activityMenu = [
        {path: '/event',title:'Events'},
        {path: '/award',title:'Awards'},
        {path: '/content',title:'Content'},
    ]
    const websiteMenu = [
        {path:'/about', title:'About us'},
        {path:'/legal', title:'Legal'},
        {path:'/contact', title:'Contact'}
    ]

    const menuTitles = ['Board Game', 'People', 'Supporter', 'Activity', 'Website']
    const menus = [boardgameMenu, peopleMenu, supporterMenu, activityMenu, websiteMenu]
</script>

<footer class="mx-auto w-screen max-w-7xl sm:px-6 lg:px-8 p-10 footer bg-base-200 text-base-content">
    <div>
        <img class="h-20" src="./static/TBGA-logo-color.png" alt="logo">
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