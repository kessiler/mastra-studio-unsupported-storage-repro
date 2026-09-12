# Mastra Studio: requests against unsupported observability storage

Minimal reproduction using LibSQL, with no agents, API keys, authentication, or external services.

## Run

Requires Node.js >=22.13.0 and npm.

```sh
npm ci
npm run dev
```

The server binds only to `127.0.0.1:4199`.

1. Open http://127.0.0.1:4199/inbox in Chrome.
2. Open DevTools Network and filter for `/api/observability/feedback`.
3. Leave the page idle. The request with `perPage=1` keeps returning HTTP 500 in repeated bursts. The page says `This storage provider does not support listing feedback`.
4. Navigate to Metrics using the sidebar.
5. The page says `Metrics are not available with your current storage`, but the Network panel shows requests to `/api/observability/metrics/aggregate` and discovery endpoints. The sidebar feedback requests also continue.

The same configuration can be bundled with `npm run build` (`mastra build --studio`); this reproduction was verified using `npm run dev`.

## Expected

- A permanent feedback capability error should stop automatic polling.
- Metrics and filter discovery should not run while capabilities are loading or after the store is known to lack metrics support.
- Transient failures should remain recoverable, and supported stores should continue to load normally.

## Observed

Verified in Chrome on macOS, with Node.js 24.14.0, using the committed npm lockfile:

- `mastra`: 1.29.0
- `@mastra/core`: 1.66.0
- `@mastra/libsql`: 1.22.5
- `@mastra/observability`: 1.17.7

The feedback handler error count increased from 84 to 112 between 18:58:18 and 18:58:42 UTC on 2026-09-12, including navigation from Inbox to Metrics. No feedback action was taken.

On Metrics, the server recorded 16 failed aggregate requests and four failed requests each for entity names, service names, and environments. This is a retry burst; the indefinite polling was verified for the feedback count. No storage changes can result from retrying these unsupported operations.

Blocked analytics requests from browser extensions are separate from this issue.

## Configuration

See [`src/mastra/index.ts`](src/mastra/index.ts). An in-memory **LibSQL** database is still LibSQL; it is not the separate `InMemoryStore` provider that supports metrics.
