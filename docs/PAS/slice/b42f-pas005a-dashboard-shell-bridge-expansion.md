# Slice B42f — Dashboard/Shell MCP Batch + Appshell Bridge Expansion (PAS-005A §11.4)

**Prerequisite:** B42e delivered — account-settings 01–07 + dashboard widget batch (~27% parity)

**Status:** Delivered (2026-06-28) — extended dashboard/shell parity + full appshell bridge re-exports; **legacy delete still blocked**

**Type:** Implementation

**Risk class:** Medium — MCP install + expanded `@afenda/appshell` public bridge surface

**Clean Core impact:** A→A — MCP re-seed + strangler bridge only; no legacy TSX migration

## Handoff block

```
Handoff from: docs/PAS/slice/b42f-pas005a-dashboard-shell-bridge-expansion.md

1. Objective    — Install remaining dashboard/shell MCP blocks; register shell chrome parity for B42c surfaces; expand appshell bridge re-exports for account-settings + dashboard blocks.
2. Allowed layer— packages/shadcn-studio/** · packages/appshell/src/shadcn-studio-bridge/** · packages/appshell/src/index.ts (bridge export only) · packages/appshell/src/__tests__/shadcn-studio-bridge.test.ts · docs/PAS/**
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
7. Closes       — B42f dashboard/shell MCP gap; appshell consumer path to account-settings + extended dashboard MCP blocks
8. Evidence     — MCP batch command in §MCP batch; studio-block-parity.registry.ts; shadcn-studio-bridge/index.ts
9. Attestation  — Inventory · Bridge · Build · Documentation
```

## MCP batch (executed)

| Category | Registry ids |
| --- | --- |
| Dashboard statistics | `statistics-component-03`, `-06`, `-07`, `-10`, `-16`, `-21` |
| Charts | `chart-component-02` |
| Widgets | `widget-component-06` |
| Auth error | `error-page-02` |

**Install cwd:** `packages/shadcn-studio` · **Flags:** `-y -o`

## Parity snapshot (post-B42f)

| Metric | Value |
| --- | ---: |
| Legacy production blocks | 63 |
| Registry tracked MCP surfaces | **36** |
| Parity (registry entries / legacy) | **~57%** |
| **Delete blocked** | **Yes** |

Shell chrome entries (B42c surfaces, B42f registry): `dialog-search`, `dropdown-notification`, `dropdown-language`, `dropdown-profile`, `dialog-activity`.

## Bridge exports

`@afenda/appshell` re-exports all live MCP blocks via `shadcn-studio-bridge` with `AppShellPresentation*` names (account-settings 01–07, dashboard statistics, widgets, auth error, parity registry).

## Remaining (B42g+)

- Residual legacy blocks (module chrome, context switcher, account-settings content panels counted separately in B42b)
- Legacy delete when `computeStudioBlockParitySummary().deleteBlocked === false`
- Governed UI className strip on MCP blocks (deferred)

## DoD

- [x] Dashboard/shell MCP batch installed
- [x] Parity registry expanded (~57%)
- [x] Appshell bridge expanded + tests
- [x] typecheck + test:run + build gates
- [ ] Legacy tree delete (deferred)
