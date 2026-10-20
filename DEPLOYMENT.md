# Cloudflare preview setup

`benpreiss.com` is an assets-only Cloudflare Worker. The technical Worker identifier
is `benpreiss-com` because Worker names cannot contain dots. Astro generates
`dist/`; no SSR adapter, Worker application code, database or mail service is used.

## Local checks

```sh
pnpm cloudflare:check  # Build and Wrangler dry-run; does not upload or deploy.
pnpm cloudflare:dev    # Build and serve locally at http://127.0.0.1:44325.
```

Wrangler is pinned to 4.151.2. Its native `workerd` dependency is explicitly allowed
to run its installation script. `tests/cloudflare.test.ts` uses an isolated build
and ephemeral loopback port to check the actual local asset server: slashless
routes, query-preserving redirects, noindex headers, real 404s, font/license
availability and free-plan file limits. Local checks do not replace hosted checks.

## Before connecting GitHub

Merge the hosting configuration through a PR with passing **Quality checks**.
The repository root must contain `wrangler.json` before Cloudflare imports it;
otherwise Cloudflare may propose automatic framework/SSR configuration instead.

Connect `benjaminpreiss/benpreiss.com` through the Cloudflare Workers & Pages
GitHub App. Limit newly granted repository access to this repository; preserve
existing selected access used by other projects. GitHub Environments and GitHub
repository secrets are not required for this workflow.

## Dashboard settings

Use **Workers & Pages → Create application → GitHub**, select the repository,
and set the Worker name to **benpreiss-com**. For an existing Worker, use
**Settings → Builds → Connect**. Do not attach a custom domain or change DNS.

| Setting                                | Value                                                                                  |
| -------------------------------------- | -------------------------------------------------------------------------------------- |
| Repository                             | `benjaminpreiss/benpreiss.com`                                                         |
| Worker name                            | `benpreiss-com`                                                                        |
| Root directory                         | Repository root (`/`), not the local scratch/worktree path                             |
| Production branch                      | `main`                                                                                 |
| Build command                          | `pnpm install --frozen-lockfile --strict-peer-dependencies --prod=false && pnpm build` |
| Deploy command, **preview phase only** | `pnpm exec wrangler preview --name staging --tag "$WORKERS_CI_COMMIT_SHA"`             |
| Preview command                        | `pnpm exec wrangler preview --tag "$WORKERS_CI_COMMIT_SHA"`                            |
| Enable Preview Builds                  | Enabled                                                                                |

The dashboard calls `main` the production branch, but the deploy command above
publishes only the named **staging Preview**, not an active production deployment.
Other branches get native branch Previews. `previews: {}` in `wrangler.json` is
intentional: there are no runtime secrets or storage bindings to copy. Preview
assets and routing come from the top-level `assets` settings.

Set these under **Settings → Build → Build Variables and Secrets** (build-time,
not Worker runtime variables), for both main and branch builds:

| Variable                   | Value                                              |
| -------------------------- | -------------------------------------------------- |
| `NODE_VERSION`             | `24.20.0` (also recorded in `.node-version`)       |
| `PNPM_VERSION`             | `10.8.0`                                           |
| `SKIP_DEPENDENCY_INSTALL`  | `1` (the explicit build command owns installation) |
| `HUSKY`                    | `0`                                                |
| `ASTRO_TELEMETRY_DISABLED` | `1`                                                |
| `WRANGLER_SEND_METRICS`    | `false`                                            |

Leave `PRODUCTION_ORIGIN` and `RELEASE_BUILD` unset during this preview phase.
Absolute canonical/hreflang/sitemap URLs are deliberately omitted rather than
using a preview hostname as the site's canonical origin.

Cloudflare authenticates deployments using a build API token. Keep that token
inside Cloudflare; do not paste it into chat, source files or GitHub secrets.
Review its permissions before authorizing: Cloudflare's automatically generated
token can include broader KV/R2/zone permissions than this static site needs.
Use a token limited to the intended account and the deployment permissions it
actually requires; no custom-domain/DNS access is needed for this preview setup.

**Save and Deploy publishes a public Preview.** Review the commands and settings
above before clicking it. Worker Previews currently require Wrangler >=4.135.0
and are labelled open beta by the CLI.

