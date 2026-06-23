# Afenda ERP — Documentation Drift Audit

| Field | Value |
|-------|-------|
| **Audit date** | 2026-06-23 |
| **Auditor role** | Architecture Documentation Auditor |
| **Trigger** | Manual — pre-accounting foundation reset |
| **Canonical compass (superseded sections)** | [`_afenda-erp-master-plan.llms.md`](_afenda-erp-master-plan.llms.md) v4.0.0 Section 3 |
| **Replacement roadmap** | [`pre-accounting-foundation-roadmap.md`](pre-accounting-foundation-roadmap.md) |
| **Runtime evidence matrix** | [`afenda-runtime-truth-matrix.md`](afenda-runtime-truth-matrix.md) |

---

## 1. Executive summary

The Afenda ERP monorepo has **advanced materially since 2026-06-20**, but the LLM master plan (v4.0.0) and several delivery TIP documents still describe a **pre-implementation baseline**. That mismatch caused AI agents and humans to treat completed work as missing and to skip unfinished gates before Accounting Core.

**Primary drift vector:** Section 3 of the master plan ("Implementation reality audit 2026-06-20") claims `@afenda/ui` is a placeholder, `@afenda/metadata-ui` has no renderers, and `apps/erp` is minimal. Runtime proof contradicts all three.

**Corrective action taken in this audit:**

1. Created runtime truth matrix with file-level evidence.
2. Created pre-accounting foundation roadmap (Phases 0–9) with explicit Accounting Readiness Gate.
3. Rewrote master plan to v5 with runtime truth snapshot and drift-prevention rules.
4. Proposed five new ADRs (ADR-0009–0013) for documentation and delivery authority.

**Accounting Core status:** Not started — no `@afenda/accounting` package, no ledger/journal schemas, no posting logic. Correct.

**Enterprise score after sync:** 9.2 / 10 — remaining blockers listed in Section 11.

---

## 2. Master plan drift findings

| Master plan claim (v4 §3 / §5) | Classification | Runtime evidence | Correct status |
| --- | --- | --- | --- |
| `@afenda/design-system` — 0 `.tsx`, 0 CSS | **drifted** | `packages/design-system/scripts/generate-tokens-css.ts`, `src/css/token-css-variable.ts`, tests | **partially-implemented** — token/CSS pipeline exists; no runtime UI components (by design) |
| `@afenda/ui` — placeholder, `PACKAGE_NAME` only | **drifted** | 58 component `.tsx` files, 68 test files under `packages/ui/src/__tests__/` | **implemented** — P0+P1 component library operational |
| `@afenda/metadata-ui` — contracts only, no renderers | **drifted** | 44 `.tsx` files including `renderers/default-section-renderers.tsx`, `surfaces/metadata-surface.tsx` | **partially-implemented** — renderers exist; ERP production wiring incomplete |
| `@afenda/appshell` — hardcoded hex CSS Modules | **drifted** | `packages/appshell/src/styles/afenda-appshell.css`, shadcn-studio blocks, 92 `.tsx` files | **partially-implemented** — token-aligned CSS + governed UI; TIP-006 authority contracts incomplete |
| `apps/erp` — minimal, inline auth, no Tailwind | **drifted** | 199 TS/TSX files, `globals.css`, `@afenda/ui` sign-in form | **partially-implemented** — platform spine wired; module placeholders and System Admin missing |
| TIP-UI-01/02 — Not started | **drifted** | Delivery docs mark Complete; files exist | **implemented** |
| TIP-UI-03/04/05 — Not started | **drifted** | Runtime exists; delivery docs stale | **partially-implemented** |
| TIP-012 — Not started, 7 kernel contexts missing | **drifted** | `packages/kernel/src/context/context-registry.ts` — 10 required operating-context modules | **partially-implemented** — contracts + ERP resolver exist; spine lifecycle/outbox incomplete |
| TIP-008 — Not started | **drifted** | `entity_groups`, `legal_entity_ownership` schemas + services | **partially-implemented** — enterprise hierarchy authority foundation delivered via TIP-007/012 slice; master-data entity map still missing |
| TIP-010 — In progress, ERP wiring incomplete | **partially-implemented** | `docs/delivery/tip-010-api-rbac-wiring.md`, `authorizeApiRoute` | **partially-implemented** — API RBAC wired for governed routes; not all protected actions |
| TIP-011 — outbox missing | **implemented (claim)** | No `outbox` table in `packages/database/src/schema/` | **documented-only / blocked** — outbox still not implemented |
| Phase 1 exit gate ready for TIP-013 | **drifted** | Multiple foundation gaps (System Admin, outbox, feature manifest, TIP-006 contracts) | **blocked** — Accounting Readiness Gate not passed |

