/** Reporting failures must not interfere with the recovery UI. */
export function reportError(error: Error) {
  if (process.env.NEXT_PUBLIC_SENTRY_DSN) {
    void import("@sentry/nextjs").then((Sentry) => Sentry.captureException(error)).catch(() => {});
  }
}
