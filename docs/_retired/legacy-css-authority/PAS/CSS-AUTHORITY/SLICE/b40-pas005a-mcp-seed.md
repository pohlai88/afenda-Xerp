# Slice B40 — MCP Seed (Theme, Primitives, Blocks) (PAS-005A §4.4—§4.6)

**Prerequisite:** B39 delivered — theme preset runtime operational

**Status:** Delivered (2026-06-28) — manual seed equivalent (MCP unavailable in agent environment)

**Type:** Implementation

**Risk class:** Medium — external MCP install + new npm deps (ADR-0003)

**Clean Core impact:** AÔåÆA — inventory seed only; no ERP wiring

## Purpose

Seed `@afenda/shadcn-studio` via shadcn-studio MCP: `install-theme` into base CSS, `/rui` for ÔëÑ5 primitives under `src/components/ui/`, `/cui` for ÔëÑ2 blocks under `src/blocks/`. Follow collect-all-then-install rule. Document provenance headers on installed files.

## Handoff block

```
Handoff from: docs/PAS/CSS-AUTHORITY/SLICE/b40-pas005a-mcp-seed.md

1. Objective    — MCP-seed shadcn-studio base theme alignment, ÔëÑ5 /rui primitives, and ÔëÑ2 /cui blocks into @afenda/shadcn-studio with collection-before-install discipline and package builds cleanly.
2. Allowed layer— packages/shadcn-studio/** · shadcn-studio.config.json · docs/PAS/CSS-AUTHORITY/SLICE/b40-pas005a-mcp-seed.md · packages/architecture-authority/src/data/dependency-registry.data.ts (if new deps)
3. Files        —
   packages/shadcn-studio/components.json
   packages/shadcn-studio/package.json
   packages/shadcn-studio/src/styles/shadcn-studio.css
   packages/shadcn-studio/src/components/ui/**
   packages/shadcn-studio/src/blocks/**
   packages/shadcn-studio/src/lib/utils.ts
   packages/shadcn-studio/src/__tests__/mcp-seed-inventory.test.ts
   docs/PAS/CSS-AUTHORITY/SLICE/b40-pas005a-mcp-seed.md
   docs/PAS/pas-status-index.md
4. Prohibited   — packages/ui/** staging; packages/appshell/** migration; apps/erp/**; @afenda/css-authority imports; governed Governed UI normalization (deferred B42)
5. Authority    — PAS-005A §4.4—§4.6 · ADR-0017 · afenda-shadcn-components skill (install workflow only)
6. Gates        —
   pnpm --filter @afenda/shadcn-studio typecheck
   pnpm --filter @afenda/shadcn-studio test:run
   pnpm --filter @afenda/shadcn-studio build
   pnpm sync:package-css-dist -- --package @afenda/shadcn-studio
   pnpm check:package-css-dist-sync
   pnpm quality:boundaries
7. Closes       — PAS-005A MCP inventory Target ÔåÆ Current; primitives + blocks seed evidence
8. Evidence     —
   packages/shadcn-studio/src/components/ui/ (ÔëÑ5 files)
   packages/shadcn-studio/src/blocks/ (ÔëÑ2 directories)
   packages/shadcn-studio/src/__tests__/mcp-seed-inventory.test.ts
9. Attestation  — Inventory · Build · CSS dist sync · Documentation
```

## Rules frozen

1. MCP cwd = `packages/shadcn-studio`
2. Collect all selected components/blocks before any install command
3. Stock shadcn className patterns in Phase 1 — no Governed UI strip pass
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
| MCP primitive inventory | Yes — B40 manual seed | `packages/shadcn-studio/src/components/ui/` |
| MCP block inventory | Yes — B40 manual seed | `packages/shadcn-studio/src/blocks/` |
