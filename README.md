# benpreiss.com

A bilingual portfolio for Benjamin Preiss, freelance web developer and product designer. Built with **Astro**, **Markdoc**, **Svelte**, **Tailwind CSS** and **TypeScript**.

The site is statically generated. Markdoc owns the content and page composition; Svelte adds interactive navigation and project-video playback where needed.

## Features

- German (`/`) and English (`/en`) homepages with selected projects and a Proton Calendar booking link.
- Responsive project recordings served over Livepeer HLS, with lazy loading, offscreen pause, reduced-motion support and manual playback controls.
- Keyboard-accessible navigation and language switching, with a native disclosure fallback without JavaScript.
- Localized privacy pages at `/privacy` and `/en/privacy`, shared footers and a bilingual 404.
- Self-hosted Work Sans and an Onest wordmark subset, generated from pinned dependencies.
- A deliberately disabled “Coming soon” contact form. Contact is available through email and booking links; there is no mail-delivery backend.

## Getting started

Use **Node 24.20.0** (see `.node-version`) and **pnpm 10.8.0**. Direct dependencies are pinned, and `pnpm-lock.yaml` is committed.

```sh
pnpm install --frozen-lockfile --strict-peer-dependencies
pnpm dev
```

The development server binds to `127.0.0.1`, normally on port `4321`.

Installation generates the public font binaries. `pnpm dev` and `pnpm build` also regenerate missing or changed fonts. If installation scripts are disabled, run `pnpm fonts:generate` before tests or direct Astro commands.

To build and inspect the static site locally:

```sh
pnpm build
pnpm preview
```

Output is written to the ignored `dist/` directory. Astro may background dev/preview when invoked by an agent; add `--ignore-lock` to keep the process in the foreground.

## Project structure

| Path                     | Purpose                                                        |
| ------------------------ | -------------------------------------------------------------- |
| `content/pages/{de,en}/` | Localized homepages and privacy pages                          |
| `content/navigation/`    | Navigation labels, destinations and accessibility copy         |
| `content/footer/`        | Social links, privacy links and imprint content                |
| `content/system/`        | Bilingual not-found content                                    |
| `content/*.json`         | Playback messages and technology-button definitions            |
| `src/components/`        | Astro presentation components and Svelte interactions          |
| `src/lib/`               | Content validation, routing, SEO and playback logic            |
| `src/pages/`             | Static route generation, 404, sitemap and robots output        |
| `styles/`                | Font declarations, design tokens and styling documentation     |
| `public/`                | Portrait, posters, icons, font notices and generated fonts     |
| `scripts/`               | Font generation, build auditing and formatting tools           |
| `tests/`                 | Unit/build tests, browser tests and synthetic content fixtures |

## Editing content

Edit localized Markdoc rather than hardcoding copy in components. Each page declares its `permalink`, `locale`, `translationKey`, `title` and `description`. Translation pairs and routes are explicit; locale is not inferred from a URL prefix.

Homepages compose the introduction, booking button, projects and contact section. Each project owns its prose, destination, color, recording dimensions, posters and HLS URLs. Booking labels and the complete booking URL—including its fragment—also live in Markdoc.

Build-time validation rejects invalid metadata, duplicate routes, missing translations, dangling navigation targets and missing local assets. Privacy prose has a single source in Markdoc, not a duplicate snapshot.

See the [content editing guide](content/README.md).

## Styling and typography

Tailwind consumes the palette and typography values in `styles/tokens.json`. Composite classes such as `type-lg-regular` and `type-2xl-semibold` set font family, size, weight/style and line-height together. Inline bold and emphasis inherit surrounding text metrics and change only weight/style.

Spacing uses Tailwind's standard utilities. Paragraph margins belong to content layouts, not typography assets. Shared controls use keyboard-only focus brackets and preserve their dimensions across interaction states.

See [design tokens and typography](styles/README.md).