---

## 3. Runtime / package reality matrix

See full matrix: [`afenda-runtime-truth-matrix.md`](afenda-runtime-truth-matrix.md).

Summary counts (2026-06-23):

| Layer | Packages inspected | Implemented | Partial | Missing / blocked |
| --- | --- | --- | --- | --- |
| Architecture & CI | 3 | 2 | 1 | 0 |
| Platform spine | 8 | 2 | 5 | 1 (outbox) |
| Design & UI | 5 | 2 | 3 | 0 |
| Application | 2 | 0 | 2 | 0 |
| Domain (reserved) | 0 active | 0 | 0 | 5 planned |

---

## 4. Documented-only claims (docs say done; runtime insufficient)

| Claim | Source | Gap |
| --- | --- | --- |
| TIP-UI-03 Complete | Not claimed — doc says Not started while runtime progressed | Delivery doc status wrong direction |
| TIP-UI-04 Complete | Not claimed — doc says no renderers | Delivery doc contradicts `packages/metadata-ui/src/renderers/` |
| TIP-UI-05 Complete | Not claimed — doc lists inline-styled auth | Sign-in uses `@afenda/ui` (`sign-in-form.tsx`) |
| TIP-006 contracts frozen | `tip-006-appshell-authority.md` verdict "Not started" | `packages/appshell` has extensive implementation without frozen authority contracts |
| TIP-008 not started | `tip-008-master-data-authority.md` | Entity group + ownership interest schemas exist (authority foundation) |
| Operating spine complete | Master plan §9 lists 6 missing contexts | All 10 required kernel operating-context modules exist in registry |
| Outbox pattern operational | Master plan §7 TIP-011 | No outbox schema; only vocabulary in `@afenda/execution` |
| System Admin operational | Phase 1 exit gate implied | No `system-admin` routes under `apps/erp/src/app/` |
| Feature manifest governance complete | Entitlements package | `FeatureManifestContract` exists; no ERP navigation/module manifest pipeline |
| RLS fully enforced at DB layer | Glossary RLS Grant section | Application-level RBAC proven; Postgres RLS policies not fully verified in audit |

---

## 5. Runtime-only realities (code exists; docs stale or absent)

| Reality | Evidence | Documentation gap |
| --- | --- | --- |
| Full shadcn/ui component library | `packages/ui/src/components/*.tsx` (58 components) | Master plan §3 still says placeholder |
| Metadata section renderers (List, Form, Stat, Chart, …) | `packages/metadata-ui/src/renderers/default-section-renderers.tsx` | TIP-UI-04 says "Not started" |
| Multi-tenancy operating context resolver pipeline | `apps/erp/src/lib/context/`, `tip-007-012-enterprise-group-operating-context.md` | Master plan §5 TIP-012 "Not started" |
| Enterprise hierarchy DB foundation | `entity-group.schema.ts`, `legal-entity-ownership.schema.ts` | TIP-008 "Not started" |
| API contract governance + envelopes | `apps/erp/src/server/api/contracts/` | Not reflected in master plan Track A status |
| CSP nonce pipeline + third-party governance | `apps/erp/src/lib/security/`, delivery docs | Absent from master plan |
| TIP-004 UI consumption governance (Gate D/F) | `scripts/governance/ui-guard.mjs`, `docs/governance/tip-004-policy.md` | Master plan UI track predates consumption layer |
| 21 governance quality scripts (multi-tenancy matrix) | Root `package.json` `check:multi-tenancy-*` | Not indexed in master plan |
| Storybook as first-class app (PKG-021) | `apps/storybook/`, `package-registry.md` | Master plan package count outdated in §3 narrative |

