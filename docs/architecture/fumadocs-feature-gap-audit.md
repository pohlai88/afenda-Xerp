# Fumadocs feature gap audit — `@afenda/docs`

| Field | Value |
| --- | --- |
| **Status** | Evidence — Phase 4 (2026-06-25) |
| **Authority** | ARCH-DOCS-001 Phase 4 · Slice 16 |
| **Package** | PKG-005 · `@afenda/docs` |

---

## Executive summary

| Metric | Before Phase 2 | After Slice 12 | After Phase 3 (Slices 13–15) | After Slice 16 |
| --- | ---: | ---: | ---: | ---: |
| **Composite Fumadocs-ready** | ~35% | **~68%** | **~74%** | **~76%** |
| **Official UI components adopted in MDX** | 7/14 | **13/14** | **13/14** | **13/14** |
| **Platform extensions** | ~10% | **~35%** | **~38%** | **~40%** |
| **SSG routes** | 15 | **16** | **16** | **16** |
| **Test suites** | 12 / 83 tests | **15 / 103 tests** | **16 / 107 tests** | **17 / 112 tests** |

Phase 3 closes **search empty-state links** and **Guides + Applications dual sidebar tabs** without breaking seed URLs (Fumadocs `(guides)/` folder group). Slice 16 adds **UI translations (singular)** — English-only content with Fumadocs label overrides; no `[lang]` routes. OpenAPI (TIP-031) and custom search API remain blocked/deferred. Full multilingual i18n remains blocked until product requirement.

---

## 1. Platform and framework

| Feature | Before Phase 2 | After Slice 12 | After Phase 3 | After Slice 16 |
| --- | --- | --- | --- | --- |
| MDX collections + SSG | Adopted | Adopted | Adopted | Adopted |
| Link reference extraction + GraphView | Wired, unused | **Adopted** | Adopted | Adopted |
| Custom frontmatter (`full`, `status`, `noIndex`) | Absent | **Adopted** | Adopted | Adopted |
| remarkAutoTypeTable | Absent | **Adopted** | Adopted | Adopted |
| Default Orama search | Partial | Partial (styled default) | **Adopted** (empty-state `search.links`) | Adopted |
| LLM / page actions | Absent | **Partial** | Partial | Partial |
| OpenAPI | Deferred (TIP-031) | Deferred | **Blocked** (no TIP-031) | **Blocked** (no TIP-031) |
| i18n | Absent | Absent | **Blocked** (no product requirement) | **Partial — UI translations (singular)**; full multilingual blocked |
| Static export search index | Absent | Absent | Absent | Absent |
| Custom search API route | — | — | Deferred (Orama sufficient) | Deferred (Orama sufficient) |

---

## 2. Layouts and navigation

| Feature | Before Phase 2 | After Slice 12 | After Phase 3 |
| --- | --- | --- | --- |
| DocsLayout + DocsPage | Adopted | Adopted + page actions | Adopted |
| HomeLayout | Absent | **Adopted** | Adopted |
| Sidebar tabs (`root: true`) | Absent | Partial (Applications only) | **Adopted** (Guides + Applications) |
| Full-width hub pages | Infrastructure only | **Adopted** | Adopted |
| Page actions (GitHub, copy) | Absent | **Adopted** | Adopted |

---

## 3. MDX components (official)

| Component | Before | After Slice 12 | After Phase 3 |
| --- | --- | --- | --- |
| Callout, Cards, Tabs, Files, Steps | Used | Used | Used |
| GraphView | Registered only | **Used** | Used |
| AutoTypeTable | Registered only | **Used** | Used |
| Accordion, ImageZoom, InlineTOC | Unused | **Used** | Used |
| Banner, DynamicCodeBlock, GithubInfo, TypeTable | Unused | Unused | Unused |

---

## 4. Editorial blocks (Afenda)

| Block | Before | After |
| --- | --- | --- |
| DocsFeatureStrip, DocsFileTree | Used | Used |
| DocsGuideCardGrid | Unused | **Used** on home + apps nav |
| Other editorial blocks | Unused | Unused |

---

## 5. Remaining gaps (Phase 4+)

1. **OpenAPI** — **Blocked** until TIP-031 + `fumadocs-openapi` (+10% when unblocked)
2. **i18n (full multilingual)** — **Blocked** until product requirement; singular UI translations adopted (Slice 16) — no `[lang]` routes; English-only content; infrastructure ready for `@fumadocs/language` preset later
3. **Per-package `@afenda/*` AutoTypeTable pages** — needs export index outside docs app boundary
4. **Custom search API** — optional; default Orama sufficient for current corpus
5. **Unused MDX primitives** — Banner, DynamicCodeBlock, GithubInfo, TypeTable (lower ROI)

**Target 80%+** requires OpenAPI reference + expanded MDX corpus (50+ pages).

---

## Evidence

| Gate | Result (2026-06-25 Phase 4 / Slice 16) |
| --- | --- |
| `pnpm --filter @afenda/docs typecheck` | exit 0 |
| `pnpm --filter @afenda/docs test:run` | 112/112 |
| `pnpm quality:docs` | 16 SSG routes (`/docs/getting-started/**` preserved) |
| `pnpm exec biome check apps/docs` | exit 0 |
