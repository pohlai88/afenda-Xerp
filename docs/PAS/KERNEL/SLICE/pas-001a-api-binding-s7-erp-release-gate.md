# PAS-001A-API-BINDING-S7 — ERP Release Gate

| Slice ID | PAS-001A-API-BINDING-S7 |
| Status | Planned |

## 0. Purpose

ERP cannot release with API contract drift — IS-004 closure gate on PAS-001A.

## Handoff block

```
6. Gates        — check:api-contracts · check:openapi-drift · check:api-route-catalog · check:foundation-disposition
```

## 7. Acceptance

PAS-001A-API-BINDING **Delivered** when S1–S7 complete and IS-004 marked Production Accepted in pas-status-index.

## 9. Hard Stops

ERP release gate does not activate reserved RPC/GQL/Event/Agent bindings.
