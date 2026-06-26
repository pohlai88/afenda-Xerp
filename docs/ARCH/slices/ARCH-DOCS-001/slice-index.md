# ARCH-DOCS-001 — Slice catalog

> **Parent:** [`[Complete] ARCH-DOCS-001-fumadocs-site.md`](../../%5BComplete%5D%20ARCH-DOCS-001-fumadocs-site.md)  
> **Paired FDR:** [`fdr-005-docs-app`](../../../delivery/FDR/%5BComplete%5D%20fdr-005-docs-app.md)  
> **Executor:** `afenda-governed-implementer` · one slice per session  
> **Handoff format:** 9-field (write-fdr-slice / ARCH Appendix A)

## Phase 1 — Applications book (Complete 2026-06-25)

| Slice | File | Title | Status | Runtime owner |
| ---: | --- | --- | --- | --- |
| 1 | _(inline §17)_ | Authority + Editorial Charter | Delivered 2026-06-25 | `docs/ARCH/` |
| 2 | _(inline §17)_ | Publication + Editorial 9.5 | Delivered 2026-06-25 | `apps/docs/` |
| 3 | _(inline §17)_ | Evidence-sync (fdr-005 Slice 3) | Delivered 2026-06-25 | `docs/` |
| 4 | [slice-04-typescript-governance.md](./slice-04-typescript-governance.md) | TypeScript governance + test dedup | Delivered 2026-06-25 | `apps/docs/src/` |
| 5 | [slice-05-dod20-peer-review-evidence.md](./slice-05-dod20-peer-review-evidence.md) | DoD #20 peer review evidence packet | Complete 2026-06-25 | `docs/` |

## Phase 2 — Fumadocs readiness upgrade (2026-06-25)

| Slice | File | Title | Status | Runtime owner |
| ---: | --- | --- | --- | --- |
| **6** | [slice-06-content-adoption.md](./slice-06-content-adoption.md) | GraphView + charter nav | **Delivered** 2026-06-25 | `apps/docs/content/` |
| **7** | [slice-07-reference-pages.md](./slice-07-reference-pages.md) | AutoTypeTable reference | **Delivered** 2026-06-25 | `apps/docs/content/monorepo-map/` |
| **8** | [slice-08-page-actions.md](./slice-08-page-actions.md) | GitHub · lastModified · copy | **Delivered** 2026-06-25 | `apps/docs/src/app/docs/` |
| **9** | [slice-09-sidebar-tabs.md](./slice-09-sidebar-tabs.md) | Applications sidebar tab | **Delivered** 2026-06-25 | `apps/docs/content/docs/apps/` |
| **10** | [slice-10-homelayout-frontmatter.md](./slice-10-homelayout-frontmatter.md) | HomeLayout + frontmatter | **Delivered** 2026-06-25 | `apps/docs/src/app/` |
| **11** | [slice-11-typescript-evidence-sync.md](./slice-11-typescript-evidence-sync.md) | TS cleanup + gap audit | **Delivered** 2026-06-25 | `apps/docs/src/` · `docs/` |
| **12** | [slice-12-mdx-adoption.md](./slice-12-mdx-adoption.md) | MDX adoption (Accordion · ImageZoom · InlineTOC) | **Delivered** 2026-06-25 | `apps/docs/content/` |

## Phase 3 — Search · Guides tab · evidence-sync (2026-06-25)

| Slice | File | Title | Status | Runtime owner |
| ---: | --- | --- | --- | --- |
| **13** | [slice-13-search-ux.md](./slice-13-search-ux.md) | Search empty-state quick links | **Delivered** 2026-06-25 | `apps/docs/src/` |
| **14** | [slice-14-guides-sidebar-tab.md](./slice-14-guides-sidebar-tab.md) | Guides + Applications sidebar tabs | **Delivered** 2026-06-25 | `apps/docs/content/docs/` |
| **15** | [slice-15-phase3-evidence-sync.md](./slice-15-phase3-evidence-sync.md) | Phase 3 gap audit + slice-index | **Delivered** 2026-06-25 | `docs/` |

## Phase 4 — UI translations · evidence-sync (2026-06-25)

| Slice | File | Title | Status | Runtime owner |
| ---: | --- | --- | --- | --- |
| **16** | [slice-16-ui-translations.md](./slice-16-ui-translations.md) | UI translations (singular) | **Delivered** 2026-06-25 | `apps/docs/src/` |
| **17** | [slice-17-multilingual-i18n.md](./slice-17-multilingual-i18n.md) | Full multilingual i18n (en+zh) | **Delivered** 2026-06-25 | `apps/docs/` |

## Phase 5 — OpenAPI · LLM · corpus · polish (2026-06-26)

| Slice | File | Title | Status | Runtime owner |
| ---: | --- | --- | --- | --- |
| **18** | [slice-18-openapi-reference.md](./slice-18-openapi-reference.md) | OpenAPI reference (ARCH-API-002) | **Delivered** 2026-06-26 | `apps/docs/` |
| **19** | [slice-19-llm-markdown-export.md](./slice-19-llm-markdown-export.md) | LLM markdown export | **Delivered** 2026-06-26 | `apps/docs/` |
| **20** | [slice-20-corpus-growth.md](./slice-20-corpus-growth.md) | zh body · AutoTypeTable corpus | **Delivered** 2026-06-26 | `apps/docs/content/` |
| **21** | [slice-21-nav-polish.md](./slice-21-nav-polish.md) | Icons · prev/next · draft filter | **Delivered** 2026-06-26 | `apps/docs/src/` |
| **22** | [slice-22-phase5-evidence-sync.md](./slice-22-phase5-evidence-sync.md) | Phase 5 evidence-sync · async deferral | **Delivered** 2026-06-26 | `docs/` |

## Orchestration sequence

```text
Phase 1 — Complete (DoD #20 closed 2026-06-25).
Phase 2 — Slices 6–11 delivered 2026-06-25 (sequential; shared runtimeOwner serialized per slice).
Slice 12 (C) — MDX adoption delivered 2026-06-25 (Accordion · ImageZoom · InlineTOC on long pages).
Phase 3 — Slices 13–15 delivered 2026-06-25 (search links · Guides tab · evidence-sync).
Slice 16 (2026-06-25) — UI translations (singular): defineTranslations + i18nProvider.
Slice 17 (2026-06-25) — Full multilingual i18n: defineI18n + middleware + app/[lang]/ + en/zh content dirs.
Phase 5 — Slice 18 delivered 2026-06-26 (OpenAPI). Slices 19–22 delivered 2026-06-26 (LLM · corpus · nav · evidence).
Slice 18 (2026-06-26) — OpenAPI reference: fumadocs-openapi loader + interactive operation pages + generate:openapi-docs.
Slice 19 (2026-06-26) — LLM export: includeProcessedMarkdown + llms.mdx route + markdownUrl + Accept negotiation.
Slice 20 (2026-06-26) — Corpus: zh getting-started/contributing body + docs-i18n-contract AutoTypeTable page.
Slice 21 (2026-06-26) — Nav polish: lucideIconsPlugin + findNeighbour footer + draft tree filter.
Slice 22 (2026-06-26) — Evidence-sync: gap audit ~92% · async: true deferral documented (85 SSG routes; cold-start gate pending).
```

**Gap audit:** [`docs/architecture/fumadocs-feature-gap-audit.md`](../../../architecture/fumadocs-feature-gap-audit.md)

**Remaining operator debt:** `docs-live-dns` waiver — DNS at external beta go-live.

**Out of scope:** fdr-005 regression · `@afenda/ui` in docs shell · `async: true` until ≥50 SSG routes (Slice 22 deferral).
