# Fumadocs feature gap audit — `@afenda/docs`

| Field | Value |
| --- | --- |
| **Status** | Evidence — Phase 5 complete (2026-06-26) |
| **Authority** | ARCH-DOCS-001 Phase 5 · Slices 18–22 |
| **Package** | PKG-005 · `@afenda/docs` |

---

## Executive summary

| Metric | After Slice 18 | After Phase 5 (Slices 19–22) |
| --- | ---: | ---: |
| **Composite Fumadocs-ready** | **~88%** | **~92%** |
| **Official UI components adopted in MDX** | **13/14** | **13/14** |
| **Platform extensions** | **~55%** | **~68%** |
| **SSG routes** | **43** | **85** (+2 corpus pages en/zh · +40 llms.mdx mirrors) |
| **Test suites** | **21 / 137 tests** | **23 / 150 tests** |

Phase 5 closes **LLM markdown export** (Slice 19), **zh body translation (scoped)** + **AutoTypeTable corpus +1** (Slice 20), **nav polish** — Lucide icons, prev/next footer, draft tree filter (Slice 21), and **evidence-sync** (Slice 22). OpenAPI reference (Slice 18) remains adopted. **`async: true` deferred** — see §Remaining gaps.

---

## 1. Platform and framework

| Feature | After Slice 18 | After Phase 5 |
| --- | --- | --- |
| MDX collections + SSG | Adopted | Adopted |
| Link reference extraction + GraphView | Adopted | Adopted |
| Custom frontmatter (`full`, `status`, `noIndex`) | Adopted | Adopted |
| remarkAutoTypeTable | Adopted | Adopted (+1 docs-local page) |
| Default Orama search | Adopted | Adopted |
| LLM / page actions | Partial | **Adopted** (`includeProcessedMarkdown` · `llms.mdx` · `llms.txt` · `llms-full.txt` · `markdownUrl` · Accept negotiation · `LLMCopyButton`) |
| Ask AI | Not enabled | **Adopted** (`/api/chat` · OpenRouter · flexsearch tool · AISearch panel) — requires `OPENROUTER_API_KEY` |
| OpenAPI | Adopted (ARCH-API-002) | Adopted |
| i18n | Adopted (en+zh) | Adopted — **partial zh body** (getting-started · contributing) |
| Loader plugins | OpenAPI only | **+ lucideIcons · draft tree filter** |
| `async: true` / dynamic MDX | Not enabled | **Deferred** (§Remaining gaps) |
| Static export search index | Absent | Absent |
| Custom search API route | Deferred | Deferred |

---

## 2. Layouts and navigation

| Feature | After Slice 17 | After Phase 5 |
| --- | --- | --- |
| DocsLayout + DocsPage | Adopted | Adopted |
| HomeLayout | Adopted | Adopted |
| Sidebar tabs (`root: true`) | Adopted | Adopted |
| Sidebar Lucide icons | Absent | **Adopted** (Guides · Applications) |
| Prev/next footer | Absent | **Adopted** (`findNeighbour` + `PageFooter`) |
| Draft pages in nav | Visible | **Hidden** (nav-only; SSG unchanged) |
| Page actions (GitHub, copy, markdown) | Partial | **Adopted** |
| Language switcher | Adopted | Adopted |

---

## 3. MDX components (official)

| Component | After Slice 12 | After Phase 5 |
| --- | --- | --- |
| Callout, Cards, Tabs, Files, Steps | Used | Used |
| GraphView | Used | Used |
| AutoTypeTable | Used | Used (+ `docs-i18n-contract`) |
| Accordion, ImageZoom, InlineTOC | Used | Used |
| Banner, DynamicCodeBlock, GithubInfo, TypeTable | Unused | Unused |

---

## 4. Editorial blocks (Afenda)

| Block | Status |
| --- | --- |
| DocsFeatureStrip, DocsFileTree | Used |
| DocsGuideCardGrid | Used on home + apps nav |
| Other editorial blocks | Unused |

---

## 5. Remaining gaps

1. **OpenAPI search indexing** — deferred (Orama text search sufficient)
2. **zh OpenAPI operation pages** — zh index cards link to en ops; full zh ops incremental
3. **i18n (fr/ko expansion)** — en+zh adopted; add locales when product requires
4. **zh MDX translation** — getting-started + contributing translated; other pages incremental
5. **Per-package `@afenda/*` AutoTypeTable pages** — blocked outside docs app boundary
6. **Custom search API** — optional; Orama sufficient
7. **Unused MDX primitives** — Banner, DynamicCodeBlock, GithubInfo, TypeTable (lower ROI)
8. **`llms.txt` / `llms-full.txt` site indexes** — **Adopted** (2026-06-26 full LLM pass)
9. **Ask AI runtime** — wire `OPENROUTER_API_KEY` on docs Vercel project for live chat
10. **`async: true` (fumadocs-mdx dynamic MDX)** — **Deferred**

### `async: true` deferral criteria (Slice 22)

| Trigger | Status | Action |
| --- | --- | --- |
| SSG route count ≥ 50 | **Met** (85 routes, 2026-06-26 build) | Do **not** enable without cold-start evidence + slice addendum |
| `fumadocs-mdx` cold start consistently > 15s | **Not measured** | Profile on Vercel preview before adoption |
| Operator approval | Pending | New ARCH-DOCS slice addendum required |

**Rationale:** Route-count trigger alone is insufficient — enable `async: true` only when cold-start pain is evidenced or product requires lazy MDX beyond current 85-route SSG budget.

**Target 80%+** achieved (~92%). Expanded corpus (50+ *content* pages without llms mirrors) remains for 90%+ headline.

---

## Evidence

| Gate | Result (2026-06-26 Phase 5) |
| --- | --- |
| `pnpm --filter @afenda/docs typecheck` | exit 0 |
| `pnpm --filter @afenda/docs test:run` | 150/150 |
| `pnpm quality:docs` | 85 SSG routes |
| `pnpm check:documentation-drift` | exit 0 |
| `pnpm check:openapi-drift` | exit 0 (Slice 18) |
