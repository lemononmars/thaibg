<script lang=ts>
   import icons from './iconStrings'
   import { personRoles, organizationRoles } from '$lib/datatypes'

   // control width & height via css
   export let type: string = 'boardgame'

   const getTypeIcon = (type: string) => {
      if(type === 'person' || personRoles.includes(type))
         return 'person'
      if(type === 'organization' || organizationRoles.includes(type))
         return 'organization'
      if(type === 'mechanics' || type === 'type' || type ==='category')
         return 'mechanics'
      return type
   }

   const getFillColor = (type: string) => {
      if(type === 'person' || personRoles.includes(type))
         return 'fill-accent'
      if(type === 'organization' || organizationRoles.includes(type))
         return 'fill-secondary'
      return 'fill-primary'
   }

   const iconType = getTypeIcon(type)
   const fillColor = getFillColor(type)
</script>

<svg 
   class={$$props.class + ` ${fillColor}`} 
   viewBox="0 0 500 500" xmlns="http://www.w3.org/2000/svg"
>
   {@html icons[iconType]}
</svg>