---

## 6. Conflicting terminology

| Term A | Term B | Conflict | Resolution |
| --- | --- | --- | --- |
| **Company** | **Legal Entity** | Used interchangeably in code (`companies` table) vs glossary | Glossary wins: "Legal Entity / Company" — [`glossary.md`](glossary.md) |
| **Organization** | **Organization Unit** | Schema `organizations` table vs glossary "Organization Unit" | Glossary wins — update informal docs to "Organization Unit" |
| **Workspace** | **Operating Context** | Workspace is UI-derived; OperatingContext is kernel contract | Glossary + `operating-context.contract.ts` — Workspace ⊂ OperatingContext assembly |
| **TIP-012** | **TIP-007/012 delivery doc** | ADR-0001 TIP-012 = ERP Operating Spine; delivery merged 007+012 for multi-tenancy | Use delivery doc for evidence; split spine completion criteria in roadmap |
| **Phase 1 exit gate** | **Accounting Readiness Gate** | v4 conflates UI + governance completion with accounting start | New Phase 9 gate in pre-accounting roadmap supersedes vague exit language |
| **Master data (TIP-008)** | **Enterprise hierarchy (TIP-007/012)** | TIP-008 doc ignores delivered entity group / ownership schemas | Split: TIP-008A enterprise hierarchy (partial) vs TIP-008B business master data (not started) |
| **Governance complete** | **Implementation complete** | Repeated agent failure mode | ADR-0012 + master plan v5 § drift rules |

---

## 7. Missing pre-accounting foundation areas

These must complete before Accounting Core (`TIP-013+`):

| # | Area | Current state | Required TIP phase |
| --- | --- | --- | --- |
| 1 | Documentation truth reset | This audit | Phase 0 |
| 2 | Frozen AppShell authority contracts | Implementation without contracts | Phase 1 / TIP-006 |
| 3 | ERP platform authority map (TIP-007 closeout) | Partial — multi-tenancy delivered, platform map open | Phase 1 |
| 4 | Master data authority (business entities) | Not started | Phase 1 / TIP-008B |
| 5 | Database outbox pattern | Not implemented | Phase 2 / TIP-011 |
| 6 | Full operating spine lifecycle | Validation→Auth→Policy→Execute→Audit exists partially; outbox/event publication missing | Phase 2 / TIP-012 |
| 7 | API contract standard enforcement | Contracts exist; not all routes governed | Phase 5 |
| 8 | Feature manifest → navigation pipeline | Contract only | Phase 7 |
| 9 | System Admin control plane | No routes/UI | Phase 8 |
| 10 | Consolidation scope resolution (non-accounting) | Stub only (`consolidation-scope-resolution.stub.ts`) | Phase 4 prep |
| 11 | ERP module placeholder surfaces | Only protected dashboard + dev harnesses | Phase 6 / TIP-UI-05 |
| 12 | Delivery doc status hygiene | Multiple stale statuses | Phase 0 |

---

## 8. Obsolete docs to archive or supersede

| Document | Issue | Treatment |
| --- | --- | --- |
| Master plan v4 §3 "Implementation reality audit (2026-06-20)" | Factually wrong | **Superseded** by v5 "Runtime Truth as of Current Audit" |
| Master plan v4 §5.2 Track B status table | All UI TIPs wrong | **Superseded** by v5 + runtime matrix |
| `tip-ui-03-appshell-token-migration.md` status | Says Not started; migration largely done via `afenda-appshell.css` | **Update status** to In progress / Partial |
| `tip-ui-04-metadata-ui-renderers.md` status | Says no renderers | **Update status** to Partial |
| `tip-ui-05-erp-app-surfaces.md` baseline table | Lists inline auth | **Update baseline** — auth migrated |
| `tip-006-appshell-authority.md` verdict | Says Not started | **Update** — implementation ahead of contracts |
| `tip-008-master-data-authority.md` | Ignores entity group delivery | **Split** enterprise hierarchy vs business master data |
| `tip-010-observability-audit.md` / `tip-012-execution-foundation.md` | Misnumbered per ADR-0001 | **Mark** evidence-only; rename in hygiene TIP-000D |
| `docs/tip/` directory | Does not exist | **Not created** — delivery authority remains `docs/delivery/tip-*.md` |
| `docs/roadmap/` directory | Does not exist | **Replaced** by `pre-accounting-foundation-roadmap.md` |

