/** @typedef {{id: number, type: "success" | "info" | "warning" | "critical", message: string, remaining: number}} DemoToast */
/** @typedef {{visible: DemoToast[], queue: DemoToast[], critical: DemoToast[], notice: string}} ToastState */
/** @returns {ToastState} */
export const emptyToasts = () => ({
  visible: [],
  queue: [],
  critical: [],
  notice: "Ready to publish.",
});
/** @param {ToastState} state */
function fill(state) {
  const queue = [...state.queue];
  const visible = [...state.visible];
  while (visible.length < 3 && queue.length) visible.push(queue.shift());
  return { ...state, visible, queue };
}
/**
 * @param {ToastState} state
 * @param {{type: "publish", toast: DemoToast} | {type: "dismiss", id: number} | {type: "tick", elapsed: number} | {type: "reset"}} action
 * @returns {ToastState}
 */
export function toastReducer(state, action) {
  if (action.type === "reset") return emptyToasts();
  if (action.type === "publish") {
    const toast = action.toast;
    return toast.type === "critical"
      ? {
          ...state,
          critical: [...state.critical, toast],
          notice: "Critical message received. Standard notification timers are suspended.",
        }
      : fill({
          ...state,
          queue: [...state.queue, toast],
          notice: `Published ${toast.type}: ${toast.message}`,
        });
  }
  if (action.type === "dismiss") {
    return fill({
      ...state,
      visible: state.visible.filter((t) => t.id !== action.id),
      queue: state.queue.filter((t) => t.id !== action.id),
      critical: state.critical.filter((t) => t.id !== action.id),
      notice: "Message dismissed. The next queued message can take an available slot.",
    });
  }
  if (state.critical.length) return state;
  const updated = state.visible.map((t) => ({ ...t, remaining: t.remaining - action.elapsed }));
  const expired = updated.filter((t) => t.remaining <= 0);
  return fill({
    ...state,
    visible: updated.filter((t) => t.remaining > 0),
    notice: expired.length
      ? "Message timed out. The next queued message takes its place."
      : state.notice,
  });
}

/** A bus owned by one mounted playground, never window or an application singleton. */
export function createToastBus() {
  /** @type {Set<(toast: DemoToast) => void>} */
  const listeners = new Set();
  return {
    /** @param {"toast"} topic @param {DemoToast} toast */
    publish(topic, toast) {
      if (topic === "toast") listeners.forEach((listener) => listener(toast));
    },
    /** @param {(toast: DemoToast) => void} listener */
    subscribe(listener) {
      listeners.add(listener);
      return () => {
        listeners.delete(listener);
      };
    },
  };
}
