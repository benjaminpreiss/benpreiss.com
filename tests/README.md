# Test the renderer, not the portfolio copy

## Agreed boundaries

- **Introduction rendering:** short/long prose, semantic emphasis and links, paragraph spacing, mobile stacking, desktop side-by-side layout, undistorted images and no horizontal overflow.
- **Navigation:** fixed positioning/scroll shadow, keyboard/focus behavior, responsive menu, real links and explicit translation relationships, including no-JavaScript operation.
- **Projects/media:** nested prose, badges, palette-token rendering, still posters without JavaScript, lazy device-specific sources, visible/offscreen playback, user pause, responsive changes, reduced motion, autoplay denial and failed requests.
- **Contact/privacy/footer:** disabled submission, honest clipboard feedback, canonical footer content, no-JS privacy/translation navigation, and a real bilingual 404.
- **Content contracts:** valid metadata and Markdoc succeed; malformed metadata, collisions, unknown tags and invalid project attributes fail with useful errors.

These tests use the real application renderer and styles. Browser assertions are grouped by introduction, navigation and projects rather than taking a snapshot of the entire portfolio. No component markup is duplicated in the test harness.

## Controlled inputs

`fixtures/content/pages/` contains synthetic Markdoc documents:

| Route           | Fixture                                                       |
| --------------- | ------------------------------------------------------------- |
| `/`             | Short German prose                                            |
| `/hello`        | Short English prose with strong/emphasis, hard break and link |
| `/long`         | Longer German prose                                           |
| `/long-english` | Longer English prose                                          |
| `/privacy`      | Short German legal-layout fixture                             |
| `/en/privacy`   | Short English legal-layout fixture                            |

English homepage/introduction URLs deliberately have no `/en` prefix; privacy fixtures use the preserved route pair. Literal wording assertions apply **only to these fixtures**, to verify how Markdoc renders supplied input. They never refer to `content/pages/` or constrain editable portfolio prose, names, paragraph counts or social URLs.

`support/site.ts` copies current application source/config/styles into a unique `portfolio-rendering-*` workspace in the OS temporary directory (outside the dev server's watched project) and supplies only the fixture documents as its content collection. The browser harness also copies local public assets, excluding videos, so typography and images exercise the real presentation. It builds and serves that isolated site, then removes it on shutdown. It never replaces the real content directory or writes into normal `dist/`. Both Astro and Vite caches are isolated so parallel builds cannot race through the shared dependency symlink. Formatter and staging fixtures also use the OS temporary directory. Do not set `TMPDIR` inside the application tree: adding/removing nested Astro/TypeScript configs triggers dev restarts even in a Git-ignored directory. `dev-isolation.test.ts` starts a disposable dev server on port 44324 and verifies fixture creation, building and cleanup cause no configuration restarts or closed-module-runner errors, and that the page still returns 200. It never starts/stops the owner's dev server.

**Real-content route check:** `routes.test.ts` requests `productionContent: true` in its own temporary site, builds with bundled OFL fonts and without local videos, and serves it on port 44322 with `--ignore-lock` (foreground, no agent auto-backgrounding). It verifies actual route statuses, metadata/origin behavior, sitemap/robots, legal section layout and key anchor IDs. Footer operator/address identifiers are also checked for migration loss. At the owner\'s request, the legacy privacy JSON snapshot and exact-copy comparison have been removed. The localized Markdoc documents are the sole privacy-content source; tests do not freeze their prose. Layout/link verification is not legal approval.

Fixture routes are not imported by the application and cannot appear in an ordinary `pnpm build`. No test-only environment switch is added to production routing.

## Run

```sh
pnpm test
pnpm test:browser
# Or use the owner's disposable Chromium:
CDP_ENDPOINT=http://127.0.0.1:9222 pnpm test:browser
```

The fixture helper creates four non-playable MP4/WebM placeholders in its OS temporary `public/` directory so the strict missing-asset audit can validate file-source links. Production-content fixtures never receive those placeholders, and `routes.test.ts` checks that their output has no video files. `build-audit.test.ts` verifies that missing video references fail rather than being deferred.

Project playback tests generate a small synthetic WebM with browser `MediaRecorder` and intercept media requests. The asset-existence placeholders are not playback evidence. No ignored local videos are required, and no recorded portfolio video is embedded in the tests. Actual local playback/MP4 fallback observations remain historical ticket-04 evidence; HLS-specific regression coverage and real hosted/device acceptance remain separate ticket-08/11 work.

CDP runs use one worker: multiple Playwright CDP connections to the same Chromium can overwrite each other's media emulation. Locally launched browsers may run concurrently. Preference-change tests wait for the browser's `matchMedia` event before applying the next preference.

The browser command builds its own fixture site; no prior normal build is needed. It owns a loopback preview on port 44321, not the user's browser. Existing Node/pnpm and sandbox configuration guidance in the main README still applies.

## What changes should require test updates?

- Editing ordinary live portfolio copy, names, links or paragraph count: **no test update**.
- Approving updated legal prose: no duplicate snapshot needs updating. If legal section IDs/layout or footer identity change, deliberately update those contract assertions.
- Changing colors, spacing values or type sizes while retaining usable layout: normally **no test update**.
- Changing an intentional design contract, such as switching desktop introduction from side-by-side to stacked: update the relevant layout assertion deliberately.
- Adding a rendering component: add controlled input in `fixtures/` and a component-scoped browser test; do not assert its live content.

Browser tests save introduction, contact and privacy screenshots under ignored `test-results/` for optional review. These are **not golden snapshots** and do not claim automated color/pixel parity. Layout/typography assertions catch the tested structural design regressions; palette changes require visual review. Historical ticket 03 screenshots remain migration evidence, not permanent expectations for future content.

Keep `pnpm build` as a separate real-content integration check: editable prose is free to change, but invalid Markdoc or metadata must still fail the site build.
