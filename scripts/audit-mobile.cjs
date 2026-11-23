const { chromium } = require(process.env.PLAYWRIGHT_MODULE || "playwright");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const base = process.env.AUDIT_URL || "http://127.0.0.1:4188";
const output = process.env.MOBILE_SCREENSHOTS || "/tmp/portfolio-mobile";
const routes = [
  "/",
  "/projects",
  "/case-studies",
  "/case-studies/vibejournal-offline-sync",
  "/case-studies/cache-first-recommendation-api",
  "/case-studies/sneaky-recommendation-system",
  "/labs/comet",
];
(async () => {
  fs.mkdirSync(output, { recursive: true });
  const browser = await chromium.launch({
    headless: true,
    ...(process.env.CHROME_PATH ? { executablePath: process.env.CHROME_PATH } : {}),
  });
  const errors = [];
  try {
    for (const width of [320, 375, 390, 430, 768]) {
      const page = await browser.newPage({
        viewport: { width, height: 900 },
        hasTouch: true,
        isMobile: true,
        reducedMotion: "reduce",
      });
      page.on("pageerror", (e) => errors.push(e.message));
      const noOverflow = async (name) =>
        assert.equal(
          await page.evaluate(
            () => document.documentElement.scrollWidth <= window.visualViewport.width
          ),
          true,
          `${width}px: ${name}`
        );
      for (const route of routes) {
        await page.goto(base + route);
        await page.waitForTimeout(150);
        await noOverflow(route);
      }
      await page.goto(base + "/");
      assert.equal(
        await page.evaluate(() => document.documentElement.dataset.pointerEffects),
        undefined
      );
      const layers = page.locator("figure ol").first();
      assert.ok((await layers.evaluate((e) => e.scrollWidth > e.clientWidth)) || width === 768);
      await page.getByRole("button", { name: /^Backend/ }).tap();
      assert.equal(
        await page.getByRole("button", { name: /^Backend/ }).getAttribute("aria-pressed"),
        "true"
      );
      await page
        .locator("figure")
        .first()
        .screenshot({ path: `${output}/hero-system-${width}.png` });
      await page.locator("#experience").screenshot({ path: `${output}/experience-${width}.png` });
      await page
        .locator("#projects article")
        .first()
        .screenshot({ path: `${output}/sneaky-${width}.png` });
      const menu = page.getByRole("button", { name: "Open navigation menu", exact: true });
      await menu.tap();
      const dialog = page.locator("dialog[open]");
      await dialog.screenshot({ path: `${output}/navigation-${width}.png` });
      assert.ok(await dialog.evaluate((e) => e.scrollWidth <= e.clientWidth));
      await dialog.getByRole("link", { name: "Case Studies", exact: true }).tap();
      await page.waitForURL("**/case-studies");
      assert.equal(await page.evaluate(() => document.body.style.position), "");
      if (width < 768) {
        const select = page.getByLabel("Explore by discipline");
        await select.selectOption("Real-Time");
        assert.match(
          await page.locator("#case-study-results").getAttribute("aria-label"),
          /Real-Time/
        );
        await select.selectOption("All");
      }
      await page.locator("#case-studies").screenshot({ path: `${output}/explorer-${width}.png` });
      for (const name of ["Toast Messages 2.0", "Real-Time Plinko"]) {
        await page.locator("main button").filter({ hasText: name }).first().tap();
        assert.ok(await dialog.evaluate((e) => e.scrollWidth <= e.clientWidth));
        if (name.startsWith("Toast")) {
          await dialog.getByRole("button", { name: "Critical Message", exact: true }).tap();
          await dialog.locator("pre").screenshot({ path: `${output}/code-${width}.png` });
        } else {
          await dialog.getByRole("button", { name: "Play", exact: true }).tap();
          await dialog.getByRole("button", { name: "Pause", exact: true }).tap();
        }
        await noOverflow(name);
        await dialog.getByRole("button", { name: "Close case study" }).tap();
      }
      await page.getByRole("button", { name: "Open command palette", exact: true }).tap();
      const input = page.getByRole("combobox", { name: "Search commands" });
      await input.fill("sneaky");
      await dialog.screenshot({ path: `${output}/palette-${width}.png` });
      await page.setViewportSize({ width, height: 420 });
      assert.ok(await dialog.evaluate((e) => e.getBoundingClientRect().bottom <= innerHeight));
      assert.ok(await dialog.evaluate((e) => e.scrollWidth <= e.clientWidth));
      await page.keyboard.press("Escape");
      await page.close();
      console.log(
        `PASS ${width}px: 7 routes, internal scrollers, touch inspection, drawer, filters, modals, code, palette and short viewport.`
      );
    }
    const hybrid = await browser.newPage({
      viewport: { width: 1280, height: 900 },
      hasTouch: true,
    });
    await hybrid.goto(base + "/");
    await hybrid.waitForTimeout(300);
    assert.equal(
      await hybrid.evaluate(() => document.documentElement.dataset.pointerEffects),
      undefined
    );
    assert.deepEqual(errors, []);
  } finally {
    await browser.close();
  }
})().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});
