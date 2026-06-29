# Slice B26 — Kernel Mapping Gate (PAS-004A §4.2 · §13.3)

**Prerequisite:** [B25 JSON data authority](b25-10-json-data-authority.md) delivered · [PAS-004A](../PAS-004A-ENTERPRISE-KNOWLEDGE-PLATFORM-STANDARD.md) published

**Status:** Delivered · 2026-06-28

**Type:** Implementation

**Risk class:** Medium — read-only validation against kernel wire paths; no corpus mutation

**Clean Core impact:** A→A — policy + governance gate only

## Purpose

Close PAS-004A §4.2 kernel implementation mapping enforcement:

1. Atoms with `implementationMapping` must cite existing kernel **contract** evidence under `packages/kernel/src/`.
2. No atom evidence may reference `*.parser.ts` (kernel-internal parsers).
3. Every `acceptanceChain[].by` must resolve via `AcceptingAuthorityRegistry` (including B25 legacy enum aliases).

## Handoff block

```
Handoff from: docs/PAS/ENTERPRISE-KNOWLEDGE/SLICE/b26-kernel-mapping-gate.md

1. Objective    — Add kernel mapping policy + B26 governance gate; validate accepting authority refs in registry conformance.
2. Allowed layer— packages/enterprise-knowledge/** · scripts/governance/check-knowledge-kernel-mapping.mts
                  · package.json (script only) · docs/PAS/ENTERPRISE-KNOWLEDGE/SLICE/b26-kernel-mapping-gate.md · docs/PAS/ENTERPRISE-KNOWLEDGE/PAS-004A-*.md (status)
3. Files        —
   packages/enterprise-knowledge/src/data/accepting-authority.registry.ts          (resolveAcceptingAuthorityRef + legacy aliases)
   packages/enterprise-knowledge/src/policy/knowledge-kernel-mapping.policy.ts    (NEW)
   packages/enterprise-knowledge/src/policy/knowledge.policy.ts                    (acceptanceChain authority lint)
   packages/enterprise-knowledge/src/index.ts                                      (export new policy surfaces)
   packages/enterprise-knowledge/src/__tests__/kernel-mapping.test.ts              (NEW)
   packages/enterprise-knowledge/src/__tests__/accepting-authority.test.ts         (chain resolution tests)
   scripts/governance/check-knowledge-kernel-mapping.mts                           (NEW gate)
   package.json
   docs/PAS/ENTERPRISE-KNOWLEDGE/SLICE/b26-kernel-mapping-gate.md
   docs/PAS/ENTERPRISE-KNOWLEDGE/PAS-004A-ENTERPRISE-KNOWLEDGE-PLATFORM-STANDARD.md                      (§17 status)
4. Prohibited   — kernel package edits; atoms.json corpus migration (B29); consumer proof (B27); glossary sync (B28)
5. Authority    — PAS-004A §4.2 · PAS-001 kernel wire triad · kernel-authority skill · enterprise-knowledge skill
6. Gates        —
   pnpm --filter @afenda/enterprise-knowledge typecheck
   pnpm --filter @afenda/enterprise-knowledge test:run
   pnpm check:knowledge-conformance
   pnpm check:knowledge-json-authority
   pnpm check:knowledge-kernel-mapping
   pnpm quality:boundaries
   pnpm check:foundation-disposition
7. Closes       — PAS-004A §4.2 B26 gate; scorecard row #2 (no kernel parser duplication); authority registry lint for chain refs
8. Evidence     —
   packages/enterprise-knowledge/src/policy/knowledge-kernel-mapping.policy.ts
   scripts/governance/check-knowledge-kernel-mapping.mts
   packages/enterprise-knowledge/src/__tests__/kernel-mapping.test.ts
9. Attestation  — Contract · Test · Governance · Documentation
```

## Rules frozen

1. Kernel evidence paths are repo-relative strings starting with `packages/kernel/src/`.
2. Mapped atoms require at least one `*.contract.ts` kernel evidence path that exists on disk.
3. Legacy `architecture_authority` / `accounting_authority` / `erp_authority` chain refs resolve via alias map until B29 canonical migration.

## Runtime evidence

| Check | Result |
| --- | --- |
| `pnpm check:knowledge-kernel-mapping` | Yes |
| Mapped atoms cite live kernel contracts | Yes (legal_entity, organization_unit, workspace, surface) |
