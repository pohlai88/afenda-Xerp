# PAS-API-RPC-001-S1 — RPC Operation Binding

| Status | Planned (Reserved binding) |
| Parent | [PAS-API-RPC-001](../PAS-API-RPC-001-GRPC-CONNECT-PROTOBUF-BINDING-STANDARD.md) |

## 0. Purpose

Map [PAS-API-001](../../PAS-API-001-PLATFORM-API-CONTRACT-AUTHORITY-STANDARD.md) `ApiOperationId` to RPC **service + method** — no REST paths.

## 3. Contract Surfaces

`rpc-operation-binding.contract.ts` · `rpc-service.contract.ts`

## 9. Hard Stops

No `.proto` without registry operation identity · No generated TS as authority · Activate only on ADR.
