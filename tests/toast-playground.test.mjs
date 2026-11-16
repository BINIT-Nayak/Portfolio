import assert from "node:assert/strict";
import test from "node:test";
import { createToastBus, emptyToasts, toastReducer } from "../lib/toast-playground.mjs";
const publish = (state, id, type = "info") =>
  toastReducer(state, {
    type: "publish",
    toast: { id, type, message: `Message ${id}`, remaining: 6000 },
  });
test("overflow waits FIFO and does not lose lifetime while queued", () => {
  let state = emptyToasts();
  for (let id = 1; id <= 5; id++) state = publish(state, id);
  state = toastReducer(state, { type: "tick", elapsed: 2000 });
  assert.deepEqual(
    state.visible.map((t) => t.id),
    [1, 2, 3]
  );
  assert.equal(state.queue[0].remaining, 6000);
  state = toastReducer(state, { type: "dismiss", id: 2 });
  assert.deepEqual(
    state.visible.map((t) => t.id),
    [1, 3, 4]
  );
  state = toastReducer(state, { type: "tick", elapsed: 4000 });
  assert.deepEqual(
    state.visible.map((t) => [t.id, t.remaining]),
    [
      [4, 2000],
      [5, 6000],
    ]
  );
});
test("critical interruptions preserve timers until all critical messages are dismissed", () => {
  let state = publish(emptyToasts(), 1);
  state = toastReducer(state, { type: "tick", elapsed: 1000 });
  state = publish(publish(state, 2, "critical"), 3, "critical");
  assert.equal(toastReducer(state, { type: "tick", elapsed: 9000 }), state);
  state = toastReducer(state, { type: "dismiss", id: 2 });
  assert.equal(toastReducer(state, { type: "tick", elapsed: 9000 }), state);
  state = toastReducer(state, { type: "dismiss", id: 3 });
  state = toastReducer(state, { type: "tick", elapsed: 1000 });
  assert.equal(state.visible[0].remaining, 4000);
  assert.deepEqual(toastReducer(state, { type: "reset" }), emptyToasts());
});
test("buses are isolated and unsubscribe removes the consumer", () => {
  const first = createToastBus();
  const second = createToastBus();
  let received = 0;
  const unsubscribe = first.subscribe(() => received++);
  const toast = { id: 1, type: "success", message: "Bet placed", remaining: 6000 };
  second.publish("toast", toast);
  assert.equal(received, 0);
  first.publish("toast", toast);
  assert.equal(received, 1);
  unsubscribe();
  first.publish("toast", toast);
  assert.equal(received, 1);
});
