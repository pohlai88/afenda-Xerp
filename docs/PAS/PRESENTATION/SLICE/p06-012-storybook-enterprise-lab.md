# Slice P06-012 — Storybook Enterprise Lab (PAS-006A)

> **Position:** Slice `12` in PAS-006 family · Blueprint box: **shadcn/studio Presentation**

**Prerequisite:** P06-011 Delivered · `@afenda/shadcn-studio/lab` barrel live

**Status:** Delivered (2026-07-01)

**Type:** Lab verification + CI smoke (no ERP route changes)

**Risk class:** Low

**Clean Core impact:** B→B — presentation lab only; no kernel vocabulary or accounting runtime

## Purpose

Close the gap between **Storybook 10 dev lab** and **enterprise verification**: CI smoke tests, import-zone gate, static build, lab onboarding surface, and scoped Vitest browser runs via `lab-smoke` tag.

## Handoff block

```
Handoff from: docs/PAS/PRESENTATION/SLICE/p06-012-storybook-enterprise-lab.md

1. Objective    — Enterprise Storybook lab: preview/lab parameters, lab-smoke Vitest runs, CI workflow, welcome surface, typecheck green.
2. Allowed layer— apps/storybook/** · packages/shadcn-studio/src/_storybook/** · packages/shadcn-studio/src/lab/** · .github/workflows/storybook-lab.yml · docs/PAS/PRESENTATION/** · .cursor/skills/afenda-storybook/SKILL.md · foundation-disposition.registry.ts (PKG021 evidence/gates only)
3. Files        —
   apps/storybook/.storybook/preview.tsx
   apps/storybook/.storybook/vitest.setup.ts
   apps/storybook/.storybook/manager.ts
   apps/storybook/.storybook/main.ts
   apps/storybook/vitest.storybook.config.ts
   apps/storybook/stories/lab-welcome.stories.tsx
   packages/shadcn-studio/src/_storybook/story-parameters.ts
   packages/shadcn-studio/src/_storybook/lab-welcome.compositions.tsx
   packages/shadcn-studio/src/shadcn-studio-theme-lab.stories.tsx
   .github/workflows/storybook-lab.yml
   docs/PAS/PRESENTATION/SLICE/p06-012-storybook-enterprise-lab.md
   docs/PAS/PRESENTATION/SLICE/presentation-slice-catalog.md
   docs/PAS/PRESENTATION/SLICE/README.md
   docs/PAS/PRESENTATION/PAS-006A-SHADCN-STUDIO-PRODUCT-STANDARD.md (§2 link)
   packages/architecture-authority/src/data/foundation-disposition.registry.ts (PKG021)
4. Prohibited   — ERP route promotion · MCP path renames · full-catalog a11y hard-fail in CI · PAS-005 re-execution · PKGR05A lane change
5. Authority    — PAS-006A · ADR-0027 · afenda-storybook skill · P06-011 lab barrel
6. Gates        —
   pnpm --filter @afenda/storybook typecheck
   pnpm test:storybook:run
   pnpm storybook:build
   pnpm check:studio-import-zones
   pnpm check:documentation-drift
7. Closes       — Enterprise lab CI smoke · PKG021 registry evidence sync · PAS-006A §2 Storybook lab row
8. Evidence     —
   .github/workflows/storybook-lab.yml (build + test jobs)
   apps/storybook/.storybook/preview.tsx (inline storySort · lab parameters)
   lab-smoke tag on Afenda/Lab Welcome + Theme Customizer Lab
9. Attestation  — Documentation · CI · Registry (PKG021)
```

## Delivery criteria

| # | Criterion | Evidence |
| --- | --- | --- |
| 1 | Lab parameters centralized in `@afenda/shadcn-studio/lab` | `src/lab/index.ts` |
| 2 | Storybook 10 inline `storySort` in preview | `apps/storybook/.storybook/preview.tsx` |
| 3 | Vitest browser smoke via `lab-smoke` tag (not full 113-story catalog) | `vitest.storybook.config.ts` |
| 4 | CI: typecheck + import zones + build + browser tests | `storybook-lab.yml` |
| 5 | Welcome onboarding lists acceptance gates + lab sections | `lab-welcome.compositions.tsx` |
| 6 | PKG021 gates/evidence reflect enterprise lab | `foundation-disposition.registry.ts` |

## Attestation evidence (2026-07-01)

| Gate | Result |
| --- | --- |
| `pnpm --filter @afenda/storybook typecheck` | PASS |
| `pnpm test:storybook:run` | PASS (2 lab-smoke stories) |
| `pnpm storybook:build` | PASS |
| `pnpm check:studio-import-zones` | PASS |
| `pnpm check:documentation-drift` | PASS (post-slice) |

## Out of scope (follow-on tracks)

| Track | Owner | Notes |
| --- | --- | --- |
| Chromatic visual regression | Repo admin | `CHROMATIC_ENABLED` + `CHROMATIC_PROJECT_TOKEN` |
| Expand `lab-smoke` | PAS-006A | Tag blocks after a11y fixes (login, account-settings, …) |
| ERP operator promotion | PAS-001A · `apps/erp` | Separate from lab verification |

## Related

- [P06-011](./p06-011-src-structure-clarity.md) — lab barrel · ADR-0037
- [afenda-storybook SKILL](../../../../.cursor/skills/afenda-storybook/SKILL.md)
