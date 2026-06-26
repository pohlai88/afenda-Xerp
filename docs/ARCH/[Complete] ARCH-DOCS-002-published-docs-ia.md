# ARCH-DOCS-002 — Published Docs IA and Tenant Operations Catalog

> Architecture authority for **reader-based published documentation** in `@afenda/docs` — task articles, hybrid catalog auto-generation, and legacy URL compatibility.  
> Extends **ARCH-DOCS-001** (engineer `/docs/apps/**` onboarding); does not replace it.  
> Template: [`ARCH-TEMPLATE.md`](ARCH-TEMPLATE.md) · Index: [`arch-status-index.md`](arch-status-index.md)

| Field | Value |
| --- | --- |
| **Document ID** | ARCH-DOCS-002 |
| **Work ID** | ARCH-DOCS-002 · PKG-005 · `fdr-033-published-docs-ia` (paired FDR) |
| **Title** | Published Docs IA and Tenant Operations Catalog |
| **Status** | **Complete — enterprise 9.5 accepted with non-code waivers (2026-06-26)** |
| **Date** | 2026-06-26 |
| **Owner** | Application Authority (`apps/docs` content + scripts) |
| **Package** | PKG-005 · `@afenda/docs` |
| **Registry entry ID** | PKG005_DOCS |
| **Runtime owner** | `apps/docs/content/docs/**` · `apps/docs/scripts/**` · `scripts/docs/**` |
| **Lane** | blue-lane |
| **Risk class** | Low |
| **Change class** | Extension + Governance |
| **Clean Core target** | A |
| **Enterprise score target** | 29/30 |

> **Scope:** Reader-based IA (Use ERP · Configure Tenant · Operate Tenant · Integrate · Build Afenda), five canonical English task articles (Slice 1), JSON catalog export pipeline, generated reference MDX blocks, legacy redirects.  
> **Not in scope:** Verbatim ARCH/FDR tables in MDX · ERP runtime imports in docs app · non-English task body (P2 Slice 2+) · full ERP feature catalog (P3).

**One-sentence architecture:** Published docs serve **all operator audiences** through task-based navigation backed by **JSON catalog snapshots** exported from canonical registries — human task prose plus machine-synced reference blocks, with **no `@afenda/erp` runtime coupling** in the docs app.

---

## 1. Execution instruction

Execute one bounded slice under ARCH-DOCS-002. Every completion claim maps to **file path**, **test path**, **command exit code**, or **explicit waiver**. No prose-only “done”.

Skills: [`write-arch-slice`](../../.cursor/skills/write-arch-slice/SKILL.md) · [`afenda-coding-session`](../../.cursor/skills/afenda-coding-session/SKILL.md) · [`afenda-fumadocs`](../../.cursor/skills/afenda-fumadocs/SKILL.md).

```text
/afenda-coding-session
Execute ARCH-DOCS-002 Slice 1 from docs/ARCH/slices/ARCH-DOCS-002/slice-01-ia-catalog-task-articles.md
Gates: pnpm --filter @afenda/docs typecheck && pnpm --filter @afenda/docs test:run && pnpm check:docs-catalog-drift && pnpm quality:docs
```

---

## 2. Target item

| Field | Value |
| --- | --- |
| Work ID | ARCH-DOCS-002 · [`fdr-033-published-docs-ia`](../delivery/FDR/%5BNot%20started%5D%20fdr-033-published-docs-ia.md) |
| Status | Not started |
| Package | `@afenda/docs` (PKG-005) |
| Registry entry ID | PKG005_DOCS |
| Runtime owner | `apps/docs/` · `scripts/docs/` |
| Lane | blue-lane |
| Clean Core | A |
| Enterprise score target | 29/30 |

### Boundary vs ARCH-DOCS-001

| Concern | ARCH-DOCS-001 | ARCH-DOCS-002 |
| --- | --- | --- |
| Primary audience | Engineers onboarding to monorepo apps | All operators: users, admins, DevOps, integrators |
| Nav model | `/docs/apps/**` + `(guides)/` engineer paths | Reader sections: use-erp · configure-tenant · operate-tenant · integrate · build-afenda |
| Auto-sync | OpenAPI internal v1 only | Auth routes · admin sections · permissions · env · modules + OpenAPI |
| Content rule | Summarize + link authority | Task articles + generated reference blocks |

---

