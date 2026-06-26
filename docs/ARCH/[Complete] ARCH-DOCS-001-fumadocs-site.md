# ARCH-DOCS-001 — Fumadocs site (Applications)

> Architecture authority for **`@afenda/docs`** — engineer-facing guides at `/docs/apps/**` for `@afenda/erp`, `@afenda/docs`, and `@afenda/storybook`.  
> Template: [`ARCH-TEMPLATE.md`](ARCH-TEMPLATE.md) · Index: [`arch-status-index.md`](arch-status-index.md)

| Field | Value |
| --- | --- |
| **Document ID** | ARCH-DOCS-001 |
| **Work ID** | ARCH-DOCS-001 · PKG-005 · `fdr-005-docs-app` (paired FDR) |
| **Title** | Fumadocs site — Applications |
| **Status** | **Complete — Phase 1** · **Phase 2 Fumadocs upgrade delivered** (58% Fumadocs-ready; 29/30 enterprise) |
| **Date** | 2026-06-25 |
| **Owner** | Application Authority (`apps/docs` content) |
| **Package** | PKG-005 · `@afenda/docs` |
| **Registry entry ID** | PKG005_DOCS |
| **Runtime owner** | `apps/docs/content/docs/apps/**` · `apps/docs/src/lib/docs-nav.contract.ts` |
| **Lane** | blue-lane |
| **Risk class** | Low |
| **Change class** | Extension + Governance |
| **Clean Core target** | A |
| **Enterprise score target** | 29/30 (documentation authority; observability waived) |

> **Scope:** Published Fumadocs content at `/docs/apps/**`, editorial charter, nav contract, component-mapped MDX, drift tests.  
> **Not in scope:** ERP/Storybook runtime code · accounting ledger docs beyond blocked callouts · verbatim ARCH/FDR/inventory duplication in MDX.

**One-sentence architecture:** The `/docs/apps` section is a **published navigation and onboarding layer** in `@afenda/docs` that summarizes runnable apps, links to ARCH/FDR/inventory authority, and enforces component-rich editorial pages — it is **not** a second runtime registry.

---

## Editorial 9.5 Enterprise Requirements Charter (normative)

> Embedded from plan charter. Slice 2 enforces via tests + visual rubric ≥ 9.5/10.

### Content authority rule (verbatim)

```text
Published docs may summarize authority sources, but must not duplicate full authority tables,
registry tables, FDR DoD tables, or runtime inventory sections.
```

| Requirement | Standard |
| --- | --- |
| Authority source | ARCH / FDR / runtime matrix / [`monorepo-feature-inventory.md`](../architecture/monorepo-feature-inventory.md) |
| Published MDX | Engineer how-tos and navigation |
| Runtime status | Linked back to inventory / matrix |
| Status claims | Partial / Not started / Delivered / Blocked — honest only |

### Visual target

Financial Times warmth · Vercel discipline · Stripe clarity · Linear restraint · Fumadocs-native.

```text
Brand accent must appear in prose links and editorial emphasis only — never in shell chrome.
No Applications landing page may be plain markdown-only.
Primary navigation must use Cards or DocsGuideCardGrid — not markdown tables alone.
```

### Component mapping (Slice 2 normative)

| Page | Required components |
| --- | --- |
| `/docs` home | `Cards` or `DocsGuideCardGrid` |
| `/docs/apps` | `Cards` or `DocsGuideCardGrid`; **`GraphView` required** (Phase 2) |
| `/docs/apps/erp` | `DocsFeatureStrip`, `Callout type="warn"` |
| `/docs/apps/erp/routes-and-surfaces` | `Tabs` + `Files`/`Folder`/`File` |
| `/docs/apps/erp/development` | `Steps`/`Step` |
| `/docs/apps/docs` | `DocsFileTree`, `Callout type="info"` |
| `/docs/apps/storybook` | `Callout type="warn"`, `DocsFeatureStrip` |

