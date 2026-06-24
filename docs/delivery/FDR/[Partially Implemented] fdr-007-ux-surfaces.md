# fdr-007-ux-surfaces — ERP UX Surfaces

| Field | Value |
| --- | --- |
| **Status** | Partially Implemented |
| **FDR ID** | `fdr-007-ux-surfaces` |
| **Registry entry ID** | — (no dedicated registry entry; PKG-007 FDR subdomain only) |
| **Package** | `@afenda/erp` (PKG-007) |
| **Lane** | — (index row; not gate-critical — no `requiredBeforeAccounting` registry row) |
| **Clean Core level** | B ([enterprise-erp-standards §10](../../../.cursor/skills/enterprise-erp-standards/SKILL.md)) |
| **Change class** | Extension |
| **Risk class** | Low |
| **BRD reference** | internal — governed ERP app surfaces (Phase 6 UI closeout) |
| **Enterprise readiness** | **26/30 audit-adjusted** · **28/30 evidence-qualified ceiling** — enterprise **9.5 candidate** (not final Complete; see §Enterprise benchmark qualification) |
| **Runtime evidence** | See §Runtime evidence |
| **Source of truth** | `foundation-disposition.registry.ts` (PKG-007 package scope only) |
| **Document role** | Delivery authority / evidence plan — not registry authority |
| **Status source** | [`afenda-runtime-truth-matrix.md`](../../architecture/afenda-runtime-truth-matrix.md) |
| **Index** | [`fdr-status-index.md`](../fdr-status-index.md) |
| **Enterprise controls** | Fiori UX · Fusion UX ([enterprise-erp-standards §8](../../../.cursor/skills/enterprise-erp-standards/SKILL.md)) |

## §Registry link

> **No dedicated foundation disposition registry entry** — `fdr-status-index.md` lists registry column **—**. This FDR scopes the **ux-surfaces** subdomain on `@afenda/erp` (PKG-007) with `runtimeOwner: apps/erp`. Registry authority for a future dedicated row belongs to `foundation-registry-owner`; until then, acceptance gates are FDR-defined below.

| Field | Value |
| --- | --- |
| id | — (FDR-only subdomain; index registry column **—**) |
| packageId | PKG-007 |
| domain | `ux-surfaces` (FDR subdomain — not in registry) |
| lane | — |
| runtimeOwner | `apps/erp` |
| gates (FDR acceptance) | `pnpm --filter @afenda/erp test:run`; `pnpm ui:guard:scan`; `pnpm check:documentation-drift` |
| prohibited | `do-not-edit-ui-primitives` (consume `@afenda/ui` only); `do-not-add-classname-on-afenda-ui-primitives` |
| allowedAgents | `erp-app-agent`; `foundation-registry-owner` (registry row creation only) |

## Package ownership

| Package | Role | runtimeOwner path |
| --- | --- | --- |
| `@afenda/erp` (PKG-007) | Protected/auth routes, loading/error boundaries, dashboard + module placeholders | `apps/erp/src/app/` · `apps/erp/src/components/` |
| `@afenda/appshell` (PKG-001) | Production `AppShell` integration in protected layout (read-only consumer) | `packages/appshell/` |
| `@afenda/ui` (PKG-004) | Governed primitives — zero consumer `className` | `packages/ui/src/components/` |
| `@afenda/metadata-ui` | Metadata workspace renderers (read-only consumer) | `packages/metadata-ui/` |
| Governance scripts | TIP-004 UI consumption scan | `scripts/governance/ui-guard.mjs` |

## Purpose

Lock and maintain governed ERP application surfaces — auth pages, protected AppShell layout, loading/error boundaries, manifest module placeholders, metadata workspace, and TIP-004 UI consumption — so every production ERP route uses design-system tokens, `@afenda/ui` primitives without consumer `className`, and consistent empty-state/alert patterns before Accounting Core activation.

Authority: [ADR-0014](../../adr/ADR-0014-foundation-disposition-registry.md) · [ADR-0016](../../adr/ADR-0016-fdr-delivery-authority.md).

Archive input (not implementation authority): [`tip-ui-05-erp-app-surfaces.md`](../../delivery/tips/[Complete]%20tip-ui-05-erp-app-surfaces.md).

