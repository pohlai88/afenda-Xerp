# Slice B42 ÔÇö Afenda Integration Bridge (PAS-005A ┬º4.8 ┬À ┬º10 ┬À ┬º11.4)

**Prerequisite:** B41 delivered ÔÇö Storybook lab proof; `@afenda/storybook typecheck` green

**Status:** Delivered (2026-06-28) ÔÇö integration bridge complete; legacy path delete closed in **B42h** (`presentation/` relocation); **remaining:** B42i MCP wrapper strangler

**Type:** Implementation

**Risk class:** High ÔÇö cross-package cutover (css-authority, appshell, ADR-0017, metadata-ui consumer path)

**Clean Core impact:** AÔåÆB ÔÇö retarget promotion pipeline; legacy `shadcn-studio/` path deleted via `presentation/` relocation (B42h)

## Purpose

Bridge `@afenda/shadcn-studio` into Afenda ERP: align base theme with PAS-005 vendored shadcn theme, wire css-authority import chain, retarget ADR-0017 / MCP promotion terminus, optional metadata-ui presentation hook (theme preset slug in render context ÔÇö vocabulary only), delete `packages/appshell/src/shadcn-studio/` after parity, run `ui:guard` on promoted blocks. Registry lane `PKGR05A_SHADCN_STUDIO` via `foundation-registry-owner`.

## Handoff block

```
Handoff from: docs/PAS/CSS-AUTHORITY/SLICE/b42-pas005a-afenda-integration.md

1. Objective    ÔÇö Integrate @afenda/shadcn-studio into Afenda runtime: css-authority theme parity, ADR-0017/MCP retarget, metadata-ui optional theme-preset vocabulary hook, appshell legacy delete after parity, ui:guard on promoted blocks, registry PKGR05A.
2. Allowed layerÔÇö packages/shadcn-studio/** ┬À packages/css-authority/** (read/sync only ÔÇö no registry JSON edits) ┬À apps/erp/src/app/globals.css ┬À apps/storybook/** ┬À packages/appshell/** (delete legacy studio only after parity) ┬À packages/metadata-ui/** (presentation hook contract only) ┬À docs/PAS/** ┬À docs/adr/ADR-0017-*.md ┬À .cursor/skills/shadcn-studio/** ┬À .cursor/mcp.json ┬À shadcn-studio.config.json ┬À scripts/governance/** (ADR-0017 path updates)
3. Files        ÔÇö
   packages/shadcn-studio/src/styles/shadcn-studio.css
   apps/erp/src/app/globals.css
   docs/adr/ADR-0017-shadcn-studio-ui-delivery-acceleration.md
   .cursor/skills/shadcn-studio/SKILL.md
   .cursor/mcp.json
   shadcn-studio.config.json
   packages/metadata-ui/src/contracts/render-context.contract.ts
   packages/metadata-ui/src/contracts/presentation.contract.ts
   packages/metadata-ui/src/__tests__/presentation.test.ts
   packages/appshell/src/shadcn-studio/ (DELETE tree after parity ÔÇö list in Completion Report)
   packages/appshell/src/styles/afenda-appshell-studio.css (bridge migration ÔÇö css-authority domain sync)
   docs/architecture/app-ui-component-adaptation-guide.md
   docs/PAS/CSS-AUTHORITY/SLICE/b42-pas005a-afenda-integration.md
   docs/PAS/pas-status-index.md
   docs/PAS/CSS-AUTHORITY/PAS-005A-SHADCN-STUDIO-PRESENTATION-STANDARD.md
   .cursor/skills/shadcn-studio-authority/SKILL.md
4. Prohibited   ÔÇö Hand-edit packages/css-authority/src/generated/** ┬À Hand-edit foundation-disposition.registry.ts (delegate registry-owner) ┬À Migrate/copy legacy appshell studio TSX (re-seed via MCP) ┬À className on @afenda/ui in metadata-ui consumers ┬À ERP business routes in this slice
5. Authority    ÔÇö PAS-005A ┬º4.8 ┬À ┬º12 ┬À ADR-0017 ┬À PAS-005 ┬º12 ┬À metadata-ui PAS (presentation contract) ┬À shadcn-studio-authority ┬À afenda-shadcn-components skill
6. Gates        ÔÇö
   pnpm --filter @afenda/shadcn-studio typecheck
   pnpm --filter @afenda/shadcn-studio test:run
   pnpm check:css-authority-conformance
   pnpm check:css-visual-regression
   pnpm --filter @afenda/metadata-ui test:run
   pnpm ui:guard:scan
   pnpm ui:guard
   pnpm quality:boundaries
   pnpm check:foundation-disposition
7. Closes       ÔÇö Dual studio systems; metadata-ui theme bridge vocabulary; ADR-0017 cwd drift; PKGR05A registry (with registry-owner); PAS-005A Phase 2
8. Evidence     ÔÇö
   apps/erp/src/app/globals.css (shadcn-studio import chain)
   packages/metadata-ui/src/contracts/presentation.contract.ts (themePresetSlug optional field)
   docs/adr/ADR-0017-shadcn-studio-ui-delivery-acceleration.md (promotion terminus)
   git deletion record packages/appshell/src/shadcn-studio/
9. Attestation  ÔÇö Integration ┬À Governance ┬À Documentation ┬À Registry (delegated)
```

