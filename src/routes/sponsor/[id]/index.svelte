<script lang="ts" context="module">
	export async function load({ params, fetch }) {
		// ignore page's [slug] and redirect to the proper location
		const res = await fetch(`/api/sponsor/${params.id}`);
		const data = await res.json();
		if (!res.ok || !data.Sponsor_show)
			return {
				redirect: '/sponsor',
				status: 303
			};

		return {
			redirect: `/sponsor/${params.id}/${data[0].slug}`,
			status: 303
		};
	}
</script>
