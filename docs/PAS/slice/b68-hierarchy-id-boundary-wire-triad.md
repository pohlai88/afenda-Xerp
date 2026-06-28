# Slice B68 — Hierarchy ID Boundary Wire Triad (PAS-001 §4.4)

**Prerequisite:** Slice B67 — PAS-001 doc attestation (`b67-pas001-doc-attestation-closure.md`, `Status: Delivered`)

**Status:** Delivered

**Type:** Implementation

**Risk class:** Low

**Clean Core impact:** A→A — wire triad split only; no resolver or export surface change

## Handoff block

```
Handoff from: docs/PAS/slice/b68-hierarchy-id-boundary-wire-triad.md

1. Objective    — Split hierarchy-id-boundary into PAS §4.4 wire triad (contract/assert/parser); sync layout contract and context registry.
2. Allowed layer— packages/kernel/src/context/** · packages/kernel/src/contracts/kernel-package-layout.contract.ts · docs/PAS/slice/b68-hierarchy-id-boundary-wire-triad.md
3. Files        —
   packages/kernel/src/context/hierarchy-id-boundary.contract.ts
   packages/kernel/src/context/hierarchy-id-boundary.assert.ts (CREATE)
   packages/kernel/src/context/hierarchy-id-boundary.parser.ts (CREATE)
   packages/kernel/src/context/index.ts
   packages/kernel/src/context/context-registry.ts
   packages/kernel/src/contracts/kernel-package-layout.contract.ts
   packages/kernel/src/__tests__/hierarchy-id-boundary.test.ts
   docs/PAS/slice/b68-hierarchy-id-boundary-wire-triad.md
4. Prohibited   — apps/erp/** · packages/database/** · packages/permissions/** · resolver/load/format functions
5. Authority    — PAS-001 §4.4 wire triad · §9 rule 14 · kernel-authority skill
6. Gates        —
   pnpm --filter @afenda/kernel typecheck
   pnpm --filter @afenda/kernel test:run
   pnpm check:kernel-package-structure
   pnpm quality:kernel-context-surface
   pnpm check:kernel-contract-rules
7. Closes       — G3 hierarchy-id-boundary colocated assert+parse
8. Evidence     — hierarchy-id-boundary.{contract,assert,parser}.ts · context/index.ts exports
9. Attestation  — Contract · Test · Governance
```

## DoD

| # | Criterion | Gate |
| --- | --- | --- |
| 1 | Three sibling modules exist | layout contract |
| 2 | Public exports unchanged semantically | hierarchy-id-boundary.test.ts |
| 3 | Registry lists assert + parser | context-registry.ts |
