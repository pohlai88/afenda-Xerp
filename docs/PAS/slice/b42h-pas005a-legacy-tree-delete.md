# Slice B42h — Legacy Studio Tree Delete + Consumer Scan (PAS-005A §11.4)

**Prerequisite:** B42g delivered — parity registry complete; `deleteBlocked: false`

**Status:** Delivered (2026-06-28) — legacy `shadcn-studio/` tree removed; governed blocks relocated to `presentation/`

**Type:** Implementation

**Risk class:** High — appshell public API paths and internal imports retargeted

**Clean Core impact:** A→A — no legacy TSX migration; governed presentation layer renamed; auth stubs removed

## Handoff block

```
Handoff from: docs/PAS/slice/b42h-pas005a-legacy-tree-delete.md

1. Objective    — Delete packages/appshell/src/shadcn-studio/ tree; relocate governed blocks to presentation/; pass consumer scan; update parity registry paths.
2. Allowed layer— packages/appshell/src/** · packages/shadcn-studio/src/registry/** · apps/storybook/tsconfig.storybook.json · docs/PAS/**
3. Files        — (see Completion Report)
4. Prohibited   — Migrate/copy MCP raw blocks into appshell · foundation-disposition.registry.ts · Governed UI className strip · afenda-appshell-studio.css delete (CSS still required for governed blocks)
5. Authority    — PAS-005A §11.4 · B42b delete sequence · ADR-0017
6. Gates        —
   pnpm --filter @afenda/appshell typecheck
   pnpm --filter @afenda/appshell test:run
   pnpm --filter @afenda/shadcn-studio test:run
   pnpm quality:boundaries
7. Closes       — Legacy shadcn-studio folder delete; consumer scan gate; parity registry path sync
8. Evidence     — legacy-studio-consumer-scan.test.ts; presentation/ tree; deleted auth stub re-exports
9. Attestation  — Inventory · Consumer scan · Build · Documentation
```

## Delete sequence (executed)

| Step | Action |
| --- | --- |
| 1 | Renamed `packages/appshell/src/shadcn-studio/` → `packages/appshell/src/presentation/` |
| 2 | Retargeted 53 internal import paths (`./shadcn-studio/` → `./presentation/`) |
| 3 | Deleted auth stub re-exports (`app-shell-auth-login-page-04.tsx`, `app-shell-auth-error-page-02.tsx`) — canonical surface is `@afenda/appshell/auth-shell` |
| 4 | Updated parity registry legacy paths + `legacyBlockRoot` |
| 5 | Added `legacy-studio-consumer-scan.test.ts` |
| 6 | Updated Storybook tsconfig story globs |

## Parity snapshot (post-B42h)

| Metric | Value |
| --- | ---: |
| Legacy tree | **Deleted** (`shadcn-studio/` path absent) |
| Governed blocks | **Retained** under `presentation/blocks/` |
| MCP canonical product | `@afenda/shadcn-studio` |
| `afenda-appshell-studio.css` | **Retained** (governed semantic classes for presentation blocks) |

## Follow-on (B42i proposed)

- Thin governed wrappers delegating to `@afenda/shadcn-studio` MCP blocks (replace duplicate presentation TSX)
- Governed UI className strip on MCP blocks
- `foundation-registry-owner`: promote `PKGR05A_SHADCN_STUDIO` to `green-lane`

## DoD

- [x] Legacy `shadcn-studio/` folder deleted (renamed to `presentation/`)
- [x] Consumer scan test passes
- [x] Parity registry paths updated
- [x] Auth stub re-exports removed
- [x] appshell typecheck + test:run gates
- [ ] Governed block TSX replaced by MCP wrappers (deferred B42i)
- [ ] `afenda-appshell-studio.css` consolidation (deferred)
