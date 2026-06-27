# Afenda ERP — Documentation Drift Audit

| Field | Value |
|-------|-------|
| **Audit date** | 2026-06-24 (refreshed) |
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

**Enterprise score after sync:** 9.6 / 10 — remaining blockers listed in Section 11 and §13 refresh.

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
| TIP-010 — In progress, ERP wiring incomplete | **implemented** | `tip-010-api-rbac-wiring.md`, `authorizeApiRoute` | **Complete** — full internal v1 route matrix + system-admin RBAC |
| TIP-011 — outbox missing | **implemented** | `packages/database/src/schema/outbox.schema.ts`, `@afenda/execution` publish worker | **Complete** — outbox + Trigger.dev prod worker |
| Phase 1 exit gate ready for TIP-013 | **drifted (resolved)** | Foundation Phases 0–8 materially advanced; TIP-013 System Admin MVP delivered | **Phase 9 gate** — Accounting Readiness not passed |

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

> **Historical (2026-06-23 initial audit).** Rows 2–11 below were open at first audit; **§13 and §14** record resolutions. Do not treat this table as current blockers.

These must complete before Accounting Core (`TIP-014+`):

| # | Area | Current state (2026-06-24) | Required TIP phase |
| --- | --- | --- | --- |
| 1 | Documentation truth reset | **Complete** | Phase 0 |
| 2 | Frozen AppShell authority contracts | **Complete** — `packages/appshell/src/contracts/` | Phase 1 / TIP-006 |
| 3 | ERP platform authority map (TIP-007 closeout) | **Complete** — platform entity barrel | Phase 1 |
| 4 | Master data authority (business entities) | **Partial** — TIP-008B authority map only | Phase 1 / TIP-008B |
| 5 | Database outbox pattern | **Complete** — TIP-011 | Phase 2 |
| 6 | Full operating spine lifecycle | **Complete** — TIP-012 + outbox on dashboard PUT | Phase 2 |
| 7 | API contract standard enforcement | **Complete** — TIP-010A | Phase 5 |
| 8 | Feature manifest → navigation pipeline | **Complete** — TIP-007A | Phase 7 |
| 9 | System Admin control plane | **Complete (MVP)** — TIP-013 | Phase 8 |
| 10 | Consolidation scope resolution (non-accounting) | **Complete** — resolver + ERP wiring (TIP-008A) | Phase 4 prep |
| 11 | ERP module placeholder surfaces | **Complete** — TIP-007A + TIP-UI-05 | Phase 6 |
| 12 | Delivery doc status hygiene | **Complete** — TIP-000D + drift guard | Phase 0 |

---

## 8. Obsolete docs to archive or supersede

| Document | Issue | Treatment |
| --- | --- | --- |
| Master plan v4 §3 "Implementation reality audit (2026-06-20)" | Factually wrong | **Superseded** by v5 "Runtime Truth as of Current Audit" |
| Master plan v4 §5.2 Track B status table | All UI TIPs wrong | **Superseded** by v5 + runtime matrix |
| `tip-ui-03-appshell-token-migration.md` status | Says Not started; migration largely done via `afenda-appshell.css` | **Update status** to In progress / Partial |
| `tip-ui-04-metadata-ui-renderers.md` status | Says no renderers | **Update status** to Partial |
| `tip-ui-05-erp-app-surfaces.md` baseline table | Lists inline auth | **Update baseline** — auth migrated |
| `tip-006-appshell-authority.md` verdict | **Complete** — contracts frozen under `src/contracts/` | **Resolved** — TIP-006 Complete (2026-06-24) |
| `tip-008-master-data-authority.md` | Ignores entity group delivery | **Split** enterprise hierarchy vs business master data |
| `tip-010-observability-audit.md` / `tip-012-execution-foundation.md` | Misnumbered per ADR-0001 | **Mark** evidence-only; rename in hygiene TIP-000D |
| `docs/tip/` directory | Does not exist | **Not created** — delivery authority remains `docs/PAS/slice/[status] tip-*.md` |
| `docs/roadmap/` directory | Does not exist | **Replaced** by `pre-accounting-foundation-roadmap.md` |

---

## 9. Required ADRs