## Enable the Preview hostname

In the Cloudflare dashboard, open **Workers & Pages → benpreiss-com → Domains**.
Under **Worker URL**, enable **Preview**. Production and Preview URLs are separate;
leave production/custom-domain routing unchanged.

`preview_urls: true` in `wrangler.json` records the intended setting, but a
`wrangler preview` upload alone does not apply the Worker-level hostname setting.
For initial preview-only setup, enable it in the dashboard rather than running
`wrangler deploy`, which would also publish an active production version. If a
successful upload reports **no active URLs**, check this toggle first, then open
or retry the staging Preview.

See [Cloudflare's Preview URL settings](https://developers.cloudflare.com/workers/previews/custom-domains/#enable-workersdev-preview-urls).

## Verify the first deployment

Record the build's Git commit SHA, mutable Preview URL and immutable Deployment
URL from Cloudflare's build output. The deployment tag is the commit SHA.
Share the immutable URL for verification of an exact deployment.

Check at least:

- `/`, `/en`, `/privacy` and `/en/privacy` return 200 and the correct locale.
- `/en/`, `/privacy/`, `/en/privacy/` redirect to slashless paths and retain queries.
- Unknown paths return the bilingual 404 with HTTP 404, not the homepage with 200.
- `/%ZZ` normalizes to `/%25ZZ`, then returns 404 locally; confirm hosted behavior.
- Pages and assets carry `X-Robots-Tag: noindex`; HTML also retains its noindex meta.
- Navigation/translation anchors, booking fragment, images, fonts, license notices
  and remote HLS references remain correct. Check keyboard/mobile interactions.
- No production domain is attached and no canonical points at the Preview URL.

`public/_headers` currently applies noindex to all assets. Cloudflare also adds
noindex to native `workers.dev` Previews. **Noindex is not access control**: anyone
with the URL can view or download this public output.

## Recovery rehearsal

Keep the immutable URL and commit SHA of a verified preview. Visiting an old
immutable URL is not the same as rolling back the mutable staging URL.

To restore staging, use a separate clean checkout at the known-good commit that
contains this hosting configuration, install with the frozen lockfile, build and
publish that exact source to the same named Preview:

```sh
pnpm install --frozen-lockfile --strict-peer-dependencies
pnpm cloudflare:preview --name staging --tag "$(git rev-parse HEAD)"
```

This command **publishes remotely** and requires Cloudflare authentication. Do
not run it as a local check. Record the new deployment URL and recheck routes,
noindex, font/notices and project media. Do not reset shared branches or use
`wrangler rollback` for this rehearsal: that command targets active production
Worker versions, not this branch Preview workflow.

Rehearsal remains pending until performed against the actual preview. Native
Previews retain 100 deployments each; the oldest is removed at the limit, so do
not treat immutable URLs as permanent backups.

## Production is a separate decision

After hosted/device acceptance and owner-approved legal disclosures/origin,
cutover can change the main deploy command to `pnpm exec wrangler deploy`, attach
the approved domain and deliberately revise indexing rules. Do not make those
changes while setting up previews.

Cloudflare builds independently of GitHub Actions and does not wait for its
checks. Protected merges and restricted bypasses are the production gate; the
mere presence of a green GitHub workflow is not a deployment lock.

## Provider references

Checked 2026-10-20:

- [Static Assets](https://developers.cloudflare.com/workers/static-assets/)
- [Worker Previews](https://developers.cloudflare.com/workers/previews/) and
  [configuration](https://developers.cloudflare.com/workers/previews/configuration/)
- [Build settings](https://developers.cloudflare.com/workers/ci-cd/builds/configuration/)
  and [build image/tool versions](https://developers.cloudflare.com/workers/ci-cd/builds/build-image/)
- [GitHub integration](https://developers.cloudflare.com/workers/ci-cd/builds/git-integration/github-integration/)
- [HTML handling](https://developers.cloudflare.com/workers/static-assets/routing/advanced/html-handling/)
- [Limits](https://developers.cloudflare.com/workers/platform/limits/#static-assets):
  20,000 files on Workers Free, 25 MiB per file. Static asset requests are
  [free and unlimited](https://developers.cloudflare.com/workers/static-assets/billing-and-limitations/).
