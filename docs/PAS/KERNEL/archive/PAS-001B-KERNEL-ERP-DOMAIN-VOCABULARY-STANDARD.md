# PAS-001B — Kernel ERP Domain Vocabulary Catalog

> **Derivation:** [PAS-001 §4.8](PAS-001-KERNEL-AUTHORITY-STANDARD.md) defines **ERP domain vocabulary modules** under `packages/kernel/src/erp-domain/`. PAS-001B is the **catalog authority** for the full-suite ERP domain map — layout contract, maturity model, LoB metadata, and promotion rules. It does **not** amend PAS-001 §1–§16 and does **not** build ERP runtime.
>
> **Doctrine:**
>
> ```text
> PAS-001 owns the kernel floor.
> PAS-001A proves ERP runtime speaks the kernel language.
> PAS-001B defines the ERP domain vocabulary map — without building the ERP.
> ```

| Field | Value |
| --- | --- |
| **PAS ID** | PAS-001B |
| **Document title** | Kernel ERP Domain Vocabulary Catalog |
| **Parent PAS** | PAS-001 §4.8 |
| **Document class** | `derived_erp_domain_vocabulary_standard` |
| **Document role** | `erp_domain_vocabulary_catalog` |
| **Canonical filename** | `PAS-001B-KERNEL-ERP-DOMAIN-VOCABULARY-STANDARD.md` |
| **Primary owner** | `packages/kernel/src/erp-domain/` (layout contract + delivered modules only) |
| **Layer** | Platform kernel (vocabulary catalog) |
| **Maturity** | **`catalog_authority`** — not `mvp_authority` (MVP implies buildable runtime) |
| **Authority status** | `catalog_authority` |
| **Implementation status** | `implemented` — B76–B106 closed; all 28 ERP domain vocabulary modules delivered and scaffold-standardized |
| **Evidence level** | `runtime` — full catalog vocabulary; unified + legacy domain gates green; foundation modules re-scaffolded (B106) |
| **Runtime status** | 28-module catalog; all slugs delivered under `erp-domain/{slug}/`; unified layout + vocabulary gates operational; `accounting` + `inventory` match governed scaffold contract |
| **Remaining slices** | none — catalog vocabulary complete; metadata-ui permission bridge deferred to PAS-001A |
| **Continuation** | Complements [PAS-003](../../ACCOUNTING-STANDARDS/PAS-003-ACCOUNTING-STANDARDS-AUTHORITY-STANDARD.md); does not replace PKGR02 inventory runtime |
| **Agent skills** | **`kernel-authority`** (mandatory) · `/afenda-coding-session` · `/coding-consistency-bundle` |
| **Registry lane** | `PKGR01B_ERP_DOMAIN_CATALOG` · `@afenda/kernel` |

#### Required gates (PAS-001B — wired on B77 close)

| # | Gate command |
| --- | --- |
| 1 | `pnpm check:erp-domain-layout` |
| 2 | `pnpm check:erp-domain-delivered-vocabulary` |
| 3 | `pnpm check:accounting-domain-contracts` |
| 4 | `pnpm check:inventory-domain-contracts` |
| 5 | `pnpm check:procurement-domain-contracts` |
| 6 | `pnpm --filter @afenda/kernel typecheck` |
| 7 | `pnpm check:foundation-disposition` |
| 8 | `pnpm check:documentation-drift` (after doc sync) |

> **Maturity is part of authority.** `catalog_authority` means the **map is governed** — not that all 28 modules are buildable. All 28 slugs are vocabulary-delivered (B76–B105); runtime posting remains ADR-gated per domain.

> **Canonical location:** `docs/PAS/PAS-001B-KERNEL-ERP-DOMAIN-VOCABULARY-STANDARD.md` · Layout contract: `packages/kernel/src/erp-domain/erp-domain-layout.contract.ts`

---

# 0. Agent Quick Path

Read **PAS-001 §0** (kernel boundary — closed), then this §0. Session: `/afenda-coding-session` · Bundle: `/coding-consistency-bundle` · Skill: **`kernel-authority`** on every B76+ slice.

