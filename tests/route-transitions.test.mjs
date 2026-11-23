import test from "node:test";
import assert from "node:assert/strict";
import { isRouteChange } from "../lib/route-transitions.mjs";

test("route transitions exclude section jumps, queries and external destinations", () => {
  const current = "https://portfolio.test/projects";
  for (const href of [
    "#sneaky",
    "?sort=new",
    "/projects#snapgram",
    "https://other.test/case-studies",
    "mailto:test@example.com",
    "javascript:void(0)",
  ]) {
    assert.equal(isRouteChange(href, current), false, href);
  }
  for (const href of ["/", "/case-studies", "/case-studies/vibejournal-offline-sync"]) {
    assert.equal(isRouteChange(href, current), true, href);
  }
});
