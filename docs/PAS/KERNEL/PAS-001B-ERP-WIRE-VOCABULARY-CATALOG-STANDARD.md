# PAS-001B — ERP Wire Vocabulary Catalog Standard

> **Platform Wire Vocabulary Catalog Authority** — governs ERP **wire** vocabulary under `packages/kernel/src/erp-domain/`. Not business glossary (PAS-004). Not domain runtime. Legacy archive: [KERNEL/PAS-001B-ERP-WIRE-VOCABULARY-CATALOG-STANDARD.md](archive/PAS-001B-KERNEL-ERP-DOMAIN-VOCABULARY-STANDARD.md).
>
> **Naming note:** Former title *Kernel Domain Vocabulary Catalog* implied business glossary. This PAS owns **wire shapes only** — aligned with Kernel Blueprint §3.4 and Enterprise Knowledge (PAS-004) for meaning.

| Field | Value |
| --- | --- |
| **PAS ID** | PAS-001B |
| **Document title** | ERP Wire Vocabulary Catalog Standard |
| **Document class** | `derived_erp_wire_vocabulary_standard` |
| **Document role** | `platform_wire_vocabulary_catalog_authority` |
| **Authority role** | `catalog_authority` — governs wire vocabulary **map**, not domain runtime |
| **Blueprint box** | **Kernel Domain Vocabulary Catalog** *(box name)* · **ERP Wire Vocabulary Catalog** *(PAS scope)* |
| **Parent PAS** | [PAS-001](PAS-001-KERNEL-VOCABULARY-AUTHORITY-STANDARD.md) §4.8 seed |
| **Primary owner** | `packages/kernel/src/erp-domain/` |
| **Layer** | Platform (wire vocabulary catalog) |
| **Maturity** | Enterprise Accepted (`enterprise_accepted`) |
| **Authority status** | `enterprise_accepted` |
| **Implementation status** | `implemented` — B76–B106 closed |
| **Evidence level** | `runtime` — 28/28 delivered wire modules; unified gates green |
| **Runtime status** | Full 28-slug wire catalog; layout + vocabulary gates operational; foundation modules scaffold-standardized (B106) |
| **Remaining slices** | none |
| **Registry lane** | `PKGR01B_ERP_DOMAIN_CATALOG` · `@afenda/kernel` |
| **Agent skills** | `kernel-authority` · `/afenda-coding-session` |
| **Upstream** | [Kernel Blueprint](../../BLUEPRINT/kernel-blueprint.md) §3.4 · Kernel NS §3.2 ERP wire vocabulary |
| **Legacy archive** | [KERNEL/PAS-001B-ERP-WIRE-VOCABULARY-CATALOG-STANDARD.md](archive/PAS-001B-KERNEL-ERP-DOMAIN-VOCABULARY-STANDARD.md) |
| **Continuation** | Complements [PAS-003](../ACCOUNTING-STANDARDS/PAS-003-ACCOUNTING-STANDARDS-AUTHORITY-STANDARD.md) · meaning in [PAS-004](../PAS-004-ENTERPRISE-KNOWLEDGE-STANDARD.md) |
| **Last reviewed** | 2026-06-29 |

#### Required gates

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

> **Maturity is part of authority.** Document maturity = **Enterprise Accepted**. Authority role = **catalog_authority** (what this PAS governs). Runtime posting remains ADR-gated per domain under future runtime PAS packages.

> **Canonical location (composed):** `docs/PAS/KERNEL/PAS-001B-ERP-WIRE-VOCABULARY-CATALOG-STANDARD.md`
> **Layout contract:** `packages/kernel/src/erp-domain/erp-domain-layout.contract.ts`

---

# 0. Agent Quick Path