### Tone

Precise, calm, engineering-first. Avoid unverified: world-class, production-ready, enterprise-grade.

---

## 1. Execution instruction

Execute one bounded slice under ARCH-DOCS-001. Every completion claim maps to **file path**, **test path**, **command exit code**, or **explicit waiver**. No prose-only “done”.

Skills: [`afenda-fumadocs`](../../.cursor/skills/afenda-fumadocs/SKILL.md) · [`docs-editorial-design`](../../.cursor/skills/docs-editorial-design/SKILL.md) · [`afenda-coding-session`](../../.cursor/skills/afenda-coding-session/SKILL.md).

---

## 2. Target item

| Field | Value |
| --- | --- |
| Work ID | ARCH-DOCS-001 · [`fdr-005-docs-app`](../delivery/FDR/%5BPartially%20Implemented%5D%20fdr-005-docs-app.md) |
| Status | Partially Implemented → **Complete — enterprise 9.5 accepted** |
| Package | `@afenda/docs` (PKG-005) |
| Registry entry ID | PKG005_DOCS |
| Runtime owner | `apps/docs/` |
| Lane | blue-lane |
| Clean Core | A |
| Enterprise score target | 29/30 |

### Delivery slice status

| Slice | Scope | Status |
| --- | --- | --- |
| **1 — Authority** | ARCH-DOCS-001 + arch-status-index + README | **Delivered** (2026-06-25) |
| **2 — Publication** | `apps/**` MDX + nav contract + 8 tests + editorial ≥ 9.5 | **Delivered** (2026-06-25) |
| **3 — Evidence-sync** | fdr-005 Slice 3 + runtime matrix | **Delivered** (2026-06-25) |
| **4 — TypeScript governance** | Test helper dedup + build-graph type guard | **Delivered** (2026-06-25) |
| **5 — Peer review evidence** | DoD #20 gate packet + fdr-005 Slice 4 prep | **Complete** (2026-06-25) |
| **6 — Content adoption** | GraphView + DocsGuideCardGrid nav; no nav tables | **Delivered** (2026-06-25) |
| **7 — Reference pages** | `monorepo-map/docs-contracts` + AutoTypeTable | **Delivered** (2026-06-25) |
| **8 — Page actions** | GitHub edit, lastModified, ViewOptionsPopover | **Delivered** (2026-06-25) |
| **9 — Sidebar tabs** | Applications `root: true` meta | **Delivered** (2026-06-25) |
| **10 — HomeLayout** | Marketing `/` + frontmatter schema | **Delivered** (2026-06-25) |
| **11 — Evidence-sync** | Gap audit doc + TS constants cleanup | **Delivered** (2026-06-25) |
| **12 — MDX adoption** | Accordion · ImageZoom · InlineTOC | **Delivered** (2026-06-25) |
| **13 — Search UX** | RootProvider `search.links` empty-state | **Delivered** (2026-06-25) |
| **14 — Guides tab** | `(guides)/` folder group dual tabs | **Delivered** (2026-06-25) |
| **15 — Phase 3 sync** | Gap audit ~74% · blocked OpenAPI/i18n | **Delivered** (2026-06-25) |
| **16–17 — i18n** | UI translations + en/zh multilingual | **Delivered** (2026-06-25) |
| **18 — OpenAPI** | fumadocs-openapi · ARCH-API-002 | **Delivered** (2026-06-26) |
| **19 — LLM export** | includeProcessedMarkdown · llms.mdx · markdownUrl | **Delivered** (2026-06-26) |
| **20 — Corpus** | zh body (scoped) · docs-i18n-contract AutoTypeTable | **Delivered** (2026-06-26) |
| **21 — Nav polish** | Lucide icons · prev/next · draft filter | **Delivered** (2026-06-26) |
| **22 — Phase 5 sync** | Gap audit ~92% · async deferral criteria | **Delivered** (2026-06-26) |

