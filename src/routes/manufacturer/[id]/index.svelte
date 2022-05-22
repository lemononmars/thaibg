<script lang="ts" context="module">
	import { from } from '$lib/supabase';

	export async function load({ params, fetch }) {
		// ignore page's [slug] and redirect to the proper location
		const {id} = params
		const res = await fetch(`/api/manufacturer/${id}`)
		
		if (!res.ok)
			return {
				redirect: '/manufacturer',
				status: 303
			};
		
		const data = await res.json()
		return {
			redirect: `/manufacturer/${id}/${data.Manufacturer_slug}`,
			status: 303
		};
	}
</script>
