<script lang="ts" context="module">
    import {from} from '$lib/supabase'

    export async function load({ params }) {
        // allow urls like person/DGS001 or person/ART019
        // redirect to the corresponding person at person/PERSXXXX/Person_slug

        // determine this person's role based on [id]:
        // artist, creator, graphicdesigner, designer
        let id = params.id
        let role = 'Person'
        if(id.startsWith('DSG')) role = 'Designer'
        if(id.startsWith('CRT')) role = 'Creator'
        if(id.startsWith('ART')) role = 'Artist'
        if(id.startsWith('GDSG')) role = 'Graphicdesigner'

        let ROLE_ID = `${role}_ID`
        let SEL_COL = `Person_ID, Person_slug, Person_show`
        console.log(role, id, ROLE_ID)
        const {data, error} = await from('Person')
            .select(SEL_COL)
            .eq(ROLE_ID, id)
        // redirect to the page
        if(error || !data[0])
            return {
                redirect: "/person",
                status: 303
            }

        let person_ID = data[0].Person_ID
        let person_slug = data[0].Person_slug
        return {
            redirect: `/person/${person_ID}/${person_slug}?role=${role}`,
            status: 303
        }
    }
</script>