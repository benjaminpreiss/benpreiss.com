# Onest logo subset — Fontsource

Installed source: **`@fontsource/onest@5.3.1`**, pinned in `package.json` and `pnpm-lock.yaml`.
Input: `files/onest-latin-700-normal.woff2` (normal style, weight 700).

`pnpm fonts:generate` uses pinned `subset-font@2.9.0` to produce `benpreiss-700.woff2` with only the seven distinct letters **b e i n p r s** used in **benpreiss**. The output is **1,228 bytes**, SHA-256 `08ecac2d3658c6f1dc635b63e5ba3a1b997d323a30b3a2e6351e5110b6f25130`. It retains copyright/license metadata and is a modified subset of Onest, not an upstream original. The package's complete normal/Latin font is not served.

The CSS family `Onest Logo` is applied only to the navigation brand with weight 700. `unicode-range` restricts selection to those letters as well; the binary itself is physically subset, not merely hidden behind a CSS range. Other text continues using Work Sans. If the authored brand changes, regenerate a suitable subset and update the CSS range/tests; unsupported characters otherwise use the declared fallback.

`pnpm fonts:check` verifies reproducibility without writing files. Unit tests inspect the subset's actual cmap and require precisely those seven characters. Browser tests verify the local subset loads at weight 700, unsupported characters are outside its range, and no full Onest font is requested.

Copyright 2021 The Onest Project Authors. Distributed under **SIL OFL 1.1**; the complete package notice/license is in `OFL.txt`. Subsetting/redistribution are permitted subject to OFL conditions. No Reserved Font Names are specified in the supplied notice. Preserve the notices/license, do not sell fonts alone or relicense them, and do not imply author endorsement.

Sources: <https://fontsource.org/fonts/onest>, <https://www.npmjs.com/package/@fontsource/onest>, <https://github.com/simpals/onest>.
