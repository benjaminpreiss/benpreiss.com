# Astro portfolio — pre-design checkpoint

This isolated worktree migrates committed Next.js baseline `33d9d96c512ee68043e10c6e55df075c11ae598b`. **Local only: no deployment authorized.** Both original projects and ticket 01 evidence remain outside this worktree and unchanged.

## Run

Use Node **24.20.0** (`.node-version`) and pnpm **10.8.0** (`packageManager`). All direct dependencies are exactly pinned; use the committed pnpm lockfile:

```sh
pnpm install --frozen-lockfile --strict-peer-dependencies
pnpm dev
```

In this sandbox, keep configuration and cache access inside the worktree:

```sh
export NPM_CONFIG_USERCONFIG="$PWD/.npmrc"
export NPM_CONFIG_GLOBALCONFIG=/dev/null
export NPM_CONFIG_CACHE="$PWD/.npm-cache"
export ASTRO_TELEMETRY_DISABLED=1
```

The npm user configuration and global writable cache are not required. `.pnpm-store/` and `.npm-cache/` are ignored. Do not change sandbox policy just to use these commands.

Commands:

- `pnpm dev`: loopback Astro development server.
- `pnpm build`: static output in ignored `dist/`.
- `pnpm preview`: loopback preview of that output.
- `pnpm typecheck`: Astro, Svelte and standalone strict TypeScript checks.
- `pnpm lint`: Oxlint correctness checks plus Markdoc hygiene.
- `pnpm format` / `pnpm format:check`: explicitly separated formatter ownership.
- `pnpm test`: schema, real positive/negative builds, rendered link/asset audits, real-content legal/HTTP route checks, formatter and isolated Git hook tests. Route tests use a foreground preview on port 44322.
- `pnpm test:browser`: component-scoped rendering/navigation checks using synthetic Markdoc from `tests/fixtures/`, built in an isolated temporary site automatically. No assertions freeze live portfolio copy. See [testing guide](tests/README.md). Requires a Playwright Chromium installation (`pnpm exec playwright install chromium`) or an authorized disposable browser via `CDP_ENDPOINT=http://127.0.0.1:9222`.

Astro 7 can automatically background dev/preview when it detects an agent. Use `pnpm dev --ignore-lock` or `pnpm preview --ignore-lock` for a foreground process. Otherwise use `pnpm exec astro dev stop` / `pnpm exec astro preview stop` to stop this worktree's background process. Browser tests use a foreground preview on port 44321 and stop it afterward.

## Current slice

- `/` and `/en`: baseline introduction prose, emphasis, line breaks, profile and social links rendered as static HTML. Navigation is a small Svelte island with native links and a native disclosure fallback without JavaScript.
- `content/pages/{de,en}/home.mdoc`: one document per localized homepage, with an introduction and four repeated `Project` tags containing nested prose. Title, destination, explicit color, mobile/desktop recording attributes and locale are validated at build time. Technology buttons are composed with nested `TechnologyButtons` tags and reference shared JSON definitions.
- `src/lib/pages.ts`: explicit `permalink`, `locale`, `translationKey`, title and description validation; duplicates and missing translation counterparts fail. Locale is never inferred from URL prefixes.
- `/privacy` and `/en/privacy`: full baseline legal content in localized Markdoc. Canonical `content/footer/{de,en}/footer.mdoc` supplies footer/imprint content on all four pages. Tests verify the legal layout, key anchors and links without a duplicate content snapshot; legal currency still requires owner approval.
- A bilingual `404.html`, sitemap and robots output are generated. Canonical/hreflang URLs require an explicit owner-approved `PRODUCTION_ORIGIN` build environment variable; absent that, local builds omit absolute metadata rather than inventing a domain. `RELEASE_BUILD=1` rejects a missing origin.
- The temporary interaction demo has been removed. Hydration is covered by real navigation and video browser tests.
- Fixed navigation without a scroll shadow, keyboard/Escape focus handling, responsive menu closing and explicit translation-pair language links are implemented. Navigation brand/links come from `content/navigation/{de,en}/navigation.mdoc` and target IDs authored on page sections. Missing targets and duplicate IDs fail the build. Language links preserve the initial section fragment when present in the target page. Contact links now target the real homepage contact section.
- Tailwind 3, baseline palette, local typography and responsive project layout remain. German project backgrounds use valid intended colors. Contact is composed in Markdoc, with permanently disabled fields/submission, no delivery backend and honest clipboard feedback. Final full-page visual parity is not claimed.
- Video.js 10.1.0 (`@videojs/html`, the v10 Svelte-compatible player package) loads on demand with owner-provided Livepeer HLS sources and a lazy hls.js/native playback adapter. It pauses offscreen and avoids desktop-video loading on mobile. Reduced motion displays posters until manual playback. Errors and autoplay denial have localized feedback. `public/posters/` contains derived stills pending redistribution approval. Local videos have been removed from `public/`; ignored videos are not required for builds. HLS-specific lifecycle/failure tests and real hosted/device acceptance remain outstanding.