## 3. Authority chain

Read in this order before touching code:

```text
1. docs/ARCH/arch-status-index.md
2. docs/ARCH/[Complete] ARCH-DOCS-001-fumadocs-site.md
3. docs/ARCH/ARCH-API-002-openapi-internal-v1-catalog.md
4. docs/delivery/fdr-status-index.md
5. docs/delivery/FDR/[Complete] fdr-033-published-docs-ia.md
6. packages/architecture-authority/src/data/foundation-disposition.registry.ts — PKG005_DOCS
7. docs/architecture/afenda-runtime-truth-matrix.md
8. docs/architecture/monorepo-feature-inventory.md (link target only — not duplicated)
```

---

## 4. Problem statement

## Current risk / gap

Published Fumadocs content is **engineer-centric** (`getting-started`, `monorepo-map`, `apps/**`) and **does not reflect tenant operator reality**. Only OpenAPI (10 internal v1 routes) is machine-synced. Auth routes, system-admin sections, permissions, environment variables, and module entitlements are **authority-owned in ERP/packages** but **absent or stale** in published docs. Any MDX renders whether true or not — creating **trust and compliance risk** for tenant DevOps and integrators.

## Business / architecture impact

- Operators cannot rely on docs for sign-in, membership, RBAC, or env troubleshooting.
- Docs app must stay decoupled from ERP runtime — catalog export via JSON snapshots is mandatory.
- Legacy URLs (`/docs/getting-started`, `/docs/api-reference`) break when IA moves without redirects.

---

## 5. Architecture requirement

### §5.1 Ownership table

| Concern | Owner path | Consumer |
| --- | --- | --- |
| Reader IA + task MDX | `apps/docs/content/docs/en/**` | Fumadocs site |
| Catalog JSON snapshots | `apps/docs/data/*.json` | Generators + task articles |
| Export scripts | `scripts/docs/export-*-catalog.mts` | CI + `sync:product-docs` |
| Reference MDX generation | `apps/docs/scripts/generate-reference-pages.mts` | Prebuild |
| Nav contract | `apps/docs/src/lib/docs-nav.contract.ts` | Tests |
| Legacy redirects | `apps/docs/next.config.ts` | Next.js |
| Auth route authority | `apps/erp/src/lib/auth/auth-path.registry.ts` | Export only — no import |
| Admin section authority | `apps/erp/src/lib/system-admin/system-admin-sections.ts` | Export only |
| Permission authority | `packages/permissions/src/grants/permission.contract.ts` | Export only |
| OpenAPI authority | `apps/erp` export + ARCH-API-002 | Existing pipeline |

### §5.2 Boundary rules

1. **No ERP runtime imports** in `apps/docs/src/**` or MDX — enforced by `no-erp-runtime-coupling.test.ts`.
2. Catalog data flows **registry → JSON → generated MDX** — same pattern as OpenAPI.
3. Task articles are **human-authored prose**; reference tables are **generated** with do-not-edit headers.
4. ARCH-DOCS-001 `/docs/apps/**` and `(guides)/build-afenda/**` remain valid under restructured IA.
5. English task articles first; other locales keep existing scaffold until Slice 2+.

### §5.3 Prohibited actions

- Import `@afenda/erp`, tenant resolvers, or Supabase clients in docs app source
- Duplicate full ARCH/FDR/registry tables in MDX
- Hand-edit generated reference MDX under `**/generated/**`
- Create parallel auth route or permission registries in docs app
- Edit `packages/ui/**` for docs-only IA work
- Accounting runtime documentation beyond blocked callouts (ADR-0010)

### §5.4 Production classification (P0–P3)

| Capability | Bucket |
| --- | --- |
| Reader IA (5 sections) | **P0 — Production mandatory** |
| Catalog export + drift gate | **P0 — Production mandatory** |
| Five canonical English task articles | **P0 — Production mandatory** |
| Legacy URL redirects (en) | **P0 — Production mandatory** |
| OpenAPI under Integrate section | **P0 — Production mandatory** |
| Task frontmatter schema (`audience`, `catalogBindings`) | **P1 — Production hardening** |
| Localized task body (vi/ms/id/th/fil/zh) | **P2 — Excluded from current release** — Requires separate ARCH/FDR approval before implementation. No runtime code may be added under this capability in this work item. |
| Full ERP module catalog articles | **P2 — Excluded from current release** — Requires separate ARCH/FDR approval before implementation. No runtime code may be added under this capability in this work item. |
| CMS / AsyncAPI / OG social previews | **P3 — Enhancement backlog** |
| Public external OpenAPI v1 | **P3 — Enhancement backlog** (ARCH-API-001 P2) |

