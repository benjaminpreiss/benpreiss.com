# Contributing

Use the pinned Node and pnpm versions and the setup instructions in
[README.md](README.md). Follow the [content guide](content/README.md) for editorial
changes and the [testing guide](tests/README.md) for renderer changes.

Before proposing a change, run:

```sh
pnpm lint
pnpm format:check
pnpm typecheck
pnpm fonts:check
pnpm test
pnpm build
pnpm test:browser
```

Install Chromium first as described in the README. Installation generates fonts;
do not add generated fonts, local recordings, environment files, build output or
private planning material to Git. Preserve the licenses in `licenses/`.

## Automated validation

`.github/workflows/validate.yaml` defines the **Quality checks** job for pull
requests and pushes, including the default branch. It installs from the frozen
lockfile and runs the checks above with Chromium. No production credentials or
origin are needed for validation; CI builds remain noindex and are not deployed.

Actions are pinned to commit SHAs. Workflow permissions are read-only, checkout
credentials are not persisted, concurrency cancels superseded runs, and runtime
is bounded. No build outputs, screenshots or logs are uploaded as artifacts.
Avoid adding secrets to test fixtures or diagnostics.

Dependabot proposes weekly dependency and Action updates. npm minor/patch
updates are grouped; major package upgrades remain separate. Review generated
font changes when updating Fontsource or subsetting dependencies. Review licenses
after dependency or icon changes and update `public/THIRD-PARTY-NOTICES.txt`; the build audit checks
presence, not completeness. No automatic merging is configured.

## Repository-owner setup

The workflow files alone do not protect a branch. After the GitHub repository
identity and publication have been approved:

1. Confirm the intended default/production branch and run validation on GitHub.
2. Add a branch ruleset requiring pull requests and the **Quality checks** status
   check from GitHub Actions. Use the exact check offered after its first run.
3. Require the branch to be up to date, resolve review conversations and obtain
   an approving review. Block force pushes and deletions, and restrict direct
   pushes and bypass access, including administrators where supported.
4. Require approval for workflows from outside contributors; do not expose
   deployment secrets to pull-request jobs. Enable secret scanning and push
   protection where available.
5. Keep production builds on the protected branch. A future Cloudflare build is
   independent of GitHub Actions and must rely on protected merges; green CI
   alone does not establish a deployment gate.

These settings are a checklist, not a claim that remote protection exists.
Do not push or publish before repository/history, asset licensing and secrets
review. Preserve Git history; history rewriting requires a separate decision.
See [licensing and exclusions](LICENSING.md).
