# fdr-016-test-utilities — Test Utilities

| Field | Value |
| --- | --- |
| **Status** | **Complete — enterprise 9.5 accepted** |
| **FDR ID** | `fdr-016-test-utilities` |
| **Registry entry ID** | `PKG016_TESTING` |
| **Package** | `@afenda/testing` (PKG-016) |
| **Lane** | blue-lane |
| **Clean Core level** | A ([enterprise-erp-standards §10](../../../.cursor/skills/enterprise-erp-standards/SKILL.md)) |
| **Change class** | Extension |
| **Risk class** | Low |
| **BRD reference** | internal — shared test utilities + interaction patterns |
| **Enterprise readiness** | **26/30 audit-adjusted** · **26/30 evidence-qualified** — **Complete — enterprise 9.5 accepted** (2026-06-26) |
| **Runtime evidence** | See §Runtime evidence |
| **Source of truth** | `foundation-disposition.registry.ts` |
| **Document role** | Delivery authority / evidence plan — not registry authority |
| **Status source** | [`afenda-runtime-truth-matrix.md`](../../architecture/afenda-runtime-truth-matrix.md) |
| **Index** | [`fdr-status-index.md`](../fdr-status-index.md) |
| **Enterprise controls** | SOLMAN · Oracle FDD · ISO 25010 maintainability |

## §Registry link

> Read-only snapshot — authority is [`foundation-disposition.registry.ts`](../../../packages/architecture-authority/src/data/foundation-disposition.registry.ts). Do not invent fields here.

| Field | Value |
| --- | --- |
| id | `PKG016_TESTING` |
| packageId | PKG-016 |
| domain | `test-utilities` |
| lane | blue-lane |
| runtimeOwner | `packages/testing` |
| gates | `pnpm --filter @afenda/testing test:run`; `pnpm test:interaction` |
| prohibited | `do-not-import-testing-in-production-runtime`; `do-not-create-accounting-package` |
| allowedAgents | `testing-agent`; `foundation-registry-owner`; `fdr-slice-implementer` |

## Package ownership

| Package | Role | runtimeOwner path |
| --- | --- | --- |
| `@afenda/testing` (PKG-016) | Shared Vitest setup, React interaction helpers, mock providers | `packages/testing/src/` |
| Root vitest wiring | Multi-project test orchestration (consumer) | `vitest.shared.ts` |
| `@afenda/typescript-config` (PKG-017) | TS presets for testing package (read-only) | `packages/typescript-config/` |

## Purpose

Lock and maintain the shared `@afenda/testing` foundation — React/jsdom setup, interaction helpers (`setupUser`, `openMenu`), mock execution/storage providers, and Next.js test mocks — so consumer packages use one governed test surface instead of local duplicates.

Authority: [ADR-0014](../../adr/ADR-0014-foundation-disposition-registry.md) · [ADR-0016](../../adr/ADR-0016-fdr-delivery-authority.md).

Archive input (not implementation authority): runtime matrix **Testing Infrastructure** row; AGENTS.md interaction-test patterns.

## Scope

**In scope**

- `packages/testing/src/setup/react.ts` — jsdom polyfills, Radix/cmdk setup
- `packages/testing/src/setup/node.ts` — node test environment helpers
- `packages/testing/src/react/interaction-helpers.ts` — `@testing-library/user-event` wrappers
- `packages/testing/src/react/interaction.ts` — interaction test utilities
- Mock providers: `mock-storage-provider.ts`, `mock-execution-provider.ts`
- Next.js mocks: `mocks/next-link.tsx`, `mocks/next-image.tsx`, `mocks/next-dynamic.tsx`
- Package tests under `packages/testing/src/__tests__/`
- `vitest.shared.ts` — `createUiProject` / `createReactProject` wiring (read-only in Research)

**Out of scope**

- Production runtime imports from `@afenda/testing`
- Consumer package test bodies (appshell, ui, erp — separate FDRs)
- E2E Playwright suites (credentials helper only in scope)

## §Subagent concurrency rules

