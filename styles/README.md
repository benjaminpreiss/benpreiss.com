# Website design tokens and typography

The Penpot `design system` and linked startpage components inform `tokens.json`.
Tailwind consumes these presentation values; editorial text, destinations and
composition remain in Markdoc.

## Composite typography

Use one composite class for standalone text (headings, buttons, captions and prose containers), not a stack of independent font/size/leading utilities:

- `type-{sm,base,lg,xl,2xl,3xl}-regular`: Work Sans 400.
- `type-{size}-semibold`: Work Sans 500.
- `type-{size}-bold`: Work Sans 600.
- `type-{size}-emphasis`: Work Sans 500 italic.
- `type-wordmark`: Onest Logo 700, 23.1px with a 28px line box.

The six sizes are 12.25, 14, 15.75, 17.5, 21 and 26.25px at the default 16px
root size. They use rem units and 1.5 line-height. Responsive and descendant
variants work normally, e.g. `type-lg-semibold md:type-2xl-semibold`.

Inline `<strong>` and `<em>` inherit the surrounding family, size and line-height. The shared page-body rules change only their weight (600/500) and emphasis style (italic); do not apply size-specific `type-*-bold` or `type-*-emphasis` classes to them. Inline project links likewise change only weight. Full variants remain available for standalone elements.

There is no paragraph-spacing property in CSS. These assets do not set margins
or padding. Content layouts explicitly own paragraph margins, such as
`[&_p+p]:mt-3`. Use Tailwind's standard spacing utilities; there are no separate
spacing tokens.

## Controls and palette

`TextButton.astro` implements Outline/Filled variants and optional decorative
icons. The intro gives the booking instance a 200px minimum width; longer labels
can grow/wrap. The component itself remains content-sized. Both Focus states use
the same dark square brackets on a light tint; hover/active states do not scale
or move adjacent content. Shared focus utilities in `src/lib/control-styles.ts`
are consumed by the static CTA and Svelte navigation. Brackets are explicitly
absent until `:focus-visible`; forced-colors retains an outline fallback.

`colors.control` contains opaque composited button surfaces: ink 5%/10% over
white, white 5% over gray6, and white 10% over ink. Other controls use
`bg-ink/5` and `bg-ink/10` directly.

The navbar uses 44px minimum-height links/brand and 48px icon controls. Long
authored labels may wrap at narrow desktop widths rather than overlap or
overflow. Reserved arrow space keeps hover from shifting navigation.

Booking is a normal HTTPS anchor with its label, full fragment URL and icon
path authored in localized Markdoc. It makes no calendar requests until used;
there is no embed, tracking script or booking API integration. Footer social
links remain separate.
