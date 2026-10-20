// Shared by static Astro links and Svelte navigation controls. Only keyboard
// focus draws brackets; pseudo-elements never change layout or the hit area.
export const focusBrackets = [
  "relative outline-none focus-visible:rounded-none",
  "before:hidden after:hidden before:content-none after:content-none",
  "focus-visible:before:block focus-visible:after:block focus-visible:before:content-[''] focus-visible:after:content-['']",
  "before:pointer-events-none before:absolute before:inset-y-0 before:left-0 before:w-[5px] before:border-y before:border-l before:border-current",
  "after:pointer-events-none after:absolute after:inset-y-0 after:right-0 after:w-[5px] after:border-y after:border-r after:border-current",
  "forced-colors:focus-visible:outline forced-colors:focus-visible:outline-2",
].join(" ");

export const iconControl = `${focusBrackets} grid h-12 w-12 shrink-0 cursor-pointer list-none place-items-center rounded-icon hover:bg-ink/5 active:bg-ink/10 focus-visible:!bg-ink/5 [&::-webkit-details-marker]:hidden`;

export const brandControl = `${focusBrackets} inline-flex min-h-11 shrink-0 items-center rounded-control px-4 py-2 type-wordmark hover:bg-ink/5 active:bg-ink/10 focus-visible:!bg-ink/5`;
