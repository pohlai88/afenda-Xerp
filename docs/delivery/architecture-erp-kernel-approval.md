# Delivery: `@afenda/erp → @afenda/kernel` registry approval

| Field | Value |
|-------|-------|
| **Date** | 2026-06-22 |
| **Owner** | Architecture Authority |
| **Scope** | Registry / dependency approval only (no ERP runtime refactor) |
| **Fingerprint** | `ARCH-BASELINE-2026-06-20-v1` (unchanged) |

## Violation

`pnpm quality:architecture` failed with:

```
(dependencies) [@afenda/erp] unapproved runtime dependency @afenda/erp → @afenda/kernel
```

`apps/erp/package.json` declares `@afenda/kernel` as a runtime dependency. ERP server code imports kernel contracts (`AppError`, `AppErrors`, branded ID helpers, request context types) for governed API handlers and server actions. The edge was missing from the architecture dependency registry.

## Registry decision: **Approved**

| Check | Result |
|-------|--------|
| Layer model | **Valid** — `Application` (`@afenda/erp`) may depend on `Platform` (`@afenda/kernel`) per `layer-registry.data.ts` `allowedTargets.Application` |
| Precedent | **Valid** — `@afenda/appshell → @afenda/kernel`, `@afenda/auth → @afenda/kernel`, `@afenda/execution → @afenda/kernel` are already approved |
| Purpose | ERP is the primary App Router delivery surface; consuming kernel execution/error contracts at the app boundary is expected for hardened routes and server actions |
| Alternatives rejected | Removing the dependency would require duplicating platform contracts or routing all kernel usage through indirect packages — out of scope and weaker boundary hygiene |

## Files changed

| File | Change |
|------|--------|
| `packages/architecture-authority/src/data/dependency-registry.data.ts` | Added `["@afenda/erp", "@afenda/kernel"]` to `RUNTIME_EDGES`; added `"@afenda/kernel"` to `approvedRuntimeByPackage["@afenda/erp"]` |
| `packages/architecture-authority/src/__tests__/validate-architecture.test.ts` | Aligned mock workspace graphs with live `package.json` deps (erp + storybook) |
| `docs/architecture/dependency-registry.md` | Documented approved edge and updated erp approved-deps row |
| `docs/architecture/dependency-snapshot.json` | Regenerated via `pnpm architecture:dependencies` |

## Rollback

1. Revert the registry/data/test/doc changes above (or `git revert` the commit).
2. Rebuild authority: `pnpm --filter @afenda/architecture-authority build`
3. Regenerate snapshot: `pnpm architecture:dependencies`
4. Confirm failure returns if ERP still declares kernel without approval: `pnpm quality:architecture`

To remove the dependency entirely (not recommended without refactor): delete `@afenda/kernel` from `apps/erp/package.json` and replace all ERP kernel imports with approved indirect contracts — separate change, not part of this delivery.

## Verification

```bash
pnpm --filter @afenda/architecture-authority build
pnpm quality:architecture          # architecture valid (21 workspaces)
pnpm quality:architecture-drift    # dependency snapshot matches live workspace graph
pnpm --filter @afenda/architecture-authority test:run
pnpm quality
```

## Architecture score

**9.5 / 10** — Explicit, traceable, layer-valid runtime edge approval with snapshot drift alignment. Remaining 0.5: `dependency-registry.md` baseline table still understates total edge count vs live graph (pre-existing doc drift outside this edge).
