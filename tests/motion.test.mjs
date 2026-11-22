import assert from "node:assert/strict";
import test from "node:test";
import { layoutKeyframes } from "../lib/motion.mjs";

test("layout transitions move retained cards from their previous position", () => {
  const frames = layoutKeyframes({ left: 100, top: 300 }, { left: 20, top: 120 }, false);
  assert.equal(frames[0].transform, "translate(80px, 180px)");
  assert.equal(frames[1].transform, "translate(0, 0)");
  assert.equal(frames[0].opacity, 1);
});
test("new cards fade in and compact layouts never translate", () => {
  assert.equal(layoutKeyframes(undefined, { left: 0, top: 0 }, false)[0].opacity, 0);
  for (const frame of layoutKeyframes({ left: 100, top: 300 }, { left: 20, top: 120 }, true)) {
    assert.deepEqual(Object.keys(frame), ["opacity"]);
  }
});
