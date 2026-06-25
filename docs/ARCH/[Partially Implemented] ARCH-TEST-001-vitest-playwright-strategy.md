# ARCH-TEST-001 — Vitest / Playwright Monorepo Testing Strategy

> Architecture authority for monorepo test pyramid, Vitest workspace, Storybook browser tests, and ERP Playwright E2E.  
> Template: [`ARCH-TEMPLATE.md`](ARCH-TEMPLATE.md) · Index: [`arch-status-index.md`](arch-status-index.md)

| Field | Value |
| --- | --- |
| **Document ID** | ARCH-TEST-001 |
| **Work ID** | ARCH-TEST-001 · PKG-016 · [`fdr-016-test-utilities`](../delivery/FDR/%5BPartially%20Implemented%5D%20fdr-016-test-utilities.md) (paired FDR) |
| **Title** | Vitest / Playwright monorepo testing strategy |
| **Status** | **Partially Implemented — authority established; runtime gates pending** |
| **Date** | 2026-06-25 |
| **Owner** | Architecture Authority · `@afenda/testing` runtime owner |
| **Package** | PKG-016 · `@afenda/testing` + root `vitest.shared.ts` |
| **Registry entry ID** | PKG016_TESTING |
| **Runtime owner** | `packages/testing/` · `vitest.shared.ts` · `apps/erp/e2e/` |
| **Lane** | blue-lane |
| **Risk class** | Low |
| **Change class** | Extension + Governance |
| **Clean Core target** | A |
| **Enterprise score target** | 29/30 (Complete — enterprise 9.5 accepted) |

**One-sentence architecture:** The monorepo uses a **layered test pyramid** — Vitest (node/jsdom) for fast unit/component/interaction proof, Vitest browser mode for Storybook only, and Playwright for ERP full-app smoke — with **P0 CI gates** on interaction and E2E smoke; coverage thresholds are **P1 mandatory for 9.5** unless explicitly waived.

---

## 1. Execution instruction

Execute one bounded slice under ARCH-TEST-001. Every completion claim maps to **file path**, **test path**, **command exit code**, or **explicit waiver**. No prose-only “done”.

Skills: [`.cursor/skills/test-coverage/SKILL.md`](../../.cursor/skills/test-coverage/SKILL.md) · [`afenda-coding-session`](../../.cursor/skills/afenda-coding-session/SKILL.md).

---

## 2. Target item

| Field | Value |
| --- | --- |
| Work ID | ARCH-TEST-001 · `fdr-016-test-utilities` |
| Status | Partially Implemented → Complete when Slices 2–5B close |
| Package | `@afenda/testing` (PKG-016) + root vitest wiring |
| Registry entry ID | PKG016_TESTING |
| Runtime owner | `packages/testing/` · `vitest.shared.ts` · `apps/erp/e2e/` |
| Lane | blue-lane |
| Clean Core | A |
| Enterprise score target | 29/30 |

### Delivery slice status

| Slice | Scope | Classification | Status |
| --- | --- | --- | --- |
| **1 — Authority** | This ARCH + index + matrix cross-link | P0 | **Delivered** (2026-06-25) |
| **2 — Root Vitest** | `vitest.config.ts` · `vitest.shared.ts` · interaction file-pattern scripts | P0 | Pending |
| **3 — CI tiering** | Gate 3i interaction · Gate 3e ERP `@smoke` E2E | P0 | Pending |
| **5A — Governance** | Interaction-import scan · `packages/testing/README.md` | P0 | Pending |
| **4 — Coverage** | Package thresholds · `check-coverage-summary.mjs` | P1 | Pending |
| **5B — Evidence-sync** | fdr-016 Complete · ARCH promotion · matrix sync | P1 | Pending |

---

## 3. Authority chain

```text
1. docs/ARCH/arch-status-index.md
2. docs/delivery/fdr-status-index.md
3. packages/architecture-authority/src/data/foundation-disposition.registry.ts
4. docs/architecture/afenda-runtime-truth-matrix.md
5. docs/delivery/FDR/[status] fdr-016-test-utilities.md
6. vitest.shared.ts · packages/testing/ · apps/erp/playwright.config.mts
7. .github/workflows/ci.yml
```

---

## 4. Problem statement

### Current risk / gap

```text
Baseline Vitest workspace, shared factories, @afenda/testing, ERP Playwright, and Storybook browser mode
are implemented (Grade A). Enforcement gaps remain: interaction tests and ERP E2E smoke are not CI gates;
coverage thresholds are not enforced; interaction filter scripts are inconsistent; fdr-016 alone does not
define pyramid policy or Vitest/Playwright division of responsibility.
```

