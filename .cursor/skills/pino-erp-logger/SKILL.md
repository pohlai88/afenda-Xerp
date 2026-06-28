---
name: pino-erp-logger
description: >-
  Structured Pino logging guide for apps/erp and packages/observability.
  Covers every logger factory, DiagnosticContext shape, message conventions,
  metadata typing, redaction, pino-pretty dev output, multi-stream, child
  loggers, audit events, edge-runtime limits, and testing patterns.
  Use when adding logging to a Server Component, Server Action, API handler,
  background job, new package, or when debugging missing/noisy log output.
disable-model-invocation: true
paths:
  - apps/erp/**
  - packages/observability/**
---

# Pino ERP Logger

## Architecture

```
packages/observability
  create-pino-logger.ts   ← public factory (Node.js only)
  pino.sink.ts            ← pino instance, redact, pino-pretty, child bindings
  pino.redact.ts          ← PINO_REDACT_PATHS (30+ sensitive keys)
  logger.ts               ← sink-agnostic Logger facade
  contracts/
    logger.contract.ts    ← Logger, LoggerSink, LogMetadata, StructuredLogEntry
    diagnostic-context.contract.ts ← DiagnosticContext shape

apps/erp/src/lib/observability
  create-erp-logger.ts          ← createErpLogger({ correlationId, module })
  create-request-bound-logger.ts← createRequestBoundErpLogger(module) [async]
  erp-correlation-id.ts         ← ErpCorrelationId + toErpCorrelationId() + createErpCorrelationId()
  erp-diagnostic-defaults.ts    ← ERP_APP_VERSION from package.json + satisfies defaults
  create-erp-background-logger.ts ← createErpBackgroundLogger() for cron/bootstrap
  record-erp-audit-event.ts     ← recordErpAuditEvent(input) [audit layer]
  resolve-correlation-id.ts     ← resolveCorrelationIdFromHeaders(headers)
```

---

## Choosing a factory

| Context | Factory | Notes |
|---------|---------|-------|
| Server Component, Server Action, Route Handler | `createRequestBoundErpLogger(module)` | `async` — reads `x-correlation-id` from request headers automatically |
| Bootstrap / cron / background job | `createErpBackgroundLogger({ module })` | Brands correlation ID via `createErpCorrelationId` |
| Bootstrap / cron (explicit ID) | `createErpLogger({ correlationId, module })` | Must supply branded `ErpCorrelationId` |
| New package outside `apps/erp` | `createPinoLogger(context, options?)` from `@afenda/observability` | Full `DiagnosticContext` required |
| Next.js middleware / Edge runtime | Custom `LoggerSink` via `createLogger(context, sink)` | pino is **Node.js only** — do not import in `src/proxy.ts` |

---

## DiagnosticContext fields

```ts
interface DiagnosticContext {
  correlationId: string;   // "corr-{uuid}" — trace across services
  environment: string;     // process.env.NODE_ENV
  module: string;          // feature slice: "auth", "api-handler", "server-action"
  package: string;         // "@afenda/erp" or owning package name
  service: string;         // "afenda-erp"
  version: string;         // semver or "0.0.0" in dev
}
```

`createErpLogger` fills `package`, `service`, `environment`, and `version` from `getServerRuntimeEnv()` automatically — only `correlationId` and `module` are caller-supplied.

---

## Usage

### Server Component / Server Action

```ts
import { createRequestBoundErpLogger } from "@/lib/observability/create-request-bound-logger";

const logger = await createRequestBoundErpLogger("billing");

logger.info("invoice.created", { invoiceId: "inv-001", amount: 4900 });
logger.warn("invoice.retry", { invoiceId: "inv-001", attempt: 2 });
logger.error("invoice.failed", { invoiceId: "inv-001", reason: err.message });
```

### API Route Handler

```ts
import { createApiHandlerLogger } from "@/server/api/runtime/api-handler-logging";

const logger = createApiHandlerLogger(correlationId);
logger.info("api.request.completed", { statusCode: 200, durationMs: 14 });
```

### Background job / cron

```ts
import { createErpBackgroundLogger } from "@/lib/observability/create-erp-background-logger";

const logger = createErpBackgroundLogger({ module: "invoice-reminder" });
logger.info("cron.started");
```

### New package (not apps/erp)

```ts
import { createPinoLogger } from "@afenda/observability";

const logger = createPinoLogger(
  {
    correlationId: "corr-abc",
    environment: "production",
    module: "sync",
    package: "@afenda/my-package",
    service: "afenda-erp",
    version: "1.2.0",
  },
  { level: "debug" }   // optional PinoSinkOptions
);
```

---

## Message and metadata conventions

**Messages** are lowercase dot-separated strings: `"domain.verb"` or `"domain.verb_qualifier"`.

```
"user.signed_in"        "invoice.created"
"api.request.completed" "server-action.failed"
"audit.skipped"         "cron.started"
```

**Metadata** must satisfy `LogMetadata` (primitives, arrays, nested objects — no `undefined`):

```ts
logger.error("payment.failed", {
  invoiceId: "inv-001",
  code: error.code,              // string
  attempt: 3,                    // number
  retryable: false,              // boolean
  tags: ["billing", "stripe"],   // readonly primitive[]
});
```

Never log raw `Error` objects as metadata — use `error.message` or `error.code`. The pino `err` serializer applies to top-level `err` / `error` fields only (Node.js serializers are wired in `createPinoSink`).

---

## Redaction

`PINO_REDACT_PATHS` (30+ patterns) censors sensitive keys at every depth with `"[REDACTED]"`:

```
password, secret, token, accessToken, refreshToken, sessionToken,
authorization, cookie, apiKey, api_key, privateKey, private_key,
credential, credentials, bearer, passwd  — plus *.{all of the above}
```

**Adding a new redacted field** — edit `packages/observability/src/pino.redact.ts`:

```ts
export const PINO_REDACT_PATHS: readonly string[] = [
  // existing...
  "cardNumber",
  "*.cardNumber",
] as const;
```

Never log PII (email, phone, name) even if not in the redact list. Use IDs instead.

---

## PinoSinkOptions

```ts
interface PinoSinkOptions {
  bindings?: Record<string, string | number | boolean | null>;
  level?: pino.Level;    // default: "info" in prod, "debug" in dev
  pretty?: boolean;      // throws PinoProductionConfigError if true + prod env
}
```

**Extra per-call bindings** (appear on every line from that logger):

```ts
const logger = createPinoLogger(context, {
  bindings: { region: "ap-southeast-1", jobId: "job-xyz" },
});
```

**Per-module debug level** (without changing global level):

```ts
const logger = createPinoLogger(context, { level: "debug" });
```

---

## Child logger (advanced)

`createPinoSink` already binds `correlationId` and `module` as a pino child. To add further bindings on a sub-scope without a new factory call, use the pino child pattern at the sink layer:

```ts
const childLogger = baseLogger.child(
  { requestId: "req-abc" },
  { level: "debug" }             // child-only level override
);
```

Child `redact` can override or clear parent rules (`redact: []`).

---

## Development vs production output

| Environment | Sink | Output |
|-------------|------|--------|
| `NODE_ENV=development` or `test` | `pino-pretty` transport | Colorized, `[{service}] {msg}`, timestamp localized |
| `NODE_ENV=production` | Raw pino | NDJSON to stdout — consumed by log aggregator |

`pino-pretty` is a devDependency; passing `pretty: true` in production throws `PinoProductionConfigError`.

Development pino-pretty config (defined in `pino.sink.ts`):

```ts
{
  colorize: true,
  translateTime: "SYS:standard",
  ignore: "pid,hostname",
  messageFormat: "[{service}] {msg}",
  levelFirst: false,
}
```

---

## Audit events vs diagnostic logs

| Layer | API | When |
|-------|-----|------|
| **Audit** | `recordErpAuditEvent(input)` | Compliance-relevant user/system actions (sign-in, resource create/delete) |
| **Diagnostic** | `logger.info / warn / error` | Operational visibility (request timing, retry counts, background job progress) |

Never use diagnostic logs as the sole audit record for compliance events — they are not durably persisted.

---

## Logging level guidance

| Level | When |
|-------|------|
| `debug` | Detailed internals (only in dev/test; stripped in prod default) |
| `info` | Normal operations: request completed, job finished |
| `warn` | Recoverable anomaly: validation failure, retry, adapter missing |
| `error` | Unrecoverable failure with a cause; always include `reason` or `code` |

---

## Forbidden patterns

```ts
// ❌ console.log — stripped by Biome lint
console.log("user signed in", userId);

// ❌ raw Error object in metadata (serializer won't fire via LogMetadata)
logger.error("payment.failed", { error: err });   // use err.message or err.code

// ❌ PII in metadata
logger.info("user.signed_in", { email: user.email });   // use userId

// ❌ pino-pretty in production
createPinoLogger(context, { pretty: true });   // throws PinoProductionConfigError

// ❌ getCspNonce / server-only modules imported in logger — logger is sink-agnostic
```

---

## Verification

```bash
pnpm check:erp-observability        # governance gate (pino edge, branding, metadata)
pnpm --filter @afenda/observability typecheck
pnpm --filter @afenda/observability test:run
pnpm --filter @afenda/erp typecheck
pnpm --filter @afenda/erp test:run
```

### Risk mitigations (enforced)

| Risk | Gate |
|------|------|
| Brand cast at boundary | `createErpCorrelationId()` + governance scan for branded `createErpLogger` callers |
| Static `version: "0.0.0"` | `ERP_APP_VERSION` imported from `apps/erp/package.json` |
| Pino in edge runtime | Governance forbids pino/`createPinoLogger` in `proxy.ts` |
| Raw Error in metadata | Governance flags `logger.*({ error:` patterns |
| Audit adapter missing | `record-erp-audit-event.test.ts` + `instrumentation.ts` wires adapter at startup |

## Testing

The `Logger` interface is sink-agnostic — inject a stub sink in unit tests:

```ts
import { createLogger } from "@afenda/observability";

const entries: unknown[] = [];
const sink = { write: (e: unknown) => entries.push(e) };
const logger = createLogger(
  { correlationId: "test", environment: "test", module: "billing",
    package: "@afenda/erp", service: "erp", version: "0.0.0" },
  sink
);

logger.error("payment.failed", { code: "CARD_DECLINED" });
expect(entries).toHaveLength(1);
```

---

## Additional resources

- Delivery evidence: `docs/governance/support/pino-erp-logger.md`
- Pino redact paths: `packages/observability/src/pino.redact.ts`
- Pino sink config: `packages/observability/src/pino.sink.ts`
- Audit event contract: `packages/observability/src/contracts/audit-event.contract.ts`
- Observability public API: `packages/observability/src/index.ts`
- Pino docs: https://getpino.io/#/docs/api
