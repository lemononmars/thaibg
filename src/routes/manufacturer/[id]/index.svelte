<script lang="ts" context="module">
	import { from } from '$lib/supabase';

	export async function load({ params }) {
		// ignore page's [slug] and redirect to the proper location
		const { data, error } = await from('Printing').select('*').eq('Printing_ID', params.id);
		if (error || !data[0] || !data[0].Printing_show)
			return {
				redirect: '/printing',
				status: 303
			};
		else
			return {
				redirect: `/printing/${params.id}/${data[0].slug}`,
				status: 303
			};
	}
</script>
