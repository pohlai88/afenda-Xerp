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

## Orchestration sequence

```text
Phase 1 — Complete (DoD #20 closed 2026-06-25).
Phase 2 — Slices 6–11 delivered 2026-06-25 (sequential; shared runtimeOwner serialized per slice).
Slice 12 (C) — MDX adoption delivered 2026-06-25 (Accordion · ImageZoom · InlineTOC on long pages).
Phase 3 — Slices 13–15 delivered 2026-06-25 (search links · Guides tab · evidence-sync). OpenAPI blocked.
Slice 16 (2026-06-25) — UI translations (singular): defineTranslations + i18nProvider; full multilingual still blocked.
```

**Gap audit:** [`docs/architecture/fumadocs-feature-gap-audit.md`](../../../architecture/fumadocs-feature-gap-audit.md)

**Remaining operator debt:** `docs-live-dns` waiver — DNS at external beta go-live.

**Out of scope:** fdr-005 regression · OpenAPI without TIP-031 · `@afenda/ui` in docs shell.