## Rules frozen

1. **Parity before delete** ÔÇö Storybook + ERP spot-check must match legacy block inventory before appshell studio tree removal
2. **Re-seed, never migrate** ÔÇö MCP `/cui` replaces placeholder blocks; do not move appshell TSX
3. **metadata-ui** ÔÇö optional `themePresetSlug` on presentation contract only; no theme runtime in metadata-ui package
4. **css-authority** ÔÇö sync shadcn variable names; do not duplicate CSS-TOKEN registry in shadcn-studio
5. Registry mutation ÔåÆ `foundation-registry-owner` only

## metadata-ui bridge (B42 scope)

| Surface | Owner | B42 action |
| --- | --- | --- |
| `MetadataUiRenderContext.presentation` | metadata-ui | Add optional `themePresetSlug?: ThemePresetSlug` imported as type-only from `@afenda/shadcn-studio` OR duplicate slug union in ui-composition (prefer type import if layer allows) |
| Theme application runtime | ERP / appshell | ERP `SettingsProvider` wraps shell; reads slug from tenant prefs later |
| Diagnostics panel | metadata-ui | Display preset slug when present in snapshot |
| Renderer registry | metadata-ui | No change ÔÇö renderers stay governed `@afenda/ui` until dedicated slice |

## DoD

| # | Criterion | Gate |
| --- | --- | --- |
| 1 | ERP globals import shadcn-studio CSS in chain | manual + css gates |
| 2 | ADR-0017 promotion terminus = packages/shadcn-studio | doc review |
| 3 | metadata-ui presentation contract accepts optional preset slug | metadata-ui tests |
| 4 | Legacy appshell studio deleted after parity list | git diff |
| 5 | ui:guard passes on integrated blocks | ui:guard |
| 6 | PKGR05A in foundation-disposition | check:foundation-disposition |

## Runtime evidence

| Capability | Proven | Evidence path |
| --- | --- | --- |
| Afenda ERP theme chain | No ÔÇö Slice B42 | `apps/erp/src/app/globals.css` |
| metadata-ui preset vocabulary | No ÔÇö Slice B42 | `presentation.contract.ts` |
| Legacy studio removed | No ÔÇö Slice B42 | appshell tree absent |

## Follow-up slice (optional)

**B40-MCP** ÔÇö Re-run MCP `/rui` + `/cui` with live credentials to replace B40 manual seed (`docs/PAS/CSS-AUTHORITY/SLICE/b40-pas005a-mcp-seed.md` addendum or `b40b-pas005a-mcp-live-seed.md`).
