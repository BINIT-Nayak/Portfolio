/**
 * Scroll geometry stays independent of React and respects unequal panel heights.
 * @param {number[]} tops Viewport-relative role panel tops, in document order.
 * @param {number} activationLine Viewport position where a role becomes current.
 */
export function getCareerPosition(tops, activationLine) {
  if (!tops.length) return { active: 0, progress: 0 };
  let active = 0;
  for (let index = 0; index < tops.length; index++) {
    if (tops[index] <= activationLine) active = index;
  }
  if (tops.length === 1) return { active, progress: tops[0] <= activationLine ? 1 : 0 };
  const next = Math.min(active + 1, tops.length - 1);
  const distance = tops[next] - tops[active];
  const segment =
    distance > 0 ? Math.min(1, Math.max(0, (activationLine - tops[active]) / distance)) : 0;
  return { active, progress: Math.min(1, Math.max(0, (active + segment) / (tops.length - 1))) };
}
