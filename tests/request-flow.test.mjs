import assert from "node:assert/strict";
import test from "node:test";
import { initialRequestFlow, requestFlowReducer } from "../lib/request-flow.mjs";
const act = (state, type, step) => requestFlowReducer(state, { type, step, count: 7 });
test("one play walks all seven steps once and completes without looping", () => {
  let state = act(initialRequestFlow, "play");
  const visited = [state.step];
  for (let i = 0; i < 6; i++) {
    state = act(state, "tick");
    visited.push(state.step);
  }
  state = act(state, "tick");
  assert.deepEqual(visited, [0, 1, 2, 3, 4, 5, 6]);
  assert.deepEqual(state, { phase: "complete", step: 6 });
  assert.deepEqual(act(state, "tick"), state);
});
test("pause and reset reject stale timer ticks; resume preserves the selected step", () => {
  const selected = act(initialRequestFlow, "select", 3);
  assert.deepEqual(act(selected, "tick"), selected);
  assert.deepEqual(act(selected, "resume"), { phase: "playing", step: 3 });
  const paused = act(act(selected, "resume"), "pause");
  assert.deepEqual(act(paused, "tick"), paused);
  assert.deepEqual(act(act(paused, "reset"), "tick"), initialRequestFlow);
});
test("replay restarts the request and manual selection stays in bounds", () => {
  assert.deepEqual(act({ phase: "complete", step: 6 }, "play"), { phase: "playing", step: 0 });
  assert.equal(act(initialRequestFlow, "select", 99).step, 6);
  assert.equal(act(initialRequestFlow, "select", -4).step, 0);
});
