# PAS-API-REST-001-S2 — REST Request / Response Schema

| Slice ID | PAS-API-REST-001-S2 |
| Status | Planned |
| Prerequisite | S1 Delivered |

## 0. Purpose

Schema-first **Zod** request/response modules per REST operation — implements PAS-API-001 API-003 at REST binding.

## Handoff block

```
1. Objective    — Standardize *.api-contract.ts schema modules linked to family schema authority.
2. Allowed layer— apps/erp/src/server/api/contracts/**/*.api-contract.ts
3. Prohibited   — handler runtime · OpenAPI hand edits
5. Authority    — PAS-API-001-S2 · PAS-API-REST-001 §2.2
6. Gates        — typecheck · test:run
```

## 9. Hard Stops

Schemas are not Enterprise Knowledge definitions.
