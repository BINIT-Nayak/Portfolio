const assert = require("node:assert/strict");
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || "playwright");
const base = process.env.AUDIT_URL || "http://127.0.0.1:4188";
(async () => {
  const browser = await chromium.launch({
    headless: true,
    executablePath: process.env.CHROME_PATH,
  });
  const errors = [];
  try {
    const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
    page.on("pageerror", (e) => errors.push(e.message));
    page.on("console", (e) => {
      if (e.type() === "error") errors.push(e.text());
    });
    page.on("response", (r) => {
      if (r.status() >= 400 && r.url().startsWith(base)) errors.push(`${r.status()} ${r.url()}`);
    });
    await page.goto(base + "/playground");
    const experiments = page.getByRole("group", { name: "Engineering experiments" });
    const choose = async (name) => {
      await experiments.getByRole("button", { name: new RegExp(name) }).click();
      await page
        .getByRole("region", { name: `${name} experiment` })
        .getByRole("heading")
        .waitFor();
    };
    const status = () => page.locator('#engineering-playground [role="status"]');
    await page.getByLabel("Workload").selectOption("500000");
    await page.getByRole("button", { name: "Run in worker", exact: true }).click();
    await page.waitForFunction(() =>
      document
        .querySelector('#engineering-playground [role="status"]')
        ?.textContent.includes("41,538 primes")
    );
    assert.match(await status().innerText(), /Worker: 41,538 primes/);
    await page.getByRole("button", { name: "Run on main thread" }).click();
    await page.waitForFunction(() =>
      document
        .querySelector('#engineering-playground [role="status"]')
        ?.textContent.includes("Main thread: 41,538 primes")
    );
    await page.getByLabel("Workload").selectOption("2000000");
    await page.getByRole("button", { name: "Run in worker", exact: true }).click();
    await page.getByLabel("Try typing").fill("Input remains available");
    await page.getByRole("button", { name: /Responsiveness check/ }).click();
    assert.equal(await page.getByLabel("Try typing").inputValue(), "Input remains available");
    await page.getByRole("button", { name: "Cancel worker", exact: true }).click();
    assert.match(await status().innerText(), /Worker terminated/);
    await choose("Event Driven UI");
    await page.getByRole("button", { name: "Publish product:added" }).click();
    await page.getByLabel("Notification subscribed").uncheck();
    await page.getByRole("button", { name: "Publish product:added" }).click();
    assert.match(await status().innerText(), /Event 2 delivered to 2 subscribers/);
    assert.equal(await page.getByText("Product added · event 1", { exact: true }).count(), 1);
    await choose("Redis Cache-Aside");
    const send = page.getByRole("button", { name: "Send request" });
    const next = page.getByRole("button", { name: "Next step", exact: true });
    await send.click();
    for (let i = 0; i < 5; i++) await next.click();
    assert.match(await status().innerText(), /Miss resolved/);
    await send.click();
    for (let i = 0; i < 3; i++) await next.click();
    assert.match(await status().innerText(), /Cache hit: no database read/);
    await page.getByRole("button", { name: "Evict selected key" }).click();
    await send.click();
    assert.equal(await page.getByText("3. MISS", { exact: true }).count(), 1);
    await choose("Animation Scheduler");
    await page.getByRole("button", { name: "Play sequence" }).click();
    await page.waitForTimeout(200);
    await page.getByRole("button", { name: "Pause sequence" }).click();
    await page.evaluate(() =>
      Promise.all(
        document
          .getAnimations()
          .filter((a) => a.effect?.getTiming().duration === 2400)
          .map((a) => a.ready)
      )
    );
    const times = await page.evaluate(() =>
      document
        .getAnimations()
        .filter(
          (a) =>
            a.effect?.getTiming().duration === 2400 &&
            a.effect?.target?.closest("#engineering-playground")
        )
        .map((a) => a.currentTime)
    );
    await page.waitForTimeout(150);
    assert.deepEqual(
      await page.evaluate(() =>
        document
          .getAnimations()
          .filter(
            (a) =>
              a.effect?.getTiming().duration === 2400 &&
              a.effect?.target?.closest("#engineering-playground")
          )
          .map((a) => a.currentTime)
      ),
      times
    );
    assert.equal(times.length, 4);
    await page.getByRole("button", { name: "Resume sequence" }).click();
    await page.waitForFunction(() =>
      document
        .querySelector('#engineering-playground [role="status"]')
        ?.textContent.includes("complete")
    );
    await choose("Recommendation Pipeline");
    const advance = page.getByRole("button", { name: "Next stage" });
    for (let i = 0; i < 4; i++) await advance.click();
    assert.equal(await page.getByRole("list", { name: "Feed output" }).locator("li").count(), 4);
    const before = await page.getByRole("list", { name: "Feed output" }).innerText();
    await page.getByLabel("Enable illustrative reranking").check();
    for (let i = 0; i < 4; i++) await advance.click();
    assert.notEqual(await page.getByRole("list", { name: "Feed output" }).innerText(), before);
    for (const width of [320, 375, 390, 430, 768, 1440]) {
      await page.setViewportSize({ width, height: 900 });
      for (const name of [
        "Web Worker",
        "Event Driven UI",
        "Redis Cache-Aside",
        "Animation Scheduler",
        "Recommendation Pipeline",
      ]) {
        await choose(name);
        assert.ok(
          await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth),
          `${width}px ${name}: overflow`
        );
        if ((width === 375 || width === 1440) && process.env.AXE_SCRIPT) {
          await page.addScriptTag({ path: process.env.AXE_SCRIPT });
          const violations = await page.evaluate(async () =>
            (
              await axe.run(document, {
                runOnly: { type: "tag", values: ["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"] },
              })
            ).violations.map((v) => ({ id: v.id, nodes: v.nodes.map((n) => n.target) }))
          );
          assert.deepEqual(violations, [], `${width}px ${name}: accessibility`);
        }
      }
      if (width === 375 || width === 1440)
        await page.screenshot({ path: `/tmp/playground-${width}.png`, fullPage: true });
    }
    await page.emulateMedia({ reducedMotion: "reduce" });
    await choose("Animation Scheduler");
    await page.getByRole("button", { name: "Show completed sequence" }).click();
    assert.equal(
      await page.evaluate(
        () =>
          document
            .getAnimations()
            .filter(
              (a) =>
                a.effect?.getTiming().duration === 2400 &&
                a.effect?.target?.closest("#engineering-playground")
            ).length
      ),
      0
    );
    await choose("Web Worker");
    await page.getByRole("button", { name: "Run in worker", exact: true }).focus();
    await page.keyboard.press("Enter");
    await choose("Event Driven UI"); // Unmount terminates an in-flight worker.
    await page.goto(base + "/");
    await page.waitForFunction(
      () => !document.querySelector('button[aria-label="Switch to light mode"]')?.disabled
    );
    await page.keyboard.press("Control+k");
    await page.getByRole("combobox", { name: "Search commands" }).fill("engineering playground");
    await page.keyboard.press("Enter");
    await page.waitForURL(/#engineering-playground$/);
    assert.deepEqual(errors, []);
    console.log(
      "PASS: real worker parity, event unsubscribe, cache MISS/HIT/eviction, scheduler pause/resume, ranking, six widths, axe, reduced motion, keyboard and palette access."
    );
  } finally {
    await browser.close();
  }
})().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});
