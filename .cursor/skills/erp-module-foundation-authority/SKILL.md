---
name: erp-module-foundation-authority
description: ERP module foundation authority for PAS-001C — governed LoB module identity, readiness bundles, and check:erp-module-* gates. Use when scaffolding module runtime, defining foundation bundles, or touching packages/erp-module-foundation.
---

# @afenda/erp-module-foundation — Authority Skill (PAS-001C)

## PAS rollout status

| Field | Value |
| --- | --- |
| **Runtime status** | `foundation_authority` — define*/assert* helpers; composite gates live |
| **Fingerprint** | `ERP_MODULE_FOUNDATION-2026-06-30-v4` |
| **Remaining slices** | Platform closed — LoB slices under [ERP-MODULES/SLICE](../../../docs/PAS/ERP-MODULES/SLICE/README.md) |

**Canonical:** [PAS-001C](../../../docs/PAS/KERNEL/PAS-001C-ERP-MODULE-FOUNDATION-STANDARD.md) · [Blueprint](../../../docs/BLUEPRINT/erp-module-runtime-blueprint.md) · [Module Foundation NS](../../../docs/NORTHSTAR/erp-module-runtime-north-star.md) · [Template](../../../docs/PAS/ERP-MODULES/erp-runtime-module-foundation.template.md)

**Doctrine:** Kernel owns wire words. Enterprise Knowledge owns meaning. This package owns **delivery shape** only. LoB runtime owns behavior.

---

## Boundary (one sentence)

`@afenda/erp-module-foundation` provides cross-LoB **foundation factories and validators**; it never implements business behavior, persistence, permission evaluation, operating-context assembly, or kernel wire vocabulary amendment.

---

## When to use

- `packages/erp-module-foundation/**`
- `scripts/governance/check-erp-module-*.mts`
- Scaffolding LoB module foundation bundles
- Readiness reports before operational promotion
- Questions about module identity, ownership rows, or path law

Pair with **kernel-authority** when touching KV IDs · **multi-tenancy-erp** when wiring spine consumers in `apps/erp`.

---

## Hard stops

- Do not add `@afenda/kernel` imports to this package (gate enforced)
- Do not add resolver, formatting, or permission evaluation here
- Do not create default top-level `packages/procurement/` — use `packages/features/erp-modules/src/{slug}/`
- Do not mark LoB operational from `PROCUREMENT_FOUNDATION_BUNDLE` alone (wire-phase reference)
- Do not amend kernel wire vocabulary from module foundation work

---

## Phase 0 — documentation or implementation

```
1. Objective       — <exact change>
2. Allowed layer   — packages/erp-module-foundation · scripts/governance/check-erp-module-* · docs/PAS (if doc slice)
3. Files           — explicit list
4. Prohibited      — packages/kernel/** · LoB runtime without slice · apps/erp (unless slice says ingress)
5. Authority       — PAS-001C · Module Foundation NS
6. Gates           — pnpm check:erp-module-foundation
                     pnpm --filter @afenda/erp-module-foundation typecheck
                     pnpm --filter @afenda/erp-module-foundation test:run
```

---

## Read order

1. This SKILL.md
2. [PAS-001C §0–§4](../../../docs/PAS/KERNEL/PAS-001C-ERP-MODULE-FOUNDATION-STANDARD.md)
3. [Template](../../../docs/PAS/ERP-MODULES/erp-runtime-module-foundation.template.md)
4. Slice 9-field handoff
5. `/afenda-coding-session` Phase 0 → code

---

## Public helpers (summary)

| Helper | Purpose |
| --- | --- |
| `defineErpRuntimeModule` | Module identity + KV binding |
| `defineErpRuntimeModuleRegistry` | Cross-module registry |
| `defineModuleOwnership` | One owner per surface |
| `defineModuleKnowledgeMap` | PAS-004 alignment statuses |
| `defineModuleContextSpineConsumer` | PAS-001A consumer contract |
| `defineModulePermissionBinding` | Permission parity |
| `defineModuleAuditMap` / `defineModuleEventCatalog` / `defineModuleOutboxContract` | Integration vocabulary |
| `defineModuleMetadataBinding` | PAS-006 surface binding |
| `defineModuleDatabaseBoundary` | Persistence declaration |
| `defineModuleReadiness` | Readiness matrix |
| `assertModuleReadiness` / `assertModuleStatusRequirements` | Fail-closed validation |
| `renderModuleReadinessReport` | Template §7 output |

Full export list: [package index](../../../packages/erp-module-foundation/src/index.ts)

---

## Required gates

```bash
pnpm check:erp-module-foundation
pnpm --filter @afenda/erp-module-foundation typecheck
pnpm --filter @afenda/erp-module-foundation test:run
pnpm check:foundation-disposition
```

Sub-gates: see PAS-001C §13.

---

## Path law

```text
packages/features/erp-modules/src/{module-slug}/   # LoB runtime (future)
packages/erp-module-foundation/                    # This PAS (live)
```

---

## Sync checksum

| Source | Last synced |
| --- | --- |
| PAS-001C | 2026-06-30 |
| Module Foundation NS | 2026-06-30 |
| Blueprint | 2026-06-30 |
