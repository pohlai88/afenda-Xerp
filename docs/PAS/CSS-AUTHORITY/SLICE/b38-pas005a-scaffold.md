# Slice B38 ÔÇö shadcn/studio Package Scaffold (PAS-005A ┬º10)

**Prerequisite:** [PAS-005A](../PAS-005A-SHADCN-STUDIO-PRESENTATION-STANDARD.md) accepted as MVP Authority; ADR-0017 Accepted

**Status:** Delivered (2026-06-28)

**Type:** Implementation

**Risk class:** Low ÔÇö new package only; no Afenda runtime cutover

**Clean Core impact:** AÔåÆA ÔÇö greenfield `packages/shadcn-studio`; legacy appshell studio untouched

## Purpose

Create `@afenda/shadcn-studio` as a standalone Afenda-free package: `package.json`, tsconfig, base CSS stub, `components.json`, tombstone PAS pointer, and retarget shadcn-studio MCP/CLI cwd from legacy `packages/ui`. Propose registry lane `PKGR05A_SHADCN_STUDIO` via foundation-registry-owner (separate commit if required). No theme presets, MCP seed, or ERP wiring in this slice.

## Handoff block

```
Handoff from: docs/PAS/CSS-AUTHORITY/SLICE/b38-pas005a-scaffold.md

1. Objective    ÔÇö Scaffold @afenda/shadcn-studio package with base CSS export stub, components.json, MCP cwd retarget, and PAS-005A tombstone pointer; zero Afenda package imports.
2. Allowed layerÔÇö packages/shadcn-studio/** ┬À .cursor/mcp/shadcn-studio.mjs ┬À shadcn-studio.config.json ┬À docs/PAS/** ┬À docs/architecture/package-registry.md (if PKG entry added)
3. Files        ÔÇö
   packages/shadcn-studio/package.json
   packages/shadcn-studio/tsconfig.json
   packages/shadcn-studio/components.json
   packages/shadcn-studio/src/index.ts
   packages/shadcn-studio/src/styles/shadcn-studio.css
   packages/shadcn-studio/PAS-005A-SHADCN-STUDIO-PRESENTATION-STANDARD.md
   packages/shadcn-studio/src/__tests__/package-scaffold.test.ts
   shadcn-studio.config.json
   .cursor/mcp/shadcn-studio.mjs
   pnpm-workspace.yaml (if new package not auto-discovered)
   docs/PAS/pas-status-index.md
   docs/PAS/CSS-AUTHORITY/PAS-005A-SHADCN-STUDIO-PRESENTATION-STANDARD.md (runtime_status sync only if evidence changes)
4. Prohibited   ÔÇö packages/appshell/src/shadcn-studio/** (no migrate); packages/css-authority/**; packages/ui/** studio cutover; apps/erp/**; @afenda/design-system; @afenda/ui; foundation-disposition.registry.ts (delegate registry-owner)
5. Authority    ÔÇö PAS-005A ┬º6 ┬À ADR-0017 ┬À monorepo-discipline skill
6. Gates        ÔÇö
   pnpm --filter @afenda/shadcn-studio typecheck
   pnpm --filter @afenda/shadcn-studio test:run
   pnpm --filter @afenda/shadcn-studio build
   pnpm check:foundation-disposition
   pnpm quality:boundaries
7. Closes       ÔÇö PAS-005A not_started ÔåÆ partial; MCP cwd legacy packages/ui
8. Evidence     ÔÇö
   packages/shadcn-studio/package.json
   packages/shadcn-studio/src/styles/shadcn-studio.css
   shadcn-studio.config.json (cwd = packages/shadcn-studio)
9. Attestation  ÔÇö Architecture ┬À Package scaffold ┬À Documentation
```

## Rules frozen

1. Phase 1 remains **Afenda-free** ÔÇö no `@afenda/css-authority` or `@afenda/ui` imports
2. Do **not** migrate or copy from `packages/appshell/src/shadcn-studio/`
3. MCP collection-before-install rule applies from B40 ÔÇö not exercised in B38
4. Registry mutation goes through `foundation-registry-owner` only

## DoD

| # | Criterion | Gate |
| --- | --- | --- |
| 1 | Package builds and typechecks | `pnpm --filter @afenda/shadcn-studio build` |
| 2 | Scaffold test passes | `pnpm --filter @afenda/shadcn-studio test:run` |
| 3 | MCP/CLI cwd points at `packages/shadcn-studio` | Manual + config file review |
| 4 | Tombstone pointer exists in package root | File review |
| 5 | Boundary gate passes | `pnpm quality:boundaries` |

## Runtime evidence

| Capability | Proven | Evidence path |
| --- | --- | --- |
| Standalone shadcn-studio package | No ÔÇö Slice B38 | `packages/shadcn-studio/` |
| MCP cwd retarget | No ÔÇö Slice B38 | `shadcn-studio.config.json` |