`public/fonts/` is entirely generated and Git-ignored. Licenses and provenance remain tracked under `licenses/fonts/`; generation copies the required OFL notices alongside the public binaries:

- [Work Sans](licenses/fonts/work-sans/README.md)
- [Onest logo subset](licenses/fonts/onest/README.md)

```sh
pnpm fonts:generate
pnpm fonts:check
```

Generation uses installed, pinned Fontsource packages without contacting a font service. Font licenses do not grant rights to portfolio copy, branding or other third-party assets.

## Quality checks

| Command             | Checks                                                          |
| ------------------- | --------------------------------------------------------------- |
| `pnpm lint`         | Oxlint and Markdoc hygiene                                      |
| `pnpm format:check` | Oxfmt, Astro formatting and Markdoc whitespace                  |
| `pnpm format`       | Apply formatting                                                |
| `pnpm typecheck`    | Astro, Svelte and TypeScript diagnostics                        |
| `pnpm test`         | Content contracts, real builds, asset audits, fonts and tooling |
| `pnpm test:browser` | Layout, controls, navigation, typography and playback behavior  |
| `pnpm build`        | Real-content static build and output audit                      |

For browser tests, install Chromium once:

```sh
pnpm exec playwright install chromium
pnpm test:browser
```

An existing disposable Chromium instance can instead be used with `CDP_ENDPOINT=http://127.0.0.1:9222`.

Tests build isolated sites in the OS temporary directory. Synthetic content exercises the real renderer without freezing editable portfolio prose, and no local video recordings are required. Test servers use ports `44321`, `44322` and `44324`; keep those ports available and do not place `TMPDIR` inside this repository. See the [testing guide](tests/README.md).

Husky installs a pre-commit hook in standalone checkouts. It runs `lint-staged`, typechecks and unit/build tests. Installation is skipped in linked Git worktrees to avoid changing shared Git configuration; run these checks manually there.

## Contributing and licensing

See [CONTRIBUTING.md](CONTRIBUTING.md) for the pull-request workflow, automated checks and repository-owner setup. GitHub Actions configuration is included; remote branch protection must be enabled separately. Dependabot proposes weekly updates without automatic merging.

Original application code is available under the [MIT License](LICENSE). Portfolio content, branding, photographs, project media, fonts and third-party assets are excluded from that grant; see [licensing and reuse](LICENSING.md). Required runtime/icon notices ship in `public/THIRD-PARTY-NOTICES.txt`.

## Build configuration and publishing

| Variable            | Behavior                                                                                                                                 |
| ------------------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| `PRODUCTION_ORIGIN` | Explicit HTTPS origin for absolute canonical/hreflang metadata and sitemap URLs. Paths, credentials, queries and fragments are rejected. |
| `RELEASE_BUILD=1`   | Fail the build when `PRODUCTION_ORIGIN` is missing.                                                                                      |

Without an origin, local builds omit absolute metadata and warn rather than guessing a domain. Setting these variables does not configure hosting or enable search indexing.

Public noindex previews use Cloudflare Workers Static Assets; see [preview setup and recovery](DEPLOYMENT.md). `pnpm cloudflare:check` builds and validates without uploading, while `pnpm cloudflare:dev` runs the local hosting simulator. **`pnpm cloudflare:preview` publishes remotely** and requires Cloudflare authentication. No SSR adapter or application backend is used.

Asset permissions and public previews are owner-approved; production cutover is not. Keep noindex and the production domain disconnected until legal/hosting and origin review, final source/output checks, and hosted/device acceptance—including HLS playback and iPhone/iPad Safari—are complete.

Astro copies files from `public/` regardless of Git ignore rules. Inspect build output before publishing; generated fonts and their OFL notices belong in the output, but local video binaries and private assets do not. The build audit rejects missing referenced assets and prohibited proprietary fonts. A large JavaScript chunk warning also remains to be reviewed.