---

## 6. Required implementation scope

### §6.1 Reader information architecture

Top-level Fumadocs sections (English first):

| Section slug | Audience | Purpose |
| --- | --- | --- |
| `use-erp` | End users | Sign-in, workspace, daily ERP tasks |
| `configure-tenant` | Tenant admins | Users, memberships, roles, permissions |
| `operate-tenant` | Tenant DevOps | Environment, auth config, troubleshooting |
| `integrate` | Integrators | Internal API (OpenAPI), webhooks (P2) |
| `build-afenda` | Engineers | getting-started, monorepo-map, contributing, apps/** |

Legacy `(guides)/` paths redirect or relocate under `build-afenda/`.

### §6.2 Catalog export pipeline

```text
scripts/docs/export-auth-routes-catalog.mts      → apps/docs/data/auth-routes.catalog.json
scripts/docs/export-system-admin-catalog.mts     → apps/docs/data/system-admin.catalog.json
scripts/docs/export-permissions-catalog.mts      → apps/docs/data/permissions.catalog.json
scripts/docs/export-env-catalog.mts              → apps/docs/data/env.catalog.json
scripts/docs/export-modules-catalog.mts          → apps/docs/data/modules.catalog.json
```

Root script: `pnpm sync:product-docs` — runs all exports + `generate-reference-pages.mts`.  
Drift gate: `pnpm check:docs-catalog-drift`.

### §6.3 Hybrid task article model

Task MDX frontmatter (extends `source.config.ts`):

```yaml
audience: tenant-admin | tenant-devops | integrator | engineer
relatedRoutes: ["/sign-in", "/system-admin/users"]
catalogBindings: ["auth-routes", "system-admin"]
```

Body: human steps + `<GeneratedReference catalog="auth-routes" />` or include generated partial.

### §6.4 Slice 1 canonical articles (English)

| Path | Title |
| --- | --- |
| `/docs/use-erp/sign-in` | Sign in to Afenda ERP |
| `/docs/configure-tenant/users-and-memberships` | Users and memberships |
| `/docs/configure-tenant/roles-and-permissions` | Roles and permissions |
| `/docs/operate-tenant/environment-and-auth` | Environment and authentication |
| `/docs/operate-tenant/troubleshooting-login` | Troubleshooting login |

### §6.5 Legacy redirects (`next.config.ts`)

| Source | Destination |
| --- | --- |
| `/:lang/docs/getting-started` | `/:lang/docs/build-afenda/getting-started` |
| `/:lang/docs/monorepo-map` | `/:lang/docs/build-afenda/monorepo-map` |
| `/:lang/docs/contributing` | `/:lang/docs/build-afenda/contributing` |
| `/:lang/docs/apps/:path*` | `/:lang/docs/build-afenda/apps/:path*` |
| `/:lang/docs/api-reference` | `/:lang/docs/integrate/internal-v1` |
| `/:lang/docs/api-reference/:path*` | `/:lang/docs/integrate/internal-v1/:path*` |

### §6.6 OpenAPI relocation

`generate-openapi-docs.mts` output moves from `(guides)/api-reference` to `integrate/internal-v1` (en + all locales).

### §6.7 Security

- No secrets in catalog JSON or MDX
- Env catalog exports **names and descriptions only** — not values
- Generated content is static at build time

---

## 7. Enterprise acceptance criteria

```gherkin
Feature: Reader-based published docs IA

  Scenario: Operator finds sign-in guidance
    Given the English docs site is built
    When a reader navigates to /en/docs/use-erp/sign-in
    Then the page renders task steps and a generated auth-routes reference block
    And catalogBindings in frontmatter match exported JSON keys

  Scenario: Legacy engineer URL still resolves
    Given redirects are configured in next.config.ts
    When a reader requests /en/docs/getting-started
    Then they receive /en/docs/build-afenda/getting-started

  Scenario: Docs app stays decoupled from ERP runtime
    Given docs app source and content are scanned
    When no-erp-runtime-coupling tests run
    Then zero imports from @afenda/erp or apps/erp paths exist

  Scenario: Catalog drift is caught in CI
    Given registries change without re-export
    When pnpm check:docs-catalog-drift runs
    Then the command exits non-zero with a diff message

  Scenario: OpenAPI lives under Integrate
    Given generate-openapi-docs completes
    When reader opens /en/docs/integrate/internal-v1
    Then operation pages render via fumadocs-openapi
    And /en/docs/api-reference redirects to the new path
```

---

## 8. Enterprise quality benchmark

| Dimension | Target | Initial |
| --- | ---: | ---: |
| Contract stability | 5/5 | 5/5 |
| Test coverage | 5/5 | 5/5 |
| Observability + audit | 4/5 | 4/5 |
| Security + RBAC + RLS | 5/5 | 5/5 |
| Documentation + BRD traceability | 5/5 | 5/5 |
| Maintainability + Clean Core | 5/5 | 5/5 |
| **Total** | **29/30** | **29/30** |

---

## 9. Non-functional requirements

| NFR | Requirement |
| --- | --- |
| Suitability | Task paths cover user, admin, DevOps, integrator, engineer |
| Security | No ERP runtime coupling; no secret values in exports |
| Compatibility | Legacy URLs redirect 308/ permanent where supported |
| Reliability | `quality:docs` build succeeds after sync |
| Performance | Catalog export < 30s; no runtime DB in docs build |
| Maintainability | Single export pipeline; generated files marked do-not-edit |
| Portability | JSON catalogs are serializable and diffable |
| Usability | Fumadocs nav reflects reader sections |

---

## 10. Required gates

| Gate | Command |
| --- | --- |
| TypeScript | `pnpm --filter @afenda/docs typecheck` |
| Unit tests | `pnpm --filter @afenda/docs test:run` |
| Catalog drift | `pnpm check:docs-catalog-drift` |
| Docs build | `pnpm quality:docs` |
| Link lint | `pnpm --filter @afenda/docs lint:links` |
| Doc sync | `pnpm check:documentation-drift` |
| ERP coupling | Covered in `test:run` — `no-erp-runtime-coupling.test.ts` |

---

## 11. Definition of Done (20 rows)

| # | Criterion | Gate |
| --- | --- | --- |
| 1 | ARCH-DOCS-002 registered in arch-status-index | Manual | ✓ |
| 2 | fdr-033 registered in fdr-status-index | Manual | ✓ |
| 3 | Slice 1 handoff exists with 9 fields | Manual | ✓ |
| 4 | Five reader sections in en meta.json | `test:run` | ✓ |
| 5 | Five canonical task articles published | `test:run` | ✓ |
| 6 | Catalog export scripts exit 0 | `sync:product-docs` | ✓ |
| 7 | JSON snapshots in apps/docs/data/ | `check:docs-catalog-drift` | ✓ |
| 8 | generate-reference-pages produces MDX | `quality:docs` | ✓ |
| 9 | Legacy redirects configured | `test:run` | ✓ |
| 10 | OpenAPI under integrate/internal-v1 | `test:run` | ✓ |
| 11 | source.config.ts task schema extended | `typecheck` | ✓ |
| 12 | docs-nav.contract aligned with IA | `test:run` | ✓ |
| 13 | No @afenda/erp imports in docs app | `test:run` | ✓ |
| 14 | Generated MDX has do-not-edit header | `test:run` | ✓ |
| 15 | catalogBindings test passes | `test:run` | ✓ |
| 16 | ARCH-DOCS-001 apps/** still reachable | `test:run` | ✓ |
| 17 | Link lint 0 errors | `lint:links` | ✓ |
| 18 | quality:docs build exit 0 | `quality:docs` | ✓ |
| 19 | Runtime matrix row updated | `check:documentation-drift` | ✓ |
| 20 | Peer review / enterprise attestation | Manual | ✓ |

---

## 12. Impact analysis

| Consumer | Impact |
| --- | --- |
| `@afenda/docs` | Primary — content tree, scripts, tests |
| Docs readers | New task paths; legacy redirects |
| CI | New `sync:product-docs` + `check:docs-catalog-drift` |
| ARCH-DOCS-001 | Extended — apps/** moves under build-afenda |
| ARCH-API-002 | OpenAPI path change + redirects |

**Risk summary:** IA move breaks bookmarks — mitigated by redirects. Catalog export must stay decoupled — mitigated by JSON snapshot pattern. Scope creep into full ERP catalog — mitigated by P2 classification.

---

## 13. Waiver policy

| Waiver | Owner | Expiry |
| --- | --- | --- |
| Observability 4/5 (docs site) | Architecture | Reuse ARCH-DOCS-001 waiver |
| Localized task body deferred | Product | Until ARCH-DOCS-002 Slice 2 ARCH approval |

No waiver may hide broken P0 runtime.

---

## 14. Rollback strategy

| Change area | Rollback |
| --- | --- |
| Content tree | Restore en/ folder from git |
| Redirects | Remove next.config redirects block |
| Catalog JSON | Delete apps/docs/data/ + disable prebuild hook |
| OpenAPI path | Revert generate-openapi-docs outputDir |

**Preserve:** ARCH-DOCS-001 tests · OpenAPI spec · no ERP imports rule

---

## 15. Slice delivery notes

### Slice 1 — IA, catalog export, task articles (2026-06-26)

- English reader IA; five task articles; `sync:product-docs` + `check:docs-catalog-drift`; OpenAPI at `integrate/internal-v1`; legacy redirects.

### Slice 2 — Reader IA locale scaffold (2026-06-26)

- Scaffolded `use-erp` / `configure-tenant` / `operate-tenant` for zh/vi/ms/id/th/fil; multi-locale generated references; `isEnglishOnlyDocsSlug` limited to `build-afenda`.

### Slice 3 — Evidence-sync + peer review (2026-06-26)

- DoD #19–#20 closed; fdr-033 + ARCH-DOCS-002 promoted **Complete — 29/30 with non-code waivers**; gate log: 234 tests, catalog drift, documentation-drift exit 0.

### Post-Complete gap closure (2026-06-26)

- Removed duplicate `en/(guides)/` tree; permanent redirects unchanged.
- Auto-generated `integrate/modules/*` stub pages from `modules.catalog.json`.
- Zod catalog parse boundary; `pnpm quality:docs` build attestation (879 SSG routes).

---

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
- `docs-ia-l10n-tasks` deferred as P2 editorial translation backlog (English scaffold + generated localized reference pages satisfy IA/runtime contract)
- CSS `::highlight` warning non-blocking; `pnpm quality:docs` exit 0

**Engineering delivery:** Complete. Do not reopen unless a new runtime failure appears.

---

## 16. Implementation slices

| Slice | Title | Type | Status | Handoff |
| --- | --- | --- | --- | --- |
| 1 | IA, catalog export, task articles, redirects | Implementation | Delivered (2026-06-26) | [slice-01-ia-catalog-task-articles.md](slices/ARCH-DOCS-002/slice-01-ia-catalog-task-articles.md) |
| 2 | Reader IA locale scaffold | Implementation | Delivered (2026-06-26) | [slice-02-reader-ia-locale-scaffold.md](slices/ARCH-DOCS-002/slice-02-reader-ia-locale-scaffold.md) |
| 3 | Evidence-sync + peer review | Evidence-sync | Delivered (2026-06-26) | [slice-03-evidence-sync-peer-review.md](slices/ARCH-DOCS-002/slice-03-evidence-sync-peer-review.md) |

---

## 17. Promotion rule

Promote ARCH status from **Not started** → **Partially Implemented** when Slice 1 gates pass.  
Promote to **Complete** when all P0 rows in §11 are checked and enterprise score ≥ 29/30.

Allowed status labels: `Not started` · `Partially Implemented` · `Complete` · `Blocked`

---

## 18. Required output from IDE / agent

```md
## ARCH-DOCS-002 Slice N Completion

- Slice:
- Files changed: (table)
- Gates: (commands + exit codes)
- DoD rows closed: (numbers)
- Enterprise score delta:
- Known gaps:
```

---

## 19. Command to execute

```text
/afenda-coding-session
/afenda-governed-implementer
Handoff: docs/ARCH/slices/ARCH-DOCS-002/slice-01-ia-catalog-task-articles.md
FDR: docs/delivery/FDR/[Complete] fdr-033-published-docs-ia.md Slice 1
Gates: pnpm sync:product-docs && pnpm check:docs-catalog-drift && pnpm --filter @afenda/docs typecheck && pnpm --filter @afenda/docs test:run && pnpm quality:docs
```
