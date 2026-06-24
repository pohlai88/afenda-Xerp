# TIP-013A — Phase 9 Accounting Readiness Gate

| Field | Value |
| --- | --- |
| **Status** | Complete |
| **Authority status** | **Accepted** — ADR-0010 Phase 9 gate checklist binding |
| **Runtime evidence** | Slices 1–5 delivered — gate orchestrator, CI wiring, live diagnostics, sign-off record |
| **Status source** | [`afenda-runtime-truth-matrix.md`](../../architecture/afenda-runtime-truth-matrix.md) |
| **Foundation phase** | Phase 9 — Accounting Readiness Gate |
| **Remaining gap** | None — Phase 9 signed off 2026-06-24; TIP-014 contracts may begin |

## Purpose

Prove Foundation Phase 9 Accounting Readiness Gate requirements with automated CI evidence, boundary-safe serializable accounting-readiness contracts, ERP resolver wiring, and a governed System Admin diagnostics panel — **without** implementing Accounting Core (`TIP-014+`, `@afenda/accounting`, ADR-0010).

ADR-0010 authority: Accounting Core coding is prohibited until Phase 9 gate passes with documented evidence per [`pre-accounting-foundation-roadmap.md`](../../architecture/pre-accounting-foundation-roadmap.md) Phase 9.

Surface rule: `accounting-readiness-gate-is-canonical-phase-9-matrix`

## Scope

**In scope**

- Phase 9 gate registry + `pnpm check:accounting-readiness-gate` orchestrator (10 roadmap requirements)
- `AccountingReadinessContext` wire-format + JSON serializability compile-time guard
- ERP `resolveAccountingReadinessContext` server boundary
- System Admin diagnostics page with shadcn/studio KPI readiness metrics block
- Integration + contract tests; documentation sync

**Out of scope**

- `@afenda/accounting`, PKG-R01, chart of accounts, journals, ledger, posting, consolidation arithmetic
- Accounting Core admin UI (TIP-014+)
- Manual Architecture Authority sign-off automation (human gate remains)

**Sign-off record:** [`phase-9-accounting-readiness-sign-off.md`](../../architecture/phase-9-accounting-readiness-sign-off.md) (2026-06-24)

## Runtime evidence

| Artifact | Path | Proven |
| --- | --- | --- |
| Gate orchestrator | `scripts/governance/check-accounting-readiness-gate.mts` | Yes |
| Gate registry | `scripts/governance/accounting-readiness-gate-registry.mts` | Yes |
| Kernel readiness contract | `packages/kernel/src/context/accounting-readiness.contract.ts` | Yes |
| ERP resolver | `apps/erp/src/lib/context/resolve-accounting-readiness.server.ts` | Yes |
| Diagnostics UI (live gate status) | `apps/erp/src/app/(protected)/system-admin/diagnostics/` + `--json-status` orchestrator | Yes — Slice 3 |

## Package ownership

| Package | Role |
| --- | --- |
| `@afenda/kernel` (PKG-010) | Serializable accounting-readiness authority contracts |
| `@afenda/erp` (PKG-007) | Resolver wiring + System Admin diagnostics page |
| `@afenda/appshell` (PKG-001) | shadcn/studio readiness metrics block |
| `scripts/governance/` | Phase 9 gate CI orchestrator |

## Depends on

- TIP-013 System Admin control plane — Complete
- TIP-007/012 Enterprise Group Operating Context — Complete
- TIP-008A consolidation scope resolver — Complete
- TIP-010 / TIP-010A API RBAC + contract governance — Complete
- TIP-007A feature manifest — Complete
- TIP-009 CI/CD spine — Complete

## Blocks

- TIP-014+ Accounting Core (ADR-0010)
- `@afenda/accounting` (PKG-R01)

## Deliverables

