<script lang="ts">
  import { onMount } from "svelte";
  import type { PageData } from "../lib/pages";
  import type { NavigationLink, NavigationLabels } from "../lib/navigation";

  let { locale, brand, brandHref, links, labels: text, translations }: {
    labels: NavigationLabels;
    locale: PageData["locale"];
    brand: string;
    brandHref: string;
    links: NavigationLink[];
    translations: { locale: string; href: string }[];
  } = $props();
  let menu: HTMLDetailsElement;
  let toggle: HTMLElement;
  let brandLink: HTMLAnchorElement;
  let languageMenu: HTMLDetailsElement;
  let languageToggle: HTMLElement;
  const orderedTranslations = $derived([...translations].sort((a, b) => Number(b.locale === locale) - Number(a.locale === locale)));

  function close(returnFocus = false) {
    menu.open = false;
    if (returnFocus) toggle.focus();
  }

  onMount(() => {
    const desktop = window.matchMedia("(min-width: 768px)");
    const background = [...document.querySelectorAll<HTMLElement>("main, footer")].map((element) => ({ element, inert: element.inert }));
    const previousOverflow = document.body.style.overflow;
    const sync = () => {
      for (const { element, inert } of background) element.inert = menu.open || inert;
      document.body.style.overflow = menu.open ? "hidden" : previousOverflow;
    };
    const resize = () => {
      if (!desktop.matches) languageMenu.open = false;
      if (desktop.matches && menu.open) {
        close();
        // The media query can hide the focused menu element before this event,
        // moving activeElement to body. Always restore focus when closing it.
        document.querySelector<HTMLAnchorElement>(".brand")?.focus();
      }
    };
    const dismissLanguages = (event: Event) => {
      if (languageMenu.open && event.target instanceof Node && !languageMenu.contains(event.target)) languageMenu.open = false;
    };
    const keydown = (event: KeyboardEvent) => {
      if (languageMenu.open && event.key === "Escape") {
        event.preventDefault();
        languageMenu.open = false;
        languageToggle.focus();
        return;
      }
      if (!menu.open) return;
      if (event.key === "Escape") { event.preventDefault(); close(true); }
      if (event.key === "Tab") {
        const items = [brandLink, toggle, ...menu.querySelectorAll<HTMLAnchorElement>("a[href]")];
        const first = items[0]!;
        const last = items[items.length - 1]!;
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
        else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
      }
    };
    menu.addEventListener("toggle", sync);
    desktop.addEventListener("change", resize);
    document.addEventListener("keydown", keydown);
    document.addEventListener("pointerdown", dismissLanguages);
    document.addEventListener("focusin", dismissLanguages);
    return () => {
      menu.removeEventListener("toggle", sync);
      desktop.removeEventListener("change", resize);
      document.removeEventListener("keydown", keydown);
      document.removeEventListener("pointerdown", dismissLanguages);
      document.removeEventListener("focusin", dismissLanguages);
      for (const { element, inert } of background) element.inert = inert;
      document.body.style.overflow = previousOverflow;
    };
  });
</script>

