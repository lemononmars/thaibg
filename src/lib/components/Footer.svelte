<script lang='ts'>
    import TBGAlogo from '$lib/assets/TBGA-logo-color.png'
    
    const boardgameMenu = [
        {path: '/boardgame',title:'Thai Board Game List'},
        {path: '/type',title:'Types'},
        {path: '/mechanics',title:'Mechanics'},
        {path: '/category',title:'Categories'},
    ]
    const peopleMenu = [
        {path: '/person?role=Designer',title:'Designers'},
        {path: '/person?role=Artist',title:'Artists'},
        {path: '/person?role=Graphicdesigner', title:'Graphic Designers'},
        {path: '/manufacturer',title:'Manufaturers'},
    ]
    const supporterMenu = [
        {path: '/publisher',title:'Publishers'},
        {path: '/sponsor',title:'Sponsors'},
        {path: '/person?role=Creator',title:'Content Creators'},
        {path: '/place', title:'Places'}
    ]
    const activityMenu = [
        {path: '/event',title:'Events'},
        {path: '/honor',title:'Honors'},
        {path: '/content',title:'Contents'},
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