---

## 3. Authority chain

```text
1. docs/ARCH/[Complete] ARCH-DOCS-001-fumadocs-site.md     ← this document
2. docs/delivery/FDR/[Complete] fdr-005-docs-app.md
3. docs/architecture/monorepo-feature-inventory.md                          ← runtime evidence source
4. docs/architecture/docs-app-architecture.md
5. docs/architecture/afenda-runtime-truth-matrix.md
6. packages/architecture-authority/src/data/foundation-disposition.registry.ts
7. apps/docs/src/components/mdx.tsx
8. apps/docs/src/lib/docs-nav.contract.ts
```

| Layer | Authority |
| --- | --- |
| Runtime inventory | `monorepo-feature-inventory.md` |
| Docs app boundaries | `docs-app-architecture.md` |
| FDR delivery gates | `fdr-005-docs-app` |
| Visual palette | `docs-editorial-palette.css` + `.contract.ts` |
| Component registry | `apps/docs/src/components/mdx.tsx` |

---

## 4. Problem statement

### 4.1 Current risk / gap

```text
Engineers have getting-started, monorepo-map, and contributing guides, but no unified,
status-aware Applications for ERP (3000), Docs (3001), and Storybook (6006).
Seed MDX uses plain tables while Fumadocs editorial components are already registered but unused.
Without ARCH-DOCS-001, agents may duplicate inventory into Fumadocs or overclaim ERP readiness.
```

### 4.2 Business / architecture impact

```text
Onboarding quality and external developer beta (fdr-005 Slice 3) depend on governed,
component-rich app guides that cross-link authority without becoming a competing registry.
```

---

## 5. Architecture requirement

### 5.1 Ownership

| Concern | Owner | Allowed path |
| --- | --- | --- |
| ARCH authority | `docs/ARCH/` | this file |
| Published MDX | `@afenda/docs` | `apps/docs/content/docs/apps/**` |
| Nav contract | `@afenda/docs` | `apps/docs/src/lib/docs-nav.contract.ts` |
| Runtime evidence | Architecture Authority | `docs/architecture/monorepo-feature-inventory.md` |
| ERP / Storybook runtime | respective apps | **read-only** for this ARCH |

### 5.2 Boundary rules

1. Fumadocs summarizes and links — does not mirror full ARCH/FDR/inventory tables.
2. Zero `@afenda/*` runtime workspace deps in `@afenda/docs` (except dev `@afenda/typescript-config`).
3. `@afenda/erp` MUST NOT depend on `@afenda/docs`.
4. Prefer Fumadocs built-ins before Afenda editorial blocks; never import `@afenda/ui` in docs shell.
5. Brand accent in prose only — monochrome shell chrome.
6. ERP status honesty mandatory (accounting blocked, partial ARCH surfaces).
7. Nav contract + meta.json stay aligned; tests fail on drift.
8. Each app chapter follows §Editorial page structure (Identity … Authority links).

### 5.3 Prohibited actions

```text
- edit apps/erp or apps/storybook runtime for Applications section delivery
- import @afenda/database, auth, permissions, kernel, appshell, ui, erp into apps/docs
- paste full ARCH/FDR/inventory/registry tables into MDX
- ship plain markdown-only Applications section landing pages
- put brand accent in sidebar/search/TOC shell chrome
- raw OKLCH literals in MDX
- mark ARCH-DOCS-001 or fdr-005 Complete without gate evidence
- create accounting package or ledger runtime documentation beyond blocked callouts
```

---

## 6. Required implementation scope

### In scope

- `docs/ARCH/ARCH-DOCS-001-*.md`
- `apps/docs/content/docs/apps/**`
- `apps/docs/content/docs/index.mdx` (Applications start path)
- `apps/docs/src/lib/docs-nav.contract.ts`
- `apps/docs/src/__tests__/` (8 mandatory suites)
- `docs/delivery/FDR/fdr-005-docs-app.md` (Slice 3 evidence-sync)

