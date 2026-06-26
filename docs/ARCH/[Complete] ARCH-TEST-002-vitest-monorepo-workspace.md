# ARCH-TEST-002 — Vitest Monorepo Workspace Architecture

> **Template:** [`ARCH-TEMPLATE.md`](ARCH-TEMPLATE.md) · **Index:** [`arch-status-index.md`](arch-status-index.md) · **Pyramid authority:** [ARCH-TEST-001](%5BComplete%5D%20ARCH-TEST-001-vitest-playwright-strategy.md)

| Field | Value |
| --- | --- |
| **Document ID** | ARCH-TEST-002 |
| **Work ID** | ARCH-TEST-002 · paired `fdr-016-test-utilities` |
| **Title** | Vitest monorepo workspace configuration |
| **Status** | **Complete — foundation acceptable** (workspace runtime delivered; pyramid CI tiering remains ARCH-TEST-001) |
| **Date** | 2026-06-26 |
| **Owner** | Architecture Authority · `@afenda/testing` + root workspace |
| **Package** | PKG-016 · `@afenda/testing` + `vitest.shared.ts` |
| **Registry entry ID** | PKG016_TESTING |
| **Runtime owner** | `vitest.config.ts` · `vitest.shared.ts` · `packages/testing/src/setup/` |
| **Lane** | blue-lane |
| **Risk class** | Low |
| **Change class** | Extension + Governance |
| **Clean Core target** | A |
| **Enterprise score target** | 28/30 foundation acceptable |

**One-sentence architecture:** Afenda runs **Vitest 3 projects mode** from the repo root with **four shared factories** (`createNodeProject`, `createDatabaseProject`, `createUiProject`, `createReactProject`), centralized setup in `@afenda/testing`, and **TIP-009 Gate 3** via `pnpm test:run` — not Turbo — while TypeScript (`pnpm typecheck`) and Biome remain separate gates.

---

# 1. Execution instruction

Execute one bounded slice under ARCH-TEST-002. Every completion claim maps to **file path**, **test path**, **command exit code**, or **explicit waiver**. Pyramid policy (Playwright, Storybook browser, interaction CI) remains **ARCH-TEST-001** authority.

Skills: [`.cursor/skills/test-coverage/SKILL.md`](../../.cursor/skills/test-coverage/SKILL.md) · [`afenda-coding-session`](../../.cursor/skills/afenda-coding-session/SKILL.md).

---

# 2. Target item

| Field | Value |
| --- | --- |
| Work ID | ARCH-TEST-002 · `fdr-016-test-utilities` |
| Status | Complete — foundation acceptable |
| Package | `@afenda/testing` + root Vitest wiring |
| Registry entry ID | PKG016_TESTING |
| Runtime owner | `vitest.shared.ts` · `packages/testing/` |
| Lane | blue-lane |
| Clean Core | A |
| Enterprise score target | 28/30 |

**Purpose (one sentence):** Govern how every workspace package and app selects Vitest environment, pool, setup, aliases, and coverage — so unit, contract, integration, UI, and database tests share one orchestrator without duplicating config or bypassing package boundaries.

---

# 3. Authority chain

```text
1. docs/ARCH/arch-status-index.md
2. docs/delivery/fdr-status-index.md
3. packages/architecture-authority/src/data/foundation-disposition.registry.ts
4. docs/architecture/afenda-runtime-truth-matrix.md
5. docs/delivery/FDR/[Complete] fdr-016-test-utilities.md
6. docs/ARCH/[Complete] ARCH-TEST-001-vitest-playwright-strategy.md (pyramid + CI tiering)
7. vitest.config.ts · vitest.shared.ts · packages/testing/
8. .github/workflows/ci.yml (Gate 3)
```

---

# 4. Problem statement

## Current risk / gap

```text
Before ARCH-TEST-002, Vitest workspace rules were spread across README prose, ad-hoc per-package configs, and agent proposals (flat root include, turbo run test as Gate 3, duplicated setup files). That drift risked losing projects-mode orchestration, unified JUnit output, workspace dep inlining, and environment-appropriate factories (node vs jsdom vs DB forks).
```

## Business / architecture impact

```text
- TIP-009 Gate 3 requires a single reproducible test entry (`pnpm test:run`) with CI reporters.
- UI packages must use jsdom before component tests land — not node smoke-only configs.
- Database and integration suites must not run parallel file mutations against shared state.
- TypeScript type correctness must stay on `pnpm typecheck`; Vitest proves behavior only.
- Agents must not replace Vitest projects with Turbo test orchestration or flat monorepo includes.
```

