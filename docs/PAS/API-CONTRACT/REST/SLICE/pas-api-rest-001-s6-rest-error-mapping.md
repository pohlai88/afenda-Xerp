# PAS-API-REST-001-S6 — REST Error Mapping

| Slice ID | PAS-API-REST-001-S6 |
| Status | Planned |
| Bundle | [R3a](./pas-001a-r3a-handler-runtime-envelope.md) |

## 0. Purpose

Map family error doctrine to **RFC 9457 ProblemDetail** + HTTP status (API-009 REST projection).

## 3. Contract Surfaces

`api-error.contract.ts` · `api-envelope.contract.ts` · runtime `api-error.ts`

## 9. Hard Stops

No ad-hoc string error bodies on governed routes.
