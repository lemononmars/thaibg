import boardgameIcon from './icon-boardgame.svg'
import contentIcon from './icon-content.svg'
import eventIcon from './icon-event.svg'
import honorIcon from './icon-honor.svg'
import organizationIcon from './icon-organization.svg'
import mechanicsIcon from './icon-mechanics.svg'
import personIcon from './icon-person.svg'
import roleIcon from './icon-role.svg'
import shopIcon from './icon-shop.svg'

import { personRoles, organizationRoles } from '$lib/datatypes'

export function getTypeIcon(type: string) {
   if(type === 'person' || personRoles.includes(type))
      return personIcon
   if(type === 'organization' || organizationRoles.includes(type))
      return organizationIcon
   if(type === 'boardgame')
      return boardgameIcon
   if(type === 'content')
      return contentIcon
   if(type === 'honor')
      return honorIcon
   if(type === 'mechanics' || type === 'type' || type === 'category')
      return mechanicsIcon
   if(type === 'shop')
      return shopIcon
   if(type === 'event')
      return eventIcon
   return roleIcon
}

export {
   boardgameIcon,
   contentIcon, 
   eventIcon, 
   honorIcon,
   organizationIcon,
   mechanicsIcon, 
   personIcon, 
   roleIcon, 
   shopIcon
}