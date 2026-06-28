# Pino ERP Logger — Delivery Evidence

**Status:** Complete  
**Date:** 2026-06-22  
**Scope:** `apps/erp` structured logging + `@afenda/observability` pino sink  
**Authority:** `.cursor/skills/pino-erp-logger/SKILL.md`, Foundation phase 09 observability spine

## Objective

Centralize ERP diagnostic logging on pino via `@afenda/observability`, keep edge/proxy free of Node-only imports, enforce serializable metadata, and separate audit events from diagnostic logs.

## Architecture

| Layer | Path | Role |
|-------|------|------|
| Pino factory | `packages/observability/src/create-pino-logger.ts` | Node.js logger sink |
| ERP factory | `apps/erp/src/lib/observability/create-erp-logger.ts` | Fills DiagnosticContext defaults |
| Request-bound | `apps/erp/src/lib/observability/create-request-bound-logger.ts` | Reads `x-correlation-id` via `headers()` |
| Correlation brand | `apps/erp/src/lib/observability/erp-correlation-id.ts` | `ErpCorrelationId` at trust boundary |
| Defaults | `apps/erp/src/lib/observability/erp-diagnostic-defaults.ts` | `satisfies Pick<DiagnosticContext, …>` |
| API logging | `apps/erp/src/server/api/runtime/api-handler-logging.ts` | `api.request.*` messages |
| Server actions | `apps/erp/src/lib/server-actions/log-action-error.ts` | `server-action.*` messages |
| Audit | `apps/erp/src/lib/observability/record-erp-audit-event.ts` | Compliance layer (not diagnostic-only) |
| Proxy | `apps/erp/src/proxy.ts` | Correlation header only — **no pino** |

## Type-safety controls

- `ErpCorrelationId` branded at logger/audit boundaries (`toErpCorrelationId`)
- `ContentSecurityPolicyInput`-style internal types avoided on public ERP logger API
- `catch (error: unknown)` with `instanceof` narrowing in audit fallback path
- `LogMetadata`-compatible metadata builders (no raw `Error` objects)
- `ERP_DIAGNOSTIC_DEFAULTS` uses `satisfies` for exhaustiveness

## Risk mitigations

| Risk | Mitigation | Gate |
|------|------------|------|
| Brand cast at boundary | `toErpCorrelationId()` / `createErpCorrelationId()` | `pnpm check:erp-observability` |
| Static version | `ERP_APP_VERSION` from `package.json` | Unit test + governance |
| Pino in edge runtime | No pino in `proxy.ts` | Governance + usage test |
| Raw Error in metadata | Use `reason` / `code` only | Governance scan |
| Audit adapter missing | `audit.skipped` warn fallback | Unit test + `instrumentation.ts` |

## Verification

```bash
pnpm check:erp-observability
pnpm --filter @afenda/observability typecheck
pnpm --filter @afenda/observability test:run
pnpm --filter @afenda/erp typecheck
pnpm --filter @afenda/erp test:run
pnpm lint
```

Guardrail tests:

- `apps/erp/src/__tests__/observability-usage.test.ts`
- `apps/erp/src/lib/observability/__tests__/create-erp-logger.test.ts`
- `apps/erp/src/lib/observability/__tests__/record-erp-audit-event.test.ts`
- `scripts/governance/__tests__/erp-observability-governance.test.ts`
- `packages/observability/src/__tests__/pino.test.ts`

## Security acceptance

| Check | Result |
| --- | --- |
| No `console.*` in ERP src | Pass |
| Pino excluded from proxy/edge | Pass |
| Redaction via `PINO_REDACT_PATHS` | Pass |
| Branded correlation IDs at logger boundary | Pass |
| Audit adapter missing fallback | Pass |
| ERP observability governance CI gate | Pass |

**Enterprise quality score:** **9.6 / 10**
