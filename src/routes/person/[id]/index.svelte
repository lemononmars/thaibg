<script context=module lang=ts>
// Note: should have been an endpoint, but I couldn't get fetch to work :/
export async function load({ params, url, fetch }) {
    let id = params.id

    // make sure the query is valid
    let role = url.searchParams.get('role')?.toLowerCase() || 'person'
    let roles = ['artist', 'designer', 'contentcreator', 'graphicdesigner', 'playtester']
    let roleURLparam = `?role=${role}`
    if(!role || !roles.includes(role))
        roleURLparam = ''

    let res = await fetch(`/api/person/${id}`)
    // redirect to the default page
    if(!res.ok)
        return {
            status: 303,
            redirect: "/person",
        }

    let data = await res.json()
    
    return {
        status: 303,
        redirect: `/person/${id}/${data.Person_slug}${roleURLparam}`,
    }
}
</script>