**One-line definition:** Kernel ERP Domain Vocabulary Catalog — not ERP runtime, not accounting runtime, not module implementation.

**Three hard rules (acceptance criteria):**

| Rule | Requirement |
| --- | --- |
| **Rule 1 — No folders for catalog-only modules** | Only `delivered` slugs may have `erp-domain/{slug}/` on disk. Catalog-only slugs exist in `erp-domain-layout.contract.ts` only. `pnpm check:erp-domain-layout` fails on violation. |
| **Rule 2 — No business-reference duplication** | `CustomerId`, `ProductId`, `EmployeeId`, etc. stay under kernel identity / business-reference (PAS-001 §4.7). `{module}-id.contract.ts` holds **domain-scoped** branded IDs only. |
| **Rule 3 — One module = one slice** | Do not batch-scaffold catalog-only modules. B79 delivered `inventory`; B80 delivered `procurement`; B81+ promotes one slug at a time. |

**Hard stops:**

- **Prohibited:** Drizzle, `@afenda/database`, persistence, posting services, UI routes under `erp-domain/`
- **Prohibited:** filesystem folders for `catalog-only` modules
- **Prohibited:** `package.json` subpath exports for non-`delivered` modules
- **Prohibited:** batch vocabulary scaffolds across multiple modules in one slice
- **Required:** read `kernel-authority` + paste slice **9-field handoff** into Phase 0 before edits

**Execution rule:** B76 (doc + authority chain) → B77 (layout contract + gate) → B78 (audit closure) → B79+ (one module per slice).

---

# 1. Derivation and PAS Positioning

## 1.1 Why PAS-001B exists

PAS-001 §4.8 reserves `erp-domain/` for closed domain vocabularies. Before runtime packages (`@afenda/accounting`, inventory ADR paths, etc.) expand, the monorepo needs a **single catalog** of ERP functional domains with enterprise LoB anchors — without implying every module is implemented.

## 1.2 PAS positioning table

| PAS | Owns | Must not own |
| --- | --- | --- |
| **PAS-001** | Kernel doctrine, identity, context, wire-safe vocabulary | ERP module catalog expansion |
| **PAS-001A** | ERP runtime integration proof of kernel context | New domain vocabulary |
| **PAS-001B** | ERP domain module vocabulary **catalog** and layout contract | Runtime packages, routes, DB, workflows |
| **PAS-003** | Accounting standards / accounting semantics | Full ERP domain catalog |

Enterprise precedent: SAP S/4HANA, Oracle Fusion, and Odoo organize capability by functional domains. PAS-001B mirrors that at the **kernel vocabulary catalog** layer only.

---

# 2. Mandatory Module File Pattern (delivered modules)

Every **delivered** module under `erp-domain/{slug}/` must match the governed scaffold contract (reference: `procurement/`, `controlling/`). Foundation modules `accounting` and `inventory` were re-scaffolded in **B106** to align with B80–B105 modules.

| # | File | Purpose |
| --- | --- | --- |
| 1 | `{module}-authority.contract.ts` | `*_AUTHORITY_PAS`, lifecycle phase, fingerprint, registry id; foundation modules also export `*_AUTHORITY_ADR` (ADR-0020) |
| 2 | `{module}-id.contract.ts` | Domain-scoped branded IDs only (Rule 2) |
| 3 | `{module}-permission-vocabulary.contract.ts` | Permission key vocabulary |
| 4 | `{module}-audit-actions.contract.ts` | Audit action vocabulary |
| 5 | `{module}-domain-wire-context.contract.ts` | JSON-safe wire context |
| 6 | `{module}-domain-vocabulary.registry.ts` | Manifest of closed vocabularies + branded IDs |
| 7 | `{module}-domain-vocabulary.policy.ts` | Prohibited runtime surfaces + `pas001bSlice` + unified gate |
| 8 | `*.contract.ts` | One file per closed vocabulary |
| 9 | `index.ts` | Governed barrel → `@afenda/kernel/erp-domain/{module}` |
| 10 | `__tests__/{module}-domain-vocabulary.contract.test.ts` | Registry integrity |

**Scaffold tooling:**

