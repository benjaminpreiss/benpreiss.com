import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync, writeFileSync, rmSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { spawn } from "node:child_process";
import { once } from "node:events";
import { createFixtureSite } from "./support/site.ts";
import { productionOrigin } from "../src/lib/seo.ts";
import { auditBuild } from "../scripts/audit-build.ts";

test("canonical origin is explicit and cannot contain a path or credentials", () => {
  assert.equal(productionOrigin(undefined), undefined);
  assert.equal(productionOrigin("https://portfolio.example/"), "https://portfolio.example");
  for (const value of [
    "http://example.org",
    "https://u:p@example.org",
    "https://example.org/path",
    "https://example.org/?preview=1",
    "https://example.org/#x",
  ])
    assert.throws(() => productionOrigin(value));
});

test(
  "production content renders the privacy layout and four-route static contract",
  { timeout: 120000 },
  async () => {
    const site = createFixtureSite({ productionContent: true });
    let server: ReturnType<typeof spawn> | undefined;
    async function stop() {
      if (!server || server.exitCode !== null || server.signalCode !== null) {
        server = undefined;
        return;
      }
      const child = server;
      const exited = once(child, "exit");
      child.kill("SIGTERM");
      const timer = setTimeout(() => child.kill("SIGKILL"), 2000);
      try {
        await exited;
      } finally {
        clearTimeout(timer);
        server = undefined;
      }
    }
    try {
      let result = site.build({ PRODUCTION_ORIGIN: "https://portfolio.example" });
      assert.equal(result.status, 0, result.stdout + result.stderr);
      assert.deepEqual(
        readdirSync(join(site.dir, "dist"), { recursive: true }).filter((file) =>
          /\.(?:mp4|webm|mov|m4v)$/i.test(String(file)),
        ),
        [],
        "Production content builds without local or synthetic video files",
      );
      const routes = ["/", "/en", "/privacy", "/en/privacy"];
      for (const route of routes) {
        const html = readFileSync(
          join(site.dir, "dist", route === "/" ? "index.html" : route.slice(1) + "/index.html"),
          "utf8",
        );
        const locale = route.startsWith("/en") ? "en" : "de";
        const other = route.includes("privacy")
          ? locale === "de"
            ? "/en/privacy"
            : "/privacy"
          : locale === "de"
            ? "/en"
            : "/";
        assert.match(html, new RegExp(`lang="${locale}"`));
        assert.ok(html.includes(`rel="canonical" href="https://portfolio.example${route}"`));
        assert.ok(html.includes(`href="https://portfolio.example${other}"`));
        assert.match(html, /name="description" content="[^"]+"/);
        assert.match(html, /name="robots" content="noindex, nofollow"/);
        assert.match(html, /<footer\b/);
        for (const literal of [
          "Benjamin Preiss",
          "DE328197327",
          "Strandweg 98a",
          "hello@benpreiss.com",
        ])
          assert.ok(html.includes(literal));
        assert.doesNotMatch(html, /(?:benjamin|info)@benpreiss\.com|705[\s-]*97[\s-]*12|tel:/);
        if (route.includes("privacy")) {
          const article = html.match(
            /<article\b(?:"[^"]*"|'[^']*'|[^'">])*?>([\s\S]*?)<\/article>/,
          )![1]!;
          assert.equal([...article.matchAll(/<section\b/g)].length, 7);
          for (const id of [
            "dse_nutzerrechte",
            "dse_aenderungdse",
            "dse_dateneingaben",
            "dse_verantwortlicher",
            "dse_allgemein096",
          ])
            assert.ok(article.includes(`id="${id}"`), `Missing legal section ${id}`);
          const rightsSection = article.lastIndexOf(
            "<section",
            article.indexOf('id="dse_nutzerrechte"'),
          );
          const changesSection = article.lastIndexOf(
            "<section",
            article.indexOf('id="dse_aenderungdse"'),
          );
          const dataSection = article.lastIndexOf(
            "<section",
            article.indexOf('id="dse_dateneingaben"'),
          );
          assert.equal(rightsSection, changesSection, "Sections 7 and 8 share a layout section");
          assert.notEqual(dataSection, changesSection, "Section 9 has its own layout section");
          const authority = article.indexOf('id="dse_verantwortlicher"');
          const general = article.indexOf('id="dse_allgemein096"');
          assert.equal(
            article.lastIndexOf("<section", authority),
            article.lastIndexOf("<section", general),
            "Responsible authority and general information share one section",
          );
        }
      }
      const sitemap = readFileSync(join(site.dir, "dist/sitemap.xml"), "utf8");
      assert.equal([...sitemap.matchAll(/<loc>/g)].length, 4);
      assert.doesNotMatch(sitemap, /404|preview/);
      assert.match(
        readFileSync(join(site.dir, "dist/robots.txt"), "utf8"),
        /Sitemap: https:\/\/portfolio\.example\/sitemap.xml/,
      );

      server = spawn(
        process.execPath,
        [site.astro, "preview", "--ignore-lock", "--host", "127.0.0.1", "--port", "44322"],
        { cwd: site.dir, stdio: "ignore" },
      );
      const base = "http://127.0.0.1:44322";
      for (let attempt = 0; ; attempt++) {
        if (server.exitCode !== null) throw new Error("Preview exited before serving");
        try {
          if ((await fetch(base, { signal: AbortSignal.timeout(3000) })).ok) break;
        } catch {
          /* starting */
        }
        if (attempt >= 100) throw new Error("Preview failed to start");
        await new Promise((resolve) => setTimeout(resolve, 100));
      }
      for (const path of [
        "/",
        "/en",
        "/privacy",
        "/en/privacy",
        "/en/",
        "/privacy/",
        "/en/privacy/",
        "/%65n/privacy",
        "/en?campaign=%C3%A4",
        "/en/?campaign=%C3%A4",
      ]) {
        const response = await fetch(base + path, {
          signal: AbortSignal.timeout(3000),
          redirect: "manual",
          headers: { "Accept-Language": "fr,en" },
        });
        await response.arrayBuffer();
        assert.equal(response.status, 200, path);
        assert.equal(response.headers.get("location"), null, path);
        assert.equal(new URL(response.url).search, new URL(base + path).search);
      }
      for (const path of ["/missing", "/en/missing", "/%C3%BCber", "/en/privacy/missing"]) {
        const response = await fetch(base + path, { signal: AbortSignal.timeout(3000) });
        assert.equal(response.status, 404, path);
        const html = await response.text();
        assert.match(html, /Page not found/);
        assert.match(html, /Seite nicht gefunden/);
        assert.doesNotMatch(html, /rel="canonical"|<footer/);
      }
      await stop();

      // The build hook must see rendered prose links and static assets too.
      const htmlPath = join(site.dir, "dist/index.html");
      const html = readFileSync(htmlPath, "utf8");
      for (const broken of [
        '<a href="/missing">bad</a>',
        '<a href="/privacy#absent">bad</a>',
        '<img src="/missing.svg">',
        '<video src="/missing.webm"></video>',
        '<a href="/missing.mp4">missing recording</a>',
      ]) {
        writeFileSync(htmlPath, html + broken);
        assert.throws(
          () => auditBuild(join(site.dir, "dist"), "https://portfolio.example"),
          /Broken/,
        );
      }
      writeFileSync(htmlPath, html);
      result = site.build();
      assert.equal(result.status, 0, result.stdout + result.stderr);
      assert.doesNotMatch(
        readFileSync(htmlPath, "utf8").split("</head>")[0]!,
        /rel="canonical"|hreflang=/,
      );
      assert.doesNotMatch(readFileSync(join(site.dir, "dist/sitemap.xml"), "utf8"), /<loc>/);
      const privacyPath = join(site.dir, "content/pages/en/privacy.mdoc");
      const privacy = readFileSync(privacyPath, "utf8");
      writeFileSync(privacyPath, privacy + "\n[Broken link](/does-not-exist)\n");
      result = site.build();
      assert.notEqual(result.status, 0);
      assert.match(result.stdout + result.stderr, /Broken internal link or asset/);
      writeFileSync(privacyPath, privacy);
      result = site.build({ RELEASE_BUILD: "1" });
      assert.notEqual(result.status, 0);
      assert.match(result.stdout + result.stderr, /PRODUCTION_ORIGIN/);
      rmSync(join(site.dir, "content/pages/en/privacy.mdoc"));
      result = site.build();
      assert.notEqual(result.status, 0);
      assert.match(result.stdout + result.stderr, /missing en translation/);
    } finally {
      await stop();
      site.cleanup();
    }
  },
);