### Out of scope

- ERP feature implementation · Storybook runner fix · OpenAPI (TIP-031) · i18n · live DNS operator step

---

## 7. Enterprise acceptance criteria

```gherkin
Feature: Afenda Applications

  Scenario: Applications section index resolves
    GIVEN the docs app is running
    WHEN an engineer opens /docs/apps
    THEN the Applications index renders
    AND it links to ERP, Docs, and Storybook chapters

  Scenario: Every app chapter declares identity and authority
    GIVEN an app chapter exists
    WHEN the page is rendered
    THEN it states package name, path, port, PKG code, and purpose
    AND it links to governing ARCH, FDR, inventory, or architecture docs

  Scenario: Published docs do not become architecture authority
    GIVEN an MDX app chapter references runtime status
    WHEN content tests run
    THEN the chapter links to the source authority
    AND does not duplicate full ARCH/FDR/inventory tables

  Scenario: Applications section does not duplicate architecture authority
    GIVEN an app chapter documents ERP, Docs, or Storybook
    WHEN the chapter references architecture, FDR, runtime status, or package ownership
    THEN it links to the source document
    AND does not paste full ARCH, FDR, registry, or inventory tables into MDX

  Scenario: Docs app has no ERP runtime coupling
    GIVEN apps/docs content and source are scanned
    WHEN no-runtime-coupling tests run
    THEN the docs app has no runtime import from ERP, database, auth, permissions, kernel, appshell, or UI packages

  Scenario: Apps nav drift is caught
    GIVEN a page is removed from apps/docs/content/docs/apps/**
    WHEN docs-nav.contract and docs-content tests run
    THEN the test suite fails before merge

  Scenario: Applications section meets editorial visual quality
    GIVEN the Applications pages are rendered
    WHEN the docs editorial design contract is applied
    THEN landing pages use Cards or DocsGuideCardGrid
    AND authority notes use Callout type="info"
    AND partial or blocked surfaces use Callout type="warn"
    AND brand accent appears only in prose links or blockquote rules
    AND shell chrome remains monochrome
    AND no raw OKLCH values appear in MDX

  Scenario: Applications section avoids plain markdown-only publication
    GIVEN an Applications section landing page exists
    WHEN MDX source is scanned by apps-book-components.test.ts
    THEN it contains registered Fumadocs or Afenda editorial components
    AND does not rely only on markdown tables for primary navigation
```

---

## 8. Enterprise quality benchmark

Target: **29/30** (observability waived — static docs site).

| Dimension | Target | Evidence |
| --- | ---: | --- |
| Contract stability | 5/5 | `docs-nav.contract.ts` + typecheck |
| Test coverage | 5/5 | 8-test suite + `quality:docs` |
| Observability + audit | 2/5 | Waiver `docs-app-observability` |
| Security + RBAC | 4/5 | `no-afenda-runtime-imports.test.ts` |
| Documentation + traceability | 5/5 | ARCH + FDR + inventory links |
| Maintainability + Clean Core | 5/5 | boundaries + biome |

---

## 9. Non-functional requirements

| Characteristic | Requirement | Verification |
| --- | --- | --- |
| Functional suitability | Applications section routes resolve | `docs-routes.test.tsx`, `quality:docs` |
| Usability | Cards/Steps navigation | `apps-book-components.test.ts` |
| Maintainability | Nav contract parity | `docs-content.test.ts` |
| Documentation | Authority cross-links | `apps-book-inventory-parity.test.ts` |

---

## 10. Required gates

```bash
pnpm check:documentation-drift
pnpm check:foundation-disposition
pnpm --filter @afenda/docs typecheck
pnpm --filter @afenda/docs test:run
pnpm quality:docs
pnpm quality:boundaries
pnpm exec biome check apps/docs
```

