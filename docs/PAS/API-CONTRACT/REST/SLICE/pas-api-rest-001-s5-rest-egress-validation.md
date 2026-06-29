# PAS-API-REST-001-S5 — REST Egress Validation

| Slice ID | PAS-API-REST-001-S5 |
| Status | Planned |
| Bundle | [R3a](./pas-001a-r3a-handler-runtime-envelope.md) |

## 0. Purpose

Validate handler output **before** JSON serialization (API-005 at REST layer).

## 9. Hard Stops

Handlers may not widen wire shape silently.
