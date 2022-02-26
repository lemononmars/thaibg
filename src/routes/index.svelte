<script lang="ts">
  
  import Seo from '$lib/components/SEO.svelte'
  import Spinner from '$lib/components/Spinner.svelte'
  import {from} from '$lib/supabase'
  import {onMount} from 'svelte'
  import BoardgameCard from '$lib/components/BoardgameCard.svelte'
  import {PlayCircleIcon, UserCheckIcon, CoffeeIcon, ChevronRightIcon, FilmIcon} from 'svelte-feather-icons'
  import ContentCard from '$lib/components/ContentCard.svelte'
  import EventCard from '$lib/components/EventCard.svelte'

   let boardgames
   let contents
   let events
   let loaded = false
   let numDesginers = 4, numBoardgames = 0, numActivities = 0
   // let artists
   const boardgameCarouselWidth = 96

   onMount(async ()=>{
      // get board game info
      let res = await from('Boardgame')
         .select('*')
         .eq('TBG_show', true)
      numBoardgames = res.data.length
      const NUM_BOARDGAMES_SHOWN = 10
      let bgindex = []
      while(bgindex.length < NUM_BOARDGAMES_SHOWN || bgindex.length >= numBoardgames) {
        const randomIdx = Math.floor(Math.random()*numBoardgames)
        if(!bgindex.includes(randomIdx))
          bgindex = [...bgindex, randomIdx]
      }
      boardgames = bgindex.map((idx)=>res.data[idx])

      res = await from('Event')
         .select('*')
      numActivities += res.data.length
      events = res.data.slice(-3)

      res = await from('Content')
         .select('*')
      numActivities += res.data.length
      contents = res.data.slice(-10)
      loaded = true

      // res = await from('Event')
      //    .select('*')
      // numActivities = res.data.length
      // contents = res.data.slice(-10)
      // loaded = true
   })

   function scrollCarousel(event){
     console.log(event, event.target.parentElement, event.target.parentElement.scrollLeft)
     event.target.parentElement.scrollLeft += boardgameCarouselWidth*3
   }
</script>

<Seo title="Home"/>
<div class="flex flex-col lg:flex-row w-full bg-gradient-to-b from-slate-100 to-slate-500 rounded-b-3xl lg:rounded-b-full py-10 lg:py-20 px-8 lg:px-32">
  <div class="flex flex-col">
    <h1>We have it all!</h1>
    {#if loaded}
    <div class="stats stats-vertical lg:stats-horizontal overflow-visible my-10 bg-transparent">
      <div class="stat mx-4">
        <div class="stat-value">{numBoardgames}</div>
        <div class="stat-title">Board Games</div>
        <div class="stat-figure text-secondary">
          <PlayCircleIcon size="40"/>
        </div>
      </div>
      
      <div class="stat mx-4">
        <div class="stat-figure text-secondary">
          <UserCheckIcon size="40"/>
        </div>
        <div class="stat-value">{numDesginers}</div>
        <div class="stat-title">People</div>
      </div>
      
      <div class="stat mx-4">
        <div class="stat-figure text-secondary">
          <CoffeeIcon size="40"/>
        </div>
        <div class="stat-value">{numActivities}</div>
        <div class="stat-title">Activities</div>
      </div>
    </div>
    {/if}
    <p class="text-2xl">
      รวมทุกข้อมูลเกี่ยวกับบอร์ดเกมไทย ในเครือข่ายของสมาคมบอร์ดเกม
    </p>
    <div class="flex flex-row items-center justify-center mt-4">
      <div class="btn btn-primary">Contribute</div>
      <div class="btn btn-ghost">Contact Us</div>
    </div>
  </div>

  <div class="flex flex-grow justify-center place-items-center">
    <div>
      <UserCheckIcon size="400"/>
    </div>
  </div>
</div>

<div class="flex flex-col w-full p-10">
  <h1 class="w-full text-center">Upcoming Events</h1>
  <div class="grid grid-cols-1 lg:grid-cols-3">
    {#if loaded}
      {#each events as event}
        <EventCard {event}/>
        {:else}
        <p>No upcoming events. Stay tuned!</p>
      {/each}
    {:else}
      <Spinner/>
    {/if}
  </div>
</div>

<div class="flex flex-row bg-base-300 w-full py-4 px-4 lg:px-20">
  <div class="flex flex-col text-left">
    <h2>Media</h2>  
    <h1>Hotness Contents</h1>
    <a href="./contents" alt="Content List" class="btn flex flex-row items-center">see all <ChevronRightIcon size="20"/></a>
    <h1 class="mx-auto">
      <FilmIcon size="4x"/>
    </h1>
  </div>
  <div class="flex-grow grid grid-cols-2 gap-4 p-20">
    {#if loaded}
      {#each contents as content}
        <ContentCard {content}/>
      {/each}
    {:else}
      <Spinner/>
    {/if}
  </div>
</div>

<div class="flex flex-col w-full py-4 px-4 lg:px-20">
  <div class="flex flex-row w-full justify-between items-center">
    <div>
      <h1>Hotness Board Game</h1>
    </div>
    <div>
      <a href="./boardgame" alt="Thai Board Game List" class="btn flex flex-row items-center">
        see all <ChevronRightIcon size="20"/>
      </a>
    </div>
  </div>
  <div>
    <!-- <div class="btn btn-secondary absolute right-0 z-10 my-auto opacity-80 hover:opacity-20 -translate-x-full " on:click={scrollCarousel}>
      <ChevronRightIcon size="30"/>
    </div> -->
    <div class="flex flex-row flex-nowrap gap-4 p-4 overflow-x-scroll overflow-y-none snap-x scroll-smooth">
      {#if loaded}
        {#each boardgames as bg}
        <div class="w-36 lg:w-72 aspect-auto shrink-0 snap-start">
            <BoardgameCard {bg}/>
        </div>
        {/each}
      {:else}
        <Spinner/>
      {/if}
    </div>
  </div>
</div>