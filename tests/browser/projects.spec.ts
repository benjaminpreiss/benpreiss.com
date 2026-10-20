import { test, expect } from "./support";

let clip: Buffer;
test.beforeAll(async ({ browser }) => {
  const page = await browser.newPage();
  await page.goto("http://127.0.0.1:44321/");
  const bytes = await page.evaluate(async () => {
    const canvas = document.createElement("canvas");
    canvas.width = 160;
    canvas.height = 90;
    const context = canvas.getContext("2d")!;
    const stream = canvas.captureStream(10);
    const recorder = new MediaRecorder(stream, { mimeType: "video/webm;codecs=vp8" });
    const chunks: Blob[] = [];
    recorder.ondataavailable = (event) => chunks.push(event.data);
    const done = new Promise<number[]>((resolve) => {
      recorder.onstop = async () =>
        resolve([...new Uint8Array(await new Blob(chunks).arrayBuffer())]);
    });
    recorder.start();
    let frame = 0;
    const interval = setInterval(() => {
      context.fillStyle = frame++ % 2 ? "#869B86" : "#E6EAEE";
      context.fillRect(0, 0, 160, 90);
    }, 100);
    await new Promise((resolve) => setTimeout(resolve, 700));
    recorder.stop();
    clearInterval(interval);
    stream.getTracks().forEach((track) => track.stop());
    return done;
  });
  clip = Buffer.from(bytes);
  await page.close();
});

for (const route of ["/", "/hello"]) {
  test(`project content, poster and badges render without JavaScript: ${route}`, async ({
    browser,
  }) => {
    const context = await browser.newContext({
      javaScriptEnabled: false,
      viewport: { width: 390, height: 844 },
    });
    const page = await context.newPage();
    await page.goto(route);
    const project = page.locator("#work article");
    await expect(project.locator("h2")).toBeVisible();
    await expect(project.locator("p:not([role='status'])")).toHaveCount(2);
    await expect(project.locator('a[aria-label="figma"]')).toHaveAttribute(
      "href",
      "https://www.figma.com/",
    );
    await expect(project.locator("[data-project-color]")).toHaveCSS(
      "background-color",
      "rgb(134, 155, 134)",
    );
    await expect(project.locator('[data-device="mobile"] video')).toHaveAttribute(
      "poster",
      "/posters/coordinet-mobile.jpg",
    );
    await expect(project.locator("video source")).toHaveCount(0);
    await expect(project.locator('[data-device="desktop"]')).toBeHidden();
    await context.close();
  });
}

test("visible playback, offscreen pause, manual pause, responsive loading and teardown", async ({
  page,
}) => {
  const mediaRequests: string[] = [];
  await page.route(/\.(webm|mp4)$/, (route) => {
    mediaRequests.push(route.request().url());
    return route.fulfill({ contentType: "video/webm", body: clip });
  });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/hello");
  expect(mediaRequests).toEqual([]);
  await expect(page.locator("video-player")).toHaveCount(0);
  const mobile = page.locator('[data-device="mobile"] video');
  await page.locator('[data-device="mobile"]').scrollIntoViewIfNeeded();
  await expect.poll(() => mobile.evaluate((v: HTMLVideoElement) => !v.paused)).toBe(true);
  expect(mediaRequests.every((url) => url.includes("-mobile."))).toBe(true);
  await expect(page.locator("video-player")).toHaveCount(1);
  expect(
    await mobile.evaluate((video) => {
      const player = video.closest("video-player")!;
      return player.matches(":defined") && "store" in player;
    }),
  ).toBe(true);
  await page.evaluate(() => scrollTo(0, 0));
  await expect.poll(() => mobile.evaluate((v: HTMLVideoElement) => v.paused)).toBe(true);
  await mobile.scrollIntoViewIfNeeded();
  await expect.poll(() => mobile.evaluate((v: HTMLVideoElement) => !v.paused)).toBe(true);
  await page
    .getByRole("button", { name: "Pause video: Fixture project — mobile", exact: true })
    .click();
  await page.evaluate(() => scrollTo(0, 0));
  await mobile.scrollIntoViewIfNeeded();
  await expect.poll(() => mobile.evaluate((v: HTMLVideoElement) => v.paused)).toBe(true);
  await page.setViewportSize({ width: 768, height: 1000 });
  await expect(page.locator('[data-device="desktop"]')).toBeHidden();
  expect(mediaRequests.some((url) => url.includes("-desktop."))).toBe(false);
  await page.setViewportSize({ width: 1440, height: 1000 });
  const desktop = page.locator('[data-device="desktop"] video');
  await page.locator('[data-device="desktop"]').scrollIntoViewIfNeeded();
  await expect.poll(() => desktop.evaluate((v: HTMLVideoElement) => !v.paused)).toBe(true);
  expect(mediaRequests.some((url) => url.includes("-desktop."))).toBe(true);
  await page.setViewportSize({ width: 390, height: 844 });
  await expect(desktop.locator("source")).toHaveCount(0);
  await expect(page.locator("video-player")).toHaveCount(1);
  await expect.poll(() => desktop.evaluate((v: HTMLVideoElement) => v.paused)).toBe(true);
  await page.goto("/long");
  await expect(page.locator("video-player")).toHaveCount(0);
});

test("reduced motion shows a still, starts only manually and responds to preference changes", async ({
  page,
}) => {
  const requests: string[] = [];
  await page.route(/\.(webm|mp4)$/, (route) => {
    requests.push(route.request().url());
    return route.fulfill({ contentType: "video/webm", body: clip });
  });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/hello");
  const video = page.locator('[data-device="mobile"] video');
  await video.scrollIntoViewIfNeeded();
  await expect(
    page.getByRole("button", { name: "Play video: Fixture project — mobile", exact: true }),
  ).toBeVisible();
  expect(requests).toEqual([]);
  await expect(video).toHaveAttribute("poster", /\.jpg$/);
  await page
    .getByRole("button", { name: "Play video: Fixture project — mobile", exact: true })
    .click();
  await expect.poll(() => video.evaluate((v: HTMLVideoElement) => !v.paused)).toBe(true);
  await page.evaluate(() => {
    matchMedia("(prefers-reduced-motion: reduce)").addEventListener("change", (event) => {
      document.documentElement.dataset.observedMotion = String(event.matches);
    });
  });
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await expect(page.locator("html")).toHaveAttribute("data-observed-motion", "false");
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(page.locator("html")).toHaveAttribute("data-observed-motion", "true");
  await expect.poll(() => video.evaluate((v: HTMLVideoElement) => v.paused)).toBe(true);
});

test("blocked autoplay offers manual playback; missing media reports an honest error", async ({
  page,
}) => {
  await page.addInitScript(() => {
    HTMLMediaElement.prototype.play = () =>
      Promise.reject(new DOMException("Fixture autoplay denial", "NotAllowedError"));
  });
  await page.route(/\.(webm|mp4)$/, (route) =>
    route.fulfill({ contentType: "video/webm", body: clip }),
  );
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/hello");
  await page.locator('[data-device="mobile"]').scrollIntoViewIfNeeded();
  await expect(page.getByRole("status").filter({ hasText: "Autoplay unavailable" })).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Play video: Fixture project — mobile", exact: true }),
  ).toBeVisible();
  await page.unroute(/\.(webm|mp4)$/);
  await page.route(/\.(webm|mp4)$/, (route) => route.fulfill({ status: 404 }));
  await page.reload();
  await page.locator('[data-device="mobile"]').scrollIntoViewIfNeeded();
  await expect(page.getByRole("status").filter({ hasText: "Video unavailable" })).toBeVisible();
});
