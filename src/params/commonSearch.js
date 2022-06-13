/** @type {import('@sveltejs/kit').ParamMatcher} */
import { TypeNamesArray } from '$lib/datatypes'
export function match(param) {
  const exception = ['mechanics', 'type', 'category']
  //const exception = []
  return TypeNamesArray.includes(param) && !exception.includes(param)
 }