There is no client router, animation framework, mail API, hosting adapter or deployment command in the active application. All pages are currently noindex as an additional local-work safeguard, not access control or permission to publish.

## Content ownership

Do not hardcode content in components. Localized prose/composition, profile pictures, social links, project media/colors and navigation belong in Markdoc. Only playback labels and technology button definitions remain in JSON under `content/`. Components own rendering and behavior only. Presentation uses co-located Tailwind utilities, including descendant, responsive, disabled and motion variants; there are no component `<style>` blocks. `styles/globals.css` contains only Tailwind directives and local `@font-face` declarations. The validated per-project color remains an inline runtime value, not a dynamically generated Tailwind class. See [the content editing guide](content/README.md).

## Preservation and hooks

The owner-authorized removal of `legacy/` excludes the old Next application, mail endpoint, dependencies and lockfile from this application. A recovery archive remains outside the worktree in private migration evidence; both original repositories remain untouched. Privacy content lives only in localized Markdoc; route/layout/link checks no longer depend on a legacy JSON snapshot. New project posters and OFL-licensed Work Sans variable fonts are included. Original Founders Grotesk files were preserved outside the worktree's public directory in migration evidence, remain Git-ignored, and are rejected in build output. Videos remain Git-ignored.

**Do not publish `dist/`: deployment is not authorized.** The rebuilt output contains no local video files. Astro copies public assets regardless of Git ignore rules, so output inspection remains necessary. Work Sans is self-hosted with its OFL notice, without runtime font services or private assets. Missing replacement fonts/license and missing local media references fail the build. Typography is owner-approved; other asset licensing, complete Livepeer verification and clean-checkout release acceptance remain gates.

Husky installs automatically in an ordinary standalone checkout. Here `.git` points into shared Git metadata belonging to the preserved project: `prepare` intentionally skips installation instead of changing shared `core.hooksPath`. Before any commit in this migration worktree, run:

```sh
pnpm exec lint-staged
pnpm typecheck
pnpm test
```

Do not run `husky init` here. `tests/staging.test.ts` verifies actual Husky installation/commit execution in a disposable repository in the OS temporary directory, with lint-staged's default backup and partial-stage protection. Only that fixture stages/commits automatically; application commits require explicit owner authorization.

## Checkpoint scope

This is a local work-in-progress checkpoint before implementing the new Penpot design, not a release. The latest worktree validation passed 23 unit/build tests, 90 Chromium browser tests, lint, formatting, framework/type checks, font reproduction and a real-content static build. Contact screenshots remain unchanged after removing dormant mail functionality.

Still required before publication: HLS-specific lifecycle/failure regression coverage and longer/mobile playback checks; poster redistribution approval; legal/hosting disclosure and production-origin approval; repository/history secret and licensing review; hosted Chromium and actual iPhone/iPad Safari acceptance. The build currently warns about an unset production origin and a JavaScript chunk over 500 kB.

`docs/` is intentionally Git-ignored at the owner's request and is not required to install, build or test a fresh checkout. Private planning/recovery evidence, local configuration, generated output, videos and unapproved fonts are excluded from this application snapshot. The original repositories and Git ancestry remain preserved. No push or deployment is authorized.