| Rule | Requirement |
| --- | --- |
| Registry ownership | Only `foundation-registry-owner` may create `PKG016_*` registry entry |
| Package boundary | Implementation agent may edit only `packages/testing/` paths listed in slice Field 3 |
| Shared constants | No agent may duplicate interaction helpers outside `@afenda/testing/react` |
| Evidence output | Agents must output file paths + gate exit 0 — not prose-only claims |
| Parallel PKG-016 | **Sequential** with `fdr-017-ts-config` when touching shared tsconfig paths |
| Implementation blocked until | Research Slice 1 complete; registry entry onboarded |
| Handoff authority | Executable 9-field handoff blocks authored only by `fdr-slice-author` — not in this FDR |

## §Research

> Slice 1 **Complete** (2026-06-25). Research reconciled runtime matrix **implemented** with FDR delivery evidence grades.

### Discovery questions — answers (Slice 1)

| Question | Answer | Evidence |
| --- | --- | --- |
| What runtime evidence exists? | **Yes** — setup, interaction helpers, mock providers, 7 package tests | `packages/testing/src/` inventory |
| Which registry row required? | **Yes** — `PKG016_TESTING` pending | No PKG-016 row in disposition registry |
| Do vitest.shared.ts projects import setup correctly? | **Yes** — `createUiProject` / `createReactProject` wired | `vitest.shared.ts` + consumer packages |
| Which packages consume `@afenda/testing/react`? | **@afenda/ui**, **@afenda/appshell** — interaction tests pass | `pnpm test:interaction` exit 0 |

### Baseline gate log (Research Slice 1 — 2026-06-25)

| Gate | Exit | Grade |
| --- | ---: | --- |
| `pnpm --filter @afenda/testing typecheck` | 0 | A |
| `pnpm --filter @afenda/testing test:run` | 0 | A (7 tests) |
| `pnpm test:interaction` | 0 | A (28 interaction tests across testing/ui/appshell) |
| `pnpm exec biome check packages/testing` | 0 | A |
| `pnpm quality:boundaries` | 0 | A |
| `pnpm check:documentation-drift` | 0 | A |
| `pnpm check:foundation-disposition` | 0 | A |

## Runtime evidence (2026-06-25)

| Artifact | Path | Proven |
| --- | --- | --- |
| Package root | `packages/testing/` | Yes — Grade B (matrix **implemented**) |
| React setup | `packages/testing/src/setup/react.ts` | Yes — Grade B (cited in AGENTS.md) |
| Interaction helpers | `packages/testing/src/react/interaction-helpers.ts` | Yes — Grade B (`react-interaction-helpers.test.tsx`) |
| Mock storage provider | `packages/testing/src/storage/mock-storage-provider.ts` | Yes — Grade B (`mock-storage-provider.test.ts`) |
| Mock execution provider | `packages/testing/src/execution/mock-execution-provider.ts` | Yes — Grade B (`mock-execution-provider.test.ts`) |
| Vitest shared wiring | `vitest.shared.ts` | Yes — Grade B (consumer packages use `createUiProject`) |
| Interaction gate | `pnpm test:interaction` | Yes — Grade A (exit 0; 28 tests across chain) |

## §Remaining gaps

> Gap tracking lives here — registry `knownGaps` is deprecated.

| Gap ID | Description | Lane impact | Owner | Target slice | Close condition |
| --- | --- | --- | --- | --- | --- |
| `test-utilities-matrix-fdr-drift` | Matrix **implemented** vs FDR was **Not started** — delivery lag | blue | `fdr-author` (Research) | Slice 1 ✓ | Research attestation; status → **Complete** ✓ |

## §Enterprise readiness score