## Scope

**In scope**

- `apps/erp/src/app/(auth)/` — sign-in and auth UX with governed `@afenda/ui` components
- `apps/erp/src/app/(protected)/` — layout, dashboard, loading.tsx, error.tsx, module placeholders, metadata workspace
- `apps/erp/src/app/globals.css` — token/CSS pipeline composition
- `apps/erp/src/components/` — dashboard client, route segment error, workspace surfaces
- ERP UX governance tests: `governed-ui-consumption.test.ts`, `nextjs-app-router-hardening.test.ts`, `error-handling.test.ts`, `protected-appshell-token-closeout.test.ts`
- `pnpm ui:guard:scan` — Gate D full-tree className + import scan (243 ERP/appshell/metadata-ui files)

**Out of scope**

- Design-system primitive authoring (`packages/ui/components/ui/` — ask Architecture Authority)
- Feature manifest registry and route generation (`fdr-001-manifest-nav`, `fdr-006-feature-manifest`)
- System Admin control plane pages (`fdr-007-system-admin` — cross-reference evidence only)
- Accounting Core runtime (ADR-0010)
- shadcn/studio candidate blocks marked **Rejected** in archive tip-ui-05

## §Subagent concurrency rules

| Rule | Requirement |
| --- | --- |
| Registry ownership | Only `foundation-registry-owner` may create a dedicated PKG-007 ux-surfaces registry row |
| Package boundary | Implementation agent may edit only `apps/erp` paths under §Scope |
| UI primitives | **Zero** `className` on `@afenda/ui` in ERP — shell chrome on plain HTML only (TIP-004) |
| Evidence output | Agents must output file paths + gate exit 0 — not prose-only claims |
| Parallel PKG-007 | **Sequential** with sibling FDRs — same `runtimeOwner`; orchestrator serializes shared `apps/erp` edits |
| Handoff authority | Executable 9-field handoff blocks authored only by `fdr-slice-author` — not in this FDR |

## §Research

> Slice 1 **Complete** (2026-06-25). Research reconciled archive tip-ui-05 Complete claims, runtime matrix ERP surface evidence, and live gate exit codes with FDR delivery evidence grades.

### Discovery questions — answers (Slice 1)

| Question | Answer | Evidence |
| --- | --- | --- |
| Does protected layout use production AppShell + manifest nav? | **Yes** | `(protected)/layout.tsx`; manifest nav resolver |
| Are loading/error boundaries governed? | **Yes** — Skeleton + RouteSegmentError | `loading.tsx`; `error.tsx`; `route-segment-error.test.tsx` |
| Does full ERP test suite exit 0? | **No** — 2 failures / 522 pass (improved from 3) | Gap `ux-erp-test-failures` |
| Does `pnpm ui:guard:scan` exit 0? | **Yes** — 243 files clean | Gate log below |
| Is a registry entry required for FDR delivery? | **No for Research** — index explicitly **—**; optional Registry-sync slice | `fdr-status-index.md` row 13 |
| Does archive tip-ui-05 Complete imply FDR Complete? | **No** — archive ≠ FDR delivery authority | ADR-0016 |

### Baseline gate log (Research Slice 1 — 2026-06-25)

| Gate | Exit | Grade |
| --- | ---: | --- |
| `pnpm ui:guard:scan` | 0 | A (241 files clean, 0.2s) |
| `pnpm --filter @afenda/erp test:run` | 1 | B (521 pass, 3 fail — see gap) |
| `pnpm --filter @afenda/erp typecheck` | 0 | A |
| `pnpm check:documentation-drift` | 0 | A (post FDR upgrade) |
| `pnpm check:foundation-disposition` | 0 | A |

### v2 audit gate log (2026-06-25 refresh)

| Gate | Exit | Grade |
| --- | ---: | --- |
| `pnpm ui:guard:scan` | 0 | A (243 files clean, 1.4s) |
| `pnpm --filter @afenda/erp test:run` | 1 | B (522 pass, 2 fail — see gap) |
| `pnpm --filter @afenda/erp typecheck` | 0 | A |
| `pnpm check:documentation-drift` | 0 | A |
| `pnpm check:foundation-disposition` | 0 | A |

