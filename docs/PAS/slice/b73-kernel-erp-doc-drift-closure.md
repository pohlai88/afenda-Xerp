# Slice B73 — Kernel ERP Doc Drift Closure (PAS-001A §1.2 D5)

**Status:** Delivered (2026-06-29)

**Objective:** Sync documentation with post–PAS-001 runtime: fix stale kernel resolver paths in runtime matrix, close multi-tenancy delivery-doc gaps, update PAS-001 §9 rule-14 prose (wire triad gate delivered in B69).

**Authority:** PAS-001A · `documentation-drift` agent

**Prerequisite:** B71 Delivered (permission paths must be final before doc cites)

---

## Handoff (paste into Phase 0)

| Field | Value |
| --- | --- |
| **Slice** | B73 |
| **PAS** | PAS-001A |
| **Objective** | Documentation reflects ERP resolver + permissions ownership |
| **Allowed layer** | `docs/architecture/afenda-runtime-truth-matrix.md`, `docs/architecture/multi-tenancy.md`, `docs/PAS/PAS-001-KERNEL-AUTHORITY-STANDARD.md` (prose only), delivery evidence MDX if generated |
| **Prohibited** | Marking runtime capabilities implemented without gate evidence; kernel source edits |
| **Files (expected)** | Runtime matrix rows for operating context, permission scope, accounting readiness preview |
| **Authority** | Documentation drift · Architecture |
| **Gates** | `pnpm check:documentation-drift` · `pnpm check:multi-tenancy-context-contracts` |

---

## Target doc updates

- [x] Runtime matrix: permission scope parser path → `@afenda/permissions`
- [x] Runtime matrix: kernel projection path documented
- [x] Accounting readiness preview partial rows → `implemented` only where B72 evidence exists
- [x] PAS-001 §9: rule 14 no longer "deferred" — cite `check:kernel-context-wire-triad`
- [x] Multi-tenancy delivery doc: Step 8 integration registry reference

## Acceptance

| Check | Required |
| --- | --- |
| `check:documentation-drift` green | Yes |
| `check:multi-tenancy-context-contracts` green | Yes |
| No doc cites deleted `permission-scope-context.parser.ts` in kernel | Yes |
