# shadcn-studio-v2 Migration And Retirement Ledger

## Purpose

Machine-readable migration status for the greenfield V2 baseline. Rows cite
executable proof — not narrative intent.

**Consumer proof route (Phase 8):** `apps/developer` → `/design-system/v2-proof`

**Acceptance (Phase 9):** 2026-07-06 — all package gates + `pnpm --filter @afenda/developer verify:v2-proof` + developer build PASS.

## Status vocabulary

```txt
pending → approved-for-migration → migrated → pilot-proven → enterprise-accepted → retirement-candidate → retired
```

Never treat `migrated = retired` or `pilot-proven = enterprise-ready` without consumer proof.

---

## Package baseline

| Artifact | V2 destination | Status | Proof |
| --- | --- | --- | --- |
| Greenfield package baseline | `packages/shadcn-studio-v2` | **enterprise-accepted** | Phase 9 gates: 156 tests, typecheck, build, drift, biome |
| Public export contract | `index.ts`, `clients.ts`, `server.ts`, `metadata.ts`, `theme` | **enterprise-accepted** | `public-exports.test.ts`, `runtime-boundary.test.ts` |
| CSS export contract | `shadcn-default.css`, `themes/*.css` | **enterprise-accepted** | `check:drift`, `style-governance.test.ts`, consumer `globals.css` |
| Consumer proof route | `@afenda/developer` `/design-system/v2-proof` | **pilot-proven** | Phase 8 DoD, import-boundary test, MCP `get_errors` zero |

---

## Theme overlays

| Legacy / reference | V2 path | Status | Proof |
| --- | --- | --- | --- |
| shadcn default tokens | `src/styles/shadcn-default.css` | **enterprise-accepted** | drift + APCA + proof route default baseline |
| Swiss Noir editorial | `src/styles/swiss-noir.css` | **pilot-proven** | ThemeCustomizer on proof route |
| Verdant Noir editorial | `src/styles/verdant-noir.css` | **pilot-proven** | ThemeCustomizer on proof route |
| Afenda operator brand (calm) | `src/styles/afenda-brand.css` | **pilot-proven** | Default theme on proof route; `check:apca` |

---

## Proof-route surfaces (public imports)

| Surface | V2 export | Status | Proof route | Notes |
| --- | --- | --- | --- | --- |
| App shell chrome | `AppShell01` / `clients` | **pilot-proven** | Yes | Sidebar + Topbar via AppShell01 |
| Page surface | `PageSurface` | **pilot-proven** | Yes | |
| Metric widget | `MetricWidget` | **pilot-proven** | Yes | |
| Evidence widget | — | **pending** | Stand-in | MetricWidget documents deferral; no V2 export yet |
| Data table | `DataTableSurface` | **pilot-proven** | Yes | |
| Form surface | `FormSurface` | **pilot-proven** | Yes | |
| Confirm dialog | `ConfirmDialogSurface` | **pilot-proven** | Yes | |
| Settings surface | `SettingsSurface` | **pilot-proven** | Yes | |
| Theme controls | `ThemeToggle`, `ThemeCustomizer` | **pilot-proven** | Yes | light/dark/system + all theme ids |

---

## Consumer apps

| App | Role | Status | Notes |
| --- | --- | --- | --- |
| `apps/developer` | Phase 8 proof + route lab | **pilot-proven** | `/design-system/v2-proof` uses public V2 only |
| `apps/erp` | Production ERP | **pending** | Presentation providers wired to V2; broad migration not started |

---

## Legacy package (`@afenda/shadcn-studio`)

| Area | Status | Notes |
| --- | --- | --- |
| v1 lab shell (`AdmincnShell`) | **migrated** (lab only) | Developer `(lab)` routes still use v1 shell + v1 `SettingsProvider` |
| v1 ERP presentation | **pending** | ERP skeleton uses V2 providers; full surface migration not in scope |
| v1 package retirement | **pending** | ADR-0027 archive-lane; no deletion in closing gate |

---

## Rollback

Greenfield proof requires no rollback. If a row regresses, reopen the owning
slice (see `docs/slices/README.md`) and revert the consumer proof route before
widening migration claims.