| Slice | Gates |
| --- | --- |
| 1 — Authority | drift + foundation-disposition |
| 2 — Publication | all docs gates above |
| 3 — Evidence-sync | drift + foundation-disposition + docs gates |
| 4–5 | all docs gates above + documentation drift |

### Gate report (Slice 5 — 2026-06-25 evidence)

| Gate | Exit | Result |
| --- | ---: | --- |
| `pnpm --filter @afenda/docs typecheck` | 0 | Pass |
| `pnpm --filter @afenda/docs test:run` | 0 | Pass — 12 files · 83/83 tests |
| `pnpm quality:docs` | 0 | Pass — 15 SSG routes |
| `pnpm quality:boundaries` | 0 | Pass — 22 workspaces |
| `pnpm exec biome check apps/docs` | 0 | Pass — 64 files |
| `pnpm check:foundation-disposition` | 0 | Pass — PKG005_DOCS fingerprint valid |
| `pnpm check:documentation-drift` | 0 | Pass |

---

## 11. Definition of Done

| # | Criterion | Evidence | Status |
| --- | --- | --- | --- |
| 1 | Runtime evidence at stated paths | `apps/docs/content/docs/apps/**` | [x] |
| 2 | Acceptance criteria implemented | Gherkin §7 tests | [x] |
| 3 | Positive path tested | `docs-routes.test.tsx` | [x] |
| 4 | Negative path tested | `no-afenda-runtime-imports.test.ts` | [x] |
| 5 | TypeScript strict | typecheck exit 0 | [x] |
| 6 | Package tests pass | test:run exit 0 (83 tests) | [x] Slice 5 |
| 7 | Biome clean | biome check apps/docs | [x] |
| 8 | Boundaries pass | quality:boundaries | [x] |
| 9 | Registry/index aligned | foundation-disposition | [x] |
| 10 | Documentation drift clean | check:documentation-drift | [x] |
| 11 | Runtime matrix updated | matrix Docs row | [x] |
| 12 | FDR status updated | fdr-005 Slice 4 evidence packet | [x] |
| 13 | Impact analysis completed | §12 | [x] |
| 14 | Rollback strategy documented | §14 | [x] |
| 15 | Security path verified | import scan tests | [x] |
| 16 | Observability verified | waiver reconfirmed | [x] |
| 17 | Public API compatibility | MDX nav contract semver | [x] |
| 18 | Clean Core level declared | A | [x] |
| 19 | Waivers documented | §13 | [x] |
| 20 | Peer review | §16 attestation · fdr-005 DoD #14 | [x] 2026-06-25 |

---

## 12. Impact analysis

| Consumer | Dependency | Breaking? | Action |
| --- | --- | --- | --- |
| Engineers | `/docs/apps` URLs | No | None |
| `monorepo-map` | Cross-link to Applications section | No | Optional one-line in inventory |
| `@afenda/erp` | None | No | Must not import docs app |

**Breaking change:** No · **Rollback safe:** Yes

---

## 13. Waiver policy

| Waiver ID | Requirement | Reason |
| --- | --- | --- |
| `docs-app-observability` | Observability 2/5 | Static docs site — no governed mutations |
| `docs-live-dns` | Live DNS | Operator step — not code |

---

## 14. Rollback strategy

| Change | Rollback |
| --- | --- |
| MDX content | Revert `apps/docs/content/docs/apps/**` |
| Nav contract | Revert `docs-nav.contract.ts` |
| ARCH doc | Revert ARCH-DOCS-001 + index row |

---

## 15. Required output from agent

Completion report per ARCH-TEMPLATE §15 + afenda-fumadocs §11 + docs-editorial-design §12 (Slice 2).

---

## 16. Promotion rule

Do not promote to **Complete** until: Slices 1–5 delivered ✓ · all gates exit 0 ✓ · fdr-005 DoD #14 peer review ✓ · visual score ≥ 9.5/10 ✓.

### DoD #20 — Architecture Authority peer review

