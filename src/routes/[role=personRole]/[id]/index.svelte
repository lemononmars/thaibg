<script context=module lang=ts>
	import { getVarPrefix } from "$lib/supabase";

	export async function load({ params, fetch }) {
		let {id, role} = params;
		console.log(id, role)

		const res = await fetch(`/api/${role}/${id}`);
		// redirect to the default page
		if (!res.ok)
			return {
				status: 303,
				redirect: `/person?role=${role}`
			};

		const data = await res.json()
		const slug = data[getVarPrefix(role) + '_slug']
		return {
			status: 303,
			redirect: `/${role}/${id}/${slug}`
		};
	}
</script>