---

# 5. Architecture requirement

## 5.1 Ownership

| Concern | Owner | Allowed path |
| --- | --- | --- |
| Vitest project factories | Root workspace | `vitest.shared.ts` |
| Root orchestration + CI reporters | Root workspace | `vitest.config.ts` |
| Node / React setup + mocks | `@afenda/testing` | `packages/testing/src/setup/` · `packages/testing/src/mocks/` |
| Per-workspace project config | Each package/app | `packages/*/vitest.config.ts` · `apps/*/vitest.config.ts` |
| Test type overlays | Each workspace | `tsconfig.vitest.json` |
| Pyramid / Playwright / Storybook browser | ARCH-TEST-001 | `apps/erp/e2e/` · `apps/storybook/` |
| ARCH authority (this doc) | docs | `docs/ARCH/ARCH-TEST-002-*` |

No implementation may occur outside declared owner paths unless listed in a slice handoff.

---

## 5.2 Boundary rules

The Vitest workspace must:

1. Use **Vitest 3 projects mode** — `projects: ["packages/*/vitest.config.ts", "apps/*/vitest.config.ts", "scripts/vitest.config.ts"]`.
2. Use **`defineProject`** in package configs via shared factories — not duplicated `mergeConfig` blocks except documented overrides (e.g. appshell timeouts).
3. Co-locate tests under `src/**/__tests__/**/*.{test,spec}.{ts,tsx}` — excluded from library `tsconfig.json` builds.
4. Inline workspace packages via `server.deps.inline: [/@afenda\//]`.
5. Keep `globals: false` — explicit `import { it, expect } from "vitest"`.
6. Apply mock hygiene at root: `restoreMocks`, `clearMocks`, `mockReset`.
7. Apply `isolate: true` on all projects via `sharedTestOptions()`.
8. Keep Gate 3 as `pnpm test:run` / `pnpm test:run:affected` — **not** `turbo run test`.
9. Keep `@afenda/testing` out of production runtime (`quality:boundaries`).
10. Document naming suffixes as team convention — not Vitest `include` glob filters.

---

## 5.3 Prohibited actions

```text
- Replace Vitest projects with flat root include: ["apps/**", "packages/**"]
- Make turbo run test the TIP-009 Gate 3 entry (breaks unified JUnit + project roots)
- Duplicate per-package src/test/setup.ts instead of @afenda/testing/setup/*
- Add global 80% coverage thresholds without baseline measurement (ARCH-TEST-001 Slice 4)
- Use vitest/globals types while globals: false
- Put full user journeys (multi-page nav, CSP runtime) in Vitest (ARCH-TEST-001)
- Import @afenda/testing in production source
- Weaken type safety with any
- Suppress tests instead of fixing failures
- Use prohibited timeline vocabulary without P0/P1/P2/P3 classification
```

---

## 5.4 Production classification vocabulary

| Item | Bucket | Requirement |
| --- | --- | --- |
| Vitest projects workspace + factories | **P0** | Delivered — this ARCH |
| `pnpm test:run` / `test:run:affected` in CI | **P0** | Gate 3 in `ci.yml` |
| `@afenda/testing` production import ban | **P0** | `quality:boundaries` |
| UI packages on jsdom (`createUiProject`) | **P0** | design-system · ui |
| Database forks + `fileParallelism: false` | **P0** | `@afenda/database` |
| Interaction CI gate (`pnpm test:interaction`) | **P0** | ARCH-TEST-001 Slice 3 — **Delivered** ✓ |
| ERP E2E smoke in CI | **P0** | ARCH-TEST-001 Slice 3 — **Delivered** ✓ |
| Package-tier coverage thresholds | **P1** | ARCH-TEST-001 Slice 4 — **Delivered** ✓ (phase-1 ratchet) |
| Vitest browser mode for ERP app routes | **P2** | Not in current production release. Requires separate ARCH/FDR approval. |
| Mutation testing | **P3** | Post-9.5 enhancement backlog |

---

# 6. Required implementation scope

## Runtime architecture

```mermaid
flowchart TB
  subgraph root [Root vitest.config.ts]
    Gate3["Gate 3: pnpm test:run"]
    CI["CI: junit + github-actions"]
  end
  subgraph factories [vitest.shared.ts]
    Node[createNodeProject]
    DB[createDatabaseProject]
    UI[createUiProject]
    React[createReactProject]
  end
  subgraph setup [@afenda/testing]
    NodeSetup[setup/node]
    ReactSetup[setup/react]
    Mocks[mocks next-link next-image]
  end
  Gate3 --> factories
  Node --> NodeSetup
  DB --> NodeSetup
  UI --> ReactSetup
  React --> ReactSetup
  React --> Mocks
```

