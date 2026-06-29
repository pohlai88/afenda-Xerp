# Slice B42g — Residual Shell Chrome + Content Panel Parity (PAS-005A §11.4)

**Prerequisite:** B42f delivered — dashboard/shell MCP batch + appshell bridge (~57% parity)

**Status:** Delivered (2026-06-28) — full parity registry coverage; **legacy delete gate open**

**Type:** Implementation

**Risk class:** Medium — MCP install + parity registry closure; legacy path delete closed in B42h

**Clean Core impact:** AÔåÆA — MCP re-seed + strangler registry only; no legacy TSX migration

## Handoff block

```
Handoff from: docs/PAS/CSS-AUTHORITY/SLICE/b42g-pas005a-residual-shell-content-parity.md

1. Objective    — Install dashboard-shell-05 shell chrome; register account-settings content panels + residual legacy surfaces; open delete gate when parity registry >= 63.
2. Allowed layer— packages/shadcn-studio/** · packages/appshell/src/shadcn-studio-bridge/** · packages/appshell/src/__tests__/shadcn-studio-bridge.test.ts · docs/PAS/**
3. Files        — (see Completion Report)
4. Prohibited   — DELETE packages/appshell/src/shadcn-studio/** · Migrate/copy legacy TSX · foundation-disposition.registry.ts · Governed UI className strip
5. Authority    — PAS-005A §11.4 · ADR-0017 · B42b inventory · PKGR05A
6. Gates        —
   pnpm --filter @afenda/shadcn-studio typecheck
   pnpm --filter @afenda/shadcn-studio test:run
   pnpm --filter @afenda/shadcn-studio build
   pnpm --filter @afenda/appshell typecheck
   pnpm --filter @afenda/appshell test:run -- shadcn-studio-bridge
   pnpm quality:boundaries
7. Closes       — B42g residual shell/content parity gap; delete gate when computeStudioBlockParitySummary().deleteBlocked === false
8. Evidence     — MCP batch dashboard-shell-05; studio-block-parity.registry.ts full coverage; bridge shell exports
9. Attestation  — Inventory · Bridge · Build · Documentation
```

## MCP batch (executed)

| Category | Registry id |
| --- | --- |
| Shell chrome | `dashboard-shell-05` (`menu-trigger`, `sidebar-user-dropdown`, `statistics-card-04`, `chart-total-revenue`) |

**Install cwd:** `packages/shadcn-studio` · **Flags:** `-y -o`

## Parity snapshot (post-B42g)

| Metric | Value |
| --- | ---: |
| Legacy production blocks | 63 |
| Registry tracked MCP surfaces | **67** |
| Parity (registry entries / legacy) | **106%** (gate uses entry count ÔëÑ 63) |
| **Delete blocked** | **No** |

Registered in B42g: 19 account-settings content panels, shell chrome (menu-trigger, sidebar-user, module chrome, context switcher, activity feed, panel section), dashboard utilities (columns, overflow, breakdown), standalone statistics-line-trends-card.

## Bridge exports

Added `AppShellPresentationMenuTrigger`, `AppShellPresentationSidebarUserDropdown` via `@afenda/shadcn-studio` bridge.

## Follow-on (B42h — delivered)

- Filesystem delete `packages/appshell/src/shadcn-studio/` — **executed** via `presentation/` relocation ([`b42h-pas005a-legacy-tree-delete.md`](b42h-pas005a-legacy-tree-delete.md))
- Governed UI className strip on MCP blocks (deferred B42i)
- Storybook lab stories for new shell chrome exports

## DoD

- [x] dashboard-shell-05 MCP batch installed
- [x] Parity registry full coverage (delete gate open)
- [x] Shell chrome bridge exports + tests
- [x] typecheck + test:run + build gates
- [x] Legacy tree delete (B42h — `presentation/` relocation)