Read [PAS-001 §0](PAS-001-KERNEL-VOCABULARY-AUTHORITY-STANDARD.md#0-agent-quick-path), then this §0.

**One line:** ERP Wire Vocabulary Catalog — wire shapes in kernel; meaning in Enterprise Knowledge; runtime in domain packages.

**Three hard rules:**

| Rule | Requirement |
| --- | --- |
| **Rule 1** | Only `delivered` slugs may have `erp-domain/{slug}/` folders |
| **Rule 2** | `CustomerId`, `ProductId`, etc. stay under kernel identity — not domain `{module}-id` duplication |
| **Rule 3** | One module = one slice — no batch scaffold across modules |

**Hard stops:**

- No Drizzle, `@afenda/database`, persistence, posting, UI routes under `erp-domain/`
- No folders for `catalog-only` modules
- No `package.json` subpath exports for non-`delivered` modules
- Read `kernel-authority` + 9-field handoff before edits

**Doctrine:**

```text
PAS-001 owns the kernel floor.
PAS-001A proves ERP runtime speaks the kernel language.
PAS-001B defines the ERP wire vocabulary map — without building the ERP.

Catalog authority ≠ domain runtime authority.
Kernel owns wire; Enterprise Knowledge owns meaning.
```

---

# 1. Derivation and PAS Positioning

| PAS | Owns | Must not own |
| --- | --- | --- |
| **PAS-001** | Kernel doctrine, identity, context, wire-safe vocabulary | ERP wire catalog expansion |
| **PAS-001A** | ERP runtime integration proof | New wire vocabulary |
| **PAS-001B** | ERP **wire** vocabulary **catalog** + layout contract | Runtime packages, routes, DB, workflows, business glossary |

Enterprise precedent: SAP/Oracle/Odoo organize by functional domains — PAS-001B mirrors that at **wire vocabulary catalog** layer only.

**Source:** ADR-0020 · Kernel NS §3.2 · Kernel Blueprint §3.4 (T0/T5)

---

# 2. Mandatory Module File Pattern (delivered modules)

Every **delivered** module under `erp-domain/{slug}/` matches the governed scaffold:

| # | File | Purpose |
| --- | --- | --- |
| 1 | `{module}-authority.contract.ts` | PAS/ADR fingerprint, registry id, **KV-* module id** |
| 2 | `{module}-id.contract.ts` | Domain-scoped branded IDs only |
| 3 | `{module}-permission-vocabulary.contract.ts` | Permission key vocabulary |
| 4 | `{module}-audit-actions.contract.ts` | Audit action vocabulary |
| 5 | `{module}-domain-wire-context.contract.ts` | JSON-safe wire context |
| 6 | `{module}-domain-vocabulary.registry.ts` | Closed vocabulary manifest |
| 7 | `{module}-domain-vocabulary.policy.ts` | Prohibited surfaces + gate |
| 8 | `*.contract.ts` | One per closed vocabulary |
| 9 | `index.ts` | Governed barrel |
| 10 | `__tests__/{module}-domain-vocabulary.contract.test.ts` | Registry integrity |

**Root:** `erp-domain-layout.contract.ts` — full catalog + layout maturity + LoB metadata + **KV-* ids**.

**Export rule:** `package.json` subpath `./erp-domain/{slug}` only for `delivered` modules.

Full scaffold tooling: legacy [PAS-001B §2](archive/PAS-001B-KERNEL-ERP-DOMAIN-VOCABULARY-STANDARD.md#2-mandatory-module-file-pattern-delivered-modules).

---

# 3. ERP Wire Vocabulary Catalog (28 modules)

All 28 slugs **delivered** at wire vocabulary layer. Machine registry: `erp-domain-layout.contract.ts`.

| KV ID | Slug | LoB pillar | Registry test id pattern |
| --- | --- | --- | --- |
| **KV-ACCT** | `accounting` | Finance | `PAS-001B-4.8-ACCOUNTING` |
| **KV-CTRL** | `controlling` | Finance | `PAS-001B-4.8-CONTROLLING` |
| **KV-TRE** | `treasury` | Finance | `PAS-001B-4.8-TREASURY` |
| **KV-TAX** | `tax` | Finance | `PAS-001B-4.8-TAX` |
| **KV-CONS** | `consolidation` | Finance | `PAS-001B-4.8-CONSOLIDATION` |
| **KV-IC** | `intercompany` | Finance | `PAS-001B-4.8-INTERCOMPANY` |
| **KV-PROC** | `procurement` | SCM | `PAS-001B-4.8-PROCUREMENT` |
| **KV-INV** | `inventory` | SCM | `PAS-001B-4.8-INVENTORY` |
| **KV-MFG** | `manufacturing` | SCM | `PAS-001B-4.8-MANUFACTURING` |
| **KV-QM** | `quality` | SCM | `PAS-001B-4.8-QUALITY` |
| **KV-PM** | `maintenance` | SCM | `PAS-001B-4.8-MAINTENANCE` |
| **KV-SC** | `supply-chain` | SCM | `PAS-001B-4.8-SUPPLY-CHAIN` |
| **KV-SD** | `sales` | Sales & CX | `PAS-001B-4.8-SALES` |
| **KV-CRM** | `crm` | Sales & CX | `PAS-001B-4.8-CRM` |
| **KV-PRC** | `pricing` | Sales & CX | `PAS-001B-4.8-PRICING` |
| **KV-SUB** | `subscription` | Sales & CX | `PAS-001B-4.8-SUBSCRIPTION` |
| **KV-ECOM** | `ecommerce` | Sales & CX | `PAS-001B-4.8-ECOMMERCE` |
| **KV-POS** | `pos` | Sales & CX | `PAS-001B-4.8-POS` |
| **KV-SVC** | `service` | Service | `PAS-001B-4.8-SERVICE` |
| **KV-FS** | `field-service` | Service | `PAS-001B-4.8-FIELD-SERVICE` |
| **KV-MKT** | `marketing` | Marketing | `PAS-001B-4.8-MARKETING` |
| **KV-HCM** | `hcm` | HCM & Projects | `PAS-001B-4.8-HCM` |
| **KV-PY** | `payroll` | HCM & Projects | `PAS-001B-4.8-PAYROLL` |
| **KV-PS** | `project` | HCM & Projects | `PAS-001B-4.8-PROJECT` |
| **KV-AA** | `assets` | HCM & Projects | `PAS-001B-4.8-ASSETS` |
| **KV-DOC** | `document` | Platform ERP | `PAS-001B-4.8-DOCUMENT` |
| **KV-WF** | `workflow` | Platform ERP | `PAS-001B-4.8-WORKFLOW` |
| **KV-AN** | `analytics` | Platform ERP | `PAS-001B-4.8-ANALYTICS` |

**KV ID rule:** Stable across PAS, Blueprint, tests, ADRs, and Enterprise Knowledge `realizationMapping` — cite **KV-*** in reviews, not slug alone.

**Slug disambiguation:**

- `supply-chain` (**KV-SC**) — logistics/fulfillment orchestration only
- `document` (**KV-DOC**) — ERP business document wire vocabulary; not platform CMS

Full SAP/Oracle/Odoo anchor table: legacy [PAS-001B §3](archive/PAS-001B-KERNEL-ERP-DOMAIN-VOCABULARY-STANDARD.md#3-full-stack-erp-domain-catalog-28-modules).

---

## 3.1 Vocabulary classification

Within each delivered module, contracts classify wire vocabulary by **shape role** — not business meaning (PAS-004).

| Category | Typical contract file | Example (accounting) | Owner |
| --- | --- | --- | --- |
| **Identity** | `{module}-id.contract.ts` | Domain-scoped document IDs | Kernel wire |
| **Enumeration** | `*-status.contract.ts`, `posting-status` | `PostingStatus` enum | Kernel wire |
| **Classification** | `account-type.contract.ts` | `AccountType` | Kernel wire · label trace PAS-004 |
| **Context** | `{module}-domain-wire-context.contract.ts` | JSON-safe wire context frame | Kernel wire |
| **Event** | envelope refs in registry | Business event name in envelope | Kernel wire shape · dispatch outside kernel |
| **Reference** | permission/audit vocab | `PermissionModuleKey`, audit action | Kernel wire |
| **Authority** | `{module}-authority.contract.ts` | PAS fingerprint, KV id | Catalog metadata |

**Review rule:** If a row is contested **business meaning** → PAS-004 atom first. If wire-safe enum/shape → catalog module contract.

---

## 3.2 Catalog dependency graph (conceptual)

Conceptual wire-vocabulary dependencies only — **not runtime**, not import graphs, not service orchestration.

**Finance chain:**

```text
Identity (PAS-001)
        ↓
KV-ACCT Accounting wire
        ↓
KV-TAX Tax wire
        ↓
KV-CONS Consolidation wire
        ↓
KV-AN Analytics wire (reporting vocabulary)
```

**Order-to-cash chain:**

```text
Identity · Business reference (PAS-001)
        ↓
KV-CRM CRM wire
        ↓
KV-SD Sales wire
        ↓
KV-PRC Pricing wire
        ↓
KV-SUB Subscription wire
```

**Supply chain chain:**

```text
KV-PROC Procurement wire
        ↓
KV-INV Inventory wire
        ↓
KV-MFG Manufacturing wire
        ↓
KV-QM Quality wire
        ↓
KV-SC Supply-chain orchestration wire
```

**HCM chain:**

```text
Identity (PAS-001)
        ↓
KV-HCM HCM wire
        ↓
KV-PY Payroll wire
        ↓
KV-PS Project wire
```

Arrows mean **vocabulary assumes earlier wire terms may appear in wire context** — not that modules call each other at runtime.

---

# 4. Maturity models

Two complementary models: **layout registry** (what exists on disk today) and **catalog lifecycle** (full promotion path to runtime PAS).

## 4.1 Layout registry maturity

Values in `erp-domain-layout.contract.ts` — enforced by `check:erp-domain-layout`.

| Value | Meaning |
| --- | --- |
| `catalog-only` | Metadata in layout contract only — **no folder** |
| `delivered` | Folder + contracts + registry test + package.json subpath |
| `blocked` | ADR-gated deferrals |

Promotion `catalog-only` → `delivered` is always a **future slice** — never batch catalog operation.

## 4.2 Catalog lifecycle (full promotion path)

Relationship to future domain runtime PAS documents:

```text
Proposed → Catalog → Delivered → Runtime → Deprecated
```

| Lifecycle stage | Maps to | Meaning |
| --- | --- | --- |
| **Proposed** | — (pre-catalog) | Domain identified; no layout row yet |
| **Catalog** | `catalog-only` | Slug registered in layout contract; no filesystem module |
| **Delivered** | `delivered` | Wire vocabulary on disk under `erp-domain/{slug}/` |
| **Runtime** | Future `@afenda/{domain}` PAS | Persistence, services, workflows — **outside PAS-001B** |
| **Deprecated** | `blocked` or tombstone ADR | Wire module retired; consumers migrate |

**Constitutional law:** Catalog authority ≠ domain runtime authority. **Delivered** wire vocabulary does not imply **Runtime** domain package.

---

# 5. Relationship Matrix

| Surface | Owner | Notes |
| --- | --- | --- |
| `erp-domain/{slug}/` wire vocabulary | `@afenda/kernel` | Shapes-only until domain runtime ADR |
| `PKGR01_ACCOUNTING` | `@afenda/kernel` | **KV-ACCT** delivered wire |
| `PKGR01B_ERP_DOMAIN_CATALOG` | `@afenda/kernel` | Full 28-slug wire map |
| `PKGR02_INVENTORY` | `@afenda/database` | Inventory **runtime** — separate from **KV-INV** wire |
| `@afenda/accounting-standards` | PAS-003 | Standards — not wire catalog |
| **Business meaning** | `@afenda/enterprise-knowledge` | PAS-004 atoms |
| **Wire shape** | **PAS-001B (this PAS)** | Enums, branded IDs, wire context |

```text
Kernel     → Wire vocabulary (PAS-001 + PAS-001B)
Database   → Runtime persistence (domain ADR)
Enterprise Knowledge → Meaning (PAS-004)
```

**Hard rule:** Do not store contested business definitions in kernel wire contracts. Promote meaning to Enterprise Knowledge; retain wire-safe enum/shape in catalog after NS + knowledge alignment.

---

# 6. Slice Catalog

| Slice | Objective | KV / status |
| --- | --- | --- |
| **B76** | PAS-001B doc + authority chain | — · Delivered |
| **B77** | Layout contract + `check:erp-domain-layout` + PKGR01B | — · Delivered |
| **B78** | Audit closure / evidence sync | — · Delivered |
| **B79** | `inventory` wire promotion | KV-INV · Delivered |
| **B80** | `procurement` wire promotion | KV-PROC · Delivered |
| **B81–B105** | Remaining 25 module promotions | KV-* · Delivered |
| **B106** | Foundation scaffold (`accounting`, `inventory`) | KV-ACCT · KV-INV · Delivered |

Handoffs (SSOT): [SLICE/kernel-slice-catalog.md §4](SLICE/kernel-slice-catalog.md#4-pas-001b--erp-wire-vocabulary-catalog) — individual composed handoffs B76–B106 in [KERNEL/SLICE/](SLICE/) · legacy archive non-compliant per [slice-compliance-audit.md](SLICE/slice-compliance-audit.md)

**Catalog:** [SLICE/kernel-slice-catalog.md §4](SLICE/kernel-slice-catalog.md#4-pas-001b--erp-wire-vocabulary-catalog)

---

# 7. Required Gates

## 7.1 Gate summary

See metadata **Required gates** table. Unified gate `check:erp-domain-delivered-vocabulary` covers B81+ modules.

## 7.2 Layout failure matrix

`pnpm check:erp-domain-layout` **must fail** when:

1. Duplicate slugs or **KV-* ids** in registry
2. Maturity map mismatch
3. Invalid layout maturity values
4. Catalog-only module has folder
5. Catalog-only module has subpath export
6. Delivered module missing scaffold files
7. `accounting` (**KV-ACCT**) not delivered
8. `accounting` subpath missing
9. Missing LoB metadata
10. §3 catalog count disagrees with layout contract

Enforcement: `scripts/governance/check-erp-domain-layout.mts`

Full matrix: legacy [PAS-001B §7.1](archive/PAS-001B-KERNEL-ERP-DOMAIN-VOCABULARY-STANDARD.md#71-checkerp-domain-layout-failure-matrix).

---

# 8. Enterprise Acceptance Criteria

| Criterion | Gate | Upstream EFR |
| --- | --- | --- |
| Layout contract enforced | `check:erp-domain-layout` | ERP wire catalog (Kernel NS §3.2) |
| 28/28 delivered wire vocabulary | `check:erp-domain-delivered-vocabulary` | Kernel Blueprint Catalog box |
| Foundation modules scaffold-aligned | B106 · KV-ACCT · KV-INV | ADR-0020 lineage |
| No runtime under erp-domain | policy contracts + boundaries | Kernel NS §9 |
| Wire vs meaning split | PAS-004 alignment · §5 matrix | Kernel Blueprint §3.4 |

Integration scorecard at B106 closure: **9.7/10** — legacy [PAS-001B §9](archive/PAS-001B-KERNEL-ERP-DOMAIN-VOCABULARY-STANDARD.md#9-integration-scorecard-b106-closure).

---

# 9. Doctrine

```text
Catalog authority ≠ domain runtime authority.
Wire shape in kernel; business meaning in Enterprise Knowledge.
One slug · one KV id · one slice · one governed folder when delivered.
```

**Platform constitutional laws (recurring — proposed single artifact):**

1. Meaning before implementation
2. Vocabulary before behavior
3. One owner per responsibility
4. Contracts before runtime
5. Runtime proves vocabulary

*Future:* promote into **Platform Constitutional Law** document referenced by NS, Blueprint, and all PAS — avoid repeating in every PAS body.

---

# 10. References

| Artifact | Path |
| --- | --- |
| Parent PAS (composed) | [PAS-001-KERNEL-VOCABULARY-AUTHORITY-STANDARD.md](PAS-001-KERNEL-VOCABULARY-AUTHORITY-STANDARD.md) |
| Integration spine | [PAS-001A-ERP-INTEGRATION-SPINE-STANDARD.md](PAS-001A-ERP-INTEGRATION-SPINE-STANDARD.md) |
| Legacy archive | [KERNEL/PAS-001B-ERP-WIRE-VOCABULARY-CATALOG-STANDARD.md](archive/PAS-001B-KERNEL-ERP-DOMAIN-VOCABULARY-STANDARD.md) |
| Kernel Blueprint §3.4 | [kernel-blueprint.md](../../BLUEPRINT/kernel-blueprint.md) |
| Layout contract | `packages/kernel/src/erp-domain/erp-domain-layout.contract.ts` |
| Family index | [KERNEL/README.md](README.md) |
| Superseded composed filename | `PAS-001B-KERNEL-DOMAIN-VOCABULARY-CATALOG-STANDARD.md` → this document |

**Provenance:** Enterprise Accepted — composed from legacy PAS-001B B106 closure; wire naming + KV ids + lifecycle added 2026-06-29.
