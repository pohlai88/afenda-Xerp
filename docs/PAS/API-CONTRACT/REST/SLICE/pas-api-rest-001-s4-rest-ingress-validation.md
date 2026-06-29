# PAS-API-REST-001-S4 — REST Ingress Validation

| Slice ID | PAS-API-REST-001-S4 |
| Status | Planned |
| Bundle | [R3a](./pas-001a-r3a-handler-runtime-envelope.md) |

## 0. Purpose

Validate params, query, body, headers **before** handler business logic (API-004 at REST layer).

## 9. Hard Stops

Fail closed on invalid ingress — no silent coercion.
