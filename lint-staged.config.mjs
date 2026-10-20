const quote = (file) => JSON.stringify(file);
export default {
  "*": (files) => {
    const owned = files.filter(
      (file) => !file.includes("/public/") && !file.endsWith("/pnpm-lock.yaml"),
    );
    const formatted = owned.filter((file) =>
      /\.(?:astro|svelte|mdoc|[cm]?js|ts|json|css|md|yaml)$/.test(file),
    );
    const linted = owned.filter((file) => /\.(?:astro|svelte|[cm]?js|ts)$/.test(file));
    return [
      ...(formatted.length
        ? [`node scripts/format.ts --write ${formatted.map(quote).join(" ")}`]
        : []),
      ...(linted.length ? [`oxlint --deny-warnings ${linted.map(quote).join(" ")}`] : []),
    ];
  },
};
