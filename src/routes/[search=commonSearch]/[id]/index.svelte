<script lang="ts" context="module">
	import {handleAlert} from "$lib/alert";
	import type {Alert} from '$lib/alert/alert.type'
	import {getVarPrefix} from '$lib/supabase'

	export async function load({ params, fetch }) {
		// ignore page's [slug] and redirect to the proper location
		const {id, search: type} = params
		const res = await fetch(`/api/${type}/${id}?select=slug`);
		if (!res.ok) {
			const newAlert: Alert = {
				type: 'error',
				text: `${type} with ID ${id} does not exist`
			}
			handleAlert(newAlert)
			return {
				redirect: `/${type}`,
				status: 303
			};
		}

		const data = await res.json();
		const slug = data[getVarPrefix(type) + '_slug'] || 'no-slug'
		return {
			redirect: `/${type}/${id}/${slug}`,
			status: 303
		};
	}
</script>