## Factory matrix (runtime truth)

| Factory | Environment | Pool | File parallelism | Timeouts | next mocks | Packages |
| --- | --- | --- | --- | --- | --- | --- |
| `createNodeProject` | node | threads (root) | default | 10s | no | auth, kernel, permissions, observability, storage, entitlements, feature-flags, metadata, execution, accounting, ai-governance, architecture-authority |
| `createDatabaseProject` | node | **forks** | **false** | 20s | no | `@afenda/database` |
| `createUiProject` | jsdom | threads | default | 10s | link + image + `@afenda/ui` aliases | design-system, ui |
| `createReactProject` | jsdom | threads | default | 10s (appshell 60s override) | link + image + ui/appshell aliases | appshell, erp, docs, metadata-ui, testing |

**`createUiProject` vs `createReactProject`:** UI packages without Next app wiring use `createUiProject`. Packages that consume Next mocks, appshell, or extra setup files use `createReactProject`.

## Shared constants (`vitest.shared.ts`)

| Export | Purpose |
| --- | --- |
| `TEST_FILE_PATTERN` | `src/**/__tests__/**/*.{test,spec}.{ts,tsx}` |
| `INTERACTION_TEST_PATTERN` | `**/*.interaction.test.{ts,tsx}` |
| `INTEGRATION_TEST_PATTERN` | `**/*.integration.test.{ts,tsx}` |
| `INTERACTION_CLI_PATH_FILTER` | `.interaction.test` for `pnpm test:interaction` |
| `INTERACTION_VITEST_PROJECTS` | `@afenda/testing` · `@afenda/ui` · `@afenda/appshell` |

## Test naming (team convention)

| Suffix | Purpose |
| --- | --- |
| `*.unit.test.ts` | Pure functions, schemas |
| `*.contract.test.ts` | Contract stability |
| `*.service.test.ts` | Domain/service behavior |
| `*.permission.test.ts` | Permission and policy rules |
| `*.integration.test.ts` | DB/auth/API bridges |
| `*.migration.test.ts` | Drizzle journal / migration integrity |
| `*.live.test.ts` | Env-gated real infra (`AFENDA_LIVE_DB_TEST=yes`) |
| `*.interaction.test.tsx` | Radix/cmdk flows (`@afenda/testing/react`) |
| `*.ui.test.tsx` | React component behavior |

## Quality stack (division of responsibility)

| Tool | Role |
| --- | --- |
| **Vitest** | Unit + integration + contract + jsdom component/interaction tests |
| **TypeScript** | Type correctness (`pnpm typecheck` — Gate 1) |
| **Biome** | Lint/format (`pnpm ci:biome` — Gate 2) |
| **Turbo** | Build + typecheck orchestration — **not** Gate 3 test runner |
| **Playwright** | Full browser E2E (`apps/erp/e2e/` — ARCH-TEST-001) |
| **Storybook Vitest browser** | `pnpm test:run:storybook` — Gate 3a |
| **Custom scripts** | Boundaries, migrations, exports, architecture gates |

## In scope (delivered)

```text
- vitest.config.ts (root orchestrator, CI reporters, coverage root)
- vitest.shared.ts (four factories, patterns, coverage excludes)
- packages/testing/src/setup/node.ts · react.ts · load-monorepo-env.ts
- packages/*/vitest.config.ts · apps/*/vitest.config.ts
- tsconfig.vitest.json per workspace + tsconfig.vitest.base.json
- README Testing section (runbook summary)
```

## Out of scope

```text
- Playwright E2E policy and CI (ARCH-TEST-001)
- Storybook browser test config (apps/storybook)
- Global coverage threshold enforcement (ARCH-TEST-001 Slice 4)
- turbo run test as Gate 3
- Per-package duplicated setup.ts trees
```

## Expected files (reference)

| File | Owner | Role |
| --- | --- | --- |
| `vitest.config.ts` | root | Projects orchestrator |
| `vitest.shared.ts` | root | Factory authority |
| `packages/testing/src/setup/*` | PKG-016 | Shared setup |
| `packages/<pkg>/vitest.config.ts` | each workspace | One-liner factory import |
| `packages/<pkg>/tsconfig.vitest.json` | each workspace | Test typecheck overlay |

---

# 7. Enterprise acceptance criteria

