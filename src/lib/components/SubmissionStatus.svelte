<script type=ts>
   import Spinner from '$lib/components/Spinner.svelte'
   import { locale } from 'svelte-i18n'
   const enum State {
		START,
		SUBMITTING,
		SUCCESS,
		ERROR
	}
   export let submitState: number = State.START
   export let type: string
   export let requireApproval: boolean = false
   export let submissionType: 'edit' | 'new' = 'new'

   const dialogs = {
      'en': [
         'Submitting... please wait.',
         'Accepted! Once we approve your submission, it will be added to the database.',
         'Accepted! You can see the new page below.',
         'Click the button below to submit more.'
      ],
      'th': [
         'กำลังส่งข้อมูล... กรุณารอสักครู่',
         'เสร็จแล้ว! ข้อมูลนี้จะเข้าอยู่ในฐานข้อมูล หลังจากที่เรายืนยันเสร็จ',
         'เสร็จแล้ว! เข้าไปยังหน้าใหม่ได้เลยด้านล่างนี้',
         'กดปุ่มด้านล่างเพื่อเพิ่มข้อมูลอื่น'
      ]
   }
</script>

<div class="h-screen w-screen grid place-content-center gap-4">
   {#if submitState == State.SUBMITTING}
      <p>{dialogs[$locale][0]}</p>
      <Spinner size="xxl"/>
   {:else if submitState == State.SUCCESS}
      {requireApproval? dialogs[$locale][1] : dialogs[$locale][2]}
      <slot/>
      {#if submissionType === 'new'}
         <p>{dialogs[$locale][3]}</p>
         <div class="btn" href="./add/{type}">Add</div>
      {/if}
      <div class="btn" href="./">Home</div>
   {/if}
</div>