### Files inspected

| Path | Why |
| --- | --- |
| `apps/erp/src/app/(protected)/layout.tsx` | Production AppShell + context + manifest nav |
| `apps/erp/src/app/(protected)/loading.tsx` | Governed Skeleton loading boundary |
| `apps/erp/src/app/(protected)/error.tsx` | Route segment error boundary |
| `apps/erp/src/app/(protected)/page.tsx` | Protected dashboard home |
| `apps/erp/src/app/(protected)/modules/[moduleId]/page.tsx` | Manifest module placeholder UX |
| `apps/erp/src/app/(protected)/metadata-workspace/page.tsx` | Metadata UI production page |
| `apps/erp/src/app/(auth)/sign-in/sign-in-form.tsx` | Governed auth form primitives |
| `apps/erp/src/app/globals.css` | CSS pipeline composition |
| `apps/erp/src/__tests__/governed-ui-consumption.test.ts` | TIP-004 consumption gate |
| `apps/erp/src/__tests__/nextjs-app-router-hardening.test.ts` | App Router boundary tests (10 tests) |
| `apps/erp/src/__tests__/error-handling.test.ts` | Error surface tests (6 tests) |
| `apps/erp/src/__tests__/protected-appshell-token-closeout.test.ts` | AppShell token alignment |
| `apps/erp/src/components/__tests__/protected-workspace-dashboard.integration.test.tsx` | Dashboard integration |
| [`afenda-runtime-truth-matrix.md`](../../architecture/afenda-runtime-truth-matrix.md) | ERP / System Admin surface rows |

## Runtime evidence (2026-06-25)

| Artifact | Path | Proven |
| --- | --- | --- |
| Protected layout | `apps/erp/src/app/(protected)/layout.tsx` | Yes — Grade A (`typecheck` + integration harness) |
| Protected loading | `apps/erp/src/app/(protected)/loading.tsx` | Yes — Grade B (Skeleton + `aria-busy`; no dedicated unit test) |
| Protected error | `apps/erp/src/app/(protected)/error.tsx` | Yes — Grade B (`route-segment-error.test.tsx`) |
| Dashboard home | `apps/erp/src/app/(protected)/page.tsx` | Yes — Grade B (`protected-workspace-dashboard.integration.test.tsx`) |
| Module placeholders | `apps/erp/src/app/(protected)/modules/[moduleId]/page.tsx` | Yes — Grade B (manifest pipeline cross-ref) |
| Metadata workspace | `apps/erp/src/app/(protected)/metadata-workspace/page.tsx` | Yes — Grade B (`metadata-production-page.test.tsx`) |
| Sign-in form | `apps/erp/src/app/(auth)/sign-in/sign-in-form.tsx` | Yes — Grade B (governed Button/Input/Label) |
| CSS pipeline | `apps/erp/src/app/globals.css` | Yes — Grade B (token imports verified on disk) |
| UI guard scan | `scripts/governance/ui-guard.mjs` | Yes — Grade A (`ui:guard:scan` exit 0, 243 files) |
| Governed UI test | `apps/erp/src/__tests__/governed-ui-consumption.test.ts` | Yes — Grade A |
| App Router hardening | `apps/erp/src/__tests__/nextjs-app-router-hardening.test.ts` | Yes — Grade A (10 tests) |
| Error handling suite | `apps/erp/src/__tests__/error-handling.test.ts` | Yes — Grade A (6 tests) |
| AppShell token closeout | `apps/erp/src/__tests__/protected-appshell-token-closeout.test.ts` | Yes — Grade A (2 tests) |
| Route segment error | `apps/erp/src/__tests__/route-segment-error.test.tsx` | Yes — Grade A (3 tests) |
| Empty state patterns | `apps/erp/src/__tests__/erp-empty-state.test.tsx` | Yes — Grade B (2 tests) |

## §Remaining gaps

> Gap tracking lives here — registry `knownGaps` is deprecated.