```gherkin
Feature: Vitest monorepo workspace

  Scenario: Gate 3 runs Vitest projects from root
    GIVEN a pull request targets main
    WHEN CI Gate 3 executes
    THEN pnpm test:run:affected or pnpm test:run completes with exit 0
    AND test-results/junit.xml is produced when CI=true

  Scenario: Package selects correct environment factory
    GIVEN @afenda/database vitest.config.ts
    WHEN the project loads
    THEN createDatabaseProject applies pool forks and fileParallelism false
    AND @afenda/ui uses createUiProject with jsdom environment

  Scenario: Workspace packages resolve in tests
    GIVEN a test imports @afenda/<package> from source
    WHEN Vitest transforms the module graph
    THEN server.deps.inline matches /@afenda\//
    AND the test does not require pre-built dist for sibling packages

  Scenario: Live tests do not break CI
    GIVEN AFENDA_LIVE_DB_TEST is not set to yes
    WHEN pnpm test:run executes
    THEN *.live.test.ts suites are skipped via describe.runIf
    AND Gate 3 still passes

  Scenario: Testing utilities do not leak into production
    GIVEN production source is scanned
    WHEN quality:boundaries runs
    THEN @afenda/testing imports are prohibited outside test/setup/story paths
```

---

# 8. Enterprise quality benchmark

| Dimension | Target | Evidence |
| --- | ---: | --- |
| Contract stability | 5/5 | `vitest.shared.ts` factories · `pnpm typecheck` exit 0 |
| Test coverage | 4/5 | `pnpm test:run` exit 0; threshold gate P1 pending |
| Observability + audit | 4/5 | JUnit + github-actions reporters in CI |
| Security + RBAC + RLS | 4/5 | Boundaries gate; mock providers isolated |
| Documentation + BRD traceability | 5/5 | This ARCH + README + ARCH-TEST-001 cross-link |
| Maintainability + Clean Core | 5/5 | Single factory surface; no duplicate setup trees |

**Score:** 28/30 — foundation acceptable. Coverage threshold enforcement delivered via ARCH-TEST-001 Slice 4 (phase-1 ratchet).

---

# 9. Non-functional requirements

| Characteristic | Requirement | Verification |
| --- | --- | --- |
| Functional suitability | Correct env per package class | Factory matrix §6 |
| Performance efficiency | PR uses `test:run:affected` | `ci.yml` Gate 3 |
| Compatibility | Vitest 3.2.x projects API | `vitest.config.ts` |
| Reliability | DB serial files; isolate all projects | `createDatabaseProject` |
| Maintainability | One factory per environment class | `vitest.shared.ts` |
| Security | No testing imports in production | `quality:boundaries` |
| Documentation | ARCH + README aligned | `check:documentation-drift` |

---

# 10. Required gates

```bash
pnpm test:run
pnpm test:run:affected
pnpm test:interaction
pnpm test:run:storybook
pnpm typecheck
pnpm ci:biome
pnpm quality:boundaries
pnpm check:foundation-disposition
pnpm check:documentation-drift
```

| Gate | Exit | Result |
| --- | ---: | --- |
| `pnpm test:run` | 0 | Pass — all Vitest projects |
| `pnpm typecheck` | 0 | Pass |
| `pnpm ci:biome` | 0 | Pass |
| `pnpm quality:boundaries` | 0 | Pass |
| `pnpm test:interaction` | 0 | Pass — CI Gate 3i (ARCH-TEST-001 Slice 3) |
| `pnpm check:coverage-summary` | 0 | Gate 3cov — ARCH-TEST-001 Slice 4 |

---

# 11. Definition of Done

| # | Criterion | Evidence | Status |
| --- | --- | --- | --- |
| 1 | Runtime evidence at stated paths | `vitest.shared.ts` · `packages/testing/` | [x] |
| 2 | Acceptance criteria implemented | §7 Gherkin | [x] |
| 3 | Positive path tested | `pnpm test:run` exit 0 | [x] |
| 4 | Negative path tested | boundaries gate; live tests skipped in CI | [x] |
| 5 | TypeScript strict passes | `pnpm typecheck` | [x] |
| 6 | Four factories documented | §6 factory matrix | [x] |
| 7 | UI jsdom migration | `createUiProject` on design-system · ui | [x] |
| 8 | Database isolation | forks + `fileParallelism: false` | [x] |
| 9 | ARCH registered | `arch-status-index.md` | [x] |
| 10 | README runbook | root `README.md` Testing | [x] |
| 11 | Runtime matrix cross-link | Testing Infrastructure row | [x] |
| 12 | Pyramid CI tiering | ARCH-TEST-001 Slices 3–4 | [x] |
| 13 | Impact analysis | §12 | [x] |
| 14 | Rollback strategy | §14 | [x] |
| 15 | `@afenda/testing` boundary | `quality:boundaries` | [x] |
| 16 | Public API compatibility | `@afenda/testing` exports stable | [x] |
| 17 | Clean Core level | A | [x] |
| 18 | Waivers documented | §13 | [x] |
| 19 | Cross-link ARCH-TEST-001 | Pyramid + Playwright | [x] |
| 20 | Peer review | Architecture Authority | [ ] |

