# Slice B42d — Appshell Re-export Bridge + Parity Contract (PAS-005A §11.4)

**Prerequisite:** B42c delivered — live MCP blocks in `@afenda/shadcn-studio`; dependency edge `@afenda/appshell` → `@afenda/shadcn-studio` approved

**Status:** Delivered (2026-06-28) — bridge exports + parity registry; **legacy delete still blocked**

**Type:** Implementation (partial cutover)

**Risk class:** High — public API surface on `@afenda/appshell`; legacy tree retained

**Clean Core impact:** A→B — strangler bridge; no legacy TSX migration

## Handoff block

```
Handoff from: docs/PAS/slice/b42d-pas005a-appshell-reexport-bridge.md

1. Objective    — Wire appshell re-export bridge to @afenda/shadcn-studio live MCP blocks; publish serializable parity registry; keep legacy tree until deleteBlocked is false.
2. Allowed layer— packages/appshell/src/shadcn-studio-bridge/** · packages/appshell/src/index.ts (bridge exports only) · packages/appshell/package.json · packages/shadcn-studio/src/registry/** · packages/architecture-authority/src/data/dependency-registry.data.ts (edge — registry owner) · docs/PAS/**
3. Files        —
   packages/appshell/src/shadcn-studio-bridge/index.ts
   packages/appshell/src/__tests__/shadcn-studio-bridge.test.ts
   packages/appshell/package.json
   packages/appshell/src/index.ts
   packages/shadcn-studio/src/registry/studio-block-parity.registry.ts
   packages/shadcn-studio/src/__tests__/studio-block-parity.registry.test.ts
   packages/shadcn-studio/src/index.ts
   docs/PAS/slice/b42d-pas005a-appshell-reexport-bridge.md
   docs/PAS/pas-status-index.md
4. Prohibited   — DELETE packages/appshell/src/shadcn-studio/** · Migrate/copy legacy TSX · className TIP-004 strip on MCP blocks · foundation-disposition.registry.ts (except registry-owner edge)
5. Authority    — PAS-005A §11.4 · ADR-0017 · PKGR05A · dependency-registry
6. Gates        —
   pnpm --filter @afenda/shadcn-studio typecheck
   pnpm --filter @afenda/shadcn-studio test:run
   pnpm --filter @afenda/appshell typecheck
   pnpm --filter @afenda/appshell test:run
   pnpm --filter @afenda/architecture-authority test:run
   pnpm quality:boundaries
   pnpm quality:architecture
7. Closes       — Dual-path risk mitigation; appshell consumer path to live MCP blocks; machine-readable parity for B42d+ delete gate
8. Evidence     —
   packages/appshell/src/shadcn-studio-bridge/index.ts
   packages/shadcn-studio/src/registry/studio-block-parity.registry.ts
   packages/architecture-authority dependency edge appshell→shadcn-studio
9. Attestation  — Bridge · Registry · Boundaries · Documentation
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

- [x] Dependency edge `@afenda/appshell` → `@afenda/shadcn-studio`
- [x] Bridge module + appshell barrel exports
- [x] Serializable parity registry + tests
- [x] Legacy tree retained
- [ ] Legacy tree delete (deferred — parity < 100%)