| Gap ID | Description | Lane impact | Owner | Target slice | Close condition |
| --- | --- | --- | --- | --- | --- |
| `ux-erp-test-failures` | `pnpm --filter @afenda/erp test:run` — 2 failing tests (522 pass): `context-switch.action.test.ts`, `list-visible-system-admin-sections.server.test.ts` | — | `erp-app-agent` | Slice 2 | Full suite exit 0 |
| `ux-no-registry-entry` | No foundation disposition registry row for ux-surfaces | — | `foundation-registry-owner` | Registry-sync (optional) | New entry or documented waiver in index |
| `ux-complete-status` | FDR at 26/30 audit-adjusted; Complete blocked on test failures + peer review | — | Architecture Authority (PR) | Complete | DoD #2 + #14 `[x]` |

## §Enterprise readiness score

> **Enterprise 9.5 (final)** = 29/30 on this table **and** DoD #14 peer review closed **and** waivers reconfirmed at PR ([ENTERPRISE-BENCHMARK.md §3](../../../.cursor/skills/write-fdr/ENTERPRISE-BENCHMARK.md)). This FDR is **not gate-critical** (no registry row). Until Complete, it is an **enterprise 9.5 candidate / evidence-qualified**.
>
> Score 0–5 per dimension (integers only). Every point maps to gate exit 0, test path, or explicit §Waivers row.

| Dimension | Score | Evidence | Audit note |
| --- | ---: | --- | --- |
| Contract stability | 4/5 | `typecheck` exit 0 + governed UI consumption test — Grade A | — |
| Test coverage | 4/5 | 522 ERP tests pass; 2 failures tracked — Grade B | Failures: context-switch + system-admin section filter |
| Observability + audit | 4/5 | `client-error-reporting.test.ts` (8 tests) — Grade B | — |
| Security + RBAC + RLS | 4/5 | CSP + middleware tests (`middleware-csp.test.ts` 12 tests) — Grade B | — |
| Documentation + BRD traceability | 5/5 | FDR v2 + tip-ui-05 archive + drift gate exit 0 — Grade A | — |
| Maintainability + Clean Core | 5/5 | `ui:guard:scan` exit 0 (243 files); TIP-004 compliant — Grade A | — |
| **Total (audit-adjusted)** | **26/30** | **~8.7 / 10 equivalent** — honest UX surface score today | |
| **Total (evidence-qualified ceiling)** | **28/30** | Upper bound if 2 test failures fixed + E2E waived + peer review pending only | Not final 9.5 until Complete |

## §Clean Core classification

| Level | Meaning | Allowed for red-lane / gate-critical? |
| --- | --- | --- |
| A | Registry-driven, public contracts, no local authority, no private imports | Yes |
| B | Approved extension boundary, dependency registered, no duplicated constants | Yes |
| C | Tactical workaround, bounded and tracked | No, unless ADR waiver |
| D | Local hack, duplicate constants, private import, undocumented runtime behaviour | No |

**This FDR: Level B** — ERP surfaces consume `@afenda/ui`, `@afenda/appshell`, `@afenda/metadata-ui` at approved boundaries; layout chrome on plain HTML; no primitive edits.

**Rule: red-lane or gate-critical FDRs must be Clean Core A or B.** (This FDR is not gate-critical.)

## §Impact analysis

| Consumer package | Import surface | Breaking change? | Clean Core impact |
| --- | --- | --- | --- |
| End users (ERP) | Protected/auth routes, AppShell chrome | No | B→B |
| `@afenda/appshell` | `AppShell`, providers from protected layout | No | B→B |
| `@afenda/metadata-ui` | Metadata workspace page renderers | No | B→B |
| `fdr-007-system-admin` | Admin pages share protected layout + TIP-004 rules | No | B→B |

Upstream consumers scan: new ERP pages under `(protected)/` must pass `pnpm ui:guard:scan` and avoid `className` on `@afenda/ui` primitives.

## §Enterprise acceptance

| SAP control | Oracle control | Afenda gate | DoD # |
| --- | --- | --- | --- |
| Fiori UX | Fusion UX | `pnpm ui:guard:scan` | 1, 16 |
| SOLMAN | FDD testable AC | Gherkin §Acceptance criteria | 2 |
| SAP namespace / dependency governance | CEMLI extension registry | `pnpm quality:boundaries` | 3 |
| ATC | Quality standards | `pnpm ci:biome` | 5 |
| TIP-004 UI governance | Oracle UX standards | `pnpm ui:guard:erp` (Gate F) | 16 |

