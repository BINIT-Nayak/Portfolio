/** @param {string} href @param {string} current */
export function isRouteChange(href, current) {
  try {
    const from = new URL(current);
    const to = new URL(href, from);
    return (
      to.origin === from.origin && /^https?:$/.test(to.protocol) && to.pathname !== from.pathname
    );
  } catch {
    return false;
  }
}
/** Notify the visual layer without delaying or replacing router navigation. @param {string} href */
export function announceRouteNavigation(href) {
  window.dispatchEvent(new CustomEvent("portfolio:route-start", { detail: href }));
}
