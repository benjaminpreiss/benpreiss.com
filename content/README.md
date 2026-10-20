# Editing content

**Do not hardcode content in components.** Components own layout, styling and behavior; `content/` owns copy, labels, destinations and media metadata.

- Use localized Markdoc for prose, page composition and project-specific configuration (`pages/de/home.mdoc`, `pages/en/home.mdoc`).
- Use JSON only for reusable structured content that does not fit naturally into Markdoc. Do not move editorial data into TypeScript constants.

## Pages, translations and legal content

Every `content/pages/**/*.mdoc` document requires explicit `permalink`, `locale` (`de` or `en`), `translationKey`, `title` and `description` frontmatter. Author slashless lowercase paths (except `/`) without query/fragment; do not infer locale from the path. Every translation identity must have exactly one DE and one EN document. Metadata changes affect head tags; absolute canonical/hreflang URLs require an owner-approved `PRODUCTION_ORIGIN` build environment variable.

`pages/{de,en}/privacy.mdoc` preserves the approved baseline legal prose. Use `LegalContent` around prose, lists and ordinary Markdown links. `LegalHeading` takes `level` (1–3), `title` and `id`, retaining legacy `dse_*` IDs with underscores so old legal fragments keep working. `LegalNotice` retains the baseline's emphasized objection notices. Do not silently update hosting/delivery/legal assertions: see the review checklist in `docs/ticket-06.md`.

`footer/{de,en}/footer.mdoc` is canonical per locale and is rendered on all pages of that locale. Compose it with `FooterLinks` (Markdown headings/prose/links), `FooterSocial` plus `SocialLink`, and `Imprint` plus `ImprintEntry` for labeled prose. It has `locale` frontmatter only and does **not** create an imprint route. A missing or duplicate footer locale fails the build.

`system/not-found.mdoc` owns bilingual 404 prose and explicit homepage links via `Language` blocks. It does not join the public page/translation collection. Build audits validate rendered internal links, fragments and asset references, including footer and 404 content. Missing local assets, including video references and required fonts, fail the build. Passing this audit is not release acceptance.

## Introduction and social links

```markdoc
{% Intro id="start" %}
{% ProfilePicture src="/profile-pic.jpg" alt="Picture of Benjamin Preiss" width=477 height=595 /%}
{% IntroColumn %}
{% IntroText %}
Introduction prose goes here.
{% /IntroText %}
{% SocialLinks %}
{% SocialLink name="GitHub" href="https://github.com/benjaminpreiss" icon="/github-black.svg" /%}
{% /SocialLinks %}
{% /IntroColumn %}
{% /Intro %}
```

Supply localized alt text in each document. Image paths and positive integer dimensions are validated at build time. Each `SocialLink` supplies its accessible name, HTTP(S) destination and local icon path. Link order and membership are controlled in Markdoc, not JSON or components.

## Project colors and recordings

Each `Project` declares its actual color and both device recordings directly:

```markdoc
{% Projects id="work" %}
{% Project title="Example project" href="https://example.org/" linkText="Website" locale="en"
color="#869B86"
mobile={"width":320,"height":640,"poster":"/posters/example-mobile.jpg","webm":"/example-mobile.webm","mp4":"/example-mobile.mp4"}
desktop={"width":1280,"height":720,"poster":"/posters/example-desktop.jpg","webm":"/example-desktop.webm","mp4":"/example-desktop.mp4"}
%}
Project prose goes here.

{% TechnologyButtons names=["figma", "nextjs"] /%}
{% /Project %}
{% /Projects %}
```

Colors must be six-digit hex values. Both recordings require positive integer dimensions, a poster and WebM/MP4 URLs. Local paths and HTTP(S) URLs are supported; missing or unsafe values fail the build. Playback prioritizes WebM with MP4 fallback. There is no shared project-media/color registry and no inferred filename convention: all project-specific values belong to the localized documents.

Technology buttons remain reusable definitions in `technology-buttons.json`; Markdoc chooses their order by name. Their `small`, `medium` and `wide` sizes select component styles, not arbitrary CSS.

## Navigation and section IDs

Navigation is separate from page documents:

- `navigation/de/navigation.mdoc`
- `navigation/en/navigation.mdoc`

Each document has a locale, brand label/destination and navigation accessibility labels in frontmatter, followed by one Markdown list:

```markdoc
---
locale: en
brand: benpreiss
brandHref: /en#start
labels:
  language: Language
  main: Main navigation
  mobile: Mobile navigation
  menu: Menu
---
- [about.](/en#start)
- [work.](/en#work)
- contact.
```