## §BRD traceability

> No orphan AC rows. Every acceptance criterion maps to internal requirement or archive tip-ui-05.

| BRD ref | Acceptance criteria | DoD # | Afenda gate |
| --- | --- | --- | --- |
| internal | Zero `className` on `@afenda/ui` in ERP production TSX | 16 | `pnpm ui:guard:scan` |
| internal | Protected routes use AppShell production layout | 1 | `(protected)/layout.tsx` + integration tests |
| internal | Loading and error boundaries use governed components | 17 | `loading.tsx` + `route-segment-error.test.tsx` |
| tip-ui-05 (archive) | CSS pipeline composes ui + appshell + metadata-ui tokens | 18 | `globals.css` |
| tip-ui-05 (archive) | Manifest module placeholders at `/modules/[moduleId]` | 2 | module placeholder page + manifest tests |

## §NFR

| Characteristic (ISO 25010) | Target | Verification |
| --- | --- | --- |
| Functional suitability | Auth + protected surfaces render with governed components | integration + hardening tests |
| Performance efficiency | Loading skeletons for async RSC segments | `loading.tsx` + code review |
| Compatibility | AppShell token alignment with design system | `protected-appshell-token-closeout.test.ts` |
| Security | CSP nonce pipeline on protected layout when required | `middleware-csp.test.ts` |
| Maintainability | ui:guard scan clean; typecheck strict | `ui:guard:scan` + `typecheck` |
| Reliability | Error boundaries recover via RouteSegmentError reset | `error-handling.test.ts` |
| Accessibility | Loading `aria-busy`; error alerts semantic | `loading.tsx`; RouteSegmentError component |

## §SoD evidence

| Governed mutation | Approver ≠ initiator | Evidence path |
| --- | --- | --- |
| UX surfaces (read-heavy) | N/A — no governed mutation in layout/loading paths | — |
| Domain mutations (general) | waived — Phase 9 gate | [`phase-9-accounting-readiness-sign-off.md`](../../architecture/phase-9-accounting-readiness-sign-off.md) |

## Depends on

- [`fdr-status-index.md`](../fdr-status-index.md) row **fdr-007-ux-surfaces** (registry column **—**)
- Upstream: [`fdr-001-manifest-nav`](%5BPartially%20Implemented%5D%20fdr-001-manifest-nav.md) — manifest nav in protected layout
- Upstream: [`fdr-007-operating-context`](%5BNot%20started%5D%20fdr-007-operating-context.md) — operating context in layout
- Sibling: [`fdr-007-system-admin`](%5BNot%20started%5D%20fdr-007-system-admin.md) — admin surfaces share protected chrome
- Archive evidence: [`tip-ui-05-erp-app-surfaces.md`](../../delivery/tips/[Complete]%20tip-ui-05-erp-app-surfaces.md)

## Deliverables

| File | Package | New / Modified |
| --- | --- | --- |
| `docs/delivery/FDR/[status] fdr-007-ux-surfaces.md` | — | Modified per slice |
| `apps/erp/src/app/(protected)/loading.tsx` | `@afenda/erp` | Modified (Implementation slices only) |
| `apps/erp/src/app/(protected)/error.tsx` | `@afenda/erp` | Modified (Implementation slices only) |
| `apps/erp/src/app/(protected)/layout.tsx` | `@afenda/erp` | Modified (Implementation slices only) |

## Acceptance gate

- `pnpm ui:guard:scan`
- `pnpm --filter @afenda/erp test:run`
- `pnpm --filter @afenda/erp typecheck`
- `pnpm check:documentation-drift`
- `pnpm check:foundation-disposition`

## Acceptance criteria

