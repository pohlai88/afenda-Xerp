# Slice B42c ÔÇö MCP Live Re-seed (PAS-005A ┬º4.4ÔÇô┬º4.6 ┬À B42b follow-on)

**Prerequisite:** B42b planning delivered ÔÇö parity inventory; `.env.secret` credentials available

**Status:** Delivered (2026-06-28) ÔÇö live MCP batch install replaces B40 placeholders

**Type:** Implementation

**Risk class:** Medium ÔÇö Pro registry install + new npm deps (cmdk, radix-ui)

**Clean Core impact:** AÔåÆA ÔÇö inventory only; install cwd `packages/shadcn-studio`

## Purpose

Replace B40 manual placeholder blocks with live shadcn-studio MCP `/cui` batch install using `@ss-blocks` registry and license credentials from `.env.secret`.

## Handoff block

```
Handoff from: docs/PAS/CSS-AUTHORITY/SLICE/b42c-pas005a-mcp-live-reseed.md

1. Objective    ÔÇö Live MCP re-seed: collect 4 @ss-blocks, batch install with -y -o, remove B40 placeholders, fix strict TS on installed files, update Storybook + inventory tests.
2. Allowed layerÔÇö packages/shadcn-studio/** ┬À apps/storybook/stories/shadcn-studio-*.stories.tsx ┬À docs/PAS/CSS-AUTHORITY/SLICE/b42c-pas005a-mcp-live-reseed.md ┬À docs/PAS/pas-status-index.md
3. Files        ÔÇö
   packages/shadcn-studio/components.json
   packages/shadcn-studio/package.json
   packages/shadcn-studio/src/styles/shadcn-studio.css
   packages/shadcn-studio/src/components/ui/**
   packages/shadcn-studio/src/components/shadcn-studio/blocks/**
   packages/shadcn-studio/src/index.ts
   packages/shadcn-studio/src/__tests__/mcp-seed-inventory.test.ts
   packages/shadcn-studio/src/__tests__/package-scaffold.test.ts
   apps/storybook/stories/shadcn-studio-block.stories.tsx
   docs/PAS/CSS-AUTHORITY/SLICE/b42c-pas005a-mcp-live-reseed.md
   docs/PAS/pas-status-index.md
4. Prohibited   ÔÇö packages/appshell/** ┬À packages/ui/** ┬À apps/erp/** ┬À foundation-disposition.registry.ts ┬À migrate legacy appshell TSX
5. Authority    ÔÇö PAS-005A ┬º4.4ÔÇô┬º4.6 ┬À ADR-0017 ┬À shadcn-studio skill ┬À PKGR05A prohibited do-not-migrate-appshell-studio-tsx
6. Gates        ÔÇö
   pnpm --filter @afenda/shadcn-studio typecheck
   pnpm --filter @afenda/shadcn-studio test:run
   pnpm --filter @afenda/shadcn-studio build
   pnpm sync:package-css-dist -- --package @afenda/shadcn-studio
   pnpm check:package-css-dist-sync
   pnpm quality:boundaries
7. Closes       ÔÇö B40 manual seed placeholders; B42c operator-owned MCP gap
8. Evidence     ÔÇö
   MCP install command: npx shadcn@latest add @ss-blocks/hero-section-01 @ss-blocks/login-page-04 @ss-blocks/application-shell-02 @ss-blocks/statistics-component-01 -y -o
   packages/shadcn-studio/src/components/shadcn-studio/blocks/hero-section-01/
   packages/shadcn-studio/src/components/shadcn-studio/blocks/login-page-04/
9. Attestation  ÔÇö Inventory ┬À Build ┬À MCP provenance ┬À Documentation
```

## MCP batch (executed)

| Block | Registry id | Install path |
| --- | --- | --- |
| Hero | `@ss-blocks/hero-section-01` | `src/components/shadcn-studio/blocks/hero-section-01/` |
| Auth login | `@ss-blocks/login-page-04` | `src/components/shadcn-studio/blocks/login-page-04/` |
| App shell chrome | `@ss-blocks/application-shell-02` | dropdown/dialog/sidebar primitives under `blocks/` |
| Statistics | `@ss-blocks/statistics-component-01` | `statistics-card-01.tsx` |

**Install cwd:** `packages/shadcn-studio`
**Credentials:** `.env.secret` ÔåÆ `SHADCN_STUDIO_ACCOUNT_EMAIL` / `SHADCN_STUDIO_LICENSE_KEY` mapped to `EMAIL` / `LICENSE_KEY`

## Path normalization

MCP registry targets install to `src/components/shadcn-studio/blocks/` (upstream default). `components.json` alias `components` retargeted to `@/components/shadcn-studio` for future `/cui` installs. Legacy `src/blocks/placeholder-*` removed.

## DoD

| # | Criterion | Result |
| --- | --- | --- |
| 1 | Live MCP install (not manual placeholders) | **Pass** |
| 2 | ÔëÑ5 primitives | **Pass** (20+ ui files) |
| 3 | ÔëÑ2 blocks | **Pass** (hero + login + shell chrome + stats) |
| 4 | Placeholders deleted | **Pass** |
| 5 | typecheck + test:run + build | Gate evidence in Completion Report |

## Remaining (B42d)

- Appshell legacy delete still blocked (~63 vs ~8 MCP block surfaces)
- Full parity requires additional `/cui` batches per B42b inventory