---

# 12. Impact analysis

| Consumer | Dependency | Breaking change? | Required action |
| --- | --- | --- | --- |
| All packages | `vitest.shared.ts` factories | No | One-liner `vitest.config.ts` |
| `@afenda/design-system` · `@afenda/ui` | `createUiProject` (jsdom) | No | Use for new `.ui.test.tsx` |
| `@afenda/database` | `createDatabaseProject` | No | Serial integration files |
| `@afenda/metadata-ui` | `createReactProject` + local setup | No | Keep metadata-specific setup |
| CI | `pnpm test:run` Gate 3 | No | Already wired |
| Agents | This ARCH + ARCH-TEST-001 | No | Read before changing test stack |

Breaking change: **No** · Migration required: **No** · Runtime risk: **Low** · Rollback safe: **Yes**

---

# 13. Waiver policy

| Waiver ID | Requirement waived | Reason | Approver | Expiry / revisit |
| --- | --- | --- | --- | --- |
| `coverage-thresholds-p1` | Package-tier coverage enforcement | Phase-1 ratchet floors via `check:coverage-summary` | Architecture Authority | Template B targets or waiver renewal |
| `live-db-tests-ci` | Live DB tests in Gate 3 | Env-gated; optional operator job | Architecture Authority | Separate live-test workflow if needed |

No waiver permits removing Vitest projects mode or moving Gate 3 to Turbo.

---

# 14. Rollback strategy

| Change area | Rollback method | Risk |
| --- | --- | --- |
| `vitest.shared.ts` | `git revert` | Medium — re-verify all projects |
| Package `vitest.config.ts` | Revert factory import | Low |
| ARCH-TEST-002 doc | Revert PR | Low |
| CI Gate 3 | Revert `ci.yml` step | Low |

Rollback must preserve: registry authority, package boundaries, Gate 3 as `pnpm test:run`, and documentation truth.

---

# 15. Operator runbook (quick reference)

```bash
pnpm test:run                              # all Vitest projects (Gate 3 on main)
pnpm test:run:affected                     # PR affected packages (Gate 3 on PR)
pnpm test:interaction                      # interaction projects only
pnpm test:coverage                         # v8 per-project reports + json-summary
pnpm test:ui                               # Vitest UI (local)
pnpm --filter @afenda/database test:run    # database (forks, serial files)
pnpm --filter @afenda/design-system test:run  # UI package (jsdom)
pnpm check                                 # biome + typecheck + test:run:all
```

**New package checklist:**

1. Add `vitest.config.ts` importing the correct factory from `vitest.shared.ts`.
2. Add `tsconfig.vitest.json` extending workspace `tsconfig.json`.
3. Add `test` / `test:run` scripts in `package.json`.
4. Place tests in `src/__tests__/` using approved suffix conventions.
5. Do not add per-package `src/test/setup.ts` — extend `@afenda/testing` if shared setup is needed.

---

# 16. Promotion rule

ARCH-TEST-002 workspace configuration is **Complete — foundation acceptable**.

Do not rename to **enterprise 9.5 accepted** until ARCH-TEST-001 closes P0 CI slices (interaction + E2E smoke) and P1 coverage summary gate — **Complete 2026-06-26** under ARCH-TEST-001.

---

# 17. Related documents

| Document | Relationship |
| --- | --- |
| [ARCH-TEST-001](%5BComplete%5D%20ARCH-TEST-001-vitest-playwright-strategy.md) | Pyramid, Playwright, Storybook browser, CI tiering |
| [fdr-016-test-utilities](../delivery/FDR/%5BComplete%5D%20fdr-016-test-utilities.md) | Implementation FDR for `@afenda/testing` |
| [tip-009-ci-cd-preview](../delivery/tip-009-ci-cd-preview.md) | TIP-009 gate spine (historical) |
| Root [README.md](../../README.md) | Operator runbook summary |
