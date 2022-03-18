<script lang="ts">
    import { tick } from 'svelte'
    import { LockIcon, FacebookIcon } from 'svelte-feather-icons'
    import { auth } from '$lib/supabase'
    import { createQueryStore } from '$lib/utils/query'
    import Seo from '$lib/components/SEO.svelte'
	import { handleAlert } from '$lib/alert'
    import Spinner from '$lib/components/Spinner.svelte'

    const regQuery = createQueryStore('reg')

    let isSignIn: boolean = $regQuery ? false : true
    function toggleView() {
        isSignIn = !isSignIn
        tick()
        if(isSignIn) {
            regQuery.unset()
        } else {
            regQuery.set(true)
        }
    }

    // validation, message and loading state
    let loading = false
    // form fields
    let email = '', password = ''

    async function signUpOrSignIn() {
        loading = true

        if (isSignIn) {
            const { error, session } = await auth.signIn({
                email, password
            })
            if (error) {
                handleAlert({ type: "error", text: error.message})
            } else {
                handleAlert({ type: "success", text: "Signed in successfully"})
            }
        } else {
            const { error, session } = await auth.signUp({
                email, password
            })
            if (error) {
                handleAlert({ type: "error", text: error.message})
            } else {
                if(session?.user?.email_confirmed_at == null){
                    handleAlert({ type: "error", text: "Registered. Please confirm your email"})
                }
            }
        }
        loading = false
    }

    async function handleProviderSignIn(provider) {
        loading = true
        const { error } = await auth.signIn({ provider })
        if (error) handleAlert({ type: "error", text: error.message})
        loading = false
    }

    $: isSignIn =  $regQuery ? false : true
</script>

<Seo title={`Auth - ${isSignIn ? 'Log In' : 'Sign Up'}`} />
<div class="flex flex-col justify-center items-center relative">
<!-- <img src="/static/undraw_access_denied_re_awnf.svg" alt="" /> -->
<!-- App logo and tagline -->
<!-- Sign Up form -->
<form class="w-full sm:w-1/2 xl:w-5/12" method="post" on:submit|preventDefault={signUpOrSignIn} >
    <div class="form-control order-teal p-8 border-t-12 mb-6 rounded-lg">
    <!-- <button type="button" class="btn btn-secondary" on:click|preventDefault={() => handleProviderSignIn('facebook')}>
        <FacebookIcon size="1x" class="inline-block "/> {isSignIn ? 'Log In' : 'Sign Up' } with <strong>facebook</strong>
    </button> -->
    <hr class="my-4"/>
    <div class="mb-4">
        <label for="email" class="label">
            <span class="label-text">Email</span>
        </label>
        <input
        id="email"
        name="email"
        type="email"
        class="input"
        placeholder="Your Email"
        required
        bind:value={email}
        />
    </div>
    <div class="mb-4">
        <label for="email" class="label">
            <span class="label-text">Password</span>
        </label>
        <input
        id="password"
        name="password"
        type="password"
        class="input"
        placeholder="Your password. Leave empty for password-less login"
        bind:value={password}
        />
    </div>

    <!-- Sign Up & Sign In form: Actions -->

    <div class="flex pt-4 gap-2">
        <button type="submit" class="flex-1 btn"
        >
            {isSignIn ? 'Log In' : 'Sign Up'}
        </button>
        <div class="flex-1 text-right">
        <small>
            {isSignIn ? 'Not a member yet?' : 'Already a member?'}
        </small>
        <a class="block font-semibold" href="/auth" on:click|preventDefault={toggleView} >
            {isSignIn ?  'Sign Up' : 'Log In' }
        </a>
        </div>
    </div>
</form>
<div class="h-12 w-12 relative">
    {#if loading}
        <Spinner/>
    {/if}
</div>
</div>