# Slice B73 — Kernel ERP Doc Drift Closure (PAS-001A §1.2 D5)

> **Position:** Slice `3 of 5` in PAS-001A · Blueprint box: `ERP Integration Spine`

**Prerequisite:** B71 Delivered

**Status:** Delivered (2026-06-28)

**Type:** Evidence-sync

**Risk class:** Low

**Clean Core impact:** A→A — documentation sync only

## Purpose

Sync documentation with post–PAS-001 runtime: fix stale resolver paths in runtime matrix; close multi-tenancy delivery-doc gaps; update PAS-001 §9 rule-14 prose.

## Handoff block

```
Handoff from: docs/PAS/KERNEL/SLICE/b73-kernel-erp-doc-drift-closure.md

1. Objective    — Documentation reflects ERP resolver + permissions ownership split from B71.
2. Allowed layer— docs/PAS/** · docs/PAS/** · apps/docs delivery evidence if generated
3. Files        —
   docs/PAS/pas-status-index.md
   docs/PAS/KERNEL/multi-tenancy-delivery-evidence.md
   docs/PAS/KERNEL/SLICE/b73-kernel-erp-doc-drift-closure.md
4. Prohibited   — Marking runtime implemented without gate evidence · kernel source edits
5. Authority    — PAS-001A §1.2 · documentation-drift
6. Gates        —
   pnpm check:documentation-drift
   pnpm check:multi-tenancy-context-contracts
7. Closes       — Closes DoD #1–#3 · doc drift closure
8. Evidence     —
   docs/PAS/pas-status-index.md
   docs/PAS/KERNEL/multi-tenancy-delivery-evidence.md
   pnpm check:documentation-drift output
9. Attestation  — Documentation · Governance
```

## Rules frozen

1. No doc cites deleted kernel permission-scope parser path.
2. Runtime matrix permission scope → @afenda/permissions.

## DoD

| # | Criterion | Gate | Traces to EFR/EAC |
| --- | --- | --- | --- |
| 1 | documentation-drift green | pnpm check:documentation-drift | PAS-001A §1.2 D5 |
| 2 | multi-tenancy context contracts green | pnpm check:multi-tenancy-context-contracts | Kernel Blueprint §8 Step 8 |
| 3 | No stale kernel parser paths in docs | ripgrep docs/ | PAS-001A INV-002 |

**Field 8 evidence map (author fills after table):**

| DoD # | Evidence path after delivery |
| --- | --- |
| 1 | docs/PAS/pas-status-index.md |
| 2 | docs/PAS/KERNEL/multi-tenancy-delivery-evidence.md |
| 3 | pnpm check:documentation-drift output |

## Runtime evidence

| Capability | Proven | Evidence path |
| --- | --- | --- |
| Doc/runtime parity | Yes — B73 | `docs/PAS/pas-status-index.md` |

