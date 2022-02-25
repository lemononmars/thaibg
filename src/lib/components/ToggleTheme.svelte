<script lang="ts">
  import { theme } from '../../routes/store'
  import { themeChange } from 'theme-change'
  import {SunIcon, MoonIcon} from 'svelte-feather-icons'
  import { onMount } from 'svelte'

  onMount(() => {
    themeChange($theme)
  })

  const toggleTheme = () => {
    $theme = $theme === 'business' ? 'emerald' : 'business'
    themeChange($theme)
  }

  let checked = $theme === 'business'
</script>

<div>
<span class="flex flex-row items-center p-4 gap-2">
  <SunIcon class="color-gray-300" size=20/>
  <input type="checkbox" bind:checked on:click={toggleTheme} class="toggle">   
  <MoonIcon class="color-yellow-300" size=20/>
</span>
</div>