/**
 * Derive scroll state from viewport-relative section positions. Navigation order
 * deliberately does not dictate document order.
 * @param {{link: string, top: number}[]} sections
 * @param {number} scrollY
 * @param {number} scrollHeight
 * @param {number} viewportHeight
 * @param {number} headerBottom
 */
export function getNavigationState(sections, scrollY, scrollHeight, viewportHeight, headerBottom) {
  const distance = scrollHeight - viewportHeight;
  const progress = distance > 0 ? Math.min(1, Math.max(0, scrollY / distance)) : 0;
  const current = sections
    .filter((section) => section.top <= headerBottom + 32)
    .sort((a, b) => a.top - b.top)
    .at(-1);
  const last = [...sections].sort((a, b) => a.top - b.top).at(-1);
  return {
    progress,
    scrolled: scrollY > 16,
    active: progress >= 0.999 && distance > 0 ? (last?.link ?? "") : (current?.link ?? ""),
  };
}

/** @param {number} index @param {number} direction @param {number} count */
export function moveCommandSelection(index, direction, count) {
  return count > 0 ? (index + direction + count) % count : 0;
}
