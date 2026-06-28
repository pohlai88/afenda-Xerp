# Slice B33 — Kernel Identity Mapping Gate (PAS-004B §4.1)

**Prerequisite:** [B32 ERP consumer integration](b32-erp-consumer-integration.md) delivered

**Status:** Delivered — 2026-06-28

**Type:** Implementation

**Risk class:** Medium — extends kernel mapping validation to ADR-0021 identity constitution paths; requires `kernel-authority` read before edits

**Clean Core impact:** A→A — additive policy + gate; atom mapping path corrections only where B33 gate fails

## Purpose

Close the gap between PAS-004A B26 generic kernel path lint and PAS-001 §4.1 / ADR-0021 **identity constitution** discipline. Platform identity atoms must cite validated contract paths under `packages/kernel/src/identity/` (or documented platform-id registry entries), use branded ID names in mapping notes, and never reference parser/assert modules.

**Scope discipline:** this slice is **B33 only**. Do not implement B34–B37 in the same session. If identity mapping is wrong here, metadata and docs consumers will inherit wrong meaning.

## Handoff block

```
Handoff from: docs/PAS/slice/b33-kernel-identity-mapping-gate.md

1. Objective    — Add identity-constitution mapping policy + check:knowledge-kernel-identity-mapping gate; align platform identity atoms' implementationMapping to ADR-0021 kernel paths.
2. Allowed layer— packages/enterprise-knowledge/src/policy/** · packages/enterprise-knowledge/src/__tests__/** · packages/enterprise-knowledge/src/data/atoms.json (mapping paths only) · scripts/governance/check-knowledge-kernel-identity-mapping.mts · package.json (script) · docs/PAS/**
3. Files        —
   packages/enterprise-knowledge/src/policy/knowledge-kernel-identity-mapping.policy.ts
   packages/enterprise-knowledge/src/__tests__/knowledge-kernel-identity-mapping.test.ts
   packages/enterprise-knowledge/src/data/atoms.json
   scripts/governance/check-knowledge-kernel-identity-mapping.mts
   package.json
   docs/PAS/slice/b33-kernel-identity-mapping-gate.md
   docs/PAS/PAS-004B-ENTERPRISE-KNOWLEDGE-KERNEL-CONSUMER-STANDARD.md
4. Prohibited   — packages/kernel/src/** edits; parser/assert duplication; B34–B37 work in same session; metadata/erp imports into enterprise-knowledge; foundation-disposition.registry.ts (B37)
5. Authority    — PAS-004B §4.1 · PAS-001 §4.1 · ADR-0021 · kernel-authority skill · enterprise-knowledge skill
6. Gates        —
   pnpm --filter @afenda/enterprise-knowledge typecheck
   pnpm --filter @afenda/enterprise-knowledge test:run
   pnpm check:knowledge-conformance
   pnpm check:knowledge-kernel-mapping
   pnpm check:knowledge-kernel-identity-mapping
   pnpm quality:boundaries
7. Closes       — PAS-004B scorecard row #16; identity mapping honesty for platform identity atoms
8. Evidence     —
   packages/enterprise-knowledge/src/policy/knowledge-kernel-identity-mapping.policy.ts
   scripts/governance/check-knowledge-kernel-identity-mapping.mts
9. Attestation  — Contract · Test · Governance · Documentation
```

## Rules frozen

1. Atoms **reference** kernel identity contracts — never copy parser/assert logic into enterprise-knowledge.
2. `implementationMapping.contractPath` must end with `.contract.ts` — B26 parser prohibition remains.
3. Platform identity atom IDs (`tenant`, `legal_entity`, `organization_unit`, `workspace`, `surface`) must pass identity mapping validation after slice delivery.
4. Read `kernel-authority` Phase 0 and ADR-0021 before changing any mapping path.

## DoD

| # | Criterion | Gate |
| --- | --- | --- |
| 1 | Policy validates identity constitution path prefix and prohibited parser/assert suffixes | unit tests |
| 2 | All platform identity atoms pass identity mapping validation | `pnpm check:knowledge-kernel-identity-mapping` |
| 3 | Existing B26 kernel mapping gate still passes | `pnpm check:knowledge-kernel-mapping` |
| 4 | No new runtime npm dependencies | `pnpm quality:boundaries` |

## Runtime evidence

| Capability | Proven | Evidence path |
| --- | --- | --- |
| Kernel identity mapping gate | No — Slice B33 | `scripts/governance/check-knowledge-kernel-identity-mapping.mts` |
| Platform identity atoms ADR-0021 aligned | Yes — Slice B33 delivered 2026-06-28 | `packages/enterprise-knowledge/src/data/atoms.json` |

## Identity atoms in scope

| atomId | Expected kernel surface |
| --- | --- |
| `tenant` | Tenant / platform hierarchy identity contract |
| `legal_entity` | Legal entity identity contract |
| `organization_unit` | Organization unit identity contract |
| `workspace` | Workspace identity contract |
| `surface` | Surface / presentation scope vocabulary (kernel context reference) |

Exact `contractPath` values are resolved at implementation time against live `packages/kernel/src/identity/**` — do not guess paths; verify with filesystem + kernel-authority skill.
