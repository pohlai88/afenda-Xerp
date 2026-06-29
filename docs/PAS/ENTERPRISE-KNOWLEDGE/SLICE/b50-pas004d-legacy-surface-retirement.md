# Slice B50 — Legacy Surface Retirement (PAS-004D §4.2)

**Prerequisite:** [B49 Authority mirror sync](b49-pas004d-authority-mirror-sync.md) delivered

**Status:** Delivered — legacy gate `check:knowledge-legacy-surface-retirement` registered 2026-06-29

**Type:** Runtime + governance

**Risk class:** Medium — public loader boundary change; JSON corpus unchanged

**Clean Core impact:** A→A — realizationMapping is authoritative; deprecated adapter derived inline

## Purpose

Retire dual `implementationMapping` + `realizationMapping` on the public TypeScript boundary. Remove `knowledge-relationships.registry.ts` after consumer grep clean. Retain `implementationMapping` in `atoms.json` for one release.

## Handoff block

```
Handoff from: docs/PAS/ENTERPRISE-KNOWLEDGE/SLICE/b50-pas004d-legacy-surface-retirement.md

1. Objective    — Strip implementationMapping at parseAtomCorpus boundary; migrate identity/kernel policies to realizationMapping; inline KNOWLEDGE_RELATIONSHIPS adapter; add check:knowledge-legacy-surface-retirement; register in PKGR04 (delegate registry owner).
2. Allowed layer— packages/enterprise-knowledge/** · scripts/governance/check-knowledge-legacy-surface-retirement.mts · package.json (script only) · docs/PAS/ENTERPRISE-KNOWLEDGE/** · .cursor/skills/enterprise-knowledge/**
3. Files        —
   packages/enterprise-knowledge/src/data/knowledge-data.loader.ts
   packages/enterprise-knowledge/src/policy/knowledge.policy.ts
   packages/enterprise-knowledge/src/policy/knowledge-kernel-mapping.policy.ts
   packages/enterprise-knowledge/src/policy/knowledge-kernel-identity-mapping.policy.ts
   packages/enterprise-knowledge/src/policy/knowledge-realization.policy.ts
   packages/enterprise-knowledge/src/policy/knowledge-transition.policy.ts
   packages/enterprise-knowledge/src/index.ts
   scripts/governance/check-knowledge-legacy-surface-retirement.mts
   scripts/governance/__tests__/check-knowledge-legacy-surface-retirement.test.ts
4. Prohibited   — foundation-disposition.registry.ts (delegate); atoms.json corpus edits; kernel edits
5. Authority    — PAS-004D §4.2 · enterprise-knowledge skill
6. Gates        —
   pnpm check:knowledge-legacy-surface-retirement
   pnpm --filter @afenda/enterprise-knowledge typecheck
   pnpm --filter @afenda/enterprise-knowledge test:run
   pnpm check:knowledge-kernel-mapping
   pnpm check:knowledge-kernel-identity-mapping
   pnpm check:knowledge-realization-mapping
   pnpm check:knowledge-authority-mirror
7. Closes       — PAS-004D §4.2 legacy API retirement; dual mapping surface
8. Evidence     — gate PASS · parsed atoms omit implementationMapping · atoms.json retains legacy field
9. Attestation  — Runtime · Governance
```

## DoD

| # | Criterion | Evidence |
| --- | --- | --- |
| 1 | `parseAtomCorpus` strips `implementationMapping` after validation | unit tests |
| 2 | Platform identity policies validate `realizationMapping` kernel entries | identity + realization gates PASS |
| 3 | `knowledge-relationships.registry.ts` removed; adapter in `knowledge.policy.ts` | legacy gate + grep clean |
| 4 | `check:knowledge-legacy-surface-retirement` registered and passing | CI / shell |
| 5 | pas-status-index **Next sequence item** → B51 after B50 closes | pas-status-index |

## Registry delegation

Append `check:knowledge-legacy-surface-retirement` to PKGR04 gates via **foundation-registry-owner** when gate script lands.
