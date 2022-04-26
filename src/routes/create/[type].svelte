<script context=module lang=ts>
	import { getSubmissionPackage, TypeSubmissionAllowed } from '$lib/datatypes';
	import type { SubmissionPackage } from '$lib/datatypes';
	import { fromBucket, getVarPrefix } from '$lib/supabase';

	export async function load({ params }) {
		const type = params.type;
		if (!TypeSubmissionAllowed.includes(type))
			return {
				status: 303,
				redirect: '/create/'
			};

		return {
			props: {
				data: getSubmissionPackage(type),
				type: type
			}
		};
	}

   // HURRAY ! It runs on server now
	// TODO: make sure nothing breaks in production
	export async function postSubmission(data): Promise<Response> {
      const res = await fetch('/api/post/submission', {
         method: 'POST',
         cache: 'default',
         credentials: 'same-origin',
         headers: {
            'Content-Type': 'application/json'
         },
         body: JSON.stringify(data)
      })
		return res;
	}

	export async function uploadpicture(type: string, file: File, fileName: string) {
		// TODO: convert file? resize?
		let { error: updateError } = await fromBucket('images').upload(
			`${type}/${fileName}`,
			file,
			{
				upsert: false
			}
		);

		if (updateError) throw updateError;
	}
</script>

<script lang="ts">
	import Seo from '$lib/components/SEO.svelte';
	import { user, getCurrUserProfile } from '$lib/user';
	import Spinner from '$lib/components/Spinner.svelte';
	import SearchMultipleSelect from '$lib/components/SearchMultipleSelect.svelte';
	import UploadPicture from '$lib/components/UploadPicture.svelte';
	import SveltyPicker from 'svelty-picker';
	import MultipleSelect from '$lib/components/MultipleSelect.svelte';

	export let data: SubmissionPackage, type: string; // from load fucntion
	const { submission, keys, relations, selects, multiselects } = data; // destruct

	// create an array for each relation
	let relationMultiSelects: Record<string, string[]> = {};
	relations.forEach((r) => (relationMultiSelects[r] = []));

	// extra info
	let comment: string;
	const pictureKeys = keys.filter((k) => k.includes('picture')); // in case there are more than one pictures
	let pictureFiles: Record<string, File> = {};
	pictureKeys.forEach((k) => (pictureFiles[k] = null));

	// show user a page based on the submission state
	const enum State {
		START,
		SUBMITTING,
		SUCCESS,
		ERROR
	}
	let submitState = State.START;
	async function handleSubmit() {
		if (submitState != State.START && submitState != State.ERROR) return;

		submitState = State.SUBMITTING;

		// attach submitter's info
		let id = 'guest',
			username = 'guest';
		if ($user) {
			const { data, error } = await getCurrUserProfile();
			id = error || !data ? 'guest' : data.id;
			username = error || !data ? 'guest' : data.username;
		}

		// generate a slug based on name (english)
		// if only Thai name (_name_th) exists, treat it as no name
		// might have to manually fix it in admin panel
		let name = submission[getVarPrefix(type) + '_name'];
		if (!name || name.length == 0) name = 'no-slug';

		const slug = name
			.toLowerCase()
			.replace(/\s/g, '-') // replace white spaces by dashes
			.replace(/[^\w\-]/g, ''); // remove non alphanumeric characters (except dashes of course)
		submission[getVarPrefix(type) + '_slug'] = slug;

		// rename picture with random ID for hashing purpose
		for (const pf in pictureFiles) {
			//const fileExtension = pictureFiles[pf].type.split('/')[1] // no longer needed
			const randomID = Math.floor(Math.random() * 1000);
			const randomIDString = ('000' + randomID).slice(-4);
			submission[pf] = slug + randomIDString;
			await uploadpicture(type, pictureFiles[pf], slug + randomIDString);
		}

		let res = await postSubmission({
			content: submission,
			relations: relationMultiSelects,
			pageType: type,
			id,
			username,
			type: 'new',
			comment
		});
		if (res.ok) submitState = State.SUCCESS;
		else submitState = State.ERROR;
	}
</script>

<Seo title="Create {type}" />

<h1>Create new {type}</h1>
{JSON.stringify(submission)}
{JSON.stringify(relationMultiSelects)}
{#if submitState == State.START || submitState == State.ERROR}
	<form>
		<div class="grid grid-cols-2 items-center">
			<!-- display the appropriate input type, based on key's name and selects/multiselects array-->
			{#each keys as k}
				<div class="justify-self-end mx-2">{k}</div>
				<div class="justify-self-start">
					{#if selects[k]}
						<select class="select select-bordered" bind:value={submission[k]}>
							<option disabled selected value={null}>Select one option</option>
							{#each selects[k] as opt}
								<option value={opt}>{opt}</option>
							{/each}
						</select>
					{:else if multiselects[k]}
						<MultipleSelect selectOptions={multiselects[k]} bind:selects={submission[k]} />
					{:else if k.includes('picture')}
						<UploadPicture key={k} bind:pictureFile={pictureFiles[k]} />
					{:else if k.includes('_time')}
						<SveltyPicker
							inputClasses="form-control"
							format="yyyy-mm-dd"
							bind:value={submission[k]}
						/>
					{:else if k.includes('show')}
						<input type="checkbox" bind:checked={submission[k]} class="checkbox" />
					{:else if k.includes('description')}
						<textarea class="textarea textarea-bordered" bind:value={submission[k]} />
					{:else}
						<input type="text" class="input input-bordered" bind:value={submission[k]} />
					{/if}
				</div>
			{/each}
		</div>
		<div class="divider" />
		<div class="flex flex-col justify-center">
			{#each relations as r}
				<SearchMultipleSelect bind:selects={relationMultiSelects[r]} type={r} />
			{/each}
		</div>
		<div class="divider" />
		<div class="justify-self-end mx-2">Comment</div>
		<textarea
			class="textarea textarea-bordered"
			placeholder="comment to admin"
			bind:value={comment}
		/><br />
		{#if submitState == State.START}
			<div class="btn" on:click|preventDefault={handleSubmit}>Submit</div>
		{/if}
	</form>
{/if}

{#if submitState == State.SUBMITTING}
	<p>Submitting.... please wait</p>
	<Spinner />
{:else if submitState == State.SUCCESS}
	<p>Your submission has been received. Please wait until we approve it</p>
	<div class="btn" href="./create/{type}">Click here</div>
	<p>if you want to submit another one!</p>
{:else if submitState == State.ERROR}
	<p class="text-red">There was an error. Please try again</p>
	<div class="btn" on:click|preventDefault={handleSubmit}>Submit</div>
{/if}

<style>
	input {
		@apply w-72;
	}

	select {
		@apply w-72;
	}

	input.checkbox {
		@apply w-10;
	}

	textarea {
		@apply w-72;
	}
</style>
