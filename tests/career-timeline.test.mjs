import assert from "node:assert/strict";
import test from "node:test";
import { getCareerPosition } from "../lib/career-timeline.mjs";

test("before the timeline begins, its first role is selected with an empty line", () => {
  assert.deepEqual(getCareerPosition([600, 1200, 1900], 200), { active: 0, progress: 0 });
});
test("progress follows unequal role heights, including expanded contributions", () => {
  assert.deepEqual(getCareerPosition([-200, 600, 1800], 200), { active: 0, progress: 0.25 });
  assert.deepEqual(getCareerPosition([-1000, -200, 600], 200), { active: 1, progress: 0.75 });
});
test("deep links activate their role and scrolling backward restores the previous role", () => {
  assert.deepEqual(getCareerPosition([-900, 100, 800], 100), { active: 1, progress: 0.5 });
  assert.equal(getCareerPosition([-400, 300, 1000], 100).active, 0);
});
test("line progress clamps at the end and handles empty or single-role lists", () => {
  assert.deepEqual(getCareerPosition([-1800, -1000, -100], 200), { active: 2, progress: 1 });
  assert.deepEqual(getCareerPosition([], 200), { active: 0, progress: 0 });
  assert.deepEqual(getCareerPosition([100], 200), { active: 0, progress: 1 });
});