```gherkin
Feature: Governed ERP application surfaces

  Scenario: Protected layout renders AppShell with manifest navigation
    GIVEN an authenticated linked session
    AND operating context resolves successfully from headers
    WHEN the protected layout renders
    THEN AppShell receives identity, operating context, and manifest navigation pages
    AND WorkspaceDashboardCapabilitiesProvider wraps dashboard children

  Scenario: UI guard scan finds no className on @afenda/ui primitives in ERP
    GIVEN production TSX under apps/erp scanned by ui:guard Gate D
    WHEN pnpm ui:guard:scan runs
    THEN zero violations are reported across appshell, metadata-ui, and erp consumer trees

  Scenario: Protected loading boundary exposes accessible busy state
    GIVEN a protected route segment is loading
    WHEN loading.tsx renders
    THEN Skeleton components from @afenda/ui are shown
    AND the container has aria-busy="true"

  Scenario: Protected error boundary allows recovery
    GIVEN a protected route segment throws during render
    WHEN error.tsx renders RouteSegmentError
    THEN the user sees a governed Alert with title and description
    AND reset() re-attempts rendering the segment
```

## Definition of Done

| # | Criterion | Gate | Status |
| --- | --- | --- | --- |
| 1 | Runtime evidence at stated paths | file exists + ui:guard pass | [x] |
| 2 | Tests pass | `pnpm --filter @afenda/erp test:run` | [ ] |
| 3 | Boundaries | `pnpm quality:boundaries` | [x] |
| 4 | TypeScript strict | `pnpm --filter @afenda/erp typecheck` | [x] |
| 5 | Biome clean | `pnpm exec biome check apps/erp/src/app` | [x] |
| 6 | Registry aligned | N/A — no registry row; index documents **—** | [x] |
| 7 | Runtime matrix updated | matrix ERP surface rows cited | [x] |
| 8 | fdr-status-index updated | index row + prefix rename | [x] |
| 9 | Drift green | `pnpm check:documentation-drift` | [x] |
| 10 | §11 + enterprise attestation | afenda-coding-session §11 | [x] |
| 11 | NFR baselines documented | §NFR section complete | [x] |
| 12 | Impact analysis complete | §Impact analysis table filled | [x] |
| 13 | Rollback plan present | §Rollback strategy filled | [x] |
| 14 | Peer review | PR approved by Architecture Authority member | [ ] |
| 15 | Clean Core level declared | metadata + §Clean Core aligned | [x] |
| 16 | TIP-004 UI governance | `pnpm ui:guard:scan` exit 0 | [x] |
| 17 | Error/loading boundaries tested | route-segment + error-handling tests | [x] |
| 18 | CSS pipeline verified | globals.css imports ui + appshell + metadata-ui | [x] |
| 19 | E2E requirement satisfied or waived | §Waivers `ux-e2e` | [x] |
| 20 | Enterprise readiness score updated | §Enterprise readiness score (audit-adjusted + ceiling) | [x] |

## Slices

### Slice 1 — Research (ux-surfaces)

**Status:** Complete (2026-06-25)  
**Prerequisite:** —  
**Type:** Research  
**Risk class:** Low  
**Clean Core impact:** B→B

**Purpose:** Reconcile archive tip-ui-05 Complete with FDR **Not started**; map protected/auth surfaces → ui:guard → tests; update §Runtime evidence and §Enterprise readiness score. No source edits.

**Outcomes:**

- Baseline gate log recorded (`ui:guard:scan` exit 0; test suite 3 failures documented)
- Status promoted to **Partially Implemented**
- Readiness score: **26/30 audit-adjusted** (28/30 ceiling)
- Slice 2 unblocked for failing test remediation
- v2 audit gate log recorded in §Research (`ui:guard:scan` 243 files; 522 pass / 2 fail)

### Slice 2 — Implementation (ERP test suite closeout)

**Status:** Not started  
**Prerequisite:** Slice 1 Complete ✓  
**Type:** Implementation  
**Risk class:** Low  
**Clean Core impact:** B→B

#### Design (internal-guide)

Close gap `ux-erp-test-failures` — restore `pnpm --filter @afenda/erp test:run` exit 0 (522 pass / 2 fail today) without editing `@afenda/ui` primitives or design-system paths.

Two bounded fixes in `apps/erp`:

