<script context=module lang=ts>
	import {personRoles} from '$lib/datatypes'
	export async function load({ params, url, fetch }) {
		let id = params.id;

		// make sure the query is valid
		let role = url.searchParams.get('role')?.toLowerCase() || 'person';
		let roleURLparam = `?role=${role}`;
		if (!role || !personRoles.includes(role)) roleURLparam = '';

		let res = await fetch(`/api/person/${id}`);
		// redirect to the default page
		if (!res.ok)
			return {
				status: 303,
				redirect: '/person'
			};

		let data = await res.json();

		return {
			status: 303,
			redirect: `/person/${id}/${data.Person_slug}${roleURLparam}`
		};
	}
</script>
