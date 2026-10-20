<script lang="ts">
  import { onMount } from "svelte";
  import NavigationLink from "./NavigationLink.svelte";
  import { brandControl, iconControl } from "../lib/control-styles";
  import type { PageData } from "../lib/pages";
  import type { NavigationLink as NavigationLinkData, NavigationLabels } from "../lib/navigation";

  let { locale, brand, brandHref, links, labels: text, translations }: {
    labels: NavigationLabels;
    locale: PageData["locale"];
    brand: string;
    brandHref: string;
    links: NavigationLinkData[];
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

{#snippet sections()}
  {#each links as link}
    <NavigationLink class="section-link" label={link.label} href={link.href} onclick={() => { if (menu.open) close(true); }} />
  {/each}
{/snippet}
{#snippet languages()}
  <details bind:this={languageMenu} class="language-switcher group/languages relative hidden shrink-0 md:block">
    <summary bind:this={languageToggle} aria-label={text.language} class={iconControl}>
      <img class="group-open/languages:hidden" src="/iconoir/language.svg" width="24" height="24" alt="" />
      <img class="hidden group-open/languages:block" src="/iconoir/language-close.svg" width="24" height="24" alt="" />
    </summary>
    <div class="absolute right-full top-0 mr-2 flex h-12 items-center gap-1" role="group" aria-label={text.language}>
      {#each orderedTranslations as translation}
        <NavigationLink label={translation.locale} lang={translation.locale} current={translation.locale === locale} href={translation.locale === locale ? undefined : translation.href} />
      {/each}
    </div>
  </details>
{/snippet}

<header class="sticky top-0 z-10 flex h-[68px] items-center justify-between gap-2 lg:gap-6 bg-white px-3 py-2 md:px-[max(2rem,calc((100%-80rem)/2))] md:py-5 type-lg-semibold supports-backdrop-blur:bg-white/70 supports-backdrop-blur:backdrop-blur-xl md:h-[88px] [&:has(.language-switcher[open])_.primary-navigation]:invisible [&:has(.mobile-menu[open])_.language-switcher]:invisible [&:has(.mobile-menu[open])]:bg-white">
  <a bind:this={brandLink} onclick={() => close()} class={`brand ${brandControl}`} href={brandHref}>{brand}</a>
  <nav class="primary-navigation hidden min-w-0 items-center md:flex" aria-label={text.main}>
    <div class="flex min-w-0 gap-1 lg:gap-4">{@render sections()}</div>
  </nav>
  <div class="flex items-center gap-2">
    <details bind:this={menu} class="primary-navigation mobile-menu group/menu md:!hidden">
      <summary bind:this={toggle} class={iconControl} aria-label={text.menu}>
        <img class="group-open/menu:hidden" src="/iconoir/mobile-menu.svg" width="24" height="24" alt="" />
        <img class="hidden group-open/menu:block" src="/iconoir/language-close.svg" width="24" height="24" alt="" />
      </summary>
      <nav class="fixed inset-x-0 top-[68px] h-[calc(100dvh-68px)] flex flex-col overflow-y-auto bg-white pl-4 pr-6 pt-[max(2rem,calc(25dvh-68px))] pb-[max(1.5rem,env(safe-area-inset-bottom))]" aria-label={text.mobile}>
        <div class="flex shrink-0 flex-col items-start gap-3">{@render sections()}</div>
        <div class="mt-auto flex shrink-0 items-center justify-between gap-3 pt-10" role="group" aria-label={text.language}>
          <div class="flex flex-wrap items-center gap-x-3 gap-y-2">
            {#each translations.filter((translation) => translation.locale !== locale) as translation}
              <NavigationLink label={translation.locale} lang={translation.locale} href={translation.href} />
            {/each}
          </div>
          <NavigationLink label={locale} lang={locale} current />
        </div>
      </nav>
    </details>
    {@render languages()}
  </div>
</header>
