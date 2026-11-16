/** @typedef {{phase: "idle" | "playing" | "paused" | "complete", step: number}} FlowState */
/** @type {FlowState} */
export const initialRequestFlow = { phase: "idle", step: 0 };
/**
 * @param {FlowState} state
 * @param {{type: "play" | "pause" | "resume" | "tick" | "reset" | "select", count: number, step?: number}} action
 * @returns {FlowState}
 */
export function requestFlowReducer(state, action) {
  const last = Math.max(0, action.count - 1);
  switch (action.type) {
    case "play":
      return { phase: "playing", step: 0 };
    case "pause":
      return state.phase === "playing" ? { ...state, phase: "paused" } : state;
    case "resume":
      return state.phase === "paused" ? { ...state, phase: "playing" } : state;
    case "reset":
      return { ...initialRequestFlow };
    case "select":
      return { phase: "paused", step: Math.min(last, Math.max(0, action.step ?? 0)) };
    case "tick":
      return state.phase !== "playing"
        ? state
        : state.step >= last
          ? { ...state, phase: "complete" }
          : { ...state, step: state.step + 1 };
    default:
      return state;
  }
}