### Business / architecture impact

```text
Without P0 CI gates, Radix interaction regressions and ERP routing/CSP/manifest failures can merge undetected.
Without coverage governance, enterprise 9.5 test-coverage dimension cannot be attested. Without ARCH authority,
agents may duplicate test setup or place full user journeys in Vitest.
```

---

## 5. Architecture requirement

### 5.1 Ownership

| Concern | Owner | Allowed path |
| --- | --- | --- |
| Test utility contracts | `@afenda/testing` | `packages/testing/src/` |
| Vitest project factories | Root workspace | `vitest.shared.ts` |
| Vitest root orchestration | Root workspace | `vitest.config.ts` |
| Storybook browser tests | `@afenda/storybook` | `apps/storybook/vitest.storybook.config.ts` |
| ERP E2E | `@afenda/erp` | `apps/erp/e2e/` |
| Coverage summary gate | Governance | `scripts/governance/check-coverage-summary.mjs` |
| ARCH authority | docs | `docs/ARCH/ARCH-TEST-001-*` |

### 5.2 Boundary rules

1. Vitest node for pure logic and contracts.
2. Vitest jsdom for component render and server-action integration tests.
3. `*.interaction.test.tsx` for Radix/cmdk flows using `@afenda/testing/react`.
4. Vitest browser mode **only** for Storybook — not ERP app routes.
5. Playwright **only** for full-app journeys (auth, routing, CSP, manifest nav).
6. Co-locate tests in `src/**/__tests__/` — no root-level `tests/` folders.
7. `@afenda/testing` imports prohibited in production runtime (`quality:boundaries`).

### 5.3 Prohibited actions

```text
- Put full user journeys (multi-page nav, auth flow, CSP runtime) in Vitest
- Put ERP app routes in Vitest browser mode
- Use fireEvent in interaction suites (use @afenda/testing/react setupUser)
- Lower coverage thresholds solely to pass existing debt
- Leave interaction tests or ERP E2E smoke out of CI after Slice 3
- Import @afenda/testing in production source
- Duplicate interaction helpers outside @afenda/testing/react
- Use testNamePattern to filter interaction files (file pattern only)
- Claim Complete until P0 CI gates exit 0
```

### 5.4 Production classification vocabulary

| Item | Bucket | Requirement |
| --- | --- | --- |
| `pnpm test:run` in CI | **P0** | Every PR (affected) + main (full) |
| `pnpm test:interaction` in CI | **P0** | Every PR — non-negotiable |
| ERP E2E smoke in CI | **P0** | PR + main — `@smoke` grep |
| Root coverage reporting | **P0** | After Slice 2 |
| `@afenda/testing` production import ban | **P0** | `quality:boundaries` |
| ARCH-TEST-001 authority | **P0** | Slice 1 |
| Coverage thresholds (package-tiered) | **P1** | Required for 9.5 unless explicit waiver |
| fdr-016 Complete closeout | **P1** | Slice 5B |
| Nightly full E2E matrix | **P2** | Not in current production release. Requires separate ARCH/FDR approval before implementation. |
| Visual screenshot regression | **P2** | Not in current production release unless Storybook separately approved. |
| Mutation testing | **P3** | Post-9.5 enhancement backlog |

**Coverage policy (mandatory):**

```text
Coverage thresholds are mandatory for 9.5, but rollout may be package-tiered.
No threshold may be lowered solely to pass existing debt; debt must be fixed or waived with owner, expiry, and revisit trigger.
```

---

## 6. Required implementation scope

### Test pyramid

| Layer | Pattern | Environment | Tool |
| --- | --- | --- | --- |
| 1 Unit | `*.test.ts` | node | Vitest workspace |
| 2 Component / integration | `*.test.tsx` · `*.integration.test.ts` | jsdom / node | Vitest workspace |
| 3 Interaction | `*.interaction.test.tsx` | jsdom | Vitest + `@afenda/testing/react` |
| 4 Storybook browser | Story files | browser (Playwright provider) | Separate vitest config |
| 5a E2E smoke | `@smoke` tagged specs | chromium + webServer | Playwright `@afenda/erp` |
| 5b E2E full | untagged / `e2e/full/` | chromium | P2 scheduled/manual |

### CI tier policy

