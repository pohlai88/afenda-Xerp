# Slice B42o — Residual Parity wrapperPath Closure (PAS-005A §14)

**Prerequisite:** B42n delivered — account-settings content afenda-only wrappers (23 slices); 24 mcp-seeded parity rows still missing `wrapperPath`

**Status:** Delivered (2026-06-28)

**Type:** Implementation

**Risk class:** Medium — closes final parity registry wrapperPath gaps; wires shell account-settings strangler wrappers; points dashboard rows at existing wrappers

**Clean Core impact:** AÔåÆA — afenda-only strangler wrappers delegate to existing governed blocks; no MCP TSX copy; index.ts public exports unchanged

## Handoff block

```
Handoff from: docs/PAS/CSS-AUTHORITY/SLICE/b42o-pas005a-residual-parity-wrapper-closure.md

1. Objective    — Close all 24 mcp-seeded parity rows missing wrapperPath: create account-settings shell wrappers (01—07), shell/residual afenda-only wrappers, utility re-export wrappers; point dashboard parity rows at existing dashboard wrappers; promote bridge-exported status where bridge twin exists; assert computeStudioBlockParitySummary missing wrapperPath count === 0.
2. Allowed layer— packages/appshell/src/presentation/wrappers/** · packages/appshell/src/__tests__/** · packages/shadcn-studio/src/registry/** · packages/shadcn-studio/src/__tests__/** · docs/PAS/CSS-AUTHORITY/SLICE/b42o-*.md · docs/PAS/pas-status-index.md · docs/PAS/CSS-AUTHORITY/PAS-005A-SHADCN-STUDIO-PRESENTATION-STANDARD.md (§14 row)
3. Files        — account-settings/shell/*.wrapper.tsx (7) · shell/*.wrapper.tsx (4) · dashboard/*-utils/columns/overflow wrappers (3) · presentation-mcp-residual.registry.ts · presentation-mcp-wrapper.registry.ts · studio-block-parity.registry.ts · presentation-mcp-wrapper-b42o.test.ts · studio-block-parity-wrapper-coverage.test.ts · slice doc · pas-status-index · PAS-005A §14
4. Prohibited   — foundation-disposition.registry.ts · MCP TSX copy into appshell · break AppShellAccountSettings01—07 props or index.ts exports · remove afenda-appshell-studio.css
5. Authority    — PAS-005A · ADR-0017 · B42i/B42n strangler registry · Governed UI consumer rules · studio-block-parity.registry.ts
6. Gates        —
   pnpm --filter @afenda/shadcn-studio build
   pnpm --filter @afenda/shadcn-studio test:run
   pnpm --filter @afenda/appshell typecheck
   pnpm --filter @afenda/appshell test:run
   pnpm quality:boundaries
   pnpm ui:guard:scan
7. Closes       — 24 parity wrapperPath gaps · 7 account-settings shell wrappers · dashboard parity pointer closure · residual shell/utility wrappers · B42o test · wrapper coverage test · PAS-005A §14 B42o row · pas-status-index Delivered
8. Evidence     — node parity count === 0 · presentation-mcp-wrapper-b42o.test.ts · studio-block-parity-wrapper-coverage.test.ts · all gates pasted in Completion Report
9. Attestation  — Zero missing wrapperPath · No bridge-index placeholder paths · Public export contracts preserved · Gate evidence
```

## B42o scope (24 parity rows)

| Category | Count | Action |
| --- | ---: | --- |
| Account-settings shell 01—07 | 7 | New afenda-only shell wrappers + main registry wrapperPath |
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
