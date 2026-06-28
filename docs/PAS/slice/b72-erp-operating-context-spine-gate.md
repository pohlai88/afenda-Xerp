# Slice B72 — ERP Operating Context Spine Gate (PAS-001A §2.3)

**Status:** Delivered (2026-06-29)

**Objective:** Add `check:erp-operating-context-spine` governance gate that verifies every `CONTEXT_INTEGRATION_WIRING` and `AUTH_SESSION_BRIDGE_WIRING` entry in `context-integration-registry.ts` is wired in source (module exists, delegate exported, no forbidden imports).

**Authority:** PAS-001A §2.3 · §3 Context Map · [multi-tenancy.md](../../architecture/multi-tenancy.md) Step 8

**Prerequisite:** B71 Delivered

---

## Handoff (paste into Phase 0)

| Field | Value |
| --- | --- |
| **Slice** | B72 |
| **PAS** | PAS-001A |
| **Objective** | Machine-enforce ERP operating-context integration registry |
| **Allowed layer** | `scripts/governance/check-erp-operating-context-spine.mts`, `apps/erp/src/lib/context/context-integration-registry.ts`, ERP integration tests |
| **Prohibited** | Kernel contract changes; new resolver shortcuts bypassing `resolveOperatingContextFromHeaders` |
| **Files (expected)** | New gate script; `package.json` script; optional `apps/erp/src/lib/context/__tests__/context-integration-registry.test.ts` |
| **Authority** | ERP Context · Multi-tenancy architecture |
| **Gates** | `pnpm check:erp-operating-context-spine` · `pnpm check:erp-context-surface` · `pnpm --filter @afenda/erp test:run` |

---

## Gate rules (minimum)

1. Each `CONTEXT_INTEGRATION_WIRING[].module` path resolves under `apps/erp/src/`
2. Each `delegate` symbol appears in that module (export or re-export)
3. Registry IDs are unique
4. `AUTH_SESSION_BRIDGE_WIRING` entries satisfy same module/delegate checks
5. Scan integration modules for forbidden patterns from `check-erp-context-surface.mts`

## Acceptance

| Check | Required |
| --- | --- |
| Gate fails when registry entry points to missing module | Yes |
| Gate fails when delegate symbol missing | Yes |
| Gate passes on current mainline registry | Yes |
| Wired into `quality:erp-context-surface` or documented in delivery-evidence registry | Yes |
