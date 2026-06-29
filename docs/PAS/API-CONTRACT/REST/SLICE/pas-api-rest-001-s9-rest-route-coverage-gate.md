# PAS-API-REST-001-S9 — REST Route Coverage Gate

| Slice ID | PAS-API-REST-001-S9 |
| Status | Planned |
| Bundle | [R3c](./pas-001a-r3c-route-coverage-drift-attestation.md) |

## 0. Purpose

No governed route without registry entry; no registry entry without route wiring.

## Handoff block

```
6. Gates        — pnpm check:api-route-catalog · pnpm check:api-contracts
```

## 9. Hard Stops

REST-INV-001: every governed route uses createApiHandler.