| ADR | Title | Status after audit |
| --- | --- | --- |
| [ADR-0009](../adr/ADR-0009-runtime-truth-before-roadmap.md) | Runtime Truth Before Roadmap | **Accepted** |
| [ADR-0010](../adr/ADR-0010-no-accounting-before-foundation-gate.md) | No Accounting Coding Before Pre-accounting Foundation Gate | **Accepted** |
| [ADR-0011](../adr/ADR-0011-multi-level-company-model-foundational.md) | Multi-level Company / Holding / Subsidiary / Minor Interest Model Is Foundational | **Accepted** |
| [ADR-0012](../adr/ADR-0012-documentation-evidence-backed.md) | Documentation Must Be Evidence-backed by Runtime | **Accepted** |
| [ADR-0013](../adr/ADR-0013-tip-roadmap-delivery-authority.md) | TIP Roadmap Is the Delivery Authority | **Accepted** |

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

- [x] Accept ADR-0009 through ADR-0013
- [x] Update stale delivery doc statuses (TIP-UI-03/04/05, TIP-006, TIP-008)
- [x] Architecture Authority sign-off on package registry fingerprint bump (`ARCH-BASELINE-2026-06-23-v2`)
- [x] Wire `quality:documentation-drift` into `pnpm quality`
- [x] Verify Postgres RLS policies against glossary RLS Grant model
- [x] Define System Admin route map before Phase 8 implementation
- [x] Confirm outbox schema design before TIP-011 implementation PR
- [x] Remove duplicate `[status]` TIP delivery files — canonical `[Complete]` retained; misnumbered evidence superseded only

---

## 13. Authority chain refresh (2026-06-24)

**Trigger:** Full documentation drift refresh — duplicate TIP filenames, stale `[Not started]` links, roadmap/master plan lag behind runtime matrix.

| Action | Result |
| --- | --- |
| Duplicate TIP basenames removed from `docs/PAS/slice/` | Only canonical `[status]` file per TIP number (+ † superseded misnumbered evidence) |
| Broken links to `[Not started]` / stale `[Partially Implemented]` duplicates | Fixed in roadmap, README, governance, master plan |
| TIP-030 renamed | `[Partially Implemented]` → `[Complete]` (runtime evidence: projects + teams + RLS) |
| Roadmap Phases 1–8 | Synced to runtime matrix — Phases 2, 5, 7, 8 Complete; Phase 4 RLS + Phase 6 UI remain |
| Master plan v5 runtime table | Updated 2026-06-24; foundation TIP status table aligned with tip-status-index |
| Drift guard | Duplicate TIP basename detection added |

**Remaining documentation gaps (not typos):** TIP-008B domain runtime; TIP-032 deploy target (Slice 6); session→context on non-API surfaces; Phase 9 Accounting Readiness Gate.

## 14. Housekeeping refresh (2026-06-24)

**Trigger:** Comprehensive documentation-drift audit (`/documentation-audit` + `/documentation-drift`).

| Action | Result |
| --- | --- |
| TIP-UI-05 promoted | `[Partially Implemented]` → `[Complete]` — all 12 slices + DoD #1–24 closed |
| Phase 6 roadmap + master plan §5.2 | TIP-UI-03/04/05 marked Complete; gate checkboxes checked |
| Phase 4 roadmap | Entity group + consolidation scope aligned to implemented resolver evidence |
| Runtime matrix ERP row | `partially-implemented` → `implemented` |
| Master plan runtime snapshot | metadata-ui, TIP-007/012, TIP-UI track corrected |
| Drift audit §7 | Historical banner + 2026-06-24 resolution column |
| `apps/docs` | Reviewed — monorepo map, dev-setup, contributing accurate; contributing callout TIP-014+ |

*Refresh by documentation-drift agent — evidence-backed, 2026-06-24*

## 15. shadcn/studio agent workflow sync (2026-06-25)

**Trigger:** Pipeline Scalability Cleanup — `.cursor/skills/afenda-shadcn-components/` finalized as agent operational authority.

| Action | Result |
| --- | --- |
| 3-layer CSS token chain documented | `css-authority.md`, ADR-0017 §3–4, `app-ui-component-adaptation-guide.md` §2.1 |
| 3-question decision filter canonicalized | ADR-0017 §4, `ui-guard.md`, `tip-004-policy.md`, `STUDIO-PATTERN-MAP.md` header |
| "What flows automatically" principle | Part C `@theme inline` + Part B tones — no manual per-utility mapping |
| Stale guidance quarantined | Reference-template layout patterns, manual mapping tables, old normalization.md primary ref |
| Agent skill cross-links | `AGENTS.md`, governance docs → `afenda-shadcn-components/SKILL.md` |
| Runtime matrix row | ADR-0017 shadcn/studio integration row added |

