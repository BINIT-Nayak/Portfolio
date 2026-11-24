import { withSentryConfig } from "@sentry/nextjs/config";

const nextConfig = {};
const hasSentryConfig =
  process.env.SENTRY_AUTH_TOKEN && process.env.SENTRY_ORG && process.env.SENTRY_PROJECT;

export default hasSentryConfig
  ? withSentryConfig(nextConfig, {
      silent: true,
      org: process.env.SENTRY_ORG,
      project: process.env.SENTRY_PROJECT,
      widenClientFileUpload: true,
    })
  : nextConfig;
