import assert from "node:assert/strict";
import test from "node:test";
import { getNavigationState, moveCommandSelection } from "../lib/navigation.mjs";

test("hero has no false active section and no progress on a short page", () => {
  assert.deepEqual(getNavigationState([{ link: "#about", top: 500 }], 0, 600, 800, 80), {
    active: "",
    progress: 0,
    scrolled: false,
  });
});
test("active section follows document position rather than menu ordering", () => {
  const sections = [
    { link: "#projects", top: 450 },
    { link: "#about", top: -800 },
    { link: "#experience", top: 100 },
  ];
  assert.equal(getNavigationState(sections, 1000, 4000, 800, 80).active, "#experience");
  assert.equal(sections[0].link, "#projects");
});
test("bottom of page activates the last section even when it cannot reach the header", () => {
  const state = getNavigationState(
    [
      { link: "#open-source", top: -400 },
      { link: "#contact", top: 500 },
    ],
    3200,
    4000,
    800,
    80
  );
  assert.equal(state.active, "#contact");
  assert.equal(state.progress, 1);
});
test("overscroll progress stays bounded and missing sections are safe", () => {
  assert.equal(getNavigationState([], -40, 2000, 800, 80).progress, 0);
  assert.deepEqual(getNavigationState([], 1400, 2000, 800, 80), {
    active: "",
    progress: 1,
    scrolled: true,
  });
});
test("command selection wraps in both directions and tolerates no results", () => {
  assert.equal(moveCommandSelection(0, -1, 7), 6);
  assert.equal(moveCommandSelection(6, 1, 7), 0);
  assert.equal(moveCommandSelection(0, 1, 0), 0);
});
