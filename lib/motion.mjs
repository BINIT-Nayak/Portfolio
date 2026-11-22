/** @param {{left: number, top: number} | undefined} previous
 * @param {{left: number, top: number}} current
 * @param {boolean} compact */
export function layoutKeyframes(previous, current, compact) {
  if (compact) return [{ opacity: 0.6 }, { opacity: 1 }];
  return [
    {
      opacity: previous ? 1 : 0,
      transform: previous
        ? `translate(${previous.left - current.left}px, ${previous.top - current.top}px)`
        : "translateY(var(--motion-distance))",
    },
    { opacity: 1, transform: "translate(0, 0)" },
  ];
}
/** @param {HTMLElement} root */
export function motionSettings(root) {
  const tokens = getComputedStyle(root);
  return {
    duration: parseFloat(tokens.getPropertyValue("--motion-duration-enter")) || 260,
    easing: tokens.getPropertyValue("--ease-standard").trim() || "ease-out",
  };
}