> **Closed 2026-06-25.** Filename promoted to `[Complete]` in same change set as fdr-005 `[Complete]`.

| # | Review criterion | Evidence path | Gate |
| --- | --- | --- | --- |
| 1 | Applications routes + MDX at `/docs/apps/**` | `apps/docs/content/docs/apps/**` | `docs-routes.test.tsx` |
| 2 | Nav contract parity | `apps/docs/src/lib/docs-nav.contract.ts` | `docs-content.test.ts` |
| 3 | No ERP runtime coupling | `no-erp-runtime-coupling.test.ts` · `no-afenda-runtime-imports.test.ts` | `test:run` |
| 4 | TypeScript governance (Slice 4) | `apps/docs/src/__tests__/helpers/` · `build-graph.ts` | `typecheck` |
| 5 | Production build | `quality:docs` (Next.js SSG) | exit 0 — 15 routes |
| 6 | PKG005 registry aligned | `foundation-disposition.registry.ts` | `check:foundation-disposition` |
| 7 | Documentation authorities aligned | ARCH · FDR · matrix · index | `check:documentation-drift` |
| 8 | Waivers documented | §13 (`docs-live-dns`, `docs-app-observability`) | §13 table — **reconfirmed** |

**Sign-off (Architecture Authority):**

```text
DoD #20 peer review — ARCH-APPS-001 (canonical: ARCH-DOCS-001)
Reviewer: Architecture Authority
Date: 2026-06-25
PR: —
Result: Approved
Notes: fdr-005 DoD #14 approved in same review. Waivers docs-live-dns + docs-app-observability reconfirmed.
```

---

## 17. Slice handoffs

### Slice 1 — Authority

```
Handoff: ARCH-DOCS-001 Slice 1 — Authority

1. Objective    — Author ARCH-DOCS-001 with Editorial Charter; register DOCS domain in arch-status-index and README.
2. Allowed layer— docs/ARCH/
3. Files        — docs/ARCH/[Partially Implemented] ARCH-DOCS-001-fumadocs-site.md
                  docs/ARCH/arch-status-index.md
                  docs/ARCH/README.md
4. Prohibited   — apps/docs/**; ERP/Storybook runtime; fdr-005 Complete claim
5. Authority    — ARCH-TEMPLATE · fdr-005-docs-app · monorepo-feature-inventory
6. Gates        — pnpm check:documentation-drift; pnpm check:foundation-disposition
7. Closes       — Slice 1 delivery row
8. Evidence     — ARCH file paths + gate exit codes
9. Attestation  — Documentation traceability
```

### Slice 2 — Publication + Editorial 9.5

```
Handoff: ARCH-DOCS-001 Slice 2 — Publication

1. Objective    — Publish Fumadocs Applications with mandatory components; 8-test suite; visual score ≥ 9.5/10.
2. Allowed layer— apps/docs/
3. Files        — apps/docs/content/docs/apps/**
                  apps/docs/content/docs/index.mdx
                  apps/docs/content/docs/meta.json
                  apps/docs/src/lib/docs-nav.contract.ts
                  apps/docs/src/lib/layout.shared.ts (links optional)
                  apps/docs/src/__tests__/**
4. Prohibited   — ERP/Storybook/packages runtime; @afenda/* runtime imports; plain markdown-only landing pages
5. Authority    — ARCH-DOCS-001 · afenda-fumadocs · docs-editorial-design · mdx.tsx
6. Gates        — typecheck; test:run; quality:docs; boundaries; biome apps/docs; check:documentation-drift
7. Closes       — DoD #1–8, #15, #17; fdr-005 Slice 3 content partial
8. Evidence     — MDX paths + test paths + gate log
9. Attestation  — Editorial 9.5 visual rubric ≥ 9.5/10
```

### Slice 3 — Evidence-sync