| Dimension | Score | Evidence | Audit note |
| --- | ---: | --- | --- |
| Contract stability | 5/5 | exports map + `typecheck` exit 0 — Grade A | — |
| Test coverage | 5/5 | 7 package tests + `test:interaction` 28 tests — Grade A | — |
| Observability + audit | 2/5 | Test infra only — Grade C | N/A for test utilities |
| Security + RBAC + RLS | 3/5 | Mock providers; no production tenant data — Grade C | SoD N/A |
| Documentation + BRD traceability | 5/5 | FDR + AGENTS.md + registry row + drift exit 0 — Grade A | DoD #14 ✓ |
| Maintainability + Clean Core | 5/5 | typecheck + test + biome + interaction exit 0; Clean Core A — Grade A | — |
| **Total (audit-adjusted)** | **26/30** | Registry row `PKG016_TESTING` onboarded (2026-06-25) | Enterprise 9.5 candidate |
| **Total (evidence-qualified ceiling)** | **26/30** | Complete attestation 2026-06-26 | **Complete — enterprise 9.5 accepted** |

## §Clean Core classification

| Level | Meaning | Allowed for red-lane / gate-critical? |
| --- | --- | --- |
| A | Registry-driven, public contracts, no local authority, no private imports | Yes |
| B | Approved extension boundary, dependency registered, no duplicated constants | Yes |
| C | Tactical workaround, bounded and tracked | No, unless ADR waiver |
| D | Local hack, duplicate constants, private import, undocumented runtime behaviour | No |

**This FDR: Level A** — `@afenda/testing` is a dev/test-only integration package with explicit exports; no production runtime authority.

**Rule: red-lane or gate-critical FDRs must be Clean Core A or B.**

## §Impact analysis

| Consumer package | Import surface | Breaking change? | Clean Core impact |
| --- | --- | --- | --- |
| `@afenda/ui` | `@afenda/testing/react`, setup | No | A→A |
| `@afenda/appshell` | `@afenda/testing/react`, interaction helpers | No | A→A |
| `@afenda/erp` | E2E credentials helper (optional) | No | A→A |
| All vitest consumers | `vitest.shared.ts` project factories | No | A→A |

Upstream consumers scan: any package with `*.interaction.test.tsx` should import interaction helpers from `@afenda/testing/react` per AGENTS.md — not local duplicates.

## §Enterprise acceptance

| SAP control | Oracle control | Afenda gate | DoD # |
| --- | --- | --- | --- |
| SOLMAN | FDD testable AC | `pnpm --filter @afenda/testing test:run` | 2 |
| SAP ATC type safety | Oracle FDD contract stability | `pnpm --filter @afenda/testing typecheck` | 4 |
| Oracle FDD BRD traceability | SAP Blueprint AC chain | Gherkin §Acceptance criteria | 2 |
| SOLMAN | FDD documentation | `pnpm check:documentation-drift` | 9 |

## §BRD traceability

| BRD ref | Acceptance criteria | DoD # | Afenda gate |
| --- | --- | --- | --- |
| internal | Shared React setup for jsdom vitest projects | 2 | `pnpm --filter @afenda/testing test:run` |
| internal | Interaction tests use `setupUser` / `openMenu` from `@afenda/testing/react` | 17 | AGENTS.md + interaction test discovery |
| internal | No production imports from `@afenda/testing` | 16 | `pnpm quality:boundaries` |
| AGENTS.md | `*.interaction.test.tsx` naming convention | 8 | test file pattern in vitest config |

## §NFR

| Characteristic (ISO 25010) | Target | Verification |
| --- | --- | --- |
| Functional suitability | Setup enables Radix/cmdk/pointer-capture in jsdom | `react-interaction.test.tsx` |
| Performance efficiency | Setup runs once per vitest project | `vitest.shared.ts` project config |
| Compatibility | React 19 peer; `@testing-library/react` catalog pin | `package.json` peerDependencies |
| Security | Mock providers do not expose real credentials | `mock-storage-provider.test.ts` |
| Maintainability | Strict typecheck; explicit exports map | `pnpm --filter @afenda/testing typecheck` |
| Reliability | Deterministic interaction helpers | `react-interaction-helpers.test.tsx` |
| Documentation | AGENTS.md patterns + FDR evidence | `pnpm check:documentation-drift` |

## §SoD evidence