| Gate | Command | When |
| --- | --- | --- |
| Unit/component | `pnpm test:run:affected` / `pnpm test:run` | PR / main |
| Interaction | `pnpm test:interaction` | Every PR |
| Storybook browser | `pnpm test:run:storybook` | Every PR |
| ERP E2E smoke | `pnpm --filter @afenda/erp test:e2e --grep @smoke` | PR + main |
| Coverage | `pnpm test:coverage` + `pnpm check:coverage-summary` | After Slice 4 |
| Boundaries | `pnpm quality:boundaries` | Every PR |

**E2E credential skip policy:**

```text
E2E smoke may skip auth-dependent specs only when required CI secrets are absent.
The skip must be annotated and must not skip routing/CSP/static smoke coverage.
```

---

## 7. Enterprise acceptance criteria

```gherkin
Feature: Monorepo testing pyramid

  Scenario: Interaction tests run in CI
    GIVEN a package contains *.interaction.test.tsx files
    WHEN CI runs on a pull request
    THEN pnpm test:interaction executes
    AND interaction suites import userEvent helpers from @afenda/testing/react

  Scenario: ERP smoke E2E protects production journeys
    GIVEN the ERP app builds successfully
    WHEN CI runs the E2E smoke gate
    THEN protected routing, auth entry, CSP, and manifest navigation smoke specs execute
    AND auth-dependent specs are skipped only when required CI secrets are absent

  Scenario: Vitest does not own full user journeys
    GIVEN a test covers multi-page navigation, auth flow, or CSP runtime behavior
    WHEN the test is authored
    THEN it must live in apps/erp/e2e as a Playwright spec
    AND not in a Vitest component or interaction suite

  Scenario: Coverage thresholds fail production debt
    GIVEN package coverage falls below the approved threshold
    WHEN pnpm test:coverage runs
    THEN the gate fails
    AND the threshold is not reduced without an approved waiver

  Scenario: Testing utilities do not leak into production
    GIVEN production source files are scanned
    WHEN quality boundaries run
    THEN @afenda/testing imports are prohibited outside test/setup/story files
```

---

## 8. Enterprise quality benchmark

| Dimension | Target | Evidence required |
| --- | ---: | --- |
| Contract stability | 5/5 | `vitest.shared.ts` factories + typecheck exit 0 |
| Test coverage | 5/5 | P0 CI gates + P1 coverage summary gate |
| Observability + audit | 4/5 | CI junit reporters; E2E trace on-first-retry |
| Security + RBAC + RLS | 4/5 | Boundaries gate; mock providers isolated |
| Documentation + BRD traceability | 5/5 | ARCH + fdr-016 + matrix synced |
| Maintainability + Clean Core | 5/5 | Single `@afenda/testing` surface; no duplicate helpers |

**Slice 1 score:** ~24/30 audit-adjusted (authority only; runtime gates pending).

---

## 9. Non-functional requirements

| Characteristic | Requirement | Verification |
| --- | --- | --- |
| Functional suitability | Pyramid layers map to correct tools | ARCH + governance scans |
| Performance efficiency | PR CI uses turbo affected for unit tests | `test:run:affected` |
| Compatibility | Vitest 3 projects workspace | `vitest.config.ts` |
| Security | No `@afenda/testing` in production | `quality:boundaries` |
| Maintainability | File-pattern interaction filter | `INTERACTION_TEST_PATTERN` in `vitest.shared.ts` |
| Reliability | Deterministic Radix helpers | `pnpm test:interaction` |
| Documentation | ARCH + README runbook | `check:documentation-drift` |

---

## 10. Required gates

```bash
pnpm test:run
pnpm test:interaction
pnpm test:run:storybook
pnpm --filter @afenda/erp test:e2e --grep @smoke
pnpm test:coverage
pnpm check:coverage-summary
pnpm quality:boundaries
pnpm check:foundation-disposition
pnpm check:documentation-drift
```

| Gate | Slice | Status |
| --- | --- | --- |
| `pnpm check:documentation-drift` | 1 | Required |
| `pnpm check:foundation-disposition` | 1 | Required |
| `pnpm test:interaction` in CI | 3 | Pending |
| `pnpm test:e2e --grep @smoke` in CI | 3 | Pending |
| `pnpm check:coverage-summary` | 4 | Pending |

---

## 11. Definition of Done

