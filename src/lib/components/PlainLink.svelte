<script lang="ts">
   import { TypeNamesArray} from '$lib/datatypes';
   import {PersonRoleArray } from '$lib/datatypes'

   import {getImageURL, getDefaultImageURL, getVarPrefix} from '$lib/supabase'
   export let object
   export let type: string
   export let comment: string = ''

   let id = 0, slug = '', picture = '', name = '', typeVar = '', roleQuery = ''

   // if type is invalid, make a blank card
   if(object && TypeNamesArray.includes(type)) {
      // make sure the role query points to the correct role
      roleQuery = PersonRoleArray.includes(type)? `?role=${type}`: ''
      // afterward, everything else can point to the person
      if(PersonRoleArray.includes(type))
         type = 'person'
      typeVar = getVarPrefix(type)

      id = object[typeVar + '_ID']
      slug = object[typeVar + '_slug']
      picture = object[typeVar + '_picture']
      name = object[typeVar + '_name'] || object[typeVar + '_name_th'] || 'untitled'
   }
</script>

<div class="flex flex-row items-center gap-4">
   <div class="avatar">
      <div class="w-16 h-16 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2 hover:scale-105 duration-300">
         <img src="{getImageURL(type, picture)}" alt="avatar" class="object-contain"
            on:error|once={(ev)=>ev.target.src = getDefaultImageURL(type)}
         />
      </div>
   </div>
   <div>
      <a href="/{type}/{id}/{slug}{roleQuery}"> {name}</a>
      <p>{comment}</p>
   </div>
</div>