1. **Context-switch action audit actor** — `context-switch.action.ts` derives `actorUserId` from resolved `operatingContext.actor.userId` instead of `contextResult.session.user` (aligns with operating-spine prohibition on session-trusted identity for governed mutations); update `context-switch.action.test.ts` mocks accordingly.
2. **System-admin diagnostics nav parity** — update `list-visible-system-admin-sections.server.test.ts` to expect diagnostics section when `audit.read` is granted (diagnostics shares `readPermissionKey` with audit in `system-admin-sections.ts`); extend `system-admin-section-nav-parity.test.ts` if section ordering assertions drift.

No layout or AppShell changes — TIP-004 scan already clean (243 files).

#### Handoff block

```
Handoff from: docs/delivery/FDR/[Partially Implemented] fdr-007-ux-surfaces.md

1. Objective    — Fix two failing ERP tests (context-switch action audit actor + system-admin diagnostics section visibility) to achieve full test:run exit 0 without primitive or AppShell edits.
2. Allowed layer— apps/erp/src/lib/context/context-switch.action.ts; apps/erp/src/lib/context/__tests__/context-switch.action.test.ts; apps/erp/src/lib/system-admin/__tests__/list-visible-system-admin-sections.server.test.ts; apps/erp/src/lib/system-admin/__tests__/system-admin-section-nav-parity.test.ts
3. Files        —
   apps/erp/src/lib/context/context-switch.action.ts
   apps/erp/src/lib/context/__tests__/context-switch.action.test.ts
   apps/erp/src/lib/system-admin/__tests__/list-visible-system-admin-sections.server.test.ts
   apps/erp/src/lib/system-admin/__tests__/system-admin-section-nav-parity.test.ts
   docs/delivery/FDR/[Partially Implemented] fdr-007-ux-surfaces.md
4. Prohibited   — packages/ui/ and packages/appshell/ primitive edits; foundation-disposition.registry.ts edits; @afenda/accounting runtime (ADR-0010); do-not-add-classname-on-afenda-ui-primitives; do-not-edit-ui-primitives
5. Authority    — ADR-0014 · ADR-0016 · TIP-004 governed UI consumption policy
6. Gates        —
   pnpm --filter @afenda/erp typecheck
   pnpm --filter @afenda/erp test:run
   pnpm ui:guard:scan
   pnpm check:documentation-drift
   pnpm check:foundation-disposition
7. Closes       — Gap `ux-erp-test-failures`; DoD #2 (tests pass); DoD #20 (readiness score uplift when test dimension reaches Grade A)
8. Evidence     —
   apps/erp/src/lib/context/context-switch.action.ts
   apps/erp/src/lib/context/__tests__/context-switch.action.test.ts
   apps/erp/src/lib/system-admin/__tests__/list-visible-system-admin-sections.server.test.ts
   apps/erp/src/lib/system-admin/__tests__/system-admin-section-nav-parity.test.ts
9. Attestation  — Test coverage (full ERP suite exit 0); Contract stability (no breaking UX surface API); Maintainability (TIP-004 scan remains clean)
```

#### DoD rows this slice closes

| # | Criterion | Gate |
| --- | --- | --- |
| 2 | Tests pass | `pnpm --filter @afenda/erp test:run` |
| 4 | TypeScript strict | `pnpm --filter @afenda/erp typecheck` |
| 16 | TIP-004 UI governance | `pnpm ui:guard:scan` |

#### Known debt

- `ux-no-registry-entry` — optional dedicated registry row deferred to Slice 4 Registry-sync
- `ux-complete-status` — DoD #14 peer review blocks **Complete** promotion
- `ux-loading-unit-test` — dedicated loading.tsx unit test waived per §Waivers
- Sequential overlap with `fdr-007-operating-context` on `context-switch.action.ts` — UX/test closeout only; full session-bridge audit remains sibling FDR Slice 2

### Slice 3 — Implementation (test closeout)

**Status:** Not started  
**Prerequisite:** Slice 2 Complete ✓  
**Type:** Implementation  
**Risk class:** Low  
**Clean Core impact:** B→B

**Purpose:** Fix 2 failing ERP tests; achieve full `test:run` exit 0; target audit-adjusted ≥27/30.

**Expected deliverables:** Test fixes only — no primitive edits without approval.