{#snippet sectionLabel(label: string)}
  <span data-nav-label class="whitespace-nowrap leading-none">{label}</span>
  <img class="ml-1 h-6 w-6 shrink-0 opacity-0 group-hover/section:opacity-100 group-focus-visible/section:opacity-100" src="/iconoir/navigation-indicator.svg" width="24" height="24" alt="" />
{/snippet}
{#snippet sections()}
  {#each links as link}
    {#if link.href}
      <a class="section-link group/section flex items-center justify-center px-2 pt-0.5 pb-1 text-lg leading-none border border-transparent outline-none focus-visible:border-ben-black focus-visible:rounded-md focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-ben-black/20 active:scale-90 transition-transform active:bg-ben-black/10 active:rounded-md motion-reduce:transition-none" href={link.href} onclick={() => close(true)}>{@render sectionLabel(link.label)}</a>
    {:else}
      <span class="section-link flex items-center justify-center px-2 pt-0.5 pb-1 text-lg leading-none border border-transparent" aria-disabled="true">{@render sectionLabel(link.label)}</span>
    {/if}
  {/each}
{/snippet}
{#snippet languages()}
  <details bind:this={languageMenu} class="language-switcher group/languages relative hidden shrink-0 md:block font-fgt text-xl leading-6 font-[350]">
    <summary bind:this={languageToggle} aria-label={text.language} class="grid h-10 w-10 cursor-pointer list-none place-items-center rounded-lg border border-transparent hover:bg-ben-black/5 outline outline-transparent focus-visible:border-ben-black focus-visible:outline-ben-black/20 focus-visible:outline-[3px] active:bg-ben-black/10 [&::-webkit-details-marker]:hidden">
      <img class="group-open/languages:hidden" src="/iconoir/language.svg" width="24" height="24" alt="" />
      <img class="hidden group-open/languages:block" src="/iconoir/language-close.svg" width="24" height="24" alt="" />
    </summary>
    <div class="absolute right-full top-0 mr-2 flex h-10 items-center gap-1" role="group" aria-label={text.language}>
      {#each orderedTranslations as translation}
        {#if translation.locale === locale}
          <span data-language-option aria-current="page" lang={translation.locale} class="flex h-8 items-center border border-transparent px-2 pt-0.5 pb-1 text-lg leading-none font-semibold">{translation.locale}<span aria-hidden="true" class="ml-1 h-6 w-6 shrink-0"></span></span>
        {:else}
          <a data-language-option class="group/section flex items-center rounded-md border border-transparent px-2 pt-0.5 pb-1 text-lg leading-none outline-none focus-visible:border-ben-black focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-ben-black/20 active:bg-ben-black/10" href={translation.href} hreflang={translation.locale} lang={translation.locale}>
            {@render sectionLabel(translation.locale)}
          </a>
        {/if}
      {/each}
    </div>
  </details>
{/snippet}

<header class="sticky top-0 z-10 flex h-[68px] items-center justify-between bg-white py-2.5 pl-4 pr-2 md:px-[max(2rem,calc((100%-72rem)/2))] md:py-6 font-fg font-medium supports-backdrop-blur:bg-white/70 supports-backdrop-blur:backdrop-blur-xl md:h-[88px] [&:has(.language-switcher[open])_.primary-navigation]:invisible [&:has(.mobile-menu[open])_.language-switcher]:invisible [&:has(.mobile-menu[open])]:bg-white">
  <a bind:this={brandLink} onclick={() => close()} class="brand font-logo font-bold px-2.5 text-brand leading-[2.3rem] block rounded-lg border border-transparent hover:bg-ben-black/5 focus-visible:border-ben-black outline outline-transparent focus-visible:outline-ben-black/20 focus-visible:outline-[3px] active:scale-90 transition-transform active:bg-ben-black/10 motion-reduce:transition-none" href={brandHref}>{brand}</a>
  <nav class="primary-navigation hidden items-center md:flex" aria-label={text.main}>
    <div class="absolute left-1/2 flex -translate-x-1/2 gap-3">{@render sections()}</div>
  </nav>
  <div class="flex items-center gap-2">
  <details bind:this={menu} class="primary-navigation mobile-menu group/menu md:!hidden [&_.section-link]:text-2xl [&_.section-link]:leading-none">
    <summary bind:this={toggle} class="grid h-12 w-12 cursor-pointer list-none place-items-center rounded-lg border border-transparent hover:bg-ben-black/5 focus-visible:border-ben-black outline outline-transparent focus-visible:outline-ben-black/20 focus-visible:outline-[3px] active:bg-ben-black/10 [&::-webkit-details-marker]:hidden" aria-label={text.menu}>
      <img class="group-open/menu:hidden" src="/iconoir/mobile-menu.svg" width="24" height="24" alt="" />
      <img class="hidden group-open/menu:block" src="/iconoir/language-close.svg" width="24" height="24" alt="" />
    </summary>
    <nav class="fixed inset-x-0 top-[68px] h-[calc(100dvh-68px)] flex flex-col overflow-y-auto bg-white pl-[18px] pr-6 pt-[max(2rem,calc(25dvh-68px))] pb-[max(1.5rem,env(safe-area-inset-bottom))]" aria-label={text.mobile}>
      <div class="flex shrink-0 flex-col items-start gap-3">{@render sections()}</div>
      <div class="mt-auto flex shrink-0 items-center justify-between gap-3 pt-10 font-fgt font-[350]" role="group" aria-label={text.language}>
        <div class="flex flex-wrap items-center gap-x-3 gap-y-2">
          {#each translations.filter((translation) => translation.locale !== locale) as translation}
            <a class="group/section flex items-center rounded-md border border-transparent px-2 pt-0.5 pb-1 text-lg leading-none outline-none focus-visible:border-ben-black focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-ben-black/20 active:bg-ben-black/10" href={translation.href} hreflang={translation.locale} lang={translation.locale}>
              {@render sectionLabel(translation.locale)}
            </a>
          {/each}
        </div>
        <span aria-current="page" lang={locale} class="flex h-8 shrink-0 items-center border border-transparent px-2 pt-0.5 pb-1 text-lg leading-none font-semibold">{locale}</span>
      </div>
    </nav>
  </details>
  {@render languages()}
  </div>
</header>
