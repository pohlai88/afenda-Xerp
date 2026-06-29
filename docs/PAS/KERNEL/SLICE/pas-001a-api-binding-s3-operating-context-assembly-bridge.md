# PAS-001A-API-BINDING-S3 — Operating Context Assembly Bridge

| Slice ID | PAS-001A-API-BINDING-S3 |
| Status | Planned |
| Bundle | [R3b](../../API-CONTRACT/REST/SLICE/pas-001a-r3b-service-actor-context-assembly.md) |

## 0. Purpose

Protected API operations receive operating context from **IS-002 spine** — not handler-local inference.

## Handoff block

```
1. Objective    — erp-api-context-bridge.contract.ts; service-actor context via spine (closes R2 deferred).
2. Allowed layer— apps/erp/src/lib/context/** · apps/erp/src/server/api/runtime/**
5. Authority    — PAS-001A IS-002 · PAS-API-001 API-007
6. Gates        — pnpm check:erp-operating-context-spine · pnpm check:erp-service-actor-s2s-attestation
```

## 9. Hard Stops

No handler-local tenant/company fallback from URL slugs.