| # | Criterion | Evidence | Status |
| --- | --- | --- | --- |
| 1 | Runtime evidence at stated paths | `vitest.shared.ts` · `packages/testing/` | [x] |
| 2 | Acceptance criteria implemented | Gherkin §7 | [ ] |
| 3 | Positive path tested | `pnpm test:run` exit 0 | [x] |
| 4 | Negative path tested | boundaries + coverage fail paths | [ ] |
| 5 | TypeScript strict passes | `pnpm typecheck` | [x] |
| 6 | Interaction CI gate | Gate 3i in ci.yml | [ ] |
| 7 | E2E smoke CI gate | Gate 3e in ci.yml | [ ] |
| 8 | ARCH authority registered | arch-status-index TEST domain | [x] |
| 9 | Coverage summary gate | `check-coverage-summary.mjs` | [ ] |
| 10 | Interaction import governance | governance test | [ ] |
| 11 | Runtime matrix updated | Testing Infrastructure row | [ ] |
| 12 | fdr-016 Complete | fdr-status-index | [ ] |
| 13 | Impact analysis completed | §12 below | [x] |
| 14 | Rollback strategy documented | §14 below | [x] |
| 15 | `@afenda/testing` boundary verified | `quality:boundaries` | [x] |
| 16 | README runbook | `packages/testing/README.md` | [ ] |
| 17 | Public API compatibility | exports map stable | [x] |
| 18 | Clean Core level declared | A | [x] |
| 19 | Waivers documented if any | §13 below | [ ] |
| 20 | Peer review completed | DoD #14 | [ ] |

---

## 12. Impact analysis

| Consumer | Dependency | Breaking change? | Required action |
| --- | --- | --- | --- |
| All packages | `vitest.shared.ts` factories | No | Use `createNodeProject` / `createReactProject` |
| `@afenda/ui` · `@afenda/appshell` | `@afenda/testing/react` | No | `*.interaction.test.tsx` naming |
| `@afenda/erp` | Playwright E2E + Vitest integration | No | `@smoke` tags on smoke specs |
| CI | New gates 3i · 3e · coverage | No | Workflow update Slice 3–4 |

Breaking change: **No** · Migration required: **No** · Runtime risk: **Low** · Rollback safe: **Yes**

---

## 13. Waiver policy

| Waiver ID | Requirement waived | Reason | Approver | Expiry |
| --- | --- | --- | --- | --- |
| `e2e-auth-credentials-ci` | Auth-dependent E2E specs in CI | `AFENDA_DEV_LOGIN_PASSWORD` absent in CI | Architecture Authority | When CI secrets provisioned |

No waiver may skip CSP or public-route smoke specs.

---

## 14. Rollback strategy

| Change area | Rollback method | Risk |
| --- | --- | --- |
| ARCH doc | Revert PR | Low |
| CI gates | Revert ci.yml steps | Low |
| vitest.shared.ts | `git revert` | Medium |
| Coverage script | Remove gate + script | Low |

---

## 15. Slice handoffs

### Slice 2 — Root Vitest optimization (P0)

```
Handoff from: docs/ARCH/[Partially Implemented] ARCH-TEST-001-vitest-playwright-strategy.md

1. Objective    — Standardize root Vitest coverage reporting, INTERACTION/INTEGRATION patterns, and file-pattern test:interaction scripts across @afenda/testing, @afenda/ui, @afenda/appshell.
2. Allowed layer— vitest.config.ts; vitest.shared.ts; package.json (root); packages/testing/package.json
3. Files        —
   vitest.config.ts
   vitest.shared.ts
   package.json
   packages/testing/package.json
4. Prohibited   — apps/erp/e2e edits; ci.yml; consumer test bodies; lower coverage thresholds
5. Authority    — ARCH-TEST-001 §5 · fdr-016 PKG016_TESTING · Vitest 3 projects docs
6. Gates        —
   pnpm test:run
   pnpm test:interaction
   pnpm check:foundation-disposition
7. Closes       — DoD #2 partial (interaction standardization)
8. Evidence     — vitest.shared.ts INTERACTION_TEST_PATTERN · INTEGRATION_TEST_PATTERN · root test:interaction script
9. Attestation  — Maintainability (single pattern authority); Test coverage (interaction filter parity)
```

### Slice 3 — CI tiering (P0)

