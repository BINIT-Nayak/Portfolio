const assert = require("node:assert/strict");
const fs = require("node:fs");
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || "playwright");
const base = process.env.AUDIT_URL || "http://127.0.0.1:4188";

(async () => {
  const browser = await chromium.launch({
    headless: true,
    ...(process.env.CHROME_PATH ? { executablePath: process.env.CHROME_PATH } : {}),
  });
  const failures = [];
  const links = new Set();
  const external = new Set();
  const results = [];
  try {
    const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
    page.on("pageerror", (error) => failures.push(error.message));
    page.on("console", (message) => {
      if (message.type() === "error") failures.push(message.text());
    });
    page.on("response", (response) => {
      if (response.status() >= 400 && response.url().startsWith(base))
        failures.push(`${response.status()} ${response.url()}`);
    });
    const sitemap = await (await page.request.get(base + "/sitemap.xml")).text();
    const routes = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map(
      ([, url]) => new URL(url).pathname
    );
    for (const route of routes) {
      const response = await page.goto(base + route);
      assert.equal(response.status(), 200, route);
      await page.waitForLoadState("networkidle");
      assert.equal(await page.locator("main").count(), 1, `${route}: main landmark`);
      assert.equal(await page.locator("h1").count(), 1, `${route}: h1`);
      const images = await page.evaluate(async () => {
        const images = [...document.images];
        await Promise.all(
          images.map(async (image) => {
            image.loading = "eager";
            try {
              await image.decode();
            } catch {
              /* Return the failed URL below. */
            }
          })
        );
        return images.filter((image) => !image.naturalWidth).map((image) => image.src);
      });
      assert.deepEqual(images, [], `${route}: broken images`);
      const anchors = await page
        .locator("a[href]")
        .evaluateAll((nodes) => nodes.map((node) => node.href));
      for (const href of anchors) {
        const url = new URL(href);
        if (url.origin === base) links.add(url.pathname + url.search + url.hash);
        else if (url.protocol === "https:") external.add(href);
      }
      if (process.env.AXE_SCRIPT) {
        await page.addScriptTag({ path: process.env.AXE_SCRIPT });
        const violations = await page.evaluate(async () =>
          (
            await axe.run(document, {
              runOnly: { type: "tag", values: ["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"] },
            })
          ).violations.map(({ id, nodes }) => ({ id, targets: nodes.map((node) => node.target) }))
        );
        assert.deepEqual(violations, [], `${route}: accessibility`);
      }
      results.push({ route, images: "pass", runtime: "pass" });
    }
    // Resolve every rendered internal link, including its fragment on the destination page.
    const documents = new Map();
    for (const link of links) {
      const url = new URL(link, base);
      if (!documents.has(url.pathname)) {
        const response = await page.request.get(base + url.pathname);
        assert.equal(response.status(), 200, link);
        documents.set(url.pathname, await response.text());
      }
      if (url.hash) {
        const found = await page.evaluate(
          ({ html, hash }) =>
            Boolean(
              new DOMParser()
                .parseFromString(html, "text/html")
                .getElementById(decodeURIComponent(hash.slice(1)))
            ),
          { html: documents.get(url.pathname), hash: url.hash }
        );
        assert.ok(found, `Missing fragment: ${link}`);
      }
    }
    for (const width of [320, 375, 390, 430, 768]) {
      await page.setViewportSize({ width, height: 900 });
      for (const route of routes) {
        await page.goto(base + route);
        // Wait for layout, not speculative route-prefetch traffic to become idle.
        await page.evaluate(() =>
          document.fonts.ready.then(
            () =>
              new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)))
          )
        );
        assert.ok(
          await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth),
          `${width}px overflow: ${route}`
        );
      }
    }
    // Exercise real navigation, history and completed animation cleanup.
    await page.setViewportSize({ width: 1440, height: 1000 });
    await page.goto(base + "/");
    await page
      .locator("header")
      .getByRole("link", { name: "Featured Projects", exact: true })
      .click();
    await page.waitForURL(base + "/projects");
    await page.goBack();
    await page.waitForURL(base + "/");
    await page.goForward();
    await page.waitForURL(base + "/projects");
    await page.waitForTimeout(400);
    assert.equal(
      await page.locator("main:not([aria-hidden])").count(),
      1,
      "Transition snapshot cleaned up"
    );
    assert.deepEqual(failures, [], "Browser console, page, and resource errors");
    // Expected 404 is checked separately so it does not pollute resource-error collection.
    const missing = await page.request.get(base + "/not-a-portfolio-page");
    assert.equal(missing.status(), 404);
    assert.match(await missing.text(), /That page isn/);
    fs.writeFileSync(
      "/tmp/portfolio-production-report.json",
      JSON.stringify({ results, links: links.size, external: [...external], failures }, null, 2)
    );
    console.log(
      `PASS: ${routes.length} routes, ${links.size} internal links, all images, console, accessibility, five-width reflow, history, and 404 recovery`
    );
  } finally {
    await browser.close();
  }
})().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