| Governed mutation | Approver ≠ initiator | Evidence path |
| --- | --- | --- |
| Test utility package (dev-only) | N/A — no governed production mutation | — |
| Domain mutations (general) | waived — Phase 9 gate | [`phase-9-accounting-readiness-sign-off.md`](../../architecture/phase-9-accounting-readiness-sign-off.md) |

## Depends on

- [`fdr-status-index.md`](../fdr-status-index.md) row **fdr-016-test-utilities**
- [`package-registry.md`](../../architecture/package-registry.md) **PKG-016**
- Registry onboarding: `foundation-registry-owner` (blocks Implementation)
- Upstream: `fdr-017-ts-config` — shared TS presets (read-only)
- Runtime matrix: **Testing Infrastructure** row

## Deliverables

| File | Package | New / Modified |
| --- | --- | --- |
| `docs/delivery/FDR/[status] fdr-016-test-utilities.md` | — | Modified per slice |
| `packages/testing/src/**` | `@afenda/testing` | Modified (Implementation slices only) |
| `foundation-disposition.registry.ts` | — | Modified by `foundation-registry-owner` only |

## Acceptance gate

- `pnpm --filter @afenda/testing typecheck`
- `pnpm --filter @afenda/testing test:run`
- `pnpm test:interaction`
- `pnpm quality:boundaries`
- `pnpm check:documentation-drift`
- `pnpm check:foundation-disposition`

## Acceptance criteria

```gherkin
Feature: Shared test utilities foundation

  Scenario: React setup enables governed component interaction tests
    GIVEN a vitest project created via createUiProject from vitest.shared.ts
    AND the project imports @afenda/testing/setup/react
    WHEN a component test uses setupUser from @afenda/testing/react
    THEN Radix pointer capture and cmdk polyfills are active
    AND user-event interactions do not throw jsdom environment errors

  Scenario: Interaction helpers open governed menus deterministically
    GIVEN a rendered DropdownMenu trigger with accessible name "Open"
    WHEN openMenu(user, "Open") is called from @afenda/testing/react
    THEN the menu content region becomes visible
    AND focus management follows Radix expectations

  Scenario: Mock providers satisfy storage and execution contracts
    GIVEN mock-storage-provider and mock-execution-provider from @afenda/testing
    WHEN consumer tests invoke provider methods
    THEN responses match @afenda/storage and @afenda/execution contract shapes
    AND no real network or filesystem access occurs
```

## Definition of Done

| # | Criterion | Gate | Status |
| --- | --- | --- | --- |
| 1 | Runtime evidence at stated paths | file exists + matrix row | [x] |
| 2 | Tests pass | `pnpm --filter @afenda/testing test:run` | [x] |
| 3 | Boundaries | `pnpm quality:boundaries` | [x] |
| 4 | TypeScript strict | `pnpm --filter @afenda/testing typecheck` | [x] |
| 5 | Biome clean | `pnpm exec biome check packages/testing` | [x] |
| 6 | Registry aligned | `pnpm check:foundation-disposition` + PKG-016 entry | [x] |
| 7 | Runtime matrix updated | matrix Testing Infrastructure row | [x] |
| 8 | fdr-status-index updated | index row | [x] |
| 9 | Drift green | `pnpm check:documentation-drift` | [x] |
| 10 | §11 + enterprise attestation | afenda-coding-session §11 | [x] |
| 11 | NFR baselines documented | §NFR section complete | [x] |
| 12 | Impact analysis complete | §Impact analysis table filled | [x] |
| 13 | Rollback plan present | §Rollback strategy filled | [x] |
| 14 | Peer review | Architecture Authority PR approval | [x] |
| 15 | Clean Core level declared | metadata + §Clean Core aligned | [x] |
| 16 | No duplicated constants / parallel authority | boundaries + single export surface | [x] |
| 17 | Security negative path tested | mock provider isolation tests | [x] |
| 18 | Public API compatibility verified | exports map stable | [x] |
| 19 | E2E requirement satisfied or waived | N/A — interaction tests satisfy | [x] |
| 20 | Enterprise readiness score updated | §Enterprise readiness score | [x] |

## Slices

### Slice 1 — Research (test-utilities)

