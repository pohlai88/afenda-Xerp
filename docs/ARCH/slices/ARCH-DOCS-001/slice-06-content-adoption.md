# ARCH-DOCS-001 · Slice 6 — Fumadocs content adoption (GraphView + charter)

| Field | Value |
| --- | --- |
| **Parent** | [`ARCH-DOCS-001`](../../%5BComplete%5D%20ARCH-DOCS-001-fumadocs-site.md) |
| **Status** | Delivered (2026-06-25) |
| **Prerequisite** | Slices 1–5 ✓ |
| **Slice type** | Implementation |
| **Runtime owner** | `apps/docs/` |
| **Closes** | Gap audit P0 content adoption · Editorial charter GraphView · nav-table drift |

---

## Design (internal-guide)

- Add `DocsSiteGraph` server wrapper — calls `buildGraph()` and renders registered `GraphView` on `/docs/apps`.
- Replace markdown **navigation** tables on `/docs` and `/docs/apps` with `DocsGuideCardGrid` (charter-approved).
- Tighten `apps-book-components.test.ts` — assert `DocsSiteGraph` on apps index; forbid nav-section markdown tables on home/apps landing.
- Register `DocsSiteGraph` in `mdx.tsx`; no new runtime deps.

---

## Handoff block

```
Handoff from: docs/ARCH/slices/ARCH-DOCS-001/slice-06-content-adoption.md

1. Objective    — Wire GraphView on /docs/apps; replace nav markdown tables with DocsGuideCardGrid; enforce charter via tests.
2. Allowed layer— apps/docs/
3. Files        — apps/docs/src/components/docs-site-graph.tsx (New)
                  apps/docs/src/components/mdx.tsx (Modified)
                  apps/docs/content/docs/index.mdx (Modified)
                  apps/docs/content/docs/apps/index.mdx (Modified)
                  apps/docs/src/__tests__/apps-book-components.test.ts (Modified)
                  docs/ARCH/slices/ARCH-DOCS-001/slice-06-content-adoption.md (Modified — status)
                  docs/ARCH/[Complete] ARCH-DOCS-001-fumadocs-site.md (Modified — Slice 6 row)
                  docs/ARCH/slices/ARCH-DOCS-001/slice-index.md (Modified)
4. Prohibited   — apps/erp/* · packages/* · @afenda/* runtime imports · OpenAPI · i18n · demoting Phase 1 DoD rows
5. Authority    — ARCH-DOCS-001 Editorial Charter · afenda-fumadocs · fumadocs-feature-gap-audit P0
6. Gates        — pnpm --filter @afenda/docs typecheck
                  pnpm --filter @afenda/docs test:run
                  pnpm quality:docs
                  pnpm exec biome check apps/docs
7. Closes       — GraphView adoption · nav-table charter · Fumadocs-ready +8%
8. Evidence     — apps/index.mdx DocsSiteGraph · test:run · quality:docs route count
9. Attestation  — Usability · Documentation traceability · Contract stability
```

---

## DoD rows this slice advances

| # | Criterion | Gate |
| --- | --- | --- |
| — | Editorial GraphView on `/docs/apps` | `apps-book-components.test.ts` |
| — | No nav markdown tables on landing pages | `apps-book-components.test.ts` |

---

## Known debt

- OpenAPI (TIP-031) · i18n · Slice 7+ reference pages
