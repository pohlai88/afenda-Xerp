# Slice B74 — Metadata Context Authorization Bridge (PAS-001A §1.2 D6 · IS-003)

> **Historical consumer note (ADR-0027):** Handoff references `@afenda/metadata-ui` and appshell-era wiring. **Live consumer** is PAS-006 + `apps/erp/src/lib/metadata/` — see [R1c](./pas-001a-r1c-metadata-consumer-pas006.md) and [DEVELOPMENT-LANE-BOUNDARIES.md](../../DEVELOPMENT-LANE-BOUNDARIES.md).

> **Position:** Slice `4 of 5` in PAS-001A · Blueprint box: `ERP Integration Spine`

**Prerequisite:** B72 Delivered

**Status:** Delivered (2026-06-28)

**Type:** Implementation

**Risk class:** High

**Clean Core impact:** A→A — consumer wiring to ERP spine

## Purpose

Prove metadata workspace and metadata-ui authorization paths consume verified OperatingContext from ERP spine — IS-003; no parallel scope resolution.

## Handoff block

```
Handoff from: docs/PAS/KERNEL/SLICE/b74-metadata-context-authorization-bridge.md

1. Objective    — Metadata surfaces use ERP operating-context spine for RBAC.
2. Allowed layer— apps/erp/src/app/(protected)/metadata-workspace/** · apps/erp/src/lib/metadata/** · packages/metadata-ui/**
3. Files        —
   apps/erp/src/app/(protected)/metadata-workspace/page.tsx
   scripts/governance/check-metadata-context-authorization-bridge.mts
   docs/PAS/KERNEL/SLICE/b74-metadata-context-authorization-bridge.md
4. Prohibited   — New kernel contracts · metadata-local tenant/company ID parsing · @afenda/database deep imports in metadata lib
5. Authority    — PAS-001A IS-003 · metadata-ui · ERP Context
6. Gates        —
   pnpm check:metadata-context-authorization-bridge
   pnpm --filter @afenda/erp test:run
   pnpm ui:guard:scan
7. Closes       — Closes DoD #1–#3 · IS-003 metadata bridge
8. Evidence     —
   scripts/governance/check-metadata-context-authorization-bridge.mts
   apps/erp/src/app/(protected)/metadata-workspace/page.tsx
   Gate output archived in B75 attestation
9. Attestation  — Security · Test · Governance
```

## Rules frozen

1. Metadata routes delegate to resolveOperatingContextFromHeaders.
2. Metadata actions reject untrusted authority fields.

## DoD

| # | Criterion | Gate | Traces to EFR/EAC |
| --- | --- | --- | --- |
| 1 | Metadata bridge gate passes | pnpm check:metadata-context-authorization-bridge | PAS-001A IS-003 |
| 2 | ERP metadata integration tests pass | pnpm --filter @afenda/erp test:run | PAS-001A §6 matrix row metadata |
| 3 | Governed UI scan clean if metadata-ui touched | pnpm ui:guard:scan | Governed UI policy |

**Field 8 evidence map (author fills after table):**

| DoD # | Evidence path after delivery |
| --- | --- |
| 1 | scripts/governance/check-metadata-context-authorization-bridge.mts |
| 2 | apps/erp/src/app/(protected)/metadata-workspace/page.tsx |
| 3 | Gate output archived in B75 attestation |

## Runtime evidence

| Capability | Proven | Evidence path |
| --- | --- | --- |
| IS-003 metadata authorization bridge | Yes — B74 | `scripts/governance/check-metadata-context-authorization-bridge.mts` |