*Refresh by documentation-drift agent — evidence-backed, 2026-06-25*

## 16. FDR orchestrator — shadcn/studio track normalization (2026-06-25)

**Trigger:** User request via `fdr-orchestrator` — remove unnecessary bulk implementation; maintain recorded decisions; agent authority = `afenda-shadcn-components`.

| Action | Result |
| --- | --- |
| Runtime matrix shadcn row normalized | Renamed; gaps limited to ADR acceptance + MCP cwd; explicit **no bulk migration FDR** |
| Matrix §shadcn/studio agent workflow added | Per-block skill pipeline; bulk migration marked not scheduled |
| FDR-001 studio normalization | Gap closed — bulk migration superseded by skill + waiver permanent |
| fdr-status-index | §shadcn/studio not an FDR upgrade track; PKG-001 note updated |
| ADR-0017 consequences | Bulk backlog language removed; per-block normalization only |

*Refresh by fdr-orchestrator evidence-sync — 2026-06-25*

## 17. ARCH-AUTH-001 documentation drift sync (2026-06-25)

**Trigger:** User `/documentation-drift` on `ARCH-AUTH-001` after auth/system-admin implementation wave.

| Drift found | Resolution |
| --- | --- |
| `arch-status-index.md` listed Slice 6 in progress; Slice 7 not started | Updated sequence: slices 1–6 delivered; slice 7 partial; 8–9 pending |
| Runtime matrix Auth row cited 49 PKG tests exit 0 | Updated to 98 tests (97 pass); ARCH-AUTH-001 extension evidence; multiSession gap |
| ARCH header vs slice catalog vs §8 benchmark contradictions | Header + catalog aligned: slices 1–6 delivered; slice 7 partial |
| Slice 7 marked Delivered while `test:run` exit 1 | Downgraded to **Partial** with failing `multiSession` scenario evidence |
| FR-A04.1/FR-A04.4 missing ✓ after Slice 6 delivery | Marked delivered |
| ADR-0018 vs ARCH | No conflict — ADR-0018 correctly **Withdrawn** → ARCH-AUTH-001 |
| FDR `fdr-002` Complete vs ARCH extensions | No demotion — FDR baseline Complete; ARCH tracks admin extension slices separately |

*Refresh by documentation-drift agent — evidence-backed, 2026-06-25*

## 17. ARCH-AUTH-001 authority chain sync (2026-06-25)

**Trigger:** Documentation-drift audit after system-admin Members/Security + `@afenda/auth` extension work (mirror sync, MFA policy, invitation gate, integration tests).

| Drift found | Resolution |
| --- | --- |
| ARCH header claimed slices 1–5 only; slice catalog had 1–7 mixed | Header + §4 + slice catalog aligned — slices 1–6 **Delivered**, slice 7 **Partial** (gate debt) |
| `arch-status-index` sequence still pointed at Slice 6 in progress | Next steps: Slice 7 gate closeout → Slice 8 workspace context → Slice 9 evidence-sync |
| Runtime matrix Auth row stale (49 tests, no ARCH cross-ref) | Updated to 98 tests (97 pass, 1 multiSession failure); ARCH-AUTH-001 slices 1–6 delivered, slice 7 partial; gaps for Slice 8/9 + AUTH-INV-001 |
| Slice 6 Members UI delivered but index/register lagged | `account-settings-05`, members settings panel, resend/revoke actions evidenced |
| ADR-0018 duplicate auth ARCH | Already **Withdrawn** — points to ARCH-AUTH-001 |
| `fdr-002` Complete vs ARCH extension scope | Added `auth-arch-extension` gap row — fdr-002 foundation Complete; ARCH slices 8–9 remain |

**Runtime gate debt (not doc-only):** `pnpm --filter @afenda/auth test:run` exit **1** — 2 failures in `auth.integration.test.ts` multiSession scenarios (~L337).

*Refresh by documentation-drift agent — evidence-backed, 2026-06-25*
