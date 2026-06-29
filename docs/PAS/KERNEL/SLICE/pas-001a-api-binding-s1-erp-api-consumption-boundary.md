# PAS-001A-API-BINDING-S1 — ERP API Consumption Boundary

| Slice ID | PAS-001A-API-BINDING-S1 |
| Parent PAS | [PAS-001A-API-BINDING](../PAS-001A-API-BINDING-ERP-INTEGRATION-SPINE-CONSUMPTION.md) |
| Status | Planned |
| Scope | Document + type proof that ERP consumes PAS-API-001; does not own family doctrine |

## 0. Purpose

Formalize ERP Integration Spine as **consumer** of Platform API Contract — IS-004 references family + REST binding without redefining invariants.

## Handoff block

```
Handoff from: docs/PAS/KERNEL/SLICE/pas-001a-api-binding-s1-erp-api-consumption-boundary.md
1. Objective    — erp-api-consumption.contract.ts + PAS-001A §6.1.3 cross-links proving consumption boundary.
2. Allowed layer— apps/erp/src/server/api/contracts/** · docs/PAS/KERNEL/PAS-001A*.md · docs/PAS/API-CONTRACT/**
3. Files        — erp-api-consumption.contract.ts (new) · PAS-001A-API-BINDING.md · PAS-001A §6.1.3
4. Prohibited   — PAS-API-001 invariant edits · kernel · new routes
5. Authority    — PAS-001A-API-BINDING §1–§2 · PAS-API-001
6. Gates        — pnpm --filter @afenda/erp typecheck · pnpm check:documentation-drift
7. Closes       — Consumption boundary typed + documented
8. Evidence     — erp-api-consumption.contract.ts · PAS-001A §6.1.3
9. Attestation  — Documentation · Contract
```

## 9. Hard Stops

Do not nest API doctrine in PAS-001A.