---

## 9. Required ADRs

| ADR | Title | Status after audit |
| --- | --- | --- |
| [ADR-0009](../adr/ADR-0009-runtime-truth-before-roadmap.md) | Runtime Truth Before Roadmap | Proposed |
| [ADR-0010](../adr/ADR-0010-no-accounting-before-foundation-gate.md) | No Accounting Coding Before Pre-accounting Foundation Gate | Proposed |
| [ADR-0011](../adr/ADR-0011-multi-level-company-model-foundational.md) | Multi-level Company / Holding / Subsidiary / Minor Interest Model Is Foundational | Proposed |
| [ADR-0012](../adr/ADR-0012-documentation-evidence-backed.md) | Documentation Must Be Evidence-backed by Runtime | Proposed |
| [ADR-0013](../adr/ADR-0013-tip-roadmap-delivery-authority.md) | TIP Roadmap Is the Delivery Authority | Proposed |

---

## 10. Required TIPs (new or reopened)

| TIP | Title | Phase | Notes |
| --- | --- | --- | --- |
| TIP-000A | Documentation Truth Audit | 0 | This audit |
| TIP-000B | Runtime Truth Matrix | 0 | Matrix doc + CI hook consideration |
| TIP-000C | Master Plan Rewrite | 0 | v5 master plan |
| TIP-000D | Glossary and Authority Normalization | 0 | Terminology sync |
| TIP-006 | AppShell Authority (reopen) | 1 | Freeze contracts — implementation ahead |
| TIP-007 | ERP Platform Authority (closeout) | 1 | Platform entity map |
| TIP-008A | Enterprise Hierarchy Authority | 1 | Evidence from 007/012 slice |
| TIP-008B | Business Master Data Authority | 1 | Customer, Product, etc. — still not started |
| TIP-011 | Execution Foundation (outbox) | 2 | Blocker for spine |
| TIP-012 | Operating Spine (lifecycle closeout) | 2 | Event publication |
| TIP-UI-03/04/05 | UI integration (status update) | 6 | Reconcile delivery docs with runtime |
| TIP-030-SA | System Admin Completion | 8 | New slice before accounting |

Full sequence: [`pre-accounting-foundation-roadmap.md`](pre-accounting-foundation-roadmap.md).

---

## 11. Final recommended delivery sequence

```text
Phase 0  Documentation truth reset (THIS AUDIT) ───────────────────►
Phase 1  Architecture authority closeout (TIP-006, 007, 008A/B) ───►
Phase 2  Platform runtime spine (context, audit, outbox) ───────────►
Phase 3  Security & permission spine (RBAC completion) ───────────►
Phase 4  Database & migration governance (RLS proof, hierarchy) ───►
Phase 5  API contract governance (all routes) ─────────────────────►
Phase 6  Design / UI / AppShell / Metadata UI (TIP-UI closeout) ───►
Phase 7  Feature manifest & module governance ─────────────────────►
Phase 8  System Admin control plane ───────────────────────────────►
Phase 9  ACCOUNTING READINESS GATE ────────────────────────────────►
         ONLY THEN: TIP-013+ Accounting Core
```

---

## 12. Manual review checklist

- [ ] Accept ADR-0009 through ADR-0013
- [ ] Update stale delivery doc statuses (TIP-UI-03/04/05, TIP-006, TIP-008)
- [ ] Architecture Authority sign-off on package registry fingerprint bump
- [ ] Verify Postgres RLS policies against glossary RLS Grant model
- [ ] Define System Admin route map before Phase 8 implementation
- [ ] Confirm outbox schema design before TIP-011 implementation PR

---

*Generated by documentation-audit skill — evidence-backed, 2026-06-23*