All four `labels` fields are required, nonempty localized text; navigation does not read JSON. Linked items become navigation links; plain-text items remain visibly disabled. The homepage contact section is now linked through its authored `contact` ID. The order and labels are entirely editorial.

`Intro`, `ProjectIntro`, `Projects` and individual `Project` sections accept an optional `id` attribute. IDs must start with a lowercase letter and contain only lowercase letters, digits and hyphens. No section ID is hardcoded in those components. Duplicate IDs, missing navigation documents, duplicate navigation locales, missing linked pages and dangling section links fail the build.

Navigation is shared across pages of its locale, so use explicit page destinations (`/en#work`) when linking to homepage sections from elsewhere. Fragment-only links (`#work`) are also supported, but must resolve on every page using that navigation. The German/English path is authored explicitly, never inferred from locale. Translation links preserve the initial section fragment only when it also exists in the target document.

## Contact

Compose the contact section directly in each localized homepage:

```markdoc
{% Contact id="contact" title="get in touch" %}
{% ContactIntro %}
Let’s have a chat! You can call me. Messaging is coming soon.
{% /ContactIntro %}
{% ContactPhone title="Phone" phone="+12025550123" phoneLabel="+1 202 555 0123"
copy="Copy phone number" copied="Phone number copied"
copyFailed="Could not copy. Please select and copy the phone number, or tap it to call." /%}
{% ContactForm id="contact-form" title="E-Mail" unavailable="Message delivery is not available yet. Please call me instead." %}
{% ContactInput id="contact-name" name="name" label="Name" /%}
{% ContactInput id="contact-email" name="email" type="email" label="E-Mail" /%}
{% ContactInput id="contact-message" name="message" type="textarea" label="Your Message" /%}
{% ContactFootnote %}
This is not a newsletter sign up form.

[privacy policy](/en/privacy)
{% /ContactFootnote %}
{% ContactButton unavailable="Coming soon" /%}
{% /ContactForm %}
{% /Contact %}
```

Markdoc owns composition, field order, accessible labels and optional `placeholder` (defaults to `label`). `ContactInput` supports `text` (default), `email` and `textarea`; field names are restricted to `name`, `email`, and `message`. Each `id` must be unique on the page. Inputs remain disabled even outside the wrapper. `ContactForm` renders a disabled fieldset, not a native form, and displays its authored unavailable explanation. Its title labels the fieldset accessibly. `ContactFootnote` accepts ordinary nested prose/links; two paragraphs preserve the mobile line break. `ContactButton` accepts only the localized `unavailable` label and always renders a disabled button.

All contact copy lives in the localized Markdoc documents, including clipboard feedback and the unavailable explanation/button label. `contact.json` has been removed; contact components do not accept a locale or look up translations. Required text attributes reject missing/empty copy at build time. Privacy destinations are explicit Markdown links; `/privacy` and `/en/privacy` now render and are verified by ticket 06 tests.

Fields and the “Coming soon” button are disabled in static HTML. There is deliberately no native form or delivery handler, so neither JavaScript nor no-JavaScript visitors can submit. Only the phone clipboard control hydrates. Its status reports success after the clipboard promise resolves, or offers manual selection/calling after failure. Without JavaScript the phone link remains usable and the copy button is omitted.

The owner chose to retain only the “Coming soon” appearance. There is no input validation, error-message metadata, sending/success state, spinner or mail-delivery code. A future contact system will be implemented separately rather than reusing dormant delivery scaffolding.

## Remaining JSON

| File                      | Owns                                    |
| ------------------------- | --------------------------------------- |
| `ui.json`                 | German/English playback labels/messages |
| `technology-buttons.json` | Reusable technology button definitions  |

`site.json`, `project-media.json` and `project-tones.json` are no longer used. Brand content belongs to navigation Markdoc; project colors/media belong to homepage Markdoc. Structural CSS, breakpoints and playback state remain code. Decorative UI icons are presentation, not editorial content.

Shared JSON is validated at build time by `src/lib/shared-content.ts`. Markdoc attributes and section/navigation contracts are also validated before output is generated. Browser components receive only the rendered data they need; build-time parsing and validation libraries are not included in islands.

Run `pnpm build`, `pnpm typecheck`, `pnpm test`, and `pnpm test:browser` after changes. Updating content does not require a component edit. Media and fonts remain subject to the local-only/release restrictions in the repository README.
