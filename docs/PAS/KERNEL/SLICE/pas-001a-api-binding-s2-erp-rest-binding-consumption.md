# PAS-001A-API-BINDING-S2 — ERP REST Binding Consumption

| Slice ID | PAS-001A-API-BINDING-S2 |
| Status | Planned |
| Prerequisite | S1 · [PAS-API-REST-001-S1](../../API-CONTRACT/REST/SLICE/pas-api-rest-001-s1-rest-operation-binding.md) |

## 0. Purpose

Prove ERP `apps/erp` internal v1 routes consume **PAS-API-REST-001** registry and handler discipline.

## Handoff block

```
1. Objective    — Wire IS-004 to REST binding contracts; attestation that all internal v1 routes reference registry.
2. Allowed layer— apps/erp/src/app/api/internal/v1/** · apps/erp/src/server/api/**
6. Gates        — typecheck · check:api-route-catalog (when active)
```

## 9. Hard Stops

No REST family authority claims in PAS-001A.
