# Slice B40 ÔÇö MCP Seed (Theme, Primitives, Blocks) (PAS-005A ┬º4.4ÔÇô┬º4.6)

**Prerequisite:** B39 delivered ÔÇö theme preset runtime operational

**Status:** Delivered (2026-06-28) ÔÇö manual seed equivalent (MCP unavailable in agent environment)

**Type:** Implementation

**Risk class:** Medium ÔÇö external MCP install + new npm deps (ADR-0003)

**Clean Core impact:** AÔåÆA ÔÇö inventory seed only; no ERP wiring

## Purpose

Seed `@afenda/shadcn-studio` via shadcn-studio MCP: `install-theme` into base CSS, `/rui` for ÔëÑ5 primitives under `src/components/ui/`, `/cui` for ÔëÑ2 blocks under `src/blocks/`. Follow collect-all-then-install rule. Document provenance headers on installed files.

## Handoff block

```
Handoff from: docs/PAS/CSS-AUTHORITY/SLICE/b40-pas005a-mcp-seed.md

1. Objective    ÔÇö MCP-seed shadcn-studio base theme alignment, ÔëÑ5 /rui primitives, and ÔëÑ2 /cui blocks into @afenda/shadcn-studio with collection-before-install discipline and package builds cleanly.
2. Allowed layerÔÇö packages/shadcn-studio/** ┬À shadcn-studio.config.json ┬À docs/PAS/CSS-AUTHORITY/SLICE/b40-pas005a-mcp-seed.md ┬À docs/architecture/dependency-registry.md (if new deps)
3. Files        ÔÇö
   packages/shadcn-studio/components.json
   packages/shadcn-studio/package.json
   packages/shadcn-studio/src/styles/shadcn-studio.css
   packages/shadcn-studio/src/components/ui/**
   packages/shadcn-studio/src/blocks/**
   packages/shadcn-studio/src/lib/utils.ts
   packages/shadcn-studio/src/__tests__/mcp-seed-inventory.test.ts
   docs/PAS/CSS-AUTHORITY/SLICE/b40-pas005a-mcp-seed.md
   docs/PAS/pas-status-index.md
4. Prohibited   ÔÇö packages/ui/** staging; packages/appshell/** migration; apps/erp/**; @afenda/css-authority imports; governed Governed UI normalization (deferred B42)
5. Authority    ÔÇö PAS-005A ┬º4.4ÔÇô┬º4.6 ┬À ADR-0017 ┬À afenda-shadcn-components skill (install workflow only)
6. Gates        ÔÇö
   pnpm --filter @afenda/shadcn-studio typecheck
   pnpm --filter @afenda/shadcn-studio test:run
   pnpm --filter @afenda/shadcn-studio build
   pnpm sync:package-css-dist -- --package @afenda/shadcn-studio
   pnpm check:package-css-dist-sync
   pnpm quality:boundaries
7. Closes       ÔÇö PAS-005A MCP inventory Target ÔåÆ Current; primitives + blocks seed evidence
8. Evidence     ÔÇö
   packages/shadcn-studio/src/components/ui/ (ÔëÑ5 files)
   packages/shadcn-studio/src/blocks/ (ÔëÑ2 directories)
   packages/shadcn-studio/src/__tests__/mcp-seed-inventory.test.ts
9. Attestation  ÔÇö Inventory ┬À Build ┬À CSS dist sync ┬À Documentation
```

## Rules frozen

1. MCP cwd = `packages/shadcn-studio`
2. Collect all selected components/blocks before any install command
3. Stock shadcn className patterns in Phase 1 ÔÇö no Governed UI strip pass
4. New npm dependencies require dependency-registry.md entry

## DoD

| # | Criterion | Gate |
| --- | --- | --- |
| 1 | ÔëÑ5 primitives in `src/components/ui/` | inventory test |
| 2 | ÔëÑ2 blocks in `src/blocks/` | inventory test |
| 3 | Package builds with CSS dist sync | build + check:package-css-dist-sync |
| 4 | No Afenda prohibited imports | quality:boundaries |

## Runtime evidence

| Capability | Proven | Evidence path |
| --- | --- | --- |
| MCP primitive inventory | Yes ÔÇö B40 manual seed | `packages/shadcn-studio/src/components/ui/` |
| MCP block inventory | Yes ÔÇö B40 manual seed | `packages/shadcn-studio/src/blocks/` |
