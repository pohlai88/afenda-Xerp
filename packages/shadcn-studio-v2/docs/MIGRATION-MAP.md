# shadcn-studio-v2 Migration And Retirement Ledger

## Purpose

Machine-readable migration status for the greenfield V2 baseline. Rows cite
executable proof — not narrative intent.

## Execution priority (2026-07-06)

**Lane A — V2 internal stabilization:** **Complete** (sign-off 2026-07-06, decision
**PROCEED**). Slices A-01–A-11 delivered with gate evidence in
`docs/slices/LANE-A-INTERNAL-STABILIZATION-INDEX.md`.

**Lane B — V1 / ERP migration:** **Complete** (sign-off 2026-07-06, decision
**PROCEED**). Program index
`docs/slices/LANE-B-V1-MIGRATION-AND-RETIREMENT-INDEX.md`
(B-01–B-15 delivered). Baseline: `scripts/lane-b/v1-consumer-import.baseline.json`
(**0** consumer v1 imports). Gates:
`check:v1-consumer-imports`, `lane-b-v1-import-baseline.test.ts`,
`lane-b-v1-import-freeze.test.ts`, `lane-b-sign-off.test.ts`.

```txt
Lane A (complete) → package + developer proof + gates
Lane B (complete) → v1 formally deprecated; v2 sole ERP presentation chain
```

Lane B entry criteria used **`approved-for-planning`** (unlocked after A-11 PROCEED).

**Lane A sign-off (2026-07-06):** **PROCEED** — package tests 196/196, typecheck, build,
drift, biome ci, `verify:v2-proof`, developer build PASS.

**Consumer proof route (Phase 8):** `apps/developer` → `/design-system/v2-proof`

**Acceptance (Phase 9):** 2026-07-06 — enterprise-accepted greenfield baseline.

**Kebab stem law:** 2026-07-06 — `normalize:kebab-stems --check` clean.

## Status vocabulary

```txt
pending → approved-for-migration → migrated → pilot-proven → enterprise-accepted → retirement-candidate → retired
```

Never treat `migrated = retired` or `pilot-proven = enterprise-ready` without consumer proof.

---

## Package baseline

| Artifact | V2 destination | Status | Proof |
| --- | --- | --- | --- |
| Greenfield package baseline | `packages/shadcn-studio-v2` | **enterprise-accepted** | Lane A sign-off: 196 tests, typecheck, build, drift, biome |
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
| App shell chrome | `AppShell01` / `clients` | **pilot-proven** | Yes | sidebar + topbar via AppShell01 |
| Page surface | `page-surface` | **pilot-proven** | Yes | |
| Metric widget | `MetricWidget` | **pilot-proven** | Yes | |
| Evidence widget | `EvidenceWidget` | **pilot-proven** | Yes | Manifest registry kind `evidence` |
| Data table | `data-table-surface` | **pilot-proven** | Yes | |
| Form surface | `form-surface` | **pilot-proven** | Yes | |
| Confirm dialog | `confirm-dialog-surface` | **pilot-proven** | Yes | |
| Settings surface | `settings-surface` | **pilot-proven** | Yes | |
| Theme controls | `theme-toggle`, `ThemeCustomizer` | **pilot-proven** | Yes | light/dark/system + all theme ids |
| Auth shell | `AuthShell` / `clients` | **pilot-proven** | Opt-in | Verification toggle or `?verify=1`; static fixture only |
| Presentation state matrix | Lane A-08 fixtures | **pilot-proven** | Yes | Non-ready states for page, metric, evidence, table, form, auth loading |

---

## Lane A internal stabilization (2026-07-06)

