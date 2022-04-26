<script lang="ts" context="module">
	export async function load({ params, fetch }) {
		// ignore page's [slug] and redirect to the proper location
		const res = await fetch(`/api/type/${params.id}`);
		if (!res.ok)
			return {
				redirect: '/type',
				status: 303
			};

		const data = await res.json();
		return {
			redirect: `/type/${params.id}/${data.Type_slug}`,
			status: 303
		};
	}
</script>
