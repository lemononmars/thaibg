import { init, addMessages, getLocaleFromNavigator } from 'svelte-i18n';
import en from './locales/en.json'
import th from './locales/th.json'

export function initialize(){
  addMessages('en', en)
  addMessages('th', th)

  init({
    fallbackLocale: 'en',
    initialLocale: getLocaleFromNavigator()?.slice(2)
  });
}