| Deliverable | Status | Proof |
| --- | --- | --- |
| Kebab stem normalization (A-01) | **complete** | `normalize:kebab-stems --check`, taxonomy snapshot |
| Widget manifest + evidence (A-02) | **complete** | `workspace-board-manifest-registry.test.ts` |
| Auth shell proof opt-in (A-03) | **complete** | `v2-proof-route.verification.test.tsx` |
| Primitive contracts — form (A-04) | **complete** | `test:primitives` / `primitive-form-controls.test.ts` |
| Primitive contracts — overlays (A-05) | **complete** | `primitive-overlays.test.ts` |
| Primitive contracts — nav chrome (A-06) | **complete** | `primitive-nav-data.test.ts` |
| Quarantine promotion governance (A-07) | **complete** | `quarantine-governance.test.ts`, `check:drift` quarantine rules |
| Proof route state matrix (A-08) | **complete** | `v2-proof-route.state-matrix.test.tsx` |
| Workflow board host mapping (A-09) | **complete** | Option A HOLD — `workflow-board-host-mapping.ts` |
| Lane A doc/runtime sync (A-10) | **complete** | `lane-a-synchronization.test.ts` |
| Lane A internal sign-off (A-11) | **complete** | `lane-a-sign-off.test.ts`, full gate matrix |

Lane B: B-01–B-15 **complete** — formal v1 deprecation at B-15 (`lane-b-sign-off.test.ts`).

## Lane B sign-off (2026-07-06)

| Gate | Result |
| --- | --- |
| Consumer v1 imports | **0** (`check:v1-consumer-imports`) |
| `lane-b-sign-off.test.ts` | PASS |
| `lane-b-synchronization.test.ts` | PASS |
| `lane-b-v1-import-freeze.test.ts` | PASS |
| ADR amendment | **ADR-0040 Accepted** |
| Registry | `@afenda/shadcn-studio` → `archive-lane` (retired); `@afenda/shadcn-studio-v2` → `green-lane` |
| `@afenda/developer verify:v2-proof` + build | PASS |
| `@afenda/erp build` | PASS |
| `@afenda/storybook typecheck` | PASS |
| `pnpm check:foundation-disposition` | PASS |

**Decision:** **`PROCEED`** — Lane B program **Complete**. v1 filesystem removal authorized in follow-up housekeeping PR.

## Lane B-01 v1 consumer import baseline (2026-07-06)

| Consumer | v1 import statements | Status |
| --- | --- | --- |
| `apps/developer/src` | 0 | **migrated** — B-12 complete |
| `apps/erp/src` | 0 | **migrated** — B-07-ext Wave 2 complete |
| `apps/storybook` | 0 | **migrated** — B-11 complete |
| **Total** | **0** | `check:v1-consumer-imports` + `lane-b-v1-import-baseline.test.ts` |

Scope: `import`/`export` from `@afenda/shadcn-studio` (excludes `-v2`). Does not
replace drift guard (v2 package source only) or B-13 zero-import freeze.

## Consumer apps

| App | Role | Status | Notes |
| --- | --- | --- | --- |
| `apps/developer` | Phase 8 proof + route lab | **migrated** | B-12: zero v1 imports; v2-only lab routes |
| `apps/erp` | Production ERP | **migrated** | B-07-ext imports + B-13 v1 workspace dep removed |
| `apps/storybook` | Block lab | **migrated** | B-11 v2 `/lab` export + decorators |

---

## Legacy package (`@afenda/shadcn-studio`) — Lane B

| Area | Status | Notes |
| --- | --- | --- |
| v1 lab shell (`AdmincnShell`) | **migrated** | Developer `(lab)` on v2 `AppShell01` (B-04) |
| v1 ERP presentation CSS | **migrated** | ERP `globals.css` v2 dist imports (B-03) |
| v1 ERP presentation TSX | **migrated** | Wave 2 (B-07-ext): roles/permissions/workspace/auth/error surfaces on v2 |
| v1 ERP system-admin memberships/users | **pilot-proven** | `ErpDataTableComposer` + v2 toolbar (B-07) |
| v1 ERP system-admin roles/permissions | **pilot-proven** | B-07-ext composers + audit/diagnostics/settings panels |
| v1 Storybook lab | **migrated** | B-11 `@afenda/shadcn-studio-v2/lab` |
| v1 ERP shell / nav wires | **migrated** | `AppProtectedShell` on v2 `AppShell01` (B-06) |
| v1 package retirement | **retired** | B-15 PROCEED; ADR-0040 Accepted; registry `archive-lane`; filesystem delete authorized (housekeeping PR) |

---

## Rollback

Greenfield proof requires no rollback. If a row regresses, reopen the owning
slice (see `docs/slices/README.md`) and revert the consumer proof route before
widening migration claims.
