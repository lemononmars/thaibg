<script context=module lang="ts">
    export async function load({fetch}) {
      let numBoardgames, numPeople, numContents
      await fetch('/api/boardgame')
        .then(res => res.json())
        .then(data => numBoardgames = data.length)
      await fetch('/api/person')
        .then(res => res.json())
        .then(data => numPeople = data.length)
      await fetch('/api/content')
        .then(res => res.json())
        .then(data => numContents = data.length)
      // TODO: add more stats
      return {
        props:{
          numBoardgames, numPeople, numContents
        }
      }
    }

    export async function getEvents(){
      const res = await fetch('/api/event')
      const data = await res.json()
      return {events: data.slice(-3)}
    }

    export async function getContents(){
      const res = await fetch('/api/content')
      const data = await res.json()
      return {contents: data.slice(-10)}
    }

    export async function getHotnessBoardgames(){
      const resBG = await fetch('/api/boardgame')
      const dataBG = await resBG.json()
      const numBoardgames = dataBG.length
      const NUM_BOARDGAMES_SHOWN = 10
      let bgindex = []

      // DEMO: take 10 random games from the list
      // TODO: use actual measure
      while(bgindex.length < NUM_BOARDGAMES_SHOWN || bgindex.length >= numBoardgames) {
        const randomIdx = Math.floor(Math.random()*numBoardgames)
        if(!bgindex.includes(randomIdx))
          bgindex = [...bgindex, randomIdx]
      }
      return {boardgames: bgindex.map((idx)=>dataBG[idx])}
    }

    export async function getDevelopers(){
      // Person IDs for First, Poom and X
      let res = await from ('Person')
        .select('*')
        .filter('Person_ID', 'in', '(8,10,11)')
      let sorted = res.data.sort((a,b)=> a.Person_ID - b.Person_ID)
      return {developers: sorted}
    }
</script>

<script lang="ts">
  import Seo from '$lib/components/SEO.svelte'
  import Spinner from '$lib/components/Spinner.svelte'
  import {from} from '$lib/supabase'
  import {onMount} from 'svelte'
  import BoardgameCard from '$lib/components/BoardgameCard.svelte'
  import PersonCard from '$lib/components/PersonCard.svelte'
  import {PlayCircleIcon, UserCheckIcon, CoffeeIcon, ChevronRightIcon, ChevronLeftIcon, FilmIcon} from 'svelte-feather-icons'
  import ContentCard from '$lib/components/ContentCard.svelte'
  import EventCard from '$lib/components/EventCard.svelte'
  import { _ } from 'svelte-i18n';

  export let numBoardgames, numContents, numPeople
  let promiseEvents, promiseContents, promiseBoardgames, promiseDevs
  onMount(async()=>{
    promiseEvents = await getEvents()
    promiseContents = await getContents()
    promiseBoardgames = await getHotnessBoardgames()
    promiseDevs = await getDevelopers()
  })
  const boardgameCarouselWidth = 200

  let bgCarousel
  function scrollCarousel(mult: number){
    bgCarousel.scrollLeft += boardgameCarouselWidth * mult
  }
</script>

<Seo title="Home"/>
<div class="flex flex-col lg:flex-row w-full bg-base-200 py-10 lg:py-20 px-8 lg:px-32">
  <div class="flex flex-col">
    <h1>{$_('page.home.welcome.intro')}</h1>
      <div class="grid grid-cols-1 lg:grid-cols-3 place-items-center py-8 m-2">
        <div class="flex flex-col place-items-center">
          <div class="flex flex-row items-center gap-2">
              <div class="text-2xl">{numBoardgames} </div>
            <div> <PlayCircleIcon size="40"/></div>
          </div>
          <div>{$_('page.home.welcome.boardgames')}</div>
        </div>
        <div class="flex flex-col place-items-center">
          <div class="flex flex-row items-center gap-2">
            <div class="text-2xl">{numPeople} </div>
            <div><UserCheckIcon size="40"/></div>
          </div>
          <div>{$_('page.home.welcome.people')} </div>
        </div>
        <div class="flex flex-col place-items-center">
          <div class="flex flex-row items-center gap-2">
            <div class="text-2xl">{numContents} </div>
            <div><CoffeeIcon size="40"/></div>
          </div>
          <div>{$_('page.home.welcome.contents')}</div>
        </div>
      </div>
    <p class="text-2xl text-secondary">
      {$_('page.home.welcome.text1')} <br>
      {$_('page.home.welcome.text2')} 
    </p>
    <div class="flex flex-row items-center justify-center mt-4">
      <a href="/create"><div class="btn btn-secondary">{$_('page.home.welcome.contribute')}</div></a>
      <a href="/contact"><div class="btn btn-ghost">{$_('page.home.welcome.contact')}</div></a>
    </div>
  </div>

  <div class="flex flex-grow justify-center place-items-center">
    <div>
      <UserCheckIcon size="200"/>
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

<div class="flex flex-col w-full">
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
  <div class="relative lg:ml-20">
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
      class="flex flex-row flex-nowrap gap-4 p-4 overflow-x-hidden overflow-y-none snap-center scroll-smooth relative"
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

<!-- database creators -->
<div class="flex flex-col w-full mx-4 mt-40">
  <h1 class="text-left my-4">Team of Developers</h1>
  {#await promiseDevs}
    <Spinner/>
  {:then res}
    {#if res}
    <div class="flex flex-row gap-4">
      {#each res.developers as d, idx}
        {@const developerRoles = ['UI Designer', 'Web Designer', 'Database Engineer']}
        <div>
          <PersonCard person={d}/>
          <div class='my-4'>{developerRoles[idx]}</div>
        </div>
      {/each}
    </div>
    {/if}
  {/await}
</div>
<!-- <div class="relative bg-error skew-y-12 h-60 -translate-y-80 -z-10"></div>
<div class="relative bg-error h-60 -z-10 -translate-y-96"></div> -->