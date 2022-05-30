<script lang="ts">
   import { onMount, onDestroy } from 'svelte';
   import type { Readable } from 'svelte/store';
   import { createEditor, EditorContent } from 'svelte-tiptap';
   import type {Editor} from 'svelte-tiptap'
   //import StarterKit from '@tiptap/starter-kit'
 
   let editor: Readable<Editor>;
 
   onMount(() => {
     editor = createEditor({
       content: `Hello world!`,
      //  extensions: [
      //   StarterKit,
      // ],
     });
   });

   onDestroy(()=>{
      if(editor)
         $editor.destroy()
   })
 
</script>

<!-- {#if editor}
  <button
    on:click={() => $editor.chain().focus().toggleHeading({ level: 1}).run()}
    class:active={$editor.isActive('heading', { level: 1 })}
  >
    H1
  </button>
  <button
    on:click={() => $editor.chain().focus().toggleHeading({ level: 2 }).run()}
    class:active={$editor.isActive('heading', { level: 2 })}
  >
    H2
  </button>
  <button on:click={() => $editor.chain().focus().setParagraph().run()} class:active={$editor.isActive('paragraph')}>
    P
  </button>
{/if} -->

{#if editor}
<EditorContent editor={$editor} />
{/if}