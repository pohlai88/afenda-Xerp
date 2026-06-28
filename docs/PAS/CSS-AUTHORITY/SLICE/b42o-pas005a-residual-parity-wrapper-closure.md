# Slice B42o ÔÇö Residual Parity wrapperPath Closure (PAS-005A ┬º14)

**Prerequisite:** B42n delivered ÔÇö account-settings content afenda-only wrappers (23 slices); 24 mcp-seeded parity rows still missing `wrapperPath`

**Status:** Delivered (2026-06-28)

**Type:** Implementation

**Risk class:** Medium ÔÇö closes final parity registry wrapperPath gaps; wires shell account-settings strangler wrappers; points dashboard rows at existing wrappers

**Clean Core impact:** AÔåÆA ÔÇö afenda-only strangler wrappers delegate to existing governed blocks; no MCP TSX copy; index.ts public exports unchanged

## Handoff block

```
Handoff from: docs/PAS/CSS-AUTHORITY/SLICE/b42o-pas005a-residual-parity-wrapper-closure.md

1. Objective    ÔÇö Close all 24 mcp-seeded parity rows missing wrapperPath: create account-settings shell wrappers (01ÔÇô07), shell/residual afenda-only wrappers, utility re-export wrappers; point dashboard parity rows at existing dashboard wrappers; promote bridge-exported status where bridge twin exists; assert computeStudioBlockParitySummary missing wrapperPath count === 0.
2. Allowed layerÔÇö packages/appshell/src/presentation/wrappers/** ┬À packages/appshell/src/__tests__/** ┬À packages/shadcn-studio/src/registry/** ┬À packages/shadcn-studio/src/__tests__/** ┬À docs/PAS/CSS-AUTHORITY/SLICE/b42o-*.md ┬À docs/PAS/pas-status-index.md ┬À docs/PAS/CSS-AUTHORITY/PAS-005A-SHADCN-STUDIO-PRESENTATION-STANDARD.md (┬º14 row)
3. Files        ÔÇö account-settings/shell/*.wrapper.tsx (7) ┬À shell/*.wrapper.tsx (4) ┬À dashboard/*-utils/columns/overflow wrappers (3) ┬À presentation-mcp-residual.registry.ts ┬À presentation-mcp-wrapper.registry.ts ┬À studio-block-parity.registry.ts ┬À presentation-mcp-wrapper-b42o.test.ts ┬À studio-block-parity-wrapper-coverage.test.ts ┬À slice doc ┬À pas-status-index ┬À PAS-005A ┬º14
4. Prohibited   ÔÇö foundation-disposition.registry.ts ┬À MCP TSX copy into appshell ┬À break AppShellAccountSettings01ÔÇô07 props or index.ts exports ┬À remove afenda-appshell-studio.css
5. Authority    ÔÇö PAS-005A ┬À ADR-0017 ┬À B42i/B42n strangler registry ┬À Governed UI consumer rules ┬À studio-block-parity.registry.ts
6. Gates        ÔÇö
   pnpm --filter @afenda/shadcn-studio build
   pnpm --filter @afenda/shadcn-studio test:run
   pnpm --filter @afenda/appshell typecheck
   pnpm --filter @afenda/appshell test:run
   pnpm quality:boundaries
   pnpm ui:guard:scan
7. Closes       ÔÇö 24 parity wrapperPath gaps ┬À 7 account-settings shell wrappers ┬À dashboard parity pointer closure ┬À residual shell/utility wrappers ┬À B42o test ┬À wrapper coverage test ┬À PAS-005A ┬º14 B42o row ┬À pas-status-index Delivered
8. Evidence     ÔÇö node parity count === 0 ┬À presentation-mcp-wrapper-b42o.test.ts ┬À studio-block-parity-wrapper-coverage.test.ts ┬À all gates pasted in Completion Report
9. Attestation  ÔÇö Zero missing wrapperPath ┬À No bridge-index placeholder paths ┬À Public export contracts preserved ┬À Gate evidence
```

## B42o scope (24 parity rows)

| Category | Count | Action |
| --- | ---: | --- |
| Account-settings shell 01ÔÇô07 | 7 | New afenda-only shell wrappers + main registry wrapperPath |
| Dashboard exports | 10 | Parity wrapperPath ÔåÆ existing dashboard wrappers; promote bridge-exported |
| Shell residual | 4 | application-shell-02, activity-feed, context-switcher, module-workspace-chrome |
| Utility/support | 3 | Thin re-export wrappers for breakdown utils, invoice columns, overflow menu |

## Parity snapshot (post-B42o)

| Metric | Value |
| --- | ---: |
| Missing wrapperPath | **0** |
| Account-settings shell wrappers | 7 |
| Residual utility registry entries | 3 |

## Follow-on (optional maintenance)

- Governed UI className strip on remaining governed-compose dashboard blocks
- Delegating flip when MCP bridge twins reach Governed UI safe parity

## DoD

- [x] 24 parity wrapperPath gaps closed
- [x] Account-settings shell wrappers on disk + main registry updated
- [x] Dashboard parity rows point at existing wrappers
- [x] Residual shell + utility wrappers
- [x] wrapper coverage test asserts zero gaps
- [x] typecheck + test:run + build + quality gates