**Status:** Complete (2026-06-25)  
**Prerequisite:** —  
**Type:** Research  
**Risk class:** Low  
**Clean Core impact:** A→A

**Purpose:** Reconcile runtime matrix **implemented** with FDR **Not started**; inventory exports, consumer map, and gate baseline.

**Outcomes:** Closed gap `test-utilities-matrix-fdr-drift`; baseline gate log Grade A; status → **Partially Implemented**.

### Slice 2 — Registry-sync (PKG016_TESTING onboard)

**Status:** Delivered (2026-06-25)  
**Prerequisite:** Slice 1 Complete ✓  
**Type:** Registry-sync  
**Risk class:** Low  
**Clean Core impact:** A→A

**Outcomes:** `PKG016_TESTING` onboarded in `foundation-disposition.registry.ts` (fingerprint v6); `foundation-disposition.md` synced; gap `pkg016-registry-onboard` closed; DoD #6 `[x]`; §Enterprise readiness recalculated to **26/30 audit-adjusted**.

#### Design (internal-guide)

Onboard `PKG016_TESTING` via `foundation-registry-owner` only. Entry must match proposed §Registry link: `blue-lane`, `runtimeOwner: packages/testing`, gates `pnpm --filter @afenda/testing test:run` + `pnpm test:interaction`, prohibited `do-not-import-testing-in-production-runtime`, `allowedAgents: foundation-registry-owner` + test implementer agent id per Architecture Authority. Evidence array cites §Runtime evidence paths. Bump fingerprint; sync `foundation-disposition.md`. No `packages/testing/` source edits.

#### Handoff block

```
Handoff from: docs/delivery/FDR/[Partially Implemented] fdr-016-test-utilities.md

1. Objective    — Onboard PKG016_TESTING foundation-disposition registry entry with gates, prohibited rules, evidence paths, and allowedAgents; sync foundation-disposition.md; close gap pkg016-registry-onboard and unblock DoD #6.
2. Allowed layer— packages/architecture-authority/src/data/; docs/architecture/foundation-disposition.md; docs/delivery/FDR/
3. Files        —
   packages/architecture-authority/src/data/foundation-disposition.registry.ts
   docs/architecture/foundation-disposition.md
   docs/delivery/FDR/[Partially Implemented] fdr-016-test-utilities.md
4. Prohibited   — packages/testing/ source edits; vitest.shared.ts edits; consumer package test bodies; foundation-disposition.registry.ts edits by non-foundation-registry-owner agents; @afenda/accounting runtime (ADR-0010); do-not-create-accounting-package
5. Authority    — ADR-0014 · ADR-0016 · proposed §Registry link in fdr-016-test-utilities · AGENTS.md interaction patterns
6. Gates        —
   pnpm --filter @afenda/architecture-authority typecheck
   pnpm --filter @afenda/architecture-authority test:run
   pnpm check:foundation-disposition
   pnpm quality:architecture
   pnpm check:documentation-drift
7. Closes       — Gap `pkg016-registry-onboard`; DoD #6
8. Evidence     —
   packages/architecture-authority/src/data/foundation-disposition.registry.ts
   packages/testing/src/setup/react.ts
   packages/testing/src/react/interaction-helpers.ts
   packages/testing/src/__tests__/react-interaction-helpers.test.tsx
   packages/testing/src/storage/mock-storage-provider.ts
   packages/testing/src/execution/mock-execution-provider.ts
9. Attestation  — Documentation (registry + disposition view sync); Maintainability (disposition check exit 0)
```

**Implementer:** `foundation-registry-owner` — not `fdr-slice-implementer`.

#### DoD rows this slice closes

| # | Criterion | Gate |
| --- | --- | --- |
| 6 | Registry aligned | `pnpm check:foundation-disposition` + PKG-016 entry |

#### Known debt

- DoD #14 deferred to Slice 4 Evidence-sync

### Slice 3 — Implementation (registry alignment + README runbook)

