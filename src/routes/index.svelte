<script context=module lang="ts">
    export async function getEvents(){
      let res = await from('Event')
          .select('*')
      
      return {events: res.data.slice(-3)}
    }

    export async function getContents(){
      let res = await from('Content')
         .select('*')
      return {contents: res.data.slice(-10)}
    }

    export async function getHotnessBoardgames(){
      let res = await from('Boardgame')
          .select('*')
          //.eq('TBG_show', true)
      let numBoardgames = res.data.length
      const NUM_BOARDGAMES_SHOWN = 10
      let bgindex = []

      // DEMO: take 10 random games from the list
      // TODO: use actual measure
      while(bgindex.length < NUM_BOARDGAMES_SHOWN || bgindex.length >= numBoardgames) {
        const randomIdx = Math.floor(Math.random()*numBoardgames)
        if(!bgindex.includes(randomIdx))
          bgindex = [...bgindex, randomIdx]
      }
      return {boardgames: bgindex.map((idx)=>res.data[idx])}
    }
   
    export async function getStats() {
      let res = await from('Boardgame')
          .select('TBG_ID')
      let numBoardgames = res.data.length
      res = await from('Person')
         .select('Person_ID')
      let numPeople = res.data.length
      res =await from('Content')
        .select('Content_ID')
      let numContents = res.data.length
      // TODO: add more stats
      return {numBoardgames, numPeople, numContents}
    }

</script>

<script lang="ts">
  
  import Seo from '$lib/components/SEO.svelte'
  import Spinner from '$lib/components/Spinner.svelte'
  import {from} from '$lib/supabase'
  import {onMount} from 'svelte'
  import BoardgameCard from '$lib/components/BoardgameCard.svelte'
  import {PlayCircleIcon, UserCheckIcon, CoffeeIcon, ChevronRightIcon, ChevronLeftIcon, FilmIcon} from 'svelte-feather-icons'
  import ContentCard from '$lib/components/ContentCard.svelte'
  import EventCard from '$lib/components/EventCard.svelte'

  let promiseEvents, promiseContents, promiseBoardgames, promiseStats
  onMount(async()=>{
    promiseEvents = await getEvents()
    promiseContents = await getContents()
    promiseBoardgames = await getHotnessBoardgames()
    promiseStats = await getStats()
  })
  const boardgameCarouselWidth = 200

  let bgCarousel
  function scrollCarousel(mult: number){
    bgCarousel.scrollLeft += boardgameCarouselWidth * mult
  }
</script>

<Seo title="Home"/>
<div class="flex flex-col lg:flex-row w-full bg-gradient-to-b from-slate-100 to-slate-500 rounded-b-3xl lg:rounded-b-full py-10 lg:py-20 px-8 lg:px-32">
  <div class="flex flex-col">
    <h1>We have it all!</h1>
    {#await promiseStats}
      <Spinner/>
    {:then res}
      {#if res}
        <div class="stats stats-vertical lg:stats-horizontal overflow-visible my-10 bg-transparent">
          <div class="stat mx-4">
            <div class="stat-value">{res.numBoardgames}</div>
            <div class="stat-title">Board Games</div>
            <div class="stat-figure text-secondary">
              <PlayCircleIcon size="40"/>
            </div>
          </div>
          
          <div class="stat mx-4">
            <div class="stat-figure text-secondary">
              <UserCheckIcon size="40"/>
            </div>
            <div class="stat-value">{res.numPeople}</div>
            <div class="stat-title">People</div>
          </div>
          
          <div class="stat mx-4">
            <div class="stat-figure text-secondary">
              <CoffeeIcon size="40"/>
            </div>
            <div class="stat-value">{res.numContents}</div>
            <div class="stat-title">Contents</div>
          </div>
        </div>
      {/if}
    {/await}
    <p class="text-2xl">
      รวมทุกข้อมูลเกี่ยวกับบอร์ดเกมไทย <br> ในเครือข่ายของสมาคมบอร์ดเกม
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
  <div class="grid grid-cols-2 lg:grid-cols-4">
    {#await promiseEvents}
      <Spinner/>
    {:then res}
      {#if res}
        {#each res.events as event}
          <EventCard {event}/>
          {:else}
          <p>No upcoming events. Stay tuned!</p>
        {/each}
      {/if}
    {/await}
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
    {#await promiseContents}
      <Spinner/>
    {:then res}
      {#if res}
        {#each res.contents as content}
          <ContentCard {content}/>
        {/each}
      {/if}
    {/await}
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
  <div class="relative">
    <div class="btn btn-accent absolute rounded-full left-0 bottom-0 z-10 opacity-20 hover:opacity-80" 
      on:click={()=>scrollCarousel(-1)}
      class:hidden={bgCarousel?.scrollLeft <= boardgameCarouselWidth}
      >
        <ChevronLeftIcon size="30"/>
    </div>
    <div class="btn btn-accent absolute rounded-full right-0 bottom-0 z-10 opacity-20 hover:opacity-80" 
      on:click={()=>scrollCarousel(1)}
      class:hidden={bgCarousel?.scrollLeft >= 9 * boardgameCarouselWidth}
      >
      <ChevronRightIcon size="30"/>
    </div>
    
    <div 
      id="bg-carousel" 
      class="flex flex-row flex-nowrap gap-4 p-4 overflow-x-scroll overflow-y-none snap-x scroll-smooth relative"
      bind:this={bgCarousel}
    >
      {#await promiseBoardgames}
        <Spinner/>
      {:then res}
        {#if res}
          {#each res.boardgames as bg}
          <div class="w-36 lg:w-72 aspect-auto shrink-0 snap-start">
              <BoardgameCard {bg}/>
          </div>
          {/each}
        {/if}
      {/await}
    </div>
  </div>
</div>