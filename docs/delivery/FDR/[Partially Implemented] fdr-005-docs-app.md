# fdr-005-docs-app — Docs Application

| Field | Value |
| --- | --- |
| **Status** | Partially Implemented |
| **FDR ID** | `fdr-005-docs-app` |
| **Registry entry ID** | `PKG005_DOCS` |
| **Package** | `@afenda/docs` (PKG-005) |
| **Lane** | blue-lane |
| **Clean Core level** | A ([enterprise-erp-standards §10](../../../.cursor/skills/enterprise-erp-standards/SKILL.md)) |
| **Change class** | Extension |
| **Risk class** | Low |
| **BRD reference** | internal — Fumadocs delivery surface, developer documentation |
| **Enterprise readiness** | **26/30 audit-adjusted** · **26/30 evidence-qualified ceiling** — enterprise **9.5 candidate** (DoD #14 peer review open; external beta content in Slice 3) |
| **Runtime evidence** | See §Runtime evidence |
| **Source of truth** | `foundation-disposition.registry.ts` |
| **Document role** | Delivery authority / evidence plan — not registry authority |
| **Status source** | [`afenda-runtime-truth-matrix.md`](../../architecture/afenda-runtime-truth-matrix.md) |
| **Index** | [`fdr-status-index.md`](../fdr-status-index.md) |
| **Enterprise controls** | SOLMAN · Oracle FDD |

## §Registry link

> Read-only snapshot — authority is [`foundation-disposition.registry.ts`](../../../packages/architecture-authority/src/data/foundation-disposition.registry.ts). Do not invent fields here.

| Field | Value |
| --- | --- |
| id | `PKG005_DOCS` |
| packageId | PKG-005 |
| domain | `docs-app` |
| lane | blue-lane |
| runtimeOwner | `apps/docs` |
| gates | `pnpm quality:docs`; `pnpm --filter @afenda/docs typecheck`; `pnpm --filter @afenda/docs test:run` |
| prohibited | `do-not-couple-erp-runtime`; `do-not-import-tenant-resolvers`; `do-not-embed-secrets-in-mdx`; `do-not-create-accounting-package` |
| allowedAgents | `docs-app-agent`; `foundation-registry-owner` |

## Package ownership

| Package | Role | runtimeOwner path |
| --- | --- | --- |
| `@afenda/docs` (PKG-005) | Fumadocs MDX site, editorial blocks, deploy config | `apps/docs/` |
| `@afenda/ui` (PKG-018) | Afenda Docs reference blocks in `components/afenda-docs/` (read-only in Research) | `packages/ui/src/components/afenda-docs/` |
| `apps/storybook` (PKG-021) | Visual gate for docs reference blocks (read-only in Research) | `apps/storybook/` |

## Purpose

Lock and maintain the Afenda **documentation delivery surface** — Fumadocs MDX content, porcelain editorial palette, reference blocks, CI build gate (`quality:docs`), and Vercel deploy config — as a standalone Next.js app decoupled from ERP runtime.

Authority: [ADR-0014](../../adr/ADR-0014-foundation-disposition-registry.md) · [ADR-0016](../../adr/ADR-0016-fdr-delivery-authority.md).

Archive input (not implementation authority): [`tip-032-implementation-documentation.md`](../../delivery/tips/[Complete]%20tip-032-implementation-documentation.md).

## Scope

**In scope**

- `apps/docs/content/docs/` — MDX content tree (getting-started, monorepo-map, contributing)
- `apps/docs/src/app/docs/[[...slug]]/page.tsx` — Fumadocs doc routes
- `apps/docs/src/components/blocks/` — editorial blocks (callout, steps, tabbed panel, etc.)
- `apps/docs/src/lib/docs-nav.contract.ts`, `docs-editorial-palette.contract.ts` — governed contracts
- `apps/docs/vercel.json` — deploy config
- Tests under `apps/docs/src/__tests__/` (7 suites)
- Root gate: `pnpm quality:docs` → `pnpm --filter @afenda/docs build`

**Out of scope**

- ERP protected routes and tenant context (`apps/erp`)
- Live DNS operator steps for `docs.afenda.app` (tracked as gap — not code)
- Accounting runtime (ADR-0010)

## §Subagent concurrency rules

| Rule | Requirement |
| --- | --- |
| Registry ownership | Only `foundation-registry-owner` may edit `foundation-disposition.registry.ts` |
| Package boundary | Implementation agent may edit only `apps/docs/` paths listed in slice Field 3 |
| Shared constants | Docs palette/nav contracts owned in `apps/docs/src/lib/` — no duplication in ERP |
| Evidence output | Agents must output file paths + gate exit 0 — not prose-only claims |
| Parallel PKG-005 | May run parallel with other **apps/** FDRs if `runtimeOwner` paths disjoint |
| Implementation blocked until | Research Slice 1 complete; registry entry `PKG005_DOCS` exists |
| Handoff authority | Executable 9-field handoff blocks authored only by `fdr-slice-author` — not in this FDR |

## §Research

> Slice 1 **Complete** (2026-06-25). Research reconciled archive tip-032 + runtime matrix **implemented** with FDR delivery evidence grades.

### Discovery questions — answers (Slice 1)

| Question | Answer | Evidence |
| --- | --- | --- |
| Does `pnpm quality:docs` exit 0? | **Yes** — Next.js build + SSG 9 routes | `pnpm quality:docs` exit 0 (2026-06-25) |
| Are all 7 vitest suites green? | **Yes** — 50 tests pass | `pnpm --filter @afenda/docs test:run` exit 0 |
| MDX content sufficient for external beta? | **Partial** — seed content exists; beta expansion in Slice 3 | 6 MDX pages + `docs-content.test.ts` |
| Registry row required? | **Yes** — `PKG005_DOCS` pending | No PKG-005 row in disposition registry |
| Is `docs.afenda.app` DNS operator-only? | **Yes** — gap `docs-live-dns` remains operator step | `fumadocs-docs-app-deploy.md` |

### Baseline gate log (Research Slice 1 — 2026-06-25)

| Gate | Exit | Grade |
| --- | ---: | --- |
| `pnpm quality:docs` | 0 | A (9 SSG routes) |
| `pnpm --filter @afenda/docs typecheck` | 0 | A |
| `pnpm --filter @afenda/docs test:run` | 0 | A (50 tests) |
| `pnpm exec biome check apps/docs` | 0 | A |
| `pnpm check:documentation-drift` | 0 | A |
| `pnpm check:foundation-disposition` | 0 | A |

### Files inspected

| Path | Why |
| --- | --- |
| `apps/docs/package.json` | Scripts: build, typecheck, test:run |
| `apps/docs/source.config.ts` | Fumadocs MDX config |
| `apps/docs/src/app/docs/[[...slug]]/page.tsx` | Doc route handler |
| `apps/docs/src/components/blocks/` | Editorial block implementations |
| `apps/docs/src/__tests__/docs-routes.test.tsx` | Route coverage |
| `apps/docs/vercel.json` | Deploy pipeline |
| [`afenda-runtime-truth-matrix.md`](../../architecture/afenda-runtime-truth-matrix.md) | Docs application row |

## Runtime evidence (2026-06-25)

| Artifact | Path | Proven |
| --- | --- | --- |
| Fumadocs app shell | `apps/docs/src/app/layout.tsx` | Yes — Grade A (`quality:docs` build exit 0) |
| MDX content | `apps/docs/content/docs/` | Yes — Grade A (`docs-content.test.ts` 6 tests) |
| Editorial blocks | `apps/docs/src/components/blocks/` | Yes — Grade A (`docs-editorial-blocks.test.tsx` 6 tests) |
| Doc routes | `apps/docs/src/app/docs/[[...slug]]/page.tsx` | Yes — Grade A (`docs-routes.test.tsx`) |
| Nav contract | `apps/docs/src/lib/docs-nav.contract.ts` | Yes — Grade B (`docs-page.test.ts`) |
| Editorial palette | `apps/docs/src/lib/docs-editorial-palette.contract.ts` | Yes — Grade A (`docs-theme.test.ts` 19 tests) |
| Build graph | `apps/docs/src/lib/build-graph.ts` | Yes — Grade A (`build-graph.test.ts`) |
| Deploy config | `apps/docs/vercel.json` | Yes — Grade B (file exists; DNS operator gap) |
| CI gate | `pnpm quality:docs` | Yes — Grade A (exit 0, 9 SSG routes) |
| Test suites | `apps/docs/src/__tests__/` (7 files) | Yes — Grade A (50 tests exit 0) |

## §Remaining gaps

> Gap tracking lives here — registry `knownGaps` is deprecated.

| Gap ID | Description | Lane impact | Owner | Target slice | Close condition |
| --- | --- | --- | --- | --- | --- |
| `docs-app-matrix-fdr-drift` | Matrix **implemented** vs FDR was **Not started** — delivery lag | blue | `fdr-author` (Research) | Slice 1 ✓ | Research attestation; status → **Partially Implemented** |
| `docs-live-dns` | Live DNS for `docs.afenda.app` — Vercel dashboard operator step | blue | Operator / DevOps | Post-deploy | DNS resolves; documented in support doc |
| `docs-app-complete-status` | Promotion to **Complete** blocked on peer review | blue | Architecture Authority | Complete | DoD #14 `[x]` |

## §Enterprise readiness score

> **Enterprise 9.5 (final)** requires 29/30, DoD #14, and waivers reconfirmed. External developer beta target per ENTERPRISE-BENCHMARK §5: **24/30** minimum for `apps/docs`.

| Dimension | Score | Evidence | Audit note |
| --- | ---: | --- | --- |
| Contract stability | 5/5 | `typecheck` exit 0 + nav/palette contracts tested — Grade A | — |
| Test coverage | 4/5 | `test:run` exit 0 (50 tests) + `quality:docs` build — Grade A | Live DNS E2E waived (`docs-live-dns`) |
| Observability + audit | 2/5 | Static docs site — no governed mutations — Grade D | Waiver `docs-app-observability` |
| Security + RBAC + RLS | 3/5 | No ERP tenant coupling by design — Grade C | Public docs surface |
| Documentation + BRD traceability | 5/5 | FDR + tip-032 + registry row + drift exit 0 — Grade A | DoD #14 `[ ]` |
| Maintainability + Clean Core | 5/5 | `quality:docs` + typecheck + test + PKG biome exit 0 — Grade A | — |
| **Total (audit-adjusted)** | **26/30** | Registry row `PKG005_DOCS` onboarded (2026-06-25) | Enterprise 9.5 candidate |
| **Total (evidence-qualified ceiling)** | **26/30** | Upper bound with peer review at Complete | External beta Slice 3 for 24/30 path |

## §Clean Core classification

| Level | Meaning | Allowed for red-lane / gate-critical? |
| --- | --- | --- |
| A | Registry-driven, public contracts, no local authority, no private imports | Yes |
| B | Approved extension boundary, dependency registered, no duplicated constants | Yes |
| C | Tactical workaround, bounded and tracked | No, unless ADR waiver |
| D | Local hack, duplicate constants, private import, undocumented runtime behaviour | No |

**This FDR: Level A** — standalone application; no ERP domain imports; content and contracts scoped to `apps/docs`.

**Rule: red-lane or gate-critical FDRs must be Clean Core A or B.**

## §Impact analysis

| Consumer package | Import surface | Breaking change? | Clean Core impact |
| --- | --- | --- | --- |
| External developers | Public docs URL + MDX content | No | A→A |
| `@afenda/ui` | Afenda Docs reference blocks (shared visual language) | No | A→A |
| `apps/storybook` | Docs block stories | No | A→A |
| `apps/erp` | None — decoupled by design | No | A→A |

**Upstream consumers scan:** docs app is a leaf application — no packages should import from `apps/docs/src/` in production paths.

## §Enterprise acceptance

| SAP control | Oracle control | Afenda gate | DoD # |
| --- | --- | --- | --- |
| SOLMAN | FDD | `pnpm quality:docs` | 2 |
| SOLMAN | FDD testable AC | `pnpm check:documentation-drift` | 9 |
| SAP ATC | Quality standards | `pnpm --filter @afenda/docs typecheck` | 4 |
| Oracle FDD BRD traceability | SAP Blueprint AC chain | Gherkin §Acceptance criteria | 2 |
| Go-live readiness | Deployment checklist | `apps/docs/vercel.json` + support doc | 13 |

## §BRD traceability

| BRD ref | Acceptance criteria | DoD # | Afenda gate |
| --- | --- | --- | --- |
| internal | Docs site builds via quality:docs | 2 | `pnpm quality:docs` |
| internal | MDX routes resolve for seed content | 2 | `docs-routes.test.tsx` |
| internal | Editorial blocks render without ERP coupling | 2 | `docs-editorial-blocks.test.tsx` |
| tip-032 (archive) | Fumadocs delivery surface complete | 1 | matrix Docs row |

## §NFR

| Characteristic (ISO 25010) | Target | Verification |
| --- | --- | --- |
| Functional suitability | Seed MDX pages render; nav matches contract | `docs-page.test.ts`, `docs-routes.test.tsx` |
| Performance efficiency | Static/SSG docs build completes in CI | `pnpm quality:docs` |
| Compatibility | Fumadocs 16.x APIs stable | `source.config.ts` + build |
| Security | No secrets in content; no tenant data | code review + `.env.example` only |
| Maintainability | typecheck + vitest green | `typecheck`, `test:run` |
| Reliability | Build graph generation deterministic | `build-graph.test.ts` |
| Usability | Editorial palette consistent | `docs-theme.test.ts` |
| Documentation | Support deploy doc + matrix aligned | `fumadocs-docs-app-deploy.md` |

## §SoD evidence

| Governed mutation | Approver ≠ initiator | Evidence path |
| --- | --- | --- |
| Docs content publish | N/A — static site build | — |
| Domain mutations (general) | waived — Phase 9 gate | [`phase-9-accounting-readiness-sign-off.md`](../../architecture/phase-9-accounting-readiness-sign-off.md) |

## Depends on

- [`fdr-status-index.md`](../fdr-status-index.md) row **fdr-005-docs-app**
- [`package-registry.md`](../../architecture/package-registry.md) **PKG-005**
- Registry: `PKG005_DOCS` (foundation-disposition.registry.ts)
- Support: [`fumadocs-docs-app-deploy.md`](../support/fumadocs-docs-app-deploy.md)
- Archive evidence: tip-032

## Deliverables

| File | Package | New / Modified |
| --- | --- | --- |
| `docs/delivery/FDR/[status] fdr-005-docs-app.md` | — | Modified per slice |
| `apps/docs/content/docs/**` | `@afenda/docs` | Modified (Implementation slices only) |
| `apps/docs/src/components/blocks/**` | `@afenda/docs` | Modified (Implementation slices only) |
| `apps/docs/src/lib/*.ts` | `@afenda/docs` | Modified (Implementation slices only) |
| `apps/docs/vercel.json` | `@afenda/docs` | Modified (Implementation slices only) |

## Acceptance gate

- `pnpm quality:docs`
- `pnpm --filter @afenda/docs typecheck`
- `pnpm --filter @afenda/docs test:run`
- `pnpm check:documentation-drift`
- `pnpm check:foundation-disposition`

## Acceptance criteria

```gherkin
Feature: Afenda docs application (Fumadocs)

  Scenario: Docs site builds successfully for CI
    GIVEN MDX content under apps/docs/content/docs
    AND Fumadocs source config at apps/docs/source.config.ts
    WHEN pnpm quality:docs runs the @afenda/docs build
    THEN the command exits 0
    AND static doc routes are generated

  Scenario: Seed documentation routes resolve
    GIVEN getting-started and monorepo-map MDX pages exist
    WHEN docs-routes.test.tsx exercises the doc router
    THEN each seed slug resolves without error
    AND page metadata matches docs-nav.contract.ts

  Scenario: Editorial blocks render without ERP runtime coupling
    GIVEN editorial block components in apps/docs/src/components/blocks
    WHEN docs-editorial-blocks.test.tsx renders representative blocks
    THEN blocks match docs-editorial-palette.contract.ts
    AND no import from apps/erp appears in the docs app source tree
```

## Definition of Done

| # | Criterion | Gate | Status |
| --- | --- | --- | --- |
| 1 | Runtime evidence at stated paths | file exists + matrix row | [x] |
| 2 | Tests pass | `pnpm --filter @afenda/docs test:run` | [x] |
| 3 | Boundaries | `pnpm quality:boundaries` | [x] |
| 4 | TypeScript strict | `pnpm --filter @afenda/docs typecheck` | [x] |
| 5 | Biome clean | `pnpm exec biome check apps/docs` | [x] |
| 6 | Registry aligned | `pnpm check:foundation-disposition` | [x] |
| 7 | Runtime matrix updated | matrix Docs row | [ ] |
| 8 | fdr-status-index updated | index row | [x] |
| 9 | Drift green | `pnpm check:documentation-drift` | [x] |
| 10 | §11 + enterprise attestation | afenda-coding-session §11 | [ ] |
| 11 | NFR baselines documented | §NFR section complete | [x] |
| 12 | Impact analysis complete | §Impact analysis table filled | [x] |
| 13 | Rollback plan present | §Rollback strategy filled | [x] |
| 14 | Peer review | PR approved by Architecture Authority member | [ ] |
| 15 | Clean Core level declared | metadata + §Clean Core aligned | [x] |
| 16 | No duplicated constants / parallel authority | docs contracts sole authority | [ ] |
| 17 | Security negative path tested | no ERP import scan in docs app | [ ] |
| 18 | Public API compatibility verified | MDX content semver policy | [ ] |
| 19 | E2E requirement satisfied or waived | §Waivers (`docs-live-dns`) | [x] |
| 20 | Enterprise readiness score updated | §Enterprise readiness score | [x] |

## Slices

### Slice 1 — Research (docs-app)

**Status:** Complete (2026-06-25)  
**Prerequisite:** —  
**Type:** Research  
**Risk class:** Low  
**Clean Core impact:** A→A

**Purpose:** Reconcile tip-032 + matrix **implemented** with FDR **Not started**; attest gates; document `docs-live-dns` operator gap.

**Outcomes:** Closed gaps `docs-app-matrix-fdr-drift`; baseline gate log Grade A; status → **Partially Implemented**.

### Slice 2 — Registry-sync (PKG005_DOCS)

**Status:** Delivered (2026-06-25)  
**Prerequisite:** Slice 1 Complete ✓  
**Type:** Registry-sync  
**Risk class:** Low  
**Clean Core impact:** A→A

**Outcomes:** `PKG005_DOCS` onboarded in `foundation-disposition.registry.ts` (fingerprint v6); `foundation-disposition.md` synced; gap `fdr-005-registry-entry` closed; DoD #6 `[x]`; waiver `docs-app-registry-pending` closed; §Enterprise readiness recalculated to **26/30 audit-adjusted**.

#### Design (internal-guide)

Onboard `PKG005_DOCS` via `foundation-registry-owner` only. Entry must match proposed §Registry link: `blue-lane`, `runtimeOwner: apps/docs`, gates from §Acceptance gate, prohibited `do-not-couple-erp-runtime` / `do-not-import-tenant-resolvers` / `do-not-embed-secrets-in-mdx`, `allowedAgents: docs-app-agent` + `foundation-registry-owner`. Evidence array cites §Runtime evidence paths including `pnpm quality:docs`. Bump fingerprint; sync `foundation-disposition.md`. No `apps/docs/` source edits.

#### Handoff block

```
Handoff from: docs/delivery/FDR/[Partially Implemented] fdr-005-docs-app.md

1. Objective    — Create PKG005_DOCS foundation-disposition registry entry with gates, prohibited rules, evidence paths, and allowedAgents; sync foundation-disposition.md; close waiver docs-app-registry-pending and unblock DoD #6.
2. Allowed layer— packages/architecture-authority/src/data/; docs/architecture/foundation-disposition.md; docs/delivery/FDR/
3. Files        —
   packages/architecture-authority/src/data/foundation-disposition.registry.ts
   docs/architecture/foundation-disposition.md
   docs/delivery/FDR/[Partially Implemented] fdr-005-docs-app.md
4. Prohibited   — apps/docs/ source edits; apps/erp/ source edits; foundation-disposition.registry.ts edits by non-foundation-registry-owner agents; @afenda/accounting runtime (ADR-0010); do-not-create-accounting-package
5. Authority    — ADR-0014 · ADR-0016 · proposed §Registry link in fdr-005-docs-app
6. Gates        —
   pnpm --filter @afenda/architecture-authority typecheck
   pnpm --filter @afenda/architecture-authority test:run
   pnpm check:foundation-disposition
   pnpm quality:architecture
   pnpm check:documentation-drift
7. Closes       — Gap `fdr-005-registry-entry`; DoD #6; waiver `docs-app-registry-pending`
8. Evidence     —
   packages/architecture-authority/src/data/foundation-disposition.registry.ts
   apps/docs/src/app/docs/[[...slug]]/page.tsx
   apps/docs/src/lib/docs-nav.contract.ts
   apps/docs/src/lib/docs-editorial-palette.contract.ts
   apps/docs/vercel.json
   apps/docs/src/__tests__/docs-routes.test.tsx
9. Attestation  — Documentation (registry + disposition view sync); Maintainability (disposition check exit 0)
```

**Implementer:** `foundation-registry-owner` — not `fdr-slice-implementer`.

#### DoD rows this slice closes

| # | Criterion | Gate |
| --- | --- | --- |
| 6 | Registry aligned | `pnpm check:foundation-disposition` |

#### Known debt

- Gap `docs-live-dns` — operator step; waived per §Waivers
- DoD #14 deferred to Slice 4 Evidence-sync

### Slice 3 — Implementation (external beta prep + security scans)

**Status:** Not started  
**Prerequisite:** Slice 2 Complete  
**Type:** Implementation  
**Risk class:** Low  
**Clean Core impact:** A→A

#### Design (internal-guide)

Close open DoD rows #16, #17, #18 in `apps/docs` only. Add no-ERP-coupling filesystem scan, docs contract sole-authority test, and external-beta seed MDX page aligned with `docs-nav.contract.ts`. Target external developer beta readiness path (24/30). No ERP imports; no tenant resolvers.

#### Handoff block

```
Handoff from: docs/delivery/FDR/[Partially Implemented] fdr-005-docs-app.md

1. Objective    — Close DoD security and contract-authority rows; add external-beta MDX seed content and no-ERP-coupling scan in @afenda/docs after PKG005_DOCS registry lands.
2. Allowed layer— apps/docs/
3. Files        —
   apps/docs/src/__tests__/no-erp-runtime-coupling.test.ts
   apps/docs/src/__tests__/docs-contract-authority.test.ts
   apps/docs/content/docs/getting-started/external-beta.mdx
   apps/docs/content/docs/getting-started/meta.json
   apps/docs/src/lib/docs-nav.contract.ts
   apps/docs/src/__tests__/docs-page.test.ts
   docs/delivery/FDR/[Partially Implemented] fdr-005-docs-app.md
4. Prohibited   — foundation-disposition.registry.ts (foundation-registry-owner only); apps/erp/; packages/; @afenda/accounting runtime (ADR-0010); do-not-couple-erp-runtime; do-not-import-tenant-resolvers; do-not-embed-secrets-in-mdx; do-not-create-accounting-package
5. Authority    — ADR-0014 · PKG005_DOCS · docs-nav.contract.ts · docs-editorial-palette.contract.ts
6. Gates        —
   pnpm quality:docs
   pnpm --filter @afenda/docs typecheck
   pnpm --filter @afenda/docs test:run
   pnpm exec biome check apps/docs
   pnpm check:foundation-disposition
   pnpm check:documentation-drift
7. Closes       — DoD #16; DoD #17; DoD #18; DoD #7 (matrix Docs row cited); DoD #10; Gap `docs-app-complete-status` (partial — peer review deferred)
8. Evidence     —
   apps/docs/src/__tests__/no-erp-runtime-coupling.test.ts
   apps/docs/src/__tests__/docs-contract-authority.test.ts
   apps/docs/content/docs/getting-started/external-beta.mdx
   apps/docs/src/lib/docs-nav.contract.ts
9. Attestation  — Security (no ERP import scan); Test coverage (+3 test files); Documentation (external beta seed content)
```

#### DoD rows this slice closes

| # | Criterion | Gate |
| --- | --- | --- |
| 16 | No duplicated constants / parallel authority | `docs-contract-authority.test.ts` |
| 17 | Security negative path tested | `no-erp-runtime-coupling.test.ts` |
| 18 | Public API compatibility verified | `docs-contract-authority.test.ts` |
| 7 | Runtime matrix updated | matrix Docs row cited in alignment test |
| 10 | §11 + enterprise attestation | afenda-coding-session §11 in slice delivery |

#### Known debt

- Gap `docs-live-dns` — operator waiver remains
- DoD #14 deferred to Slice 4 Evidence-sync

### Slice 4 — Evidence-sync (Complete — enterprise 9.5 candidate)

**Status:** Not started  
**Prerequisite:** Slice 3 Complete  
**Type:** Evidence-sync  
**Risk class:** Low  
**Clean Core impact:** A→A

#### Design (internal-guide)

Record Architecture Authority peer review; recalculate readiness to 26/30 ceiling; sync matrix and index; promote to **Complete** with waivers reconfirmed (`docs-live-dns`, `docs-app-observability`).

#### Handoff block

```
Handoff from: docs/delivery/FDR/[Complete] fdr-005-docs-app.md

1. Objective    — Close DoD #14; promote fdr-005-docs-app to Complete at 26/30 evidence-qualified ceiling; sync matrix and index.
2. Allowed layer— docs-only
3. Files        —
   docs/delivery/FDR/[Complete] fdr-005-docs-app.md
   docs/delivery/fdr-status-index.md
   docs/architecture/afenda-runtime-truth-matrix.md
4. Prohibited   — packages/; apps/; foundation-disposition.registry.ts
5. Authority    — Architecture Authority peer review attestation · ADR-0016 · ENTERPRISE-BENCHMARK §3.2
6. Gates        —
   pnpm quality:docs
   pnpm --filter @afenda/docs typecheck
   pnpm --filter @afenda/docs test:run
   pnpm check:documentation-drift
   pnpm check:foundation-disposition
7. Closes       — Gap `docs-app-complete-status`; DoD #14; DoD #8 (index rename); final §Enterprise readiness score
8. Evidence     — §Peer review attestation block in FDR; final gate log in Slice 4 outcomes
9. Attestation  — Documentation 5/5; Enterprise readiness 26/30 accepted
```

#### DoD rows this slice closes

| # | Criterion | Gate |
| --- | --- | --- |
| 14 | Peer review | Architecture Authority PR approval |
| 8 | fdr-status-index updated | index row status prefix |

#### Known debt

- Waiver `docs-live-dns` — reconfirmed at promotion until external beta go-live
- Waiver `docs-app-observability` — reconfirmed at promotion

## §Rollback strategy

| Slice | Rollback procedure | Upgrade path |
| --- | --- | --- |
| Research | Revert FDR doc commit | Safe — no runtime change |
| Registry-sync | Revert registry via `foundation-registry-owner` | Re-run disposition check |
| Implementation | Revert apps/docs commit; redeploy previous Vercel build | Quarterly-release-safe |

## §Waivers

| Waiver ID | Requirement waived | Reason | Approver | Expiry / revisit |
| --- | --- | --- | --- | --- |
| `docs-app-observability` | Audit events on static doc reads | Public documentation site — no governed mutations | Architecture Authority | Phase 9 |
| `docs-live-dns` | DoD #19 live URL E2E | DNS is Vercel dashboard operator step — code + vercel.json complete | Architecture Authority | External developer beta go-live |

## §Knowledge transfer

### Operational runbook

- Local dev: `pnpm --filter @afenda/docs dev` (port 3001)
- Build: `pnpm quality:docs`
- Content: `apps/docs/content/docs/` — update MDX + `meta.json`
- Deploy: [`fumadocs-docs-app-deploy.md`](../support/fumadocs-docs-app-deploy.md)

### Observability

- Build failures: CI `quality:docs` log
- No runtime audit — static site (waived)

### On-call escalation

- Symptom: build fails on MDX → check `source.config.ts` and `pnpm generate:source`
- Symptom: route 404 → run `docs-routes.test.tsx`
- Owner: Application Authority / pending `docs-app-agent`

## §Matrix–FDR drift

| Matrix row | Matrix status | FDR status (pre-audit) | FDR status (post-audit) | Gap nature | Required action |
| --- | --- | --- | --- | --- | --- |
| Docs application (`@afenda/docs`) | **implemented** | Not started | **Partially Implemented** | FDR delivery lag — runtime ahead of delivery authority | Slice 3 Implementation; Evidence-sync for Complete |

**Verdict:** Matrix **implemented** vs FDR **Partially Implemented** is expected per ADR-0016 until registry row + DoD closeout.

## §Enterprise benchmark qualification

This FDR is **enterprise 9.5 candidate at 26/30 audit-adjusted**, not final **Complete — enterprise 9.5 accepted**, because external beta content (Slice 3) and DoD #14 peer review remain open.

**Promotion to Complete requires:** Slice 3 content for external beta (24/30 path), Architecture Authority peer review.

## Verdict

**Partially Implemented — enterprise 9.5 candidate at 26/30 audit-adjusted, pending Slice 3 external beta content and Architecture Authority peer review (DoD #14).**

Research Slice 1 attested `quality:docs`, typecheck, and 50 tests exit 0 (2026-06-25). Registry-sync Slice 2 delivered `PKG005_DOCS` (2026-06-25). Operator gap `docs-live-dns` remains for production URL.