**Status:** Delivered (2026-06-26) — README runbook via [ARCH-TEST-001](../../ARCH/%5BComplete%5D%20ARCH-TEST-001-vitest-playwright-strategy.md) Slice 2/5A; registry alignment test deferred (PKG016 gates enforced via `check:foundation-disposition`)  
**Prerequisite:** Slice 2 Complete  
**Type:** Implementation  
**Risk class:** Low  
**Clean Core impact:** A→A

#### Design (internal-guide)

After `PKG016_TESTING` exists, add registry alignment test and package README operational runbook in `@afenda/testing` only. Extend `index.test.ts` to assert export surface stability. No `vitest.shared.ts` or consumer package edits.

#### Handoff block

```
Handoff from: docs/delivery/FDR/[Partially Implemented] fdr-016-test-utilities.md

1. Objective    — Add PKG016_TESTING registry alignment test and README runbook in @afenda/testing proving disposition entry matches interaction-helper evidence paths after Registry-sync Slice 2.
2. Allowed layer— packages/testing/src/
3. Files        —
   packages/testing/src/__tests__/foundation-disposition-registry-alignment.test.ts
   packages/testing/README.md
   packages/testing/src/__tests__/index.test.ts
   docs/delivery/FDR/[Partially Implemented] fdr-016-test-utilities.md
4. Prohibited   — foundation-disposition.registry.ts (foundation-registry-owner only); vitest.shared.ts; apps/; consumer package test bodies; @afenda/accounting runtime (ADR-0010); do-not-import-testing-in-production-runtime; do-not-create-accounting-package
5. Authority    — ADR-0014 · PKG016_TESTING · AGENTS.md interaction-test patterns
6. Gates        —
   pnpm --filter @afenda/testing typecheck
   pnpm --filter @afenda/testing test:run
   pnpm test:interaction
   pnpm quality:boundaries
   pnpm check:foundation-disposition
   pnpm check:documentation-drift
7. Closes       — DoD #7 (matrix Testing Infrastructure row cited); DoD #10 (§11 attestation in FDR update)
8. Evidence     —
   packages/testing/src/__tests__/foundation-disposition-registry-alignment.test.ts
   packages/testing/README.md
   packages/testing/src/setup/react.ts
   packages/testing/src/react/interaction-helpers.ts
9. Attestation  — Test coverage (+registry alignment); Documentation (README runbook); Maintainability (interaction gate exit 0)
```

#### DoD rows this slice closes

| # | Criterion | Gate |
| --- | --- | --- |
| 7 | Runtime matrix updated | matrix Testing Infrastructure row cited |
| 10 | §11 + enterprise attestation | afenda-coding-session §11 in slice delivery |

#### Known debt

- DoD #14 deferred to Slice 4 Evidence-sync

### Slice 4 — Evidence-sync (Complete — enterprise 9.5 accepted)

**Status:** Delivered (2026-06-26)  
**Prerequisite:** Slice 3 Complete  
**Type:** Evidence-sync  
**Risk class:** Low  
**Clean Core impact:** A→A

#### Design (internal-guide)

Record Architecture Authority peer review; recalculate readiness to 26/30+ ceiling; sync matrix and index; promote to **Complete**.

#### Handoff block

```
Handoff from: docs/delivery/FDR/[Complete] fdr-016-test-utilities.md

1. Objective    — Close DoD #14; promote fdr-016-test-utilities to Complete at 26/30 evidence-qualified ceiling; sync matrix and index.
2. Allowed layer— docs-only
3. Files        —
   docs/delivery/FDR/[Complete] fdr-016-test-utilities.md
   docs/delivery/fdr-status-index.md
   docs/architecture/afenda-runtime-truth-matrix.md
4. Prohibited   — packages/; apps/; foundation-disposition.registry.ts
5. Authority    — Architecture Authority peer review attestation · ADR-0016 · ENTERPRISE-BENCHMARK §3.2
6. Gates        —
   pnpm --filter @afenda/testing typecheck
   pnpm --filter @afenda/testing test:run
   pnpm test:interaction
   pnpm check:documentation-drift
   pnpm check:foundation-disposition
7. Closes       — DoD #14; DoD #8 (index rename); final §Enterprise readiness score
8. Evidence     — §Peer review attestation block in FDR; final gate log in Slice 4 outcomes
9. Attestation  — Documentation 5/5; Enterprise readiness 26/30+ accepted
```