| File / path | Package | Layer | Status |
| --- | --- | --- | --- |
| `scripts/governance/accounting-readiness-gate-registry.mts` | scripts | CI | Delivered |
| `scripts/governance/check-accounting-readiness-gate.mts` | scripts | CI | Delivered |
| `scripts/governance/__tests__/check-accounting-readiness-gate.test.ts` | scripts | CI | Delivered |
| `packages/kernel/src/context/accounting-readiness.contract.ts` | `@afenda/kernel` | Kernel | Delivered |
| `packages/kernel/src/context/index.ts` | `@afenda/kernel` | Kernel | Delivered |
| `packages/kernel/src/__tests__/accounting-readiness.contract.test.ts` | `@afenda/kernel` | Kernel | Delivered |
| `apps/erp/src/lib/context/resolve-accounting-readiness.server.ts` | `@afenda/erp` | Application | Delivered |
| `apps/erp/src/lib/context/__tests__/resolve-accounting-readiness.server.test.ts` | `@afenda/erp` | Application | Delivered |
| `apps/erp/src/lib/context/__tests__/accounting-readiness-integration.test.ts` | `@afenda/erp` | Application | Delivered |
| `apps/erp/src/lib/system-admin/accounting-readiness-gate.copy.contract.ts` | `@afenda/erp` | Application | Delivered |
| `apps/erp/src/lib/system-admin/resolve-accounting-readiness-gate-status.server.ts` | `@afenda/erp` | Application | Delivered |
| `apps/erp/src/lib/system-admin/system-admin-sections.ts` | `@afenda/erp` | Application | Delivered |
| `apps/erp/src/components/system-admin/system-admin-readiness-gate-panel.tsx` | `@afenda/erp` | Application | Delivered |
| `packages/appshell/src/shadcn-studio/blocks/system-admin-readiness-gate-metrics.tsx` | `@afenda/appshell` | ERPSpine | Delivered |
| `packages/appshell/src/shadcn-studio/blocks/system-admin-readiness-gate-metrics.stories.tsx` | `@afenda/appshell` | ERPSpine | Delivered |
| `apps/erp/src/app/(protected)/system-admin/diagnostics/page.tsx` | `@afenda/erp` | Application | Delivered |
| `package.json` (root — `check:accounting-readiness-gate`) | root | CI | Delivered |
| `apps/erp/src/lib/system-admin/resolve-system-admin-card-nav.ts` | `@afenda/erp` | Application | Delivered |
| `apps/erp/src/components/erp-card-nav-grid.tsx` | `@afenda/erp` | Application | Delivered |
| `packages/appshell/src/index.ts` | `@afenda/appshell` | ERPSpine | Delivered |
| `packages/kernel/src/index.ts` | `@afenda/kernel` | Kernel | Delivered |
| `scripts/quality/check-release-gates.mjs` | scripts | CI | Delivered |
| `.github/workflows/ci.yml` | CI | CI | Delivered |
| `.github/workflows/release-verification.yml` | CI | CI | Delivered |
| `scripts/governance/lib/accounting-readiness-gate-erp-copy-parity.mts` | scripts | CI | Delivered |

## Acceptance gate

- `pnpm check:accounting-readiness-gate` — all 10 Phase 9 requirements delegate to existing gates or new evidence
- `pnpm quality:release-gate` — verifies CI runs `check:accounting-readiness-gate`
- `pnpm --filter @afenda/kernel test:run` — accounting-readiness serializability + mapping tests
- `pnpm --filter @afenda/erp test:run` — resolver + diagnostics smoke tests
- `pnpm ui:guard:scan` — diagnostics UI TIP-004 clean
- `pnpm check:documentation-drift`

## Definition of Done

