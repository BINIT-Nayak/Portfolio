// Load monitoring only when configured; no session recording or continuous tracing.
if (process.env.NEXT_PUBLIC_SENTRY_DSN) {
  import("@sentry/nextjs")
    .then((Sentry) => {
      Sentry.init({
        dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
        dataCollection: {
          userInfo: false,
          cookies: false,
          httpHeaders: false,
          httpBodies: [],
          urlQueryParams: false,
        },
      });
    })
    .catch(() => {
      /* Monitoring must never prevent the portfolio from loading. */
    });
}