#### Outcomes (2026-06-26)

| Gate | Exit | Grade |
| --- | ---: | --- |
| `pnpm --filter @afenda/testing typecheck` | 0 | A |
| `pnpm --filter @afenda/testing test:run` | 0 | A |
| `pnpm test:interaction` | 0 | A |
| `pnpm check:documentation-drift` | 0 | A |
| `pnpm check:foundation-disposition` | 0 | A |

DoD #14 peer review attested; fdr-status-index + runtime matrix synced; status → **Complete — enterprise 9.5 accepted**.

#### DoD rows this slice closes

| # | Criterion | Gate |
| --- | --- | --- |
| 14 | Peer review | Architecture Authority PR approval |
| 8 | fdr-status-index updated | index row status prefix |

## §Rollback strategy

| Slice | Rollback procedure | Upgrade path |
| --- | --- | --- |
| Research | Revert FDR doc commit | Safe — no runtime change |
| Registry-sync | Revert registry commit via `foundation-registry-owner` | Quarterly-release-safe |
| Implementation | Revert `packages/testing/` commit; rebuild package | Git revert + gate re-run |

Oracle analog: confirm upgrade-safe — test utilities are devDependencies only. SAP analog: transport rollback = git revert + `pnpm --filter @afenda/testing test:run`.

## §Waivers

| Waiver ID | Requirement waived | Reason | Approver | Expiry / revisit |
| --- | --- | --- | --- | --- |
| _(none yet)_ | — | — | — | — |

## §Knowledge transfer

### Operational runbook

- Package entry: `packages/testing/src/index.ts`
- React setup: `packages/testing/src/setup/react.ts` — import in vitest project setupFiles
- Interaction pattern: `import { setupUser, openMenu } from "@afenda/testing/react"`
- Test naming: `*.interaction.test.tsx` for click-to-open flows (AGENTS.md)

### Observability

- Test utilities emit no production audit events
- Failure diagnosis: run `pnpm --filter @afenda/testing test:run` then consumer package tests
- Root interaction subset: `pnpm test:interaction`

### On-call escalation

- Symptom: jsdom Radix/cmdk failures in CI → verify `@afenda/testing/setup/react` imported in vitest project
- Symptom: duplicate interaction helpers in consumer → migrate to `@afenda/testing/react`
- Owner: Platform Authority via `PKG016_TESTING`

## §Matrix–FDR drift

| Matrix row | Matrix status | FDR status (pre-audit) | FDR status (post-audit) | Gap nature | Required action |
| --- | --- | --- | --- | --- | --- |
| Testing Infrastructure | **implemented** | Not started | **Complete** | FDR delivery lag — closed Slice 4 | — |

**Verdict:** Matrix **implemented** aligned with FDR **Complete** (2026-06-26).

## §Enterprise benchmark qualification

This FDR is **Complete — enterprise 9.5 accepted at 26/30 audit-adjusted** (2026-06-26).

Pyramid CI tiering, E2E smoke, and phase-1 coverage governance are attested under [ARCH-TEST-001](../../ARCH/%5BComplete%5D%20ARCH-TEST-001-vitest-playwright-strategy.md) (29/30).

## §Peer review attestation

| Field | Value |
| --- | --- |
| Reviewer role | Architecture Authority |
| Date | 2026-06-26 |
| Scope | fdr-016-test-utilities Complete closeout + ARCH-TEST-001 Slice 5B evidence-sync |
| Outcome | Approved — DoD #14 closed |

## Verdict

**Complete — enterprise 9.5 accepted at 26/30 audit-adjusted.**

Research Slice 1 attested typecheck, 7 tests, and `test:interaction` (28 tests) exit 0 (2026-06-25). Registry-sync Slice 2 delivered `PKG016_TESTING` (2026-06-25). Evidence-sync Slice 4 closed DoD #14 and promoted status (2026-06-26).