### Slice 4 — Registry-sync (optional)

**Status:** Not started  
**Prerequisite:** Architecture Authority decision  
**Type:** Registry-sync  
**Risk class:** Low  

**Purpose:** Optional dedicated `PKG007_UX` registry entry via `foundation-registry-owner`.

## §Rollback strategy

| Slice | Rollback procedure | Upgrade path |
| --- | --- | --- |
| Research | Revert FDR doc commit | Safe — no runtime change |
| Implementation | Revert `apps/erp/src/app/` or test commit | git revert + `pnpm ui:guard:scan` |
| Registry-sync | Revert registry via `foundation-registry-owner` | Re-run `pnpm check:foundation-disposition` |

Oracle analog: UX surfaces are presentation-layer only — rollback is git revert without data migration. SAP analog: transport rollback = revert + ui:guard re-run.

## §Waivers

| Waiver ID | Requirement waived | Reason | Approver | Expiry / revisit |
| --- | --- | --- | --- | --- |
| `ux-no-registry-entry` | Dedicated foundation disposition registry row | Index explicitly **—**; FDR acceptance gates sufficient for Phase 6 closeout | Architecture Authority | Optional Registry-sync slice |
| `ux-e2e` | Browser E2E for every ERP surface | ui:guard + unit/integration tests prove TIP-004; matrix marks E2E optional | Architecture Authority | External beta go-live |
| `ux-loading-unit-test` | Dedicated unit test for loading.tsx | Visual boundary verified by ui:guard + manual review | Architecture Authority | Slice 2 if regression risk rises |

## §Knowledge transfer

### Operational runbook

- Protected layout: `apps/erp/src/app/(protected)/layout.tsx` — AppShell + context + nav wiring
- Loading boundary: `apps/erp/src/app/(protected)/loading.tsx`
- Error boundary: `apps/erp/src/app/(protected)/error.tsx` → `RouteSegmentError`
- UI governance check: `pnpm ui:guard:scan` before merging ERP TSX changes
- CSS pipeline: `apps/erp/src/app/globals.css`

### Observability

- Client error reporting: `apps/erp/src/__tests__/client-error-reporting.test.ts`
- CSP strategy: `apps/erp/src/lib/security/csp-strategy.ts`

### On-call escalation

- Symptom: ui:guard failure on new page → remove `className` from `@afenda/ui`; use plain HTML wrapper
- Symptom: AppShell token drift → run `protected-appshell-token-closeout.test.ts`
- Owner: `@afenda/erp` (PKG-007) via `erp-app-agent`

## §Enterprise benchmark qualification

This FDR is **enterprise 9.5 candidate / evidence-qualified**, not final **Complete — enterprise 9.5 accepted**, because DoD #2 (full test suite) and DoD #14 peer review remain open.

The **28/30 evidence-qualified ceiling** is accepted only under these bounded assumptions:

1. Two ERP test failures are remediated (`ux-erp-test-failures`).
2. Browser E2E is waived until external beta go-live (`ux-e2e`).
3. Dedicated loading.tsx unit test is waived (`ux-loading-unit-test`).
4. No dedicated registry row is waived for Phase 6 closeout (`ux-no-registry-entry`).
5. **Complete** status requires Architecture Authority peer review at PR merge.

The **26/30 audit-adjusted** score is the honest UX benchmark today (~8.7 / 10 equivalent): TIP-004 scan clean on 243 files; capped by 2 failing tests and open peer review.

**Promotion to Complete — enterprise 9.5 accepted requires:**

1. `pnpm --filter @afenda/erp test:run` exit 0 (DoD #2).
2. Architecture Authority peer review approval (DoD #14).
3. FDR filename/status/index promotion to `[Complete]`.

## Verdict

**Partially Implemented — enterprise 9.5 candidate / evidence-qualified at 26/30 audit-adjusted (28/30 ceiling), pending test closeout and Architecture Authority peer review.**

v2 audit refresh (2026-06-25): TIP-004 scan passes (243 files); 522/524 ERP tests pass (2 failures named in §Remaining gaps). Complete promotion blocked on DoD #2 test failures and DoD #14 peer review. No dedicated registry entry — documented per index column **—**.
