# PAS-API-REST-001-S8 — OpenAPI Drift Gate

| Slice ID | PAS-API-REST-001-S8 |
| Status | Planned |
| Bundle | [R3c](./pas-001a-r3c-route-coverage-drift-attestation.md) |

## 0. Purpose

CI gate: generated OpenAPI equals checked-in snapshot.

## Handoff block

```
6. Gates        — pnpm check:openapi-drift
```

## 9. Hard Stops

Drift gate must fail on unapproved snapshot changes.