```
Handoff: ARCH-DOCS-001 Slice 3 — Evidence-sync

1. Objective    — Sync fdr-005 Slice 3 outcomes, runtime matrix Docs row; optional one-line inventory cross-link.
2. Allowed layer— docs/ only
3. Files        — docs/delivery/FDR/[Partially Implemented] fdr-005-docs-app.md
                  docs/architecture/afenda-runtime-truth-matrix.md
                  docs/ARCH/arch-status-index.md (slice rows)
                  docs/architecture/monorepo-feature-inventory.md (one line optional)
4. Prohibited   — apps/docs source; fdr-005 [Complete] rename; DoD #14 without peer review
5. Authority    — fdr-005-docs-app · ARCH-DOCS-001
6. Gates        — check:documentation-drift; check:foundation-disposition; quality:docs
7. Closes       — DoD #11–12; fdr-005 Slice 3 gap
8. Evidence     — FDR + matrix diff + gate log
9. Attestation  — Enterprise score 27–28/30 audit-adjusted
```

### Slice 4 — TypeScript governance

> **Canonical handoff:** [`docs/ARCH/slices/ARCH-DOCS-001/slice-04-typescript-governance.md`](slices/ARCH-DOCS-001/slice-04-typescript-governance.md)

### Slice 5 — DoD #20 peer review evidence

> **Canonical handoff:** [`docs/ARCH/slices/ARCH-DOCS-001/slice-05-dod20-peer-review-evidence.md`](slices/ARCH-DOCS-001/slice-05-dod20-peer-review-evidence.md)

**Status:** **Complete — 2026-06-25** — DoD #20 closed · paired fdr-005 `[Complete]`

### Phase 2 slice handoffs (Fumadocs readiness)

> Canonical files: [`docs/ARCH/slices/ARCH-DOCS-001/slice-index.md`](slices/ARCH-DOCS-001/slice-index.md) · evidence: [`fumadocs-feature-gap-audit.md`](../architecture/fumadocs-feature-gap-audit.md)

| Slice | Summary | Gate evidence |
| --- | --- | --- |
| 6 | GraphView on `/docs/apps`; DocsGuideCardGrid replaces nav tables | `apps-book-components.test.ts` |
| 7 | `/docs/monorepo-map/docs-contracts` + `remarkAutoTypeTable` | 16 SSG routes |
| 8 | `fumadocs-ui/page` editOnGithub + ViewOptionsPopover | `docs-github.constants.test.ts` |
| 9 | `apps/meta.json` `"root": true` | `docs-content.test.ts` |
| 10 | HomeLayout at `/`; Zod frontmatter in `source.config.ts` | `docs-home.test.ts` |
| 11 | Gap audit persisted; serializable constants | `check:documentation-drift` |

#### Gate evidence (Phase 2 — 2026-06-25)

| Gate | Exit | Result |
| --- | ---: | --- |
| `pnpm --filter @afenda/docs typecheck` | 0 | Pass |
| `pnpm --filter @afenda/docs test:run` | 0 | Pass — 14 files · 91/91 tests |
| `pnpm quality:docs` | 0 | Pass — 16 SSG routes |
| `pnpm exec biome check apps/docs` | 0 | Pass — 70 files |

See §10 Gate report (Slice 5) for Phase 1 baseline. fdr-005 Slice 4 gate log synced; `[Complete]` filename promotion applied 2026-06-25.

---

## 18. ERP status honesty reference (Slice 2 content)

Mandatory callouts in `apps/erp/index.mdx`:

- Accounting ledger blocked (ADR-0010)
- PKG-R02–R05 not in filesystem
- ARCH-USER-001 — Preferences tab pending (Slice 5)
- ARCH-AUTH-001 — waiver tracks if open
- ARCH-ADMIN-001 — Partially Implemented; DoD #20 peer review open

---

*2026-06-25 — ARCH-DOCS-001 **Complete — enterprise 9.5 accepted** · paired FDR: fdr-005-docs-app `[Complete]`*
