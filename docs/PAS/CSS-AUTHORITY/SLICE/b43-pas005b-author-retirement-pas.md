# Slice B43 ÔÇö Author PAS-005B + ADR-0025 (PAS-005B ┬º9)

**Prerequisite:** PAS-005 B26ÔÇôB37 delivered ┬À PAS-005A B42p delivered ┬À plan `pas-005b_design_retirement_93e823d5`

**Status:** Delivered (2026-06-29)

**Type:** Evidence-sync (doctrine only ÔÇö no runtime deletion)

**Risk class:** Low

**Clean Core impact:** AÔåÆA

## Purpose

Author the canonical PAS-005B retirement doctrine, propose ADR-0025, sync pas-status-index and authority skills ÔÇö without touching runtime code or deleting `@afenda/design-system`.

## Handoff block

```
Handoff from: docs/PAS/CSS-AUTHORITY/SLICE/b43-pas005b-author-retirement-pas.md

1. Objective    ÔÇö Author PAS-005B (retirement_candidate), ADR-0025 (Proposed), pas-status-index row, css-authority + shadcn-studio-authority skill sync, design-system tombstone pointer.
2. Allowed layerÔÇö docs/PAS/** ┬À docs/adr/** ┬À .cursor/skills/css-authority/** ┬À .cursor/skills/shadcn-studio-authority/** ┬À packages/design-system/PAS-005B-*.md (pointer only)
3. Files        ÔÇö
   docs/PAS/CSS-AUTHORITY/PAS-005B-DESIGN-SYSTEM-RETIREMENT-STANDARD.md
   docs/adr/ADR-0025-design-system-retirement.md
   docs/PAS/CSS-AUTHORITY/SLICE/b43-pas005b-author-retirement-pas.md
   docs/PAS/pas-status-index.md
   docs/PAS/README.md
   .cursor/skills/css-authority/SKILL.md
   .cursor/skills/shadcn-studio-authority/SKILL.md
   packages/design-system/PAS-005B-DESIGN-SYSTEM-RETIREMENT-STANDARD.md
4. Prohibited   ÔÇö packages/design-system/** deletion or runtime edits ┬À foundation-disposition.registry.ts ┬À packages/ui/** ┬À packages/css-authority/** ┬À B44+ implementation
5. Authority    ÔÇö PAS-005B (new) ┬À PAS-005 ┬À PAS-005A ┬À ADR-0017 ┬À ADR-0014 ┬À pas-slice-planner ┬À coding-consistency-bundle
6. Gates        ÔÇö
   pnpm check:documentation-drift
   pnpm check:foundation-disposition
7. Closes       ÔÇö PAS-005B doctrine gap ┬À ADR-0025 proposed ┬À retirement_candidate maturity defined
8. Evidence     ÔÇö
   docs/PAS/CSS-AUTHORITY/PAS-005B-DESIGN-SYSTEM-RETIREMENT-STANDARD.md
   docs/adr/ADR-0025-design-system-retirement.md
   docs/PAS/pas-status-index.md (PAS-005B section)
9. Attestation  ÔÇö Documentation ┬À Governance (doctrine) ┬À Architecture (retirement map)
```

## Rules frozen

1. css-authority remains constitutional ÔÇö not merged into shadcn-studio.
2. `@afenda/ui` not deleted in PAS-005B v1.
3. Package deletion blocked until ADR-0025 Accepted + B44 readiness gate.
4. Maturity label is `retirement_candidate`, not `mvp_authority`.
5. Five hard rules in PAS-005B ┬º0 are binding.

## DoD

| # | Criterion | Gate |
| --- | --- | --- |
| 1 | PAS-005B canonical doc exists with retirement_candidate maturity | Manual review |
| 2 | ADR-0025 Proposed with acceptance criteria | Manual review |
| 3 | pas-status-index PAS-005B section | `pnpm check:documentation-drift` |
| 4 | Skills mirror runtime_status + remaining_slices | Manual review |
| 5 | No runtime code changed | `git diff -- packages/` empty except tombstone |