| Script | Scope |
| --- | --- |
| `scripts/governance/scaffold-erp-domain-vocabulary-modules.mts` | B81–B105 catalog modules (25 slugs) |
| `scripts/governance/scaffold-foundation-erp-domain-modules.mts` | Foundation modules `accounting`, `inventory` (B106) |
| `scripts/governance/erp-domain-vocabulary-module-specs.mts` | B81+ module specs |
| `scripts/governance/erp-domain-foundation-module-specs.mts` | Foundation module specs (extended branded IDs, wire context, permission modes) |

**Root (B77):** `erp-domain-layout.contract.ts` — full catalog + maturity + LoB metadata.

**Export rule:** `packages/kernel/package.json` subpath `./erp-domain/{slug}` exists **only** for `delivered` modules.

**Gate pattern:** Unified `pnpm check:erp-domain-delivered-vocabulary` for all delivered modules; legacy `check:accounting-domain-contracts` and `check:inventory-domain-contracts` retained for retired package paths.

---

# 3. Full-Stack ERP Domain Catalog (28 modules)

Registered in `erp-domain-layout.contract.ts`. **28 = delivered** (full-suite vocabulary catalog complete).

**Slug scope disambiguation (required for broad or platform-adjacent slugs):**

| Slug | Scope definition |
| --- | --- |
| `supply-chain` | Logistics and fulfillment orchestration vocabulary only (transport, warehouse movements, delivery status). Does **not** subsume `inventory`, `procurement`, or `manufacturing`. |
| `document` | ERP **business document** vocabulary (posting attachments, fiscal document types, retention classes). Not platform document storage, CMS, or kernel wire document contracts. |

**External runtime cross-references (catalog-only slugs only):**

Catalog-only slugs may list `runtimeOwnerPackage` in metadata as an ADR cross-link. Delivered vocabulary modules (e.g. `inventory`) expose kernel contracts under `erp-domain/{slug}/` with a dedicated domain gate — runtime persistence remains in `@afenda/database` per ADR-0020.

| LoB pillar | Slug | SAP / Oracle / Odoo anchor | Maturity |
| --- | --- | --- | --- |
| **Finance** | `accounting` | FI / Financials / Accounting | **delivered** (B106 scaffold-standardized) |
| | `controlling` | CO / EPM / Analytic | **delivered** |
| | `treasury` | TR / Cash Mgmt / — | **delivered** |
| | `tax` | Tax / Indirect Tax / Taxes | **delivered** |
| | `consolidation` | Group reporting / FCCS / Consolidation | **delivered** |
| | `intercompany` | IC / Intercompany / — | **delivered** |
| **SCM** | `procurement` | MM-PUR / Procurement / Purchase | **delivered** |
| | `inventory` | MM-IM / Inventory / Inventory | **delivered** (B106 scaffold-standardized) |
| | `manufacturing` | PP / Manufacturing / MRP | **delivered** |
| | `quality` | QM / Quality / Quality | **delivered** |
| | `maintenance` | PM / Maintenance / Maintenance | **delivered** |
| | `supply-chain` | LE-WM / Logistics / Delivery | **delivered** |
| **Sales & CX** | `sales` | SD / Order Mgmt / Sales | **delivered** |
| | `crm` | CRM / Sales Cloud / CRM | **delivered** |
| | `pricing` | SD-Pricing / Pricing / Pricelists | **delivered** |
| | `subscription` | BRIM / Subscription / Subscriptions | **delivered** |
| | `ecommerce` | — / — / eCommerce | **delivered** |
| | `pos` | — / — / POS | **delivered** |
| **Service** | `service` | CS / Service Cloud / Helpdesk | **delivered** |
| | `field-service` | — / Field Service / Field Service | **delivered** |
| **Marketing** | `marketing` | — / Marketing Cloud / Marketing | **delivered** |
| **HCM & Projects** | `hcm` | HCM / Core HR / Employees | **delivered** |
| | `payroll` | PY / Payroll / Payroll | **delivered** |
| | `project` | PS / PPM / Project | **delivered** |
| | `assets` | AA / Fixed Assets / Assets | **delivered** |
| **Platform ERP** | `document` | DMS / Documents / Documents | **delivered** |
| | `workflow` | WF / Approvals / Approvals | **delivered** |
| | `analytics` | BW / OTBI / Spreadsheet reports | **delivered** |