| # | Criterion | Verification | Status |
|---|-----------|-------------|--------|
| 1 | Phase 9 gate orchestrator exists | `pnpm check:accounting-readiness-gate` | [x] |
| 2 | All 10 roadmap requirements mapped to delegated gates | Registry unit test | [x] |
| 3 | AccountingReadinessContext JSON-serializable at compile time | Kernel contract test | [x] |
| 4 | ERP resolver produces readiness context from operating context | ERP resolver test | [x] |
| 5 | System Admin diagnostics page renders readiness grid | ERP render test | [x] |
| 6 | No accounting Core logic introduced | ADR-0010 prohibition test | [x] |
| 7 | TypeScript strict — no `any` | package typechecks | [x] |
| 8 | Runtime matrix updated | `afenda-runtime-truth-matrix.md` | [x] |
| 9 | TIP status index updated | `tip-status-index.md` | [x] |
| 10 | Drift guard passes | `pnpm check:documentation-drift` | [x] |
| 11 | Phase 9 gate wired into TIP-009 release-gate + CI | `pnpm quality:release-gate` | [x] |
| 12 | ERP diagnostics copy matches CI registry | parity gate in `check:accounting-readiness-gate` | [x] |
| 13 | Diagnostics UI shows live pass/fail/skipped gate status per requirement | ERP render test + `--json-status` gate | [x] |
| 14 | Diagnostics risk mitigations (performance, sign-off clarity, ADR-0010 guard) | ERP presentation + prohibition tests | [x] |
| 15 | Phase 9 Architecture Authority sign-off record + foundation disposition clear | `phase-9-accounting-readiness-sign-off.md` + `pnpm check:foundation-disposition` | [x] |

## Handoff to implementation

### Slice 1 — Gate automation + TypeScript boundary + diagnostics UI

**Status:** Delivered  
**Prerequisite:** TIP-013 runtime evidence = `Complete` in `tip-status-index.md`; TIP-008A Slice 6 delivered — `packages/kernel/src/context/hierarchy-id-boundary.contract.ts` = `implemented` in `afenda-runtime-truth-matrix.md`

#### Design (internal-guide)

