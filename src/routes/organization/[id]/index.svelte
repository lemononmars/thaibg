<script lang="ts" context="module">
	export async function load({ params, fetch }) {
		// ignore page's [slug] and redirect to the proper location
		const res = await fetch(`/api/organization/${params.id}`);
		const data = await res.json();
		console.log(data)
		
		if (!res.ok || !data.Organization_show)
			return {
				redirect: '/organization',
				status: 303
			};

		return {
			redirect: `/organization/${params.id}/${data.Organization_slug}`,
			status: 303
		};
	}
</script>
