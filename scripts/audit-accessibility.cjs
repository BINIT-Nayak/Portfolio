/* Run against a production build. See docs/accessibility-audit.md for setup. */
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || "playwright");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const base = process.env.AUDIT_URL || "http://127.0.0.1:4188";
const routes = [
  "/",
  "/projects",
  "/case-studies",
  "/case-studies/vibejournal-offline-sync",
  "/case-studies/cache-first-recommendation-api",
  "/case-studies/sneaky-recommendation-system",
  "/labs/comet",
];
const report = [];
(async () => {
  const browser = await chromium.launch({
    headless: true,
    ...(process.env.CHROME_PATH ? { executablePath: process.env.CHROME_PATH } : {}),
  });
  try {
    const page = await browser.newPage({
      viewport: { width: 1440, height: 1000 },
      reducedMotion: "reduce",
    });
    const errors = [];
    page.on("pageerror", (error) => errors.push(error.message));
    async function scan(name) {
      await page.addScriptTag({
        path: process.env.AXE_SCRIPT || require.resolve("axe-core/axe.min.js"),
      });
      const result = await page.evaluate(async () =>
        axe.run(document, {
          runOnly: {
            type: "tag",
            values: ["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa", "best-practice"],
          },
        })
      );
      report.push({ name, violations: result.violations, incomplete: result.incomplete });
      console.log(
        `${name}: ${result.violations.length} violations; ${result.incomplete.length} manual-review groups`
      );
    }
    for (const theme of ["dark", "light"]) {
      for (const route of routes) {
        await page.goto(base + route);
        await page.evaluate((theme) => {
          document.documentElement.className = theme;
        }, theme);
        await page.waitForTimeout(200);
        assert.equal(await page.locator("main").count(), 1);
        assert.equal(await page.locator("h1").count(), 1);
        await scan(theme + route);
      }
    }
    await page.goto(base + "/");
    await page.keyboard.press("Tab");
    assert.equal(await page.evaluate(() => document.activeElement.textContent), "Skip to content");
    await page.keyboard.press("Enter");
    assert.equal(await page.evaluate(() => document.activeElement.id), "main-content");
    // Inspect all layers with a keyboard and open the non-animated text alternative.
    const layer = page.getByRole("button", { name: /Web Worker Off-thread work/ });
    await layer.focus();
    assert.equal(await layer.getAttribute("aria-pressed"), "true");
    await page.getByText("Read the system explanation", { exact: true }).click();
    assert.equal(await page.locator("figure details[open] li").count(), 5);
    const metric = page.locator("#engineering-snapshot button").first();
    await metric.focus();
    assert.equal(await metric.getAttribute("aria-expanded"), "true");
    await page.keyboard.press("Escape");
    assert.equal(await metric.getAttribute("aria-expanded"), "false");
    const redis = page
      .locator("#engineering-toolbox")
      .getByRole("button", { name: "Redis", exact: true });
    await redis.focus();
    await page.keyboard.press("Enter");
    assert.equal(await redis.getAttribute("aria-pressed"), "true");
    const contributions = page.locator("#experience summary").first();
    await contributions.focus();
    await page.keyboard.press("Enter");
    assert.equal(await contributions.evaluate((el) => el.parentElement.open), true);
    await page.getByText("Read the architecture and request flow", { exact: true }).click();
    assert.ok((await page.locator("#projects details[open] li").count()) > 7);
    assert.equal(
      await page.evaluate(() => document.documentElement.dataset.pointerEffects),
      undefined
    );
    await page.waitForTimeout(400);
    assert.equal(
      await page.evaluate(
        () => document.getAnimations().filter((a) => a.playState === "running").length
      ),
      0
    );
    await page.emulateMedia({ forcedColors: "active" });
    await page.keyboard.press("Tab");
    await redis.focus();
    assert.equal(await redis.evaluate((el) => getComputedStyle(el).outlineStyle), "solid");
    await page.emulateMedia({ forcedColors: "none" });
    await page.goto(base + "/case-studies");
    const filter = page.getByRole("button", { name: /^Performance/ });
    await filter.focus();
    await page.keyboard.press("Enter");
    assert.equal(await filter.getAttribute("aria-pressed"), "true");
    assert.equal(await filter.evaluate((el) => el === document.activeElement), true);
    await page.getByRole("button", { name: /^All/ }).click();
    for (const title of ["Toast Messages 2.0", "Real-Time Plinko"]) {
      const trigger = page.locator("main button").filter({ hasText: title }).first();
      await trigger.focus();
      await page.keyboard.press("Enter");
      const dialog = page.locator("dialog[open]");
      await dialog.waitFor();
      assert.equal(await dialog.evaluate((el) => el.matches(":modal")), true);
      // Programmatic focus cannot escape the browser's modal boundary.
      await page.locator('header a[href="/"]').focus();
      assert.equal(await dialog.evaluate((el) => el.contains(document.activeElement)), true);
      const close = dialog.getByRole("button", { name: "Close case study" });
      await close.focus();
      await page.keyboard.press("Shift+Tab");
      assert.equal(await dialog.evaluate((el) => el.contains(document.activeElement)), true);
      await page.keyboard.press("Tab");
      assert.equal(await close.evaluate((el) => el === document.activeElement), true);
      if (title.startsWith("Toast")) {
        await dialog.getByRole("button", { name: "Pause timers", exact: true }).click();
        await dialog.getByRole("button", { name: "Stack Multiple", exact: true }).click();
        await dialog.getByRole("button", { name: "Critical Message", exact: true }).click();
        await dialog.getByRole("button", { name: /Dismiss critical/ }).click();
        assert.equal(
          await dialog
            .getByRole("button", { name: "Success Toast", exact: true })
            .evaluate((el) => el === document.activeElement),
          true
        );
      } else {
        await dialog.getByRole("button", { name: "Play", exact: true }).click();
        await dialog.getByRole("button", { name: "Pause", exact: true }).click();
      }
      await scan("interactive dialog " + title);
      await page.keyboard.press("Escape");
      assert.equal(await trigger.evaluate((el) => el === document.activeElement), true);
      assert.equal(await page.evaluate(() => document.body.style.overflow), "");
    }
    const palette = page.getByRole("button", { name: "Open command palette", exact: true });
    await palette.focus();
    await page.keyboard.press("Control+k");
    const search = page.getByRole("combobox", { name: "Search commands" });
    await search.fill("plinko");
    await page.keyboard.press("ArrowDown");
    assert.ok(await search.getAttribute("aria-activedescendant"));
    await scan("command palette search");
    await page.keyboard.press("Enter");
    await page.getByRole("button", { name: "Close case study" }).waitFor();
    await page.keyboard.press("Escape");
    await palette.focus();
    await page.keyboard.press("Control+k");
    await search.fill("no-such-command");
    assert.equal(await search.getAttribute("aria-activedescendant"), null);
    await page.keyboard.press("Escape");
    assert.equal(await palette.evaluate((el) => el === document.activeElement), true);
    for (const width of [390, 320]) {
      await page.setViewportSize({ width, height: 844 });
      for (const route of routes) {
        await page.goto(base + route);
        assert.equal(
          await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth),
          true,
          `Reflow ${width}: ${route}`
        );
      }
      await page.getByRole("button", { name: "Open navigation menu", exact: true }).click();
      await scan(`mobile drawer ${width}`);
      await page.keyboard.press("Escape");
    }
    assert.deepEqual(errors, []);
    const violations = report.flatMap((entry) =>
      entry.violations.map(
        (v) => `${entry.name}: ${v.id} ${v.nodes.map((n) => n.target).join(", ")}`
      )
    );
    assert.deepEqual(violations, []);
    console.log(
      "PASS: route/theme scans, headings/landmarks, keyboard skip, diagram inspection, modal isolation/focus return, toast/pipeline controls, command palette and 320/390px reflow."
    );
  } finally {
    fs.writeFileSync(
      process.env.AUDIT_REPORT || "/tmp/portfolio-accessibility-report.json",
      JSON.stringify(report, null, 2)
    );
    await browser.close();
  }
})().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
