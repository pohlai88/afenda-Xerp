# Slice B43 — Author PAS-005B + ADR-0025 (PAS-005B §9)

**Prerequisite:** PAS-005 B26–B37 delivered · PAS-005A B42p delivered · plan `pas-005b_design_retirement_93e823d5`

**Status:** Delivered (2026-06-29)

**Type:** Evidence-sync (doctrine only — no runtime deletion)

**Risk class:** Low

**Clean Core impact:** A→A

## Purpose

Author the canonical PAS-005B retirement doctrine, propose ADR-0025, sync pas-status-index and authority skills — without touching runtime code or deleting `@afenda/design-system`.

## Handoff block

```
Handoff from: docs/PAS/slice/b43-pas005b-author-retirement-pas.md

1. Objective    — Author PAS-005B (retirement_candidate), ADR-0025 (Proposed), pas-status-index row, css-authority + shadcn-studio-authority skill sync, design-system tombstone pointer.
2. Allowed layer— docs/PAS/** · docs/adr/** · .cursor/skills/css-authority/** · .cursor/skills/shadcn-studio-authority/** · packages/design-system/PAS-005B-*.md (pointer only)
3. Files        —
   docs/PAS/PAS-005B-DESIGN-SYSTEM-RETIREMENT-STANDARD.md
   docs/adr/ADR-0025-design-system-retirement.md
   docs/PAS/slice/b43-pas005b-author-retirement-pas.md
   docs/PAS/pas-status-index.md
   docs/PAS/README.md
   .cursor/skills/css-authority/SKILL.md
   .cursor/skills/shadcn-studio-authority/SKILL.md
   packages/design-system/PAS-005B-DESIGN-SYSTEM-RETIREMENT-STANDARD.md
4. Prohibited   — packages/design-system/** deletion or runtime edits · foundation-disposition.registry.ts · packages/ui/** · packages/css-authority/** · B44+ implementation
5. Authority    — PAS-005B (new) · PAS-005 · PAS-005A · ADR-0017 · ADR-0014 · pas-slice-planner · coding-consistency-bundle
6. Gates        —
   pnpm check:documentation-drift
   pnpm check:foundation-disposition
7. Closes       — PAS-005B doctrine gap · ADR-0025 proposed · retirement_candidate maturity defined
8. Evidence     —
   docs/PAS/PAS-005B-DESIGN-SYSTEM-RETIREMENT-STANDARD.md
   docs/adr/ADR-0025-design-system-retirement.md
   docs/PAS/pas-status-index.md (PAS-005B section)
9. Attestation  — Documentation · Governance (doctrine) · Architecture (retirement map)
```

## Rules frozen

1. css-authority remains constitutional — not merged into shadcn-studio.
2. `@afenda/ui` not deleted in PAS-005B v1.
3. Package deletion blocked until ADR-0025 Accepted + B44 readiness gate.
4. Maturity label is `retirement_candidate`, not `mvp_authority`.
5. Five hard rules in PAS-005B §0 are binding.

## DoD

| # | Criterion | Gate |
| --- | --- | --- |
| 1 | PAS-005B canonical doc exists with retirement_candidate maturity | Manual review |
| 2 | ADR-0025 Proposed with acceptance criteria | Manual review |
| 3 | pas-status-index PAS-005B section | `pnpm check:documentation-drift` |
| 4 | Skills mirror runtime_status + remaining_slices | Manual review |
| 5 | No runtime code changed | `git diff -- packages/` empty except tombstone |
