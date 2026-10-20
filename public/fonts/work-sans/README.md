# Work Sans — Fontsource

Installed source: **`@fontsource-variable/work-sans@5.3.0`**, pinned in `package.json` and `pnpm-lock.yaml`.

Normal and true italic variable faces cover weights 100–900. Latin and Latin-ext cover English/German, including ẞ. Only those four subsets are copied; other package fonts are not shipped. Files are unmodified Fontsource bytes, renamed locally for stable same-origin URLs. CSS unicode ranges match the package. No font-service requests or font downloads occur at runtime/build time.

Reproduce or verify all public fonts from the installed packages:

```sh
pnpm fonts:generate
pnpm fonts:check
```

`scripts/fonts.mjs` maps `files/work-sans-{latin,latin-ext}-wght-{normal,italic}.woff2` to the corresponding `WorkSans[-Italic]-{latin,latin-ext}.woff2` assets. It also copies the package license verbatim. Generated assets are versioned; regeneration only writes changed bytes.

Copyright 2019 The Work Sans Project Authors. Full notices and **SIL OFL 1.1** are in `OFL.txt`. Preserve that license/copyright when distributing; do not sell fonts alone, relicense them or imply endorsement. The website's code license does not replace OFL. No Reserved Font Names are specified in this package notice.

Sources: <https://fontsource.org/fonts/work-sans>, <https://www.npmjs.com/package/@fontsource-variable/work-sans>, <https://github.com/weiweihuanghuang/Work-Sans>.
