<script lang="ts">
  import { onMount } from "svelte";
  let { phone, phoneLabel, copy, copied, copyFailed }: {
    phone: string; phoneLabel: string; copy: string; copied: string; copyFailed: string;
  } = $props();
  let ready = $state(false);
  let pending = $state(false);
  let feedback = $state("");
  let showCopied = $state(false);
  let feedbackTimer: ReturnType<typeof setTimeout> | undefined;
  onMount(() => {
    ready = true;
    return () => { ready = false; clearTimeout(feedbackTimer); };
  });

  async function copyPhone() {
    if (pending) return;
    clearTimeout(feedbackTimer);
    showCopied = false;
    pending = true;
    feedback = "";
    try {
      await navigator.clipboard.writeText(phone);
      if (!ready) return;
      feedback = copied;
      showCopied = true;
      feedbackTimer = setTimeout(() => { showCopied = false; }, 700);
    } catch {
      if (ready) feedback = copyFailed;
    } finally {
      pending = false;
    }
  }
</script>

<div class="relative w-full mt-3">
  <a class="bg-ben-gray-2 py-3.5 pr-12 pl-5 block font-fgt text-lg leading-none peer w-full text-left hover:bg-ben-gray-3 focus-visible:bg-ben-gray-3 focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-ben-black/20" href={`tel:${phone}`}>{phoneLabel}</a>
  {#if ready}
    <div class="absolute top-1/2 -translate-y-1/2 right-0 px-2 peer-hover:bg-ben-gray-3 peer-focus-visible:bg-ben-gray-3 bg-ben-gray-2">
      <div class="relative bg-inherit">
        <button type="button" onclick={copyPhone} aria-disabled={pending} aria-label={copy} class="peer/copy relative z-20 block rounded-lg border border-transparent hover:bg-ben-black/5 focus-visible:border-ben-black outline outline-transparent focus-visible:outline-ben-black/20 focus-visible:outline-[3px] active:scale-90 transition-transform active:bg-ben-black/10 motion-reduce:transition-none">
          <span class="block w-7 h-7 p-1.5" aria-hidden="true">
            <span class="block w-full h-full bg-copy bg-no-repeat bg-center bg-contain"></span>
          </span>
        </button>
        <div data-copy-hint aria-hidden="true" class={`pointer-events-none absolute z-10 top-1/2 -translate-y-1/2 left-0 h-7 flex items-center bg-inherit -translate-x-full ${pending || showCopied ? "opacity-0" : "opacity-0 peer-hover/copy:opacity-100 peer-focus-visible/copy:opacity-100 peer-active/copy:opacity-0"}`}>
          <span class="font-fgt text-sm leading-none pr-2 pl-4 block text-ben-gray-5 whitespace-nowrap">{copy}</span>
        </div>
        <div data-copy-confirmation aria-hidden="true" class={`pointer-events-none absolute z-10 top-1/2 -translate-y-1/2 left-0 h-7 flex items-center bg-inherit -translate-x-full ${showCopied ? "opacity-100" : "opacity-0"}`}>
          <span class="font-fgt text-sm leading-none pr-2 pl-4 block text-ben-gray-5 whitespace-nowrap">{copied}</span>
        </div>
      </div>
    </div>
  {/if}
</div>
<p role="status" aria-live="polite" class={feedback === copied ? "sr-only" : "font-fgt text-sm leading-normal"}>{feedback}</p>
