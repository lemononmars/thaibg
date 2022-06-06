/** @type {import('@sveltejs/kit').ParamMatcher} */
import { organizationRoles } from '$lib/datatypes'
export function match(param) {
   return organizationRoles.includes(param) || param === 'organization'
 }