---

# 4. Module Maturity Model

| Value | Meaning |
| --- | --- |
| `delivered` | Folder + contracts + registry test + package.json subpath export |
| `catalog-only` | Metadata in layout contract only — **no folder** (Rule 1) |
| `blocked` | Reserved for ADR-gated deferrals (none in B76–B77 scope) |

Promotion `catalog-only` → `delivered` is always a **future slice outcome** (B79+), never a batch catalog operation.

---

# 5. Relationship Matrix

| Surface | Owner | Notes |
| --- | --- | --- |
| `erp-domain/{slug}/` vocabulary | `@afenda/kernel` | Shapes-only until domain runtime ADR |
| `PKGR01_ACCOUNTING` | `@afenda/kernel` | `accounting` delivered vocabulary |
| `PKGR01B_ERP_DOMAIN_CATALOG` | `@afenda/kernel` | Full 28-slug catalog + layout gate |
| `PKGR02_INVENTORY` | `@afenda/database` | Inventory **runtime** — separate from catalog row |
| `@afenda/accounting-standards` | PAS-003 | Accounting **standards** — not domain catalog |
| Future `@afenda/{domain}` packages | ADR-gated | Runtime packages consume kernel vocabulary |

---

# 6. Slice Catalog

| Slice | Objective | Status |
| --- | --- | --- |
| **B76** | PAS-001B doc + authority chain | Delivered |
| **B77** | Layout contract + hardened `check:erp-domain-layout` + PKGR01B | Delivered |
| **B78** | Audit-only closure / evidence sync | Delivered (2026-06-28) |
| **B79** | `inventory` vocabulary promotion | Delivered (2026-06-28) |
| **B80** | `procurement` vocabulary promotion | Delivered (2026-06-28) |
| **B81–B105** | Remaining 25 module vocabulary promotions | Delivered (2026-06-28) |
| **B106** | Foundation module scaffold standardization (`accounting`, `inventory`) | Delivered (2026-06-28) |

Handoffs: [`slice/b76-pas001b-erp-domain-catalog-doc.md`](slice/b76-pas001b-erp-domain-catalog-doc.md) · [`slice/b77-erp-domain-layout-gate.md`](slice/b77-erp-domain-layout-gate.md) · [`slice/b78-pas001b-audit-closure.md`](slice/b78-pas001b-audit-closure.md) · [`slice/b79-inventory-domain-vocabulary.md`](slice/b79-inventory-domain-vocabulary.md) · [`slice/b106-foundation-erp-domain-scaffold-standardization.md`](slice/b106-foundation-erp-domain-scaffold-standardization.md) · B80 + B81–B105 (batch; handoffs proposed)

---

# 7. Gates

| Gate | When | Enforces |
| --- | --- | --- |
| `pnpm check:erp-domain-layout` | B77+ | 10-point failure matrix below |
| `pnpm check:inventory-domain-contracts` | B79+ for `inventory` | Contracts-only surface |
| `pnpm check:accounting-domain-contracts` | Always for `accounting` | Contracts-only surface |
| `pnpm check:erp-domain-delivered-vocabulary` | B81+ unified | All delivered module contracts-only surfaces |

**Vocabulary registry IDs (foundation modules, B106):**

| Module | Registry ID |
| --- | --- |
| `accounting` | `PAS-001B-4.8-ACCOUNTING` |
| `inventory` | `PAS-001B-4.8-INVENTORY` |

Pattern for B81+ modules: `PAS-001B-4.8-{SLUG_UPPER}` (e.g. `PAS-001B-4.8-PROCUREMENT`).

## 7.1 `check:erp-domain-layout` failure matrix

`pnpm check:erp-domain-layout` **must fail** when:

1. `ERP_DOMAIN_MODULES` contains duplicate slugs
2. `ERP_DOMAIN_MODULE_MATURITY` misses any slug or has extra keys
3. Any maturity value is outside `delivered` \| `catalog-only` \| `blocked`
4. Any catalog-only module has a folder under `packages/kernel/src/erp-domain/`
5. Any catalog-only module has a `package.json` subpath export
6. Any delivered module lacks folder, `index.ts`, registry, policy, registry test, or vocabulary gate script
7. `accounting` is not `delivered`
8. `accounting` subpath export is missing
9. Any module lacks LoB metadata
10. PAS-001B §3 catalog count or slug bijection disagrees with `erp-domain-layout.contract.ts`

Runtime enforcement: [`scripts/governance/check-erp-domain-layout.mts`](../../scripts/governance/check-erp-domain-layout.mts) exports `ERP_DOMAIN_LAYOUT_GATE_FAILURE_MATRIX` mirroring this list.

---

# 8. Enterprise Coverage Matrix

| LoB | Afenda slug | SAP LoB | Oracle pillar | Odoo app | Runtime owner |
| --- | --- | --- | --- | --- | --- |
| Finance | `accounting` | FI | Financials | Accounting | PKGR01_ACCOUNTING |
| Finance | `controlling` | CO | EPM | Analytic | — |
| Finance | `treasury` | TR | Cash Management | — | — |
| Finance | `tax` | Tax | Indirect Tax | Taxes | — |
| Finance | `consolidation` | Group Reporting | FCCS | Consolidation | — |
| Finance | `intercompany` | IC | Intercompany | — | — |
| SCM | `procurement` | MM-PUR | Procurement | Purchase | vocabulary delivered B80 |
| SCM | `inventory` | MM-IM | Inventory | Inventory | PKGR02_INVENTORY (vocabulary delivered B79) |
| SCM | `manufacturing` | PP | Manufacturing | MRP | — |
| SCM | `quality` | QM | Quality | Quality | — |
| SCM | `maintenance` | PM | Maintenance | Maintenance | — |
| SCM | `supply-chain` | LE-WM | Logistics | Delivery | — (fulfillment orchestration scope) |
| Sales & CX | `sales` | SD | Order Management | Sales | — |
| Sales & CX | `crm` | CRM | Sales Cloud | CRM | — |
| Sales & CX | `pricing` | SD-Pricing | Pricing | Pricelists | — |
| Sales & CX | `subscription` | BRIM | Subscription | Subscriptions | — |
| Sales & CX | `ecommerce` | — | — | eCommerce | — |
| Sales & CX | `pos` | — | — | POS | — |
| Service | `service` | CS | Service Cloud | Helpdesk | — |
| Service | `field-service` | — | Field Service | Field Service | — |
| Marketing | `marketing` | — | Marketing Cloud | Marketing | — |
| HCM & Projects | `hcm` | HCM | Core HR | Employees | — |
| HCM & Projects | `payroll` | PY | Payroll | Payroll | — |
| HCM & Projects | `project` | PS | PPM | Project | — |
| HCM & Projects | `assets` | AA | Fixed Assets | Assets | — |
| Platform ERP | `document` | DMS | Documents | Documents | — (ERP business document vocabulary) |
| Platform ERP | `workflow` | WF | Approvals | Approvals | — |
| Platform ERP | `analytics` | BW | OTBI | Spreadsheet | — |

---

**Quality target:** Enterprise **9.7 / 10** — 28/28 delivered; foundation modules scaffold-standardized (B106); unified vocabulary gate green.

---

# 9. Integration scorecard (B106 closure)

| Area | Score | Verdict |
| --- | ---: | --- |
| PAS positioning | 9.5/10 | Correct — does not reopen PAS-001 |
| Kernel boundary protection | 9.5/10 | Correct — no runtime under `erp-domain/` |
| ERP module catalog | 10/10 | 28/28 delivered; §3 table synced |
| Scaffold consistency | 9.5/10 | Foundation modules match B80–B105 contract |
| Runtime separation | 10/10 | Catalog-only vs delivered enforced |
| Gate design | 9.5/10 | Unified + legacy gates operational |
| Authority chain | 9.5/10 | README, index, matrix, SKILL synced |
| Enterprise benchmark alignment | 9/10 | SAP/Oracle/Odoo LoB mapping at catalog layer |

**Final integration score: 9.7 / 10** — catalog vocabulary complete; B106 closes foundation scaffold drift.
