<script lang="ts">
  import { focusBrackets } from "../lib/control-styles";
  let { label, href, onclick, lang, current = false, class: className = "" }: {
    label: string;
    href?: string;
    onclick?: () => void;
    lang?: string;
    current?: boolean;
    class?: string;
  } = $props();
  const layout = "inline-flex min-h-11 min-w-0 items-center justify-center gap-1 rounded-control px-3 py-2.5 type-lg-semibold";
</script>

{#snippet content()}
  <span data-nav-label class="min-w-0">{label}</span>
  {#if href}
    <img class="h-6 w-6 shrink-0 opacity-0 group-hover/section:opacity-100 group-focus-visible/section:opacity-100" src="/iconoir/navigation-indicator.svg" width="24" height="24" alt="" />
  {:else}
    <span aria-hidden="true" class="h-6 w-6 shrink-0"></span>
  {/if}
{/snippet}

{#if href}
  <a class={`nav-link group/section ${layout} ${focusBrackets} active:bg-ink/5 focus-visible:bg-ink/5 ${className}`} {href} {onclick} {lang} hreflang={lang} data-language-option={lang ? true : undefined}>
    {@render content()}
  </a>
{:else}
  <span class={`${layout} ${className}`} {lang} data-language-option={lang ? true : undefined} aria-current={current ? "page" : undefined} aria-disabled={current ? undefined : "true"}>
    {@render content()}
  </span>
{/if}
