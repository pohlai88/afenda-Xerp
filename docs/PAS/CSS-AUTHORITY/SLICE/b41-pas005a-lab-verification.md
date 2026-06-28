# Slice B41 ÔÇö Lab / Storybook Verification (PAS-005A ┬º4.7 ┬À ┬º11)

**Prerequisite:** B40 delivered ÔÇö MCP seed inventory exists

**Status:** Delivered (2026-06-28)

**Type:** Implementation

**Risk class:** Low ÔÇö verification harness only

**Clean Core impact:** AÔåÆA ÔÇö Storybook consumer of standalone package

## Purpose

Prove `@afenda/shadcn-studio` in lab: Storybook stories for ThemeCustomizer (all presets ├ù light/dark), representative primitives, and at least one MCP block. Wire `apps/storybook` to import `@afenda/shadcn-studio` CSS + components without ERP or Afenda governance packages.

## Handoff block

```
Handoff from: docs/PAS/CSS-AUTHORITY/SLICE/b41-pas005a-lab-verification.md

1. Objective    ÔÇö Add Storybook lab stories proving all 12 theme presets + default in light/dark, representative primitives, and one MCP block; wire apps/storybook to @afenda/shadcn-studio without Afenda governance imports in shadcn-studio package.
2. Allowed layerÔÇö apps/storybook/** ┬À packages/shadcn-studio/src/_storybook/** ┬À packages/shadcn-studio/package.json ┬À docs/PAS/CSS-AUTHORITY/SLICE/b41-pas005a-lab-verification.md ┬À docs/PAS/pas-status-index.md
3. Files        ÔÇö
   apps/storybook/package.json
   apps/storybook/.storybook/main.ts
   apps/storybook/.storybook/preview.tsx
   apps/storybook/stories/shadcn-studio-theme-lab.stories.tsx
   apps/storybook/stories/shadcn-studio-primitives.stories.tsx
   apps/storybook/stories/shadcn-studio-block.stories.tsx
   packages/shadcn-studio/src/_storybook/story-parameters.ts
   docs/PAS/CSS-AUTHORITY/SLICE/b41-pas005a-lab-verification.md
   docs/PAS/CSS-AUTHORITY/PAS-005A-SHADCN-STUDIO-PRESENTATION-STANDARD.md (runtime_status sync)
   docs/PAS/pas-status-index.md
4. Prohibited   ÔÇö apps/erp/**; packages/appshell/** cutover; @afenda/css-authority in shadcn-studio package; ui:guard normalization (B42)
5. Authority    ÔÇö PAS-005A ┬º4.7 ┬À ┬º11 ┬À afenda-storybook skill
6. Gates        ÔÇö
   pnpm --filter @afenda/shadcn-studio typecheck
   pnpm --filter @afenda/shadcn-studio test:run
   pnpm --filter @afenda/storybook typecheck
   pnpm --filter @afenda/storybook test:run
   pnpm quality:boundaries
7. Closes       ÔÇö PAS-005A Phase 1 lab proof; B41 proposed ÔåÆ delivered; implementation_status partial ÔåÆ implemented (Phase 1)
8. Evidence     ÔÇö
   apps/storybook/stories/shadcn-studio-theme-lab.stories.tsx
   apps/storybook/stories/shadcn-studio-block.stories.tsx
9. Attestation  ÔÇö Storybook ┬À Integration ┬À Documentation
```

## Rules frozen

1. Storybook imports `@afenda/shadcn-studio` package name only ÔÇö no deep paths
2. Theme lab story exercises every preset slug in both color modes
3. No ERP routes or AppShell chrome in lab stories
4. B42 owns Afenda integration ÔÇö not this slice

## DoD

| # | Criterion | Gate |
| --- | --- | --- |
| 1 | Theme lab story covers all preset slugs | Storybook + test |
| 2 | Primitive story renders Button, Card minimum | Storybook |
| 3 | Block story renders one MCP block | Storybook |
| 4 | Storybook typecheck passes | `pnpm --filter @afenda/storybook typecheck` |

## Runtime evidence

| Capability | Proven | Evidence path |
| --- | --- | --- |
| Lab theme verification | Yes ÔÇö Slice B41 | `apps/storybook/stories/shadcn-studio-theme-lab.stories.tsx` |
| Block lab story | Yes ÔÇö Slice B41 | `apps/storybook/stories/shadcn-studio-block.stories.tsx` |
