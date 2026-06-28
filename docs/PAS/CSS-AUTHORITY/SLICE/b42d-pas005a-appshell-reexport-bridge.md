# Slice B42d ÔÇö Appshell Re-export Bridge + Parity Contract (PAS-005A ┬º11.4)

**Prerequisite:** B42c delivered ÔÇö live MCP blocks in `@afenda/shadcn-studio`; dependency edge `@afenda/appshell` ÔåÆ `@afenda/shadcn-studio` approved

**Status:** Delivered (2026-06-28) ÔÇö bridge exports + parity registry; **legacy delete still blocked**

**Type:** Implementation (partial cutover)

**Risk class:** High ÔÇö public API surface on `@afenda/appshell`; legacy tree retained

**Clean Core impact:** AÔåÆB ÔÇö strangler bridge; no legacy TSX migration

## Handoff block

```
Handoff from: docs/PAS/CSS-AUTHORITY/SLICE/b42d-pas005a-appshell-reexport-bridge.md

1. Objective    ÔÇö Wire appshell re-export bridge to @afenda/shadcn-studio live MCP blocks; publish serializable parity registry; keep legacy tree until deleteBlocked is false.
2. Allowed layerÔÇö packages/appshell/src/shadcn-studio-bridge/** ┬À packages/appshell/src/index.ts (bridge exports only) ┬À packages/appshell/package.json ┬À packages/shadcn-studio/src/registry/** ┬À packages/architecture-authority/src/data/dependency-registry.data.ts (edge ÔÇö registry owner) ┬À docs/PAS/**
3. Files        ÔÇö
   packages/appshell/src/shadcn-studio-bridge/index.ts
   packages/appshell/src/__tests__/shadcn-studio-bridge.test.ts
   packages/appshell/package.json
   packages/appshell/src/index.ts
   packages/shadcn-studio/src/registry/studio-block-parity.registry.ts
   packages/shadcn-studio/src/__tests__/studio-block-parity.registry.test.ts
   packages/shadcn-studio/src/index.ts
   docs/PAS/CSS-AUTHORITY/SLICE/b42d-pas005a-appshell-reexport-bridge.md
   docs/PAS/pas-status-index.md
4. Prohibited   ÔÇö DELETE packages/appshell/src/shadcn-studio/** ┬À Migrate/copy legacy TSX ┬À className Governed UI strip on MCP blocks ┬À foundation-disposition.registry.ts (except registry-owner edge)
5. Authority    ÔÇö PAS-005A ┬º11.4 ┬À ADR-0017 ┬À PKGR05A ┬À dependency-registry
6. Gates        ÔÇö
   pnpm --filter @afenda/shadcn-studio typecheck
   pnpm --filter @afenda/shadcn-studio test:run
   pnpm --filter @afenda/appshell typecheck
   pnpm --filter @afenda/appshell test:run
   pnpm --filter @afenda/architecture-authority test:run
   pnpm quality:boundaries
   pnpm quality:architecture
7. Closes       ÔÇö Dual-path risk mitigation; appshell consumer path to live MCP blocks; machine-readable parity for B42d+ delete gate
8. Evidence     ÔÇö
   packages/appshell/src/shadcn-studio-bridge/index.ts
   packages/shadcn-studio/src/registry/studio-block-parity.registry.ts
   packages/architecture-authority dependency edge appshellÔåÆshadcn-studio
9. Attestation  ÔÇö Bridge ┬À Registry ┬À Boundaries ┬À Documentation
```

## Bridge exports (public API)

| Appshell export | Source (`@afenda/shadcn-studio`) |
| --- | --- |
| `AppShellPresentationHeroSection01` | `HeroSection01Block` |
| `AppShellPresentationLoginPage04` | `LoginPage04Block` |
| `AppShellPresentationStatisticsCard01` | `StatisticsCard01Block` |
| `SHADCN_STUDIO_BLOCK_PARITY_REGISTRY` | Parity map |
| `computeStudioBlockParitySummary()` | Delete gate (`deleteBlocked: true` until 100%) |

## Parity snapshot (post-B42d)

| Metric | Value |
| --- | ---: |
| Legacy production blocks | 63 |
| Registry tracked MCP surfaces | 4 |
| Parity (registry entries / legacy) | ~6% |
| **Delete blocked** | **Yes** |

## Delete gate (B42e+ / operator)

`computeStudioBlockParitySummary().deleteBlocked === false` **and** consumer scan clean **and** extended `/cui` batches per B42b inventory.

## DoD

- [x] Dependency edge `@afenda/appshell` ÔåÆ `@afenda/shadcn-studio`
- [x] Bridge module + appshell barrel exports
- [x] Serializable parity registry + tests
- [x] Legacy tree retained
- [ ] Legacy tree delete (deferred ÔÇö parity < 100%)
