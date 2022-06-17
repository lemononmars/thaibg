import { init, addMessages, getLocaleFromNavigator } from 'svelte-i18n';
import {locale} from './routes/store'
import en from './locales/en.json';
import th from './locales/th.json';
import { onDestroy } from 'svelte';

export function initialize() {
	addMessages('en', en);
	addMessages('th', th);

	// reading store value outside svelte component
	let storeLocale: string
	const unsubscriber = locale.subscribe(value => storeLocale = value)
	onDestroy(unsubscriber)

	init({
		fallbackLocale: 'en',
		initialLocale: storeLocale || getLocaleFromNavigator()?.slice(0,2)
	});
}
