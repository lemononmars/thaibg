/** @type {import('@sveltejs/kit').ParamMatcher} */
import { personRoles } from '$lib/datatypes'
export function match(param) {
   return personRoles.includes(param)
 }