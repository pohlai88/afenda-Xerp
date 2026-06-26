# fdr-033-published-docs-ia — Published Docs IA and Tenant Operations Catalog

| Field | Value |
| --- | --- |
| **Status** | **Complete — enterprise 9.5 accepted with non-code waivers (2026-06-26)** |
| **FDR ID** | `fdr-033-published-docs-ia` |
| **Registry entry ID** | `PKG005_DOCS` |
| **Package** | `@afenda/docs` (PKG-005) |
| **Lane** | blue-lane |
| **Clean Core level** | A |
| **Change class** | Extension |
| **Risk class** | Low |
| **BRD reference** | ARCH-DOCS-002 — operator-facing published documentation |
| **Enterprise readiness** | **29/30 — enterprise 9.5 accepted with non-code waivers** (DoD #19 peer review closed 2026-06-26; §Waivers reconfirmed) |
| **Paired ARCH** | [ARCH-DOCS-002](../ARCH/%5BComplete%5D%20ARCH-DOCS-002-published-docs-ia.md) |
| **Index** | [`fdr-status-index.md`](../fdr-status-index.md) |

## §Registry link

| Field | Value |
| --- | --- |
| id | `PKG005_DOCS` |
| packageId | PKG-005 |
| domain | `docs-app` |
| lane | blue-lane |
| runtimeOwner | `apps/docs` |
| gates | `pnpm quality:docs`; `pnpm --filter @afenda/docs typecheck`; `pnpm --filter @afenda/docs test:run`; `pnpm check:docs-catalog-drift`; `pnpm sync:product-docs` |
| prohibited | `do-not-couple-erp-runtime`; `do-not-import-tenant-resolvers`; `do-not-embed-secrets-in-mdx`; `do-not-create-accounting-package` |
| allowedAgents | `docs-app-agent`; `foundation-registry-owner` |

## Purpose

Extend `@afenda/docs` from engineer-only onboarding (ARCH-DOCS-001) to **reader-based operator documentation** with hybrid auto-generation: JSON catalog snapshots exported from canonical registries, human task prose, and generated reference MDX — without ERP runtime coupling.

Authority: [ADR-0014](../../adr/ADR-0014-foundation-disposition-registry.md) · [ADR-0016](../../adr/ADR-0016-fdr-delivery-authority.md) · [ARCH-DOCS-002](../ARCH/%5BComplete%5D%20ARCH-DOCS-002-published-docs-ia.md).

## Scope

**In scope (Slice 1)**

- Reader IA: `use-erp`, `configure-tenant`, `operate-tenant`, `integrate`, `build-afenda`
- `scripts/docs/export-*-catalog.mts` → `apps/docs/data/*.json`
- `generate-reference-pages.mts` + `sync:product-docs` + `check:docs-catalog-drift`
- Five English task articles with `audience` / `catalogBindings` frontmatter
- OpenAPI relocation to `integrate/internal-v1`
- Legacy URL redirects in `next.config.ts`

**Out of scope (P2 — separate approval)**

- Localized task body (vi, ms, id, th, fil, zh)
- Full ERP module catalog articles
- CMS / AsyncAPI

## Deliverables

| ID | Path | Slice |
| --- | --- | --- |
| D1 | `scripts/docs/export-*-catalog.mts` | 1 |
| D2 | `apps/docs/data/*.catalog.json` | 1 |
| D3 | `apps/docs/scripts/generate-reference-pages.mts` | 1 |
| D4 | `apps/docs/content/docs/en/{use-erp,configure-tenant,operate-tenant,integrate,build-afenda}/**` | 1 |
| D5 | `apps/docs/next.config.ts` redirects | 1 |
| D6 | Localized task articles | 2 |
| D7 | Runtime matrix evidence-sync | 3 |

## §Remaining gaps

| Gap ID | Description | Bucket | Status |
| --- | --- | --- | --- |
| docs-ia-l10n-tasks | Localized task article body (full translation) | P2 | **Deferred** — English scaffold + generated refs satisfy IA contract; editorial translation backlog |
| docs-ia-module-catalog | Module catalog pages from entitlement manifest | P2 | **Closed 2026-06-26** — auto-generated `integrate/modules/*` stubs + tabular reference |
| docs-ia-guides-sunset-en | Remove duplicate `en/(guides)/` tree | P1 | **Closed 2026-06-26** — legacy URLs served by `next.config.ts` permanent redirects |
| docs-ia-quality-docs-build | Full SSG build attestation (`pnpm quality:docs`) | P1 | **Closed 2026-06-26** — see §Gate evidence (post-gap closure) |
| docs-ia-matrix-sync | Runtime matrix row for reader IA | P1 | **Closed 2026-06-26** (Slice 3) |
| docs-ia-complete-status | FDR + ARCH Complete promotion | P1 | **Closed 2026-06-26** (Slice 3 DoD #19–#20) |

## §Enterprise readiness score

| Dimension | Score | Evidence |
| --- | ---: | --- |
| Contract stability | 5/5 | `docs-product-catalog.contract.ts` + multi-locale scaffold |
| Test coverage | 5/5 | 234 tests · module stubs · guides sunset · Zod catalog boundary |
| Observability + audit | 4/5 | ARCH-DOCS-001 waiver |
| Security + RBAC + RLS | 5/5 | no-erp-runtime-coupling |
| Documentation + BRD traceability | 5/5 | ARCH-DOCS-002 + FDR-033 + matrix row |
| Maintainability + Clean Core | 5/5 | JSON export pipeline · Clean Core A |
| **Total** | **29/30** | **Complete — enterprise 9.5 accepted with non-code waivers** (Slice 3 + post-gap closure) |

## Definition of Done (20 rows)

| # | Criterion | Slice 1 |
| --- | --- | --- |
| 1 | FDR registered in fdr-status-index | ✓ |
| 2 | ARCH-DOCS-002 paired | ✓ |
| 3 | Catalog export scripts | ✓ |
| 4 | JSON snapshots committed | ✓ |
| 5 | sync:product-docs | ✓ |
| 6 | check:docs-catalog-drift | ✓ |
| 7 | Five reader sections (en) | ✓ |
| 8 | Five task articles | ✓ |
| 9 | Generated reference MDX | ✓ |
| 10 | OpenAPI under integrate | ✓ |
| 11 | Legacy redirects | ✓ |
| 12 | source.config task schema | ✓ |
| 13 | No ERP runtime imports | ✓ |
| 14 | quality:docs exit 0 | ✓ |
| 15 | lint:links 0 errors | ✓ |
| 16 | Non-en reader IA scaffold (English body) | ✓ |
| 17 | Runtime matrix sync | ✓ |
| 18 | Enterprise score ≥ 29/30 | ✓ |
| 19 | DoD #19 peer review | ✓ |
| 20 | ARCH status Complete | ✓ |

---

### Slice 1 — IA, catalog export, task articles, redirects

**Status:** Delivered (2026-06-26)  
**Prerequisite:** ARCH-DOCS-001 Complete · ARCH-API-002 OpenAPI pipeline  
**Type:** Implementation  
**Risk class:** Low  
**Clean Core impact:** A→A

#### Design

English reader IA with JSON catalog export from auth paths, system-admin sections, permissions, env names, and module manifest. Generated MDX reference blocks embedded in task articles. OpenAPI moved to `integrate/internal-v1`. English-only reader IA SSG; OpenAPI remains all locales.

#### Handoff block

```
Handoff from: docs/delivery/FDR/[Complete] fdr-033-published-docs-ia.md

1. Objective    — Deliver reader-based English IA, JSON catalog exports, generate-reference-pages.mts, five task articles, OpenAPI under integrate/internal-v1, legacy redirects, and drift/coupling tests.
2. Allowed layer— apps/docs/** and scripts/docs/**
3. Files        — see ARCH-DOCS-002 slice-01 handoff §3 Files
4. Prohibited   — packages/ui/** · apps/erp runtime imports · registry edits · hand-edited generated MDX
5. Authority    — ARCH-DOCS-002 · PKG005_DOCS · ARCH-API-002
6. Gates        — pnpm sync:product-docs · pnpm check:docs-catalog-drift · pnpm --filter @afenda/docs typecheck · pnpm --filter @afenda/docs test:run · pnpm quality:docs
7. Closes       — docs-ia-* P0 gaps · ARCH-DOCS-002 DoD 4–15
8. Evidence     — apps/docs/data/*.json · en/use-erp/sign-in.mdx · integrate/internal-v1 · next.config.ts redirects
9. Attestation  — Contract · TypeScript · Boundary · Test · Documentation
```

#### DoD rows this slice closes

| # | Criterion | Gate |
| --- | --- | --- |
| 3–15 | See §Definition of Done rows 3–15 | `pnpm quality:docs` |

#### Known debt

- Localized task prose translation — P2 editorial (English scaffold delivered Slice 2)
- DoD #20 peer review — Slice 3 Evidence-sync

---

### Slice 2 — Reader IA locale scaffold

**Status:** Delivered (2026-06-26)  
**Prerequisite:** Slice 1 ✓  
**Type:** Implementation  
**Risk class:** Low  
**Clean Core impact:** A→A

#### Design

Scaffold `use-erp`, `configure-tenant`, `operate-tenant` for zh/vi/ms/id/th/fil from English canonical content. Generate catalog reference MDX for all `docsLocales`. Restrict `isEnglishOnlyDocsSlug` to `build-afenda` only so non-en reader pages SSG.

#### DoD rows this slice closes

| # | Criterion | Gate |
| --- | --- | --- |
| 16 | Non-en reader IA navigable | `docs-reader-ia-locales.test.ts` |
| — | `docs-ia-matrix-sync` partial | runtime matrix row updated |

#### Known debt

- Full translated task prose — P2 · separate editorial approval
- DoD #19 peer review — closed Slice 3

---

### Slice 3 — Evidence-sync + Complete promotion

**Status:** **Complete — enterprise 9.5 accepted (2026-06-26)**  
**Prerequisite:** Slice 2 ✓  
**Type:** Evidence-sync  
**Risk class:** Low  
**Clean Core impact:** A→A

#### Design

Record Architecture Authority peer review (ARCH-DOCS-002 DoD #20); reconfirm §Waivers inherited from fdr-005; promote fdr-033 and ARCH-DOCS-002 to **Complete — enterprise 9.5 accepted** at 29/30; sync runtime matrix and indexes.

#### Outcomes (2026-06-26)

- DoD #19–#20 closed — Architecture Authority attestation (catalog pipeline + reader IA Slices 1–2).
- Gap `docs-ia-complete-status` closed.
- FDR prefix promoted to `[Complete]`; ARCH-DOCS-002 promoted to `[Complete]`.
- Enterprise readiness **29/30 — enterprise 9.5 accepted** (observability waiver caps at 4/5).

#### Gate evidence (Slice 3 — 2026-06-26)

```text
pnpm check:docs-catalog-drift                 exit 0
pnpm --filter @afenda/docs typecheck            exit 0
pnpm --filter @afenda/docs test:run             exit 0 — 32 files · 230/230 tests
pnpm check:documentation-drift                exit 0
```

#### Gate evidence (post-gap closure — 2026-06-26)

```text
pnpm sync:product-docs                          exit 0 — module stub pages all locales
pnpm --filter @afenda/docs test:run             exit 0 — 33 files · 234/234 tests
pnpm quality:docs                               exit 0 — 879 SSG routes (Next.js 16.2.9)
pnpm check:docs-catalog-drift                 exit 0
```

#### DoD rows this slice closes

| # | Criterion | Gate |
| --- | --- | --- |
| 17–20 | Runtime matrix · score · peer review · ARCH Complete | `check:documentation-drift` |

## §Waivers

| Waiver ID | Requirement waived | Reason | Approver | Expiry / revisit |
| --- | --- | --- | --- | --- |
| `docs-app-observability` | Audit events on static doc reads | Public documentation site — inherited from fdr-005 | Architecture Authority | Phase 9 |
| `docs-live-dns` | Live URL E2E | DNS operator step — inherited from fdr-005 | Architecture Authority | External beta go-live |
| `docs-css-highlight-warning` | PostCSS/Turbopack `::highlight` pseudo-element warning | Non-blocking; `pnpm quality:docs` exit 0 on Next.js 16.2.9 | Architecture Authority | Watch — browser API evolution |

## §Peer review attestation

| Field | Value |
| --- | --- |
| **Decision** | Approved |
| **Date** | 2026-06-26 |
| **Reviewer** | Architecture Authority |
| **Scope** | ARCH-DOCS-002 Slices 1–3; fdr-033; catalog export pipeline; reader IA; PKG005_DOCS boundaries |
| **Finding** | 234 vitest tests pass; catalog drift gate exit 0; `pnpm quality:docs` exit 0 (879 SSG routes); no ERP runtime imports; serializable catalog contracts. |
| **Boundary** | Acceptable — `apps/docs` + `scripts/docs` only; no `@afenda/erp` runtime imports. |
| **Gate evidence** | Slice 3 gate log above |
| **ARCH DoD #20** | `[x]` |
| **Waivers reconfirmed** | `docs-live-dns` · `docs-app-observability` |

```text
DoD #20 peer review — ARCH-DOCS-002
Reviewer: Architecture Authority
Date: 2026-06-26
PR: —
Result: Approved
Notes: Paired with fdr-033 Complete promotion. P2 full task translation remains editorial backlog.
```

## §Matrix–FDR drift

| Matrix row | Matrix status | FDR status (post-audit) | Gap nature | Required action |
| --- | --- | --- | --- | --- |
| Docs application (`@afenda/docs`) | **implemented** | **Complete — enterprise 9.5 accepted with non-code waivers** | Closed — engineering delivery | Operator `docs-live-dns`; P2 editorial translation only |

## Final acceptance evidence

| Gate | Result |
| --- | --- |
| `pnpm sync:product-docs` | exit 0 |
| `pnpm --filter @afenda/docs test:run` | 234/234 |
| `pnpm quality:docs` | exit 0 — 879 SSG routes |
| Next.js build | Passed on Next.js 16.2.9 |
| Known code gaps | None |
| Known non-code gaps | `docs-live-dns`, `docs-ia-l10n-tasks`, CSS `::highlight` warning |

**Accepted with non-code waivers:**

- `docs-live-dns` inherited from fdr-005
- `docs-ia-l10n-tasks` deferred as P2 editorial translation backlog
- CSS `::highlight` warning non-blocking; `pnpm quality:docs` exit 0

## Verdict

**Complete — enterprise 9.5 accepted with non-code waivers at 29/30 (2026-06-26).** Engineering delivery is closed. Do not reopen implementation unless a new runtime failure appears.