```
Handoff from: docs/ARCH/[Partially Implemented] ARCH-TEST-001-vitest-playwright-strategy.md

1. Objective    — Add Gate 3i (pnpm test:interaction) and Gate 3e (ERP Playwright @smoke) to ci.yml; tag smoke E2E specs.
2. Allowed layer— .github/workflows/ci.yml; apps/erp/e2e/
3. Files        —
   .github/workflows/ci.yml
   apps/erp/e2e/protected-home.spec.ts
   apps/erp/e2e/feature-manifest-navigation.spec.ts
   apps/erp/e2e/csp-hybrid.spec.ts
4. Prohibited   — Nightly full E2E matrix (P2); Vitest config changes
5. Authority    — ARCH-TEST-001 §6 CI tier policy · E2E credential skip policy
6. Gates        —
   pnpm test:interaction
   pnpm --filter @afenda/erp test:e2e --grep @smoke
7. Closes       — DoD #6 · DoD #7
8. Evidence     — ci.yml Gate 3i/3e · @smoke tags in e2e specs
9. Attestation  — Test coverage 5/5 (CI enforcement)
```

### Slice 5A — Governance + README (P0)

```
Handoff from: docs/ARCH/[Partially Implemented] ARCH-TEST-001-vitest-playwright-strategy.md

1. Objective    — Add interaction-import governance test and @afenda/testing README runbook.
2. Allowed layer— scripts/governance/__tests__/; packages/testing/
3. Files        —
   scripts/governance/__tests__/interaction-test-imports.test.ts
   packages/testing/README.md
4. Prohibited   — vitest.shared.ts; production runtime
5. Authority    — ARCH-TEST-001 §7 · AGENTS.md interaction patterns
6. Gates        —
   pnpm exec vitest run scripts/governance/__tests__/interaction-test-imports.test.ts
   pnpm test:interaction
   pnpm quality:boundaries
7. Closes       — DoD #10 · DoD #16
8. Evidence     — governance test · README.md
9. Attestation  — Maintainability; Security boundary
```

### Slice 4 — Coverage thresholds (P1)

```
Handoff from: docs/ARCH/[Partially Implemented] ARCH-TEST-001-vitest-playwright-strategy.md

1. Objective    — Add check-coverage-summary.mjs, root script, package-tier thresholds for auth/permissions/observability/database; wire CI Gate 3cov.
2. Allowed layer— scripts/governance/; packages/{auth,permissions,observability,database}/vitest.config.ts; package.json (root); ci.yml
3. Files        —
   scripts/governance/check-coverage-summary.mjs
   scripts/governance/__tests__/check-coverage-summary.test.ts
   packages/auth/vitest.config.ts
   packages/permissions/vitest.config.ts
   packages/observability/vitest.config.ts
   packages/database/vitest.config.ts
   package.json
   .github/workflows/ci.yml
4. Prohibited   — Lower thresholds to match debt
5. Authority    — .cursor/skills/test-coverage/THRESHOLDS.md Template B
6. Gates        —
   pnpm test:coverage
   pnpm check:coverage-summary
7. Closes       — DoD #4 · DoD #9
8. Evidence     — check-coverage-summary.mjs · phase-1 vitest.config merges
9. Attestation  — Test coverage dimension toward 5/5
```

### Slice 5B — Evidence-sync (P1)

```
Handoff from: docs/ARCH/[Partially Implemented] ARCH-TEST-001-vitest-playwright-strategy.md

1. Objective    — Promote ARCH-TEST-001 and fdr-016 to Complete; sync matrix and fdr-status-index; close DoD #20 peer review attestation.
2. Allowed layer— docs/ only
3. Files        —
   docs/ARCH/[Complete] ARCH-TEST-001-vitest-playwright-strategy.md (rename)
   docs/ARCH/arch-status-index.md
   docs/delivery/FDR/[Complete] fdr-016-test-utilities.md (rename)
   docs/delivery/fdr-status-index.md
   docs/architecture/afenda-runtime-truth-matrix.md
4. Prohibited   — packages/; apps/ runtime edits
5. Authority    — ARCH-TEST-001 §11 DoD · ADR-0016
6. Gates        — Full §10 gate table exit 0
7. Closes       — DoD #11 · DoD #12 · DoD #20 · ARCH Complete
8. Evidence     — Gate log in FDR Slice 5B outcomes
9. Attestation  — Documentation 5/5; Enterprise 29/30 candidate
```

---

## 16. Promotion rule

Do not promote to **Complete — enterprise 9.5 accepted** until:

```text
- Slices 2, 3, 5A delivered (P0 CI gates live)
- Slice 4 delivered or waived with expiry (P1 coverage)
- Slice 5B evidence-sync + peer review (DoD #20)
- All §10 gates exit 0
```

---

## 17. Command to execute

```text
Execute ARCH-TEST-001 as one bounded slice per session.
Copy ONE §15 handoff block. Do not expand scope.
Stop after slice completion report.
```
