const { chromium } = require(process.env.PLAYWRIGHT_MODULE || "playwright");
const assert = require("node:assert/strict");
const base = process.env.AUDIT_URL || "http://127.0.0.1:4188";
(async () => {
  const browser = await chromium.launch({
    headless: true,
    ...(process.env.CHROME_PATH ? { executablePath: process.env.CHROME_PATH } : {}),
  });
  try {
    for (const width of [1440, 320]) {
      const page = await browser.newPage({
        viewport: { width, height: 900 },
        reducedMotion: "reduce",
        hasTouch: width === 320,
      });
      const errors = [];
      page.on("pageerror", (e) => errors.push(e.message));
      await page.goto(base + "/");
      if (width === 320) {
        assert.equal(
          await page
            .locator("header")
            .getByRole("link", { name: /^Contact/ })
            .isVisible(),
          false
        );
      }
      const start = page.getByRole("button", { name: /Take the quick tour/ });
      await start.focus();
      await page.keyboard.press("Enter");
      const tour = page.getByRole("complementary", { name: "90-second portfolio tour" });
      const stops = [
        "identity",
        "experience",
        "plinko",
        "toast",
        "sneaky",
        "open-source",
        "contact",
      ];
      for (let index = 0; index < stops.length; index++) {
        const target = page.locator(`[data-tour-target="${stops[index]}"][data-tour-highlight]`);
        await target.waitFor();
        await tour
          .getByRole("button", { name: "Explore highlighted section", exact: true })
          .waitFor();
        await page.waitForFunction(
          () =>
            document.activeElement?.tagName === "H2" &&
            !!document.activeElement.closest('aside[aria-label="90-second portfolio tour"]')
        );
        assert.equal(await page.locator("[data-tour-highlight]").count(), 1);
        const position = await page.evaluate(() => scrollY);
        await page.waitForTimeout(350);
        // Chromium may round fractional layout/scroll offsets by one CSS pixel.
        assert.ok(
          Math.abs((await page.evaluate(() => scrollY)) - position) <= 1,
          "No timed scrolling"
        );
        assert.equal(
          await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth),
          true
        );
        await tour
          .getByRole("button", { name: "Explore highlighted section", exact: true })
          .click();
        assert.equal(await target.evaluate((e) => e === document.activeElement), true);
        await target.getByRole("button", { name: "Back to tour controls", exact: true }).click();
        if (index === 2) {
          await tour.getByRole("button", { name: "Previous", exact: true }).click();
          await page.locator('[data-tour-target="experience"][data-tour-highlight]').waitFor();
          await tour.getByRole("button", { name: "Next", exact: true }).click();
          await target.waitFor();
        }
        if (index === 3) {
          await page.screenshot({ path: `/tmp/portfolio-tour-${width}.png` });
          await page.addScriptTag({
            path: process.env.AXE_SCRIPT || require.resolve("axe-core/axe.min.js"),
          });
          const result = await page.evaluate(() =>
            axe.run(document, {
              runOnly: {
                type: "tag",
                values: ["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa", "best-practice"],
              },
            })
          );
          assert.deepEqual(
            result.violations.map((v) => ({ id: v.id, targets: v.nodes.map((n) => n.target) })),
            []
          );
        }
        await tour
          .getByRole("button", { name: index === 6 ? "Finish tour" : "Next", exact: true })
          .click();
      }
      await tour.waitFor({ state: "detached" });
      assert.equal(await page.locator("[data-tour-highlight]").count(), 0);
      assert.equal(
        await page.evaluate(() => document.documentElement.dataset.portfolioTour),
        undefined
      );
      await page.goto(base + "/");
      await start.click();
      await tour.waitFor();
      await page.keyboard.press("Escape");
      await tour.waitFor({ state: "detached" });
      await start.click();
      await tour.getByRole("button", { name: "Next", exact: true }).click();
      await page.locator('[data-tour-target="experience"][data-tour-highlight]').waitFor();
      await page.getByRole("button", { name: "Open command palette", exact: true }).click();
      await tour.waitFor({ state: "detached" });
      await page.keyboard.press("Escape");
      await page.goto(base + "/");
      await start.click();
      await page.getByRole("link", { name: "View My Work", exact: true }).click();
      await tour.waitFor({ state: "detached" });
      await start.click();
      await tour.getByRole("button", { name: "Next", exact: true }).click();
      await page.locator('[data-tour-target="experience"][data-tour-highlight]').waitFor();
      await tour.getByRole("button", { name: "Next", exact: true }).click();
      await page.waitForURL("**/case-studies/plinko-ui");
      await page.goBack();
      await tour.waitFor({ state: "detached" });
      assert.deepEqual(errors, []);
      console.log(
        `PASS ${width}px: seven stops, cross-route Previous/Next, no autoplay, highlights, keyboard explore/return, finish/Escape, modal exit and axe.`
      );
      await page.close();
    }
  } finally {
    await browser.close();
  }
})().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});
