import { init, addMessages } from 'svelte-i18n';

import en from './locales/en.json'
import th from './locales/th.json'

addMessages('en', en)
addMessages('th', th)
console.log('messages added!')

init({
   fallbackLocale: 'en',
   //initialLocale: getLocaleFromNavigator(),
   initialLocale: 'th',
 });
 