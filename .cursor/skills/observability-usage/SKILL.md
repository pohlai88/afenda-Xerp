---
name: observability-usage
description: Governs correct usage of @afenda/observability in all packages and apps — pino-backed structured logging, correlation ID propagation, audit event writing, PII redaction, and log level discipline. Use when adding logging, writing audit events, handling errors that need to be recorded, or when the user mentions logging, audit trail, correlation ID, pino, or observability.
disable-model-invocation: true
---

# observability-usage

`@afenda/observability` is the single logging and audit authority for this monorepo. `console.log`, `console.error`, and `console.warn` are banned in all app and package code.

## Package API quick reference

From `packages/observability/src/index.ts`:

```ts
// Logger creation
import { createLogger, createPinoLogger } from "@afenda/observability";

// Correlation IDs
import { createCorrelationId, assertCorrelationId } from "@afenda/observability";

// Audit events
import { writeAuditEvent } from "@afenda/observability";
import type { WriteAuditEventInput, AuditResult, AuditActorType } from "@afenda/observability";

// Redaction config (use when configuring pino sink)
import { PINO_REDACT_PATHS, PINO_REDACT_CENSOR } from "@afenda/observability";
```

Logger interface (from `logger.contract.ts`):
```ts
interface Logger {
  debug(message: string, metadata?: LogMetadata): void;
  info(message: string, metadata?: LogMetadata): void;
  warn(message: string, metadata?: LogMetadata): void;
  error(message: string, metadata?: LogMetadata): void;
}
```

---

## Logger usage rules

1. **Never `console.log` in app or package code.** Use the Logger instance. Biome lint catches this; CI will reject.
2. **Create one logger per module** using `createLogger()` or `createPinoLogger()`. Do not pass a logger down through many function arguments — use module-level instances.
3. **Bind `correlationId` to every log entry.** Every log call that occurs within a request must include the request's `correlationId` in `metadata`.
4. **Use `createCorrelationId()` at the request entry point** (middleware, route handler). Propagate it through context or function arguments — never regenerate mid-request.

```ts
// apps/erp/src/middleware.ts or equivalent
import { createCorrelationId } from "@afenda/observability";

export function middleware(req: NextRequest) {
  const correlationId = req.headers.get("x-correlation-id") ?? createCorrelationId();
  const res = NextResponse.next();
  res.headers.set("x-correlation-id", correlationId);
  return res;
}
```

---

## Log level discipline

| Level | When to use | Example |
|-------|-------------|---------|
| `error` | Actionable failure — requires investigation or alerting | DB connection lost, unhandled exception |
| `warn`  | Recoverable anomaly — system continues but something is off | Slow query > 2s, retry attempt, deprecated API called |
| `info`  | Meaningful state change — confirms expected system behavior | User created, post published, job completed |
| `debug` | Developer-only detail — never emitted in production | Intermediate variable values, query plans |

`debug` is filtered out in production by the pino sink. Never use `debug` for security-relevant events.

---

## Structured log shape

Every log call must include `msg` and enough context to diagnose without reading source code:

```ts
// ✅ Correct — structured, contextual
logger.info("user.created", {
  correlationId: ctx.correlationId,
  userId:        newUser.id,
  email:         "[REDACTED]",  // PII — never log plaintext
  durationMs:    Date.now() - startMs,
});

logger.error("createUser.failed", {
  correlationId: ctx.correlationId,
  reason:        err instanceof Error ? err.message : String(err),
  // stack is NOT logged to structured output — too noisy
});

// ❌ Wrong — unstructured, no context
console.log("user created");
logger.info("Something happened");
```

---

## Audit event rules

Write an audit event for every user-initiated mutation that has compliance or security significance:

```ts
import { writeAuditEvent } from "@afenda/observability";

await writeAuditEvent({
  action:       "post.delete",          // format: resource.verb
  actorId:      session.user.id,        // who did it
  actorType:    "user",                 // "user" | "system" | "service" | "cron" | ...
  targetId:     postId,                 // what was acted on
  targetType:   "post",
  result:       "success",             // "success" | "failure" | "denied" | ...
  correlationId: ctx.correlationId,
  module:       "@afenda/erp",
  metadata: {
    postTitle: post.title,              // relevant non-PII context
  },
});
```

**When to write an audit event (mandatory):**
- Create, update, delete of any entity (user, post, document, setting)
- Authentication events (sign-in, sign-out, password change)
- Permission changes (role assignment, access grant/revoke)
- Data export or bulk operations

**When NOT to write an audit event:**
- Read operations (unless sensitive: admin viewing another user's data)
- System-internal operations with no user actor
- Events already captured by a lower-level system (DB-level audit logs)

---

## PII redaction

`PINO_REDACT_PATHS` covers tokens, keys, passwords, and credentials automatically. You must additionally never log:

- `email` — redact at application layer before passing to logger
- `phone` — same
- `name` / `display_name` — omit or hash if required for debugging
- `ip_address` — log only in audit events, not in application logs

```ts
// ✅ Correct
logger.info("auth.signIn", { correlationId, userId: session.user.id });

// ❌ Wrong — PII in log
logger.info("auth.signIn", { email: user.email, name: user.name });
```

---

## Non-negotiable checks

```
[ ] 1. No console.log, console.error, or console.warn in app or package source
[ ] 2. correlationId present in every log call within a request context
[ ] 3. Audit event written for every user-initiated create/update/delete
[ ] 4. PII (email, phone, name) not logged in plaintext
[ ] 5. Log level matches the severity (no error-level logs for expected conditions)
[ ] 6. writeAuditEvent called AFTER the mutation succeeds (result: "success") or on failure (result: "failure")
```