- Gate registry maps each Phase 9 roadmap requirement (#1–#10) to an existing `pnpm check:*` / `pnpm quality:*` command or explicit test-file evidence — no duplicate gate logic.
- `AccountingReadinessWireContext` mirrors hierarchy wire pattern: plain string ids, compile-time `AssertJsonSerializable` guard; export from kernel index.
- ERP `resolveAccountingReadinessContext` delegates to `toAccountingReadinessContext` at operating-context trust boundary only — no inline consolidation math.
- Diagnostics page: extend `SYSTEM_ADMIN_SECTIONS` with `diagnostics`; reuse shadcn/studio KPI stat pattern (`/rui` refine from `app-shell-dashboard-kpi-stat`) for 10 requirement status cards; zero `className` on `@afenda/ui`.
- Gate status server module reads static registry metadata (requirement labels + last-known gate command) — does not shell out in request path; CI owns live gate execution.

#### Handoff block (repaired §3 — includes compile/export wiring omitted from initial handoff)

```
Handoff from: docs/delivery/tips/[Partially Implemented] tip-013a-accounting-readiness-gate.md

1. Objective    — Deliver Phase 9 Accounting Readiness Gate Slice 1: automated gate orchestrator, boundary-safe accounting-readiness TypeScript contracts, ERP resolver wiring, and governed System Admin diagnostics UI.
2. Allowed layer— scripts/governance/
                  packages/kernel/src/context/
                  apps/erp/src/lib/context/
                  apps/erp/src/lib/system-admin/
                  apps/erp/src/components/system-admin/
                  apps/erp/src/components/
                  apps/erp/src/app/(protected)/system-admin/
                  packages/appshell/src/shadcn-studio/blocks/
3. Files        — scripts/governance/accounting-readiness-gate-registry.mts (New)
                  scripts/governance/check-accounting-readiness-gate.mts (New)
                  scripts/governance/__tests__/check-accounting-readiness-gate.test.ts (New)
                  packages/kernel/src/context/accounting-readiness.contract.ts (Modified)
                  packages/kernel/src/context/index.ts (Modified)
                  packages/kernel/src/index.ts (Modified)
                  packages/kernel/src/__tests__/accounting-readiness.contract.test.ts (Modified)
                  apps/erp/src/lib/context/resolve-accounting-readiness.server.ts (New)
                  apps/erp/src/lib/context/__tests__/resolve-accounting-readiness.server.test.ts (New)
                  apps/erp/src/lib/context/__tests__/accounting-readiness-integration.test.ts (Modified)
                  apps/erp/src/lib/system-admin/accounting-readiness-gate.copy.contract.ts (New)
                  apps/erp/src/lib/system-admin/resolve-accounting-readiness-gate-status.server.ts (New)
                  apps/erp/src/lib/system-admin/system-admin-sections.ts (Modified)
                  apps/erp/src/lib/system-admin/resolve-system-admin-card-nav.ts (Modified)
                  apps/erp/src/components/system-admin/system-admin-readiness-gate-panel.tsx (New)
                  apps/erp/src/components/erp-card-nav-grid.tsx (Modified)
                  packages/appshell/src/shadcn-studio/blocks/system-admin-readiness-gate-metrics.tsx (New)
                  packages/appshell/src/shadcn-studio/blocks/system-admin-readiness-gate-metrics.stories.tsx (New)
                  packages/appshell/src/index.ts (Modified)
                  apps/erp/src/app/(protected)/system-admin/diagnostics/page.tsx (New)
                  apps/erp/src/__tests__/system-admin-readiness-gate.test.tsx (New)
                  package.json (Modified — check:accounting-readiness-gate script)
                  docs/delivery/tips/[Partially Implemented] tip-013a-accounting-readiness-gate.md (Modified)
                  docs/architecture/afenda-runtime-truth-matrix.md (Modified)
                  docs/delivery/tip-status-index.md (Modified)
4. Prohibited   — @afenda/accounting, PKG-R01, ledger/journal/COA/posting/consolidation arithmetic, TIP-014+ Accounting Core, packages/ui primitive edits, hand-edited migration SQL, local permission constants outside PERMISSION_REGISTRY, className on @afenda/ui primitives in consumers
5. Authority    — ADR-0010 — Architecture Authority Phase 9 gate + Kernel context contracts + Application Authority (ERP System Admin)
6. Gates        — pnpm --filter @afenda/kernel typecheck
                  pnpm --filter @afenda/kernel test:run
                  pnpm --filter @afenda/erp typecheck
                  pnpm --filter @afenda/erp test:run
                  pnpm --filter @afenda/appshell typecheck
                  pnpm --filter @afenda/appshell test:run
                  pnpm check:accounting-readiness-gate
                  pnpm ui:guard:scan
                  pnpm quality:boundaries
                  pnpm ci:biome
                  pnpm check:documentation-drift
```

#### Known debt

- Architecture Authority manual sign-off for gate pass remains human-only.
- Live gate execution on diagnostics page deferred — UI shows requirement metadata; CI runs `check:accounting-readiness-gate`.
- Slice 2 closes TIP-009 CI wiring and ERP↔registry parity.

### Slice 2 — TIP-009 CI wiring + registry parity + handoff repair

**Status:** Delivered  
**Prerequisite:** Slice 1 delivered — `scripts/governance/check-accounting-readiness-gate.mts` = `implemented` in `afenda-runtime-truth-matrix.md`

#### Design (internal-guide)

- Extend TIP-009 `check-release-gates.mjs` to require `check:accounting-readiness-gate` in `ci.yml`, `release-verification.yml`, and root `package.json` scripts (same pattern as `check:erp-observability`).
- CI runs `pnpm check:accounting-readiness-gate --structure-only` before `quality:release-gate` on PR CI; `release-verification.yml` runs full delegated gate on `main`.
- Orchestrator excludes self-recursion: when spawning delegated gates, skip `check:accounting-readiness-gate` even if listed on requirement #9 metadata.
- ERP `accounting-readiness-gate.copy.contract.ts` stays display-only but must match registry ids/gates/tests — enforced by structural parity helper in governance, not cross-package imports.
- Requirement #9 registry row documents both `quality:release-gate` and `check:accounting-readiness-gate` for CI traceability.

#### Handoff block

```
Handoff from: docs/delivery/tips/[Partially Implemented] tip-013a-accounting-readiness-gate.md

1. Objective    — Wire Phase 9 accounting-readiness gate into TIP-009 release-gate meta-check and GitHub CI workflows, enforce ERP diagnostics copy parity with the governance registry, and repair Slice 1 handoff file list.
2. Allowed layer— scripts/quality/
                  scripts/governance/
                  .github/workflows/
                  apps/erp/src/lib/system-admin/
                  docs/delivery/
                  docs/architecture/
3. Files        — scripts/quality/check-release-gates.mjs (Modified)
                  scripts/governance/check-accounting-readiness-gate.mts (Modified)
                  scripts/governance/accounting-readiness-gate-registry.mts (Modified)
                  scripts/governance/lib/accounting-readiness-gate-erp-copy-parity.mts (New)
                  scripts/governance/__tests__/check-accounting-readiness-gate.test.ts (Modified)
                  apps/erp/src/lib/system-admin/accounting-readiness-gate.copy.contract.ts (Modified)
                  .github/workflows/ci.yml (Modified)
                  .github/workflows/release-verification.yml (Modified)
                  docs/delivery/tips/[Partially Implemented] tip-013a-accounting-readiness-gate.md (Modified)
                  docs/architecture/afenda-runtime-truth-matrix.md (Modified)
                  docs/delivery/tip-status-index.md (Modified)
4. Prohibited   — @afenda/accounting, PKG-R01, ledger/journal/COA/posting, TIP-014+ Accounting Core, packages/ui edits, packages/appshell block rewrites beyond copy parity, running accounting gate recursively in delegated spawn
5. Authority    — ADR-0010 Phase 9 gate + TIP-009 CI/CD delivery spine
6. Gates        — pnpm check:accounting-readiness-gate --structure-only
                  pnpm quality:release-gate
                  pnpm ci:biome
                  pnpm check:documentation-drift
```

#### DoD rows this slice closes

| # | Criterion | Gate |
|---|-----------|------|
| 11 | Phase 9 gate wired into TIP-009 release-gate + CI | `pnpm quality:release-gate` |
| 12 | ERP diagnostics copy matches CI registry | `pnpm check:accounting-readiness-gate --structure-only` |

#### Known debt

- Architecture Authority manual Phase 9 sign-off remains human-only — TIP-014+ still blocked.
- Full delegated gate on every PR CI is deferred to `--structure-only`; `release-verification.yml` runs full orchestrator on `main`.

### Slice 3 — Live gate status on diagnostics UI

**Status:** Delivered  
**Prerequisite:** Slice 2 delivered — TIP-009 CI wiring + ERP copy parity = `implemented` in `afenda-runtime-truth-matrix.md`

#### Design (internal-guide)

- Extend governance orchestrator with `--json-status` emitting a kernel `AccountingReadinessGateLiveSnapshot` (JSON-serializable, boundary-safe).
- ERP diagnostics spawns `pnpm exec tsx scripts/governance/check-accounting-readiness-gate.mts --json-status` server-side with a 5-minute in-process cache; Vitest uses `--structure-only` (no delegated spawn).
- Default production diagnostics runs structure + evidence live; set `AFENDA_ACCOUNTING_READINESS_DIAGNOSTICS_FULL=1` for delegated gate execution (slow, admin-only).
- `/rui` refine `system-admin-readiness-gate-metrics` — status dot + text, tabular-nums, pass/fail/skipped emphasis per afenda-ui-quality; zero `className` on `@afenda/ui`.
- Explicit non-goals: no Architecture Authority sign-off artifact, no TIP-014 / PKG-R01 / `@afenda/accounting` activation.

#### Handoff block

```
Handoff from: docs/delivery/tips/[Partially Implemented] tip-013a-accounting-readiness-gate.md

1. Objective    — Replace metadata-only System Admin diagnostics with live Phase 9 gate pass/fail/skipped status per requirement via the governance orchestrator JSON snapshot, governed KPI metrics UI, and kernel wire contracts — without Architecture Authority sign-off or Accounting Core activation.
2. Allowed layer— scripts/governance/
                  packages/kernel/src/context/
                  apps/erp/src/lib/system-admin/
                  apps/erp/src/components/system-admin/
                  apps/erp/src/app/(protected)/system-admin/diagnostics/
                  packages/appshell/src/shadcn-studio/blocks/
                  packages/appshell/src/styles/
3. Files        — scripts/governance/lib/accounting-readiness-gate-live-status.mts (New)
                  scripts/governance/check-accounting-readiness-gate.mts (Modified)
                  scripts/governance/__tests__/check-accounting-readiness-gate.test.ts (Modified)
                  packages/kernel/src/context/accounting-readiness-gate-live-status.contract.ts (New)
                  packages/kernel/src/context/accounting-readiness-gate-requirement-id.contract.ts (New)
                  packages/kernel/src/context/index.ts (Modified)
                  packages/kernel/src/__tests__/accounting-readiness-gate-live-status.contract.test.ts (New)
                  apps/erp/src/lib/system-admin/resolve-monorepo-root.server.ts (New)
                  apps/erp/src/lib/system-admin/spawn-accounting-readiness-gate-live-status.server.ts (New)
                  apps/erp/src/lib/system-admin/resolve-accounting-readiness-gate-status.server.ts (Modified)
                  apps/erp/src/lib/system-admin/accounting-readiness-gate.copy.contract.ts (Modified)
                  apps/erp/src/components/system-admin/system-admin-readiness-gate-panel.tsx (Modified)
                  apps/erp/src/app/(protected)/system-admin/diagnostics/page.tsx (Modified)
                  apps/erp/src/__tests__/system-admin-readiness-gate.test.tsx (Modified)
                  packages/appshell/src/shadcn-studio/blocks/system-admin-readiness-gate-metrics.tsx (Modified)
                  packages/appshell/src/shadcn-studio/blocks/system-admin-readiness-gate-metrics.stories.tsx (Modified)
                  packages/appshell/src/styles/afenda-appshell.css (Modified)
                  docs/delivery/tips/[Partially Implemented] tip-013a-accounting-readiness-gate.md (Modified)
                  docs/architecture/afenda-runtime-truth-matrix.md (Modified)
4. Prohibited   — @afenda/accounting, PKG-R01, ledger/journal/COA/posting, TIP-014+ Accounting Core, Architecture Authority Phase 9 sign-off artifact creation, packages/ui primitive edits, claiming Phase 9 passed or unblocking ADR-0010
5. Authority    — ADR-0010 — Architecture Authority Phase 9 gate + Kernel context contracts + Application Authority (ERP System Admin)
6. Gates        — pnpm --filter @afenda/kernel typecheck
                  pnpm --filter @afenda/kernel test:run
                  pnpm --filter @afenda/erp typecheck
                  pnpm --filter @afenda/erp test:run
                  pnpm --filter @afenda/appshell typecheck
                  pnpm --filter @afenda/appshell test:run
                  pnpm check:accounting-readiness-gate --structure-only
                  pnpm ui:guard:scan
                  pnpm ci:biome
                  pnpm check:documentation-drift
```

#### DoD rows this slice closes

| # | Criterion | Gate |
|---|-----------|------|
| 13 | Diagnostics UI shows live pass/fail/skipped gate status per requirement | `pnpm --filter @afenda/erp test:run` |

#### Known debt

- Architecture Authority manual Phase 9 sign-off remains human-only — TIP-014+ still blocked by ADR-0010.
- Full delegated gate on diagnostics page requires `AFENDA_ACCOUNTING_READINESS_DIAGNOSTICS_FULL=1`; default page load uses structure-only for responsiveness.

### Slice 4 — Diagnostics risk mitigation (performance, sign-off clarity, ADR-0010 guard)

**Status:** Delivered  
**Prerequisite:** Slice 3 delivered — live diagnostics `--json-status` = `implemented` in `afenda-runtime-truth-matrix.md`

#### Design (internal-guide)

- Never show “all requirements passing” on structure-only runs — ERP presentation layer maps to `evidence-pass` / `evidence-fail` vs `automated-pass` / `automated-fail`.
- Prominent sign-off banner (`role="status"`) states Phase 9 is not approved; no sign-off artifact is created.
- On-demand full delegated run via protected server action + refresh form (avoids slow default page load); env var documented in `.env.example` as opt-in only.
- Static prohibition tests scan diagnostics wiring for `@afenda/accounting` imports.

#### Handoff block

```
Handoff from: docs/delivery/tips/[Partially Implemented] tip-013a-accounting-readiness-gate.md

1. Objective    — Harden System Admin diagnostics against the three Slice 3 risks: slow full delegated runs (on-demand refresh + structure-only default), misread Phase 9 approval (presentation labels + sign-off banner), and accidental Accounting Core activation (prohibition tests + unchanged ADR-0010 boundaries).
2. Allowed layer— apps/erp/src/lib/system-admin/
                  apps/erp/src/components/system-admin/
                  apps/erp/src/app/(protected)/system-admin/diagnostics/
                  packages/appshell/src/styles/
                  scripts/governance/__tests__/
                  .env.example
3. Files        — apps/erp/src/lib/system-admin/resolve-accounting-readiness-gate-presentation.server.ts (New)
                  apps/erp/src/lib/system-admin/refresh-accounting-readiness-gate-full.action.ts (New)
                  apps/erp/src/lib/system-admin/resolve-accounting-readiness-gate-status.server.ts (Modified)
                  apps/erp/src/lib/system-admin/accounting-readiness-gate.copy.contract.ts (Modified)
                  apps/erp/src/components/system-admin/system-admin-readiness-gate-panel.tsx (Modified)
                  apps/erp/src/components/system-admin/system-admin-readiness-gate-refresh.client.tsx (New)
                  apps/erp/src/app/(protected)/system-admin/diagnostics/page.tsx (Modified)
                  apps/erp/src/lib/system-admin/__tests__/resolve-accounting-readiness-gate-presentation.test.ts (New)
                  apps/erp/src/__tests__/system-admin-readiness-gate.test.tsx (Modified)
                  scripts/governance/__tests__/accounting-readiness-diagnostics-prohibition.test.ts (New)
                  packages/appshell/src/styles/afenda-appshell.css (Modified)
                  .env.example (Modified)
                  docs/delivery/tips/[Partially Implemented] tip-013a-accounting-readiness-gate.md (Modified)
                  docs/architecture/afenda-runtime-truth-matrix.md (Modified)
4. Prohibited   — @afenda/accounting, PKG-R01, ledger/journal/COA/posting, TIP-014+ Accounting Core, Architecture Authority Phase 9 sign-off artifact creation, packages/ui primitive edits, claiming Phase 9 passed or unblocking ADR-0010
5. Authority    — ADR-0010 — Architecture Authority Phase 9 gate + Application Authority (ERP System Admin)
6. Gates        — pnpm --filter @afenda/erp typecheck
                  pnpm --filter @afenda/erp test:run
                  pnpm ui:guard:scan
                  pnpm ci:biome
                  pnpm check:documentation-drift
```

#### DoD rows this slice closes

| # | Criterion | Gate |
|---|-----------|------|
| 14 | Diagnostics risk mitigations: structure-only default, sign-off banner, on-demand full refresh, ADR-0010 prohibition tests | `pnpm --filter @afenda/erp test:run` |

#### Known debt

- None for Phase 9 gate. TIP-014 requires its own ADR before `@afenda/accounting` filesystem creation.

### Slice 5 — Phase 9 sign-off + foundation disposition closure

**Status:** Delivered (2026-06-24)  
**Prerequisite:** Slices 1–4 delivered; foundation disposition zero red-lane (`FOUNDATION-DISPOSITION-2026-06-24-v3`)

#### Design (internal-guide)

- Publish canonical sign-off at `docs/architecture/phase-9-accounting-readiness-sign-off.md` (not the deprecated `phase-9-architecture-authority-sign-off.md` path).
- Wire `check:foundation-disposition` into Phase 9 requirement #10 delegated gates.
- Update ERP diagnostics copy to reflect signed-off state; TIP-014 contracts still bounded (no ledger posting).
- Mark TIP-013A Complete; unblock TIP-014 in tip-status-index.

#### Known debt

- None for Phase 9 gate. TIP-014 requires its own ADR before `@afenda/accounting` filesystem creation.

## Verdict

**Complete** — Phase 9 Accounting Readiness Gate signed off 2026-06-24. Automated evidence, foundation disposition, and sign-off record delivered. TIP-014 Accounting Core Contracts may begin; ledger posting remains prohibited until TIP-014 ADR acceptance.
