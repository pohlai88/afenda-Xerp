# PAS-006D — Metadata-Driven Surfaces Standard

| Field | Value |
| --- | --- |
| **PAS ID** | PAS-006D |
| **Document class** | `package_authority_standard` |
| **Document role** | `metadata_driven_surface_composition` |
| **Parent charter** | [PAS-006](PAS-006-SHADCN-STUDIO-FRONTEND-STANDARD.md) |
| **Package** | `@afenda/shadcn-studio-v2` (contracts) · `apps/erp` (wiring — consumer) |
| **Blueprint box** | shadcn/studio Presentation |
| **Maturity** | Production Candidate |
| **Runtime status** | Metadata binding contract + surface template registry live; **P06-008-R1 + P06-008-R2 enforcement gates active** |
| **Remaining slices** | PAS-001A-R1 family closed; operator-surface route expansion deferred |
| **Depends on** | [PAS-006B](PAS-006B-INVENTORY-PRODUCTION-PIPELINE-STANDARD.md) · [PAS-006C](PAS-006C-SURFACE-ACCEPTANCE-ACPA-STANDARD.md) for Accepted blocks |

#### Required gates (target)

| # | Gate command |
| --- | --- |
| 1 | `pnpm --filter @afenda/shadcn-studio-v2 typecheck` |
| 2 | `pnpm check:studio-metadata-binding` *(P06-008-R1 — active)* |
| 3 | `pnpm check:studio-block-slot-markers` *(P06-008-R2 — active)* |
| 4 | `pnpm check:studio-surface-template-registry` *(P06-009 — active)* |

> **Maturity is part of authority.** Metadata **schema authority** lives outside presentation. This PAS owns **binding contracts** and **surface templates** only.

---

# 0. Agent Quick Path

**Boundary:** PAS-006D **owns** metadata binding contracts (field → block slot mapping), surface template registry (accepted blocks + slots → screen class), and composition chain **Metadata contract → Surface template → Operator surface**; **never owns** metadata schema persistence, permission evaluation, or Enterprise Knowledge atoms.

**Hard stops:**

- Metadata-capable surfaces must bind through contracts before route hardcoding (NS I7).
- Templates compose only **Accepted** blocks (006C).
- Labels cite Enterprise Knowledge representations — not invented in templates.

---

# 1. Composition Chain

```text
Metadata contract (serializable binding descriptor)
        ↓
Surface template (block ids + slot fills + layout recipe)
        ↓
Operator surface (ERP route / workflow attachment)
```

Reference: [Presentation NS §3.5](../../NORTHSTAR/shadcn-studio-presentation-north-star.md).

---

# 2. Metadata Binding Contract (target)

Wire-safe descriptor — not ORM schema:

| Field group | Examples |
| --- | --- |
| Field presentation | label ref (Knowledge atom id), type, density, help text ref |
| Validation presentation | required flag display, message presentation |
| Permission presentation | visibility hint (evaluation elsewhere) |
| Table presentation | column behavior, sort presentation |
| State presentation | empty, loading, error, forbidden templates |

---

# 3. Surface Template (target)

| Field | Purpose |
| --- | --- |
| `surfaceTemplateId` | Stable id |
| `templateClass` | form · table · dashboard · settings · approval |
| `blockBindings` | blockId + slot fills |
| `metadataContractId` | Required binding contract |
| `acceptanceRecordIds` | All composed blocks Accepted |

---

# 4. Scalability Doctrine

Prefer **Metadata contract → Surface template → Operator surface** over per-module manual UI for:

- HRM · CRM · Inventory · Accounting · System Admin · future LoB modules

Greenfield metadata workspace UI rebuilds on this PAS — **not** retired metadata-ui package.

---

# 5. Decision Matrix

| Question | If yes → | In 006D? |
| --- | --- | --- |
| Field → slot mapping contract? | 006D | **Yes** |
| Surface template registry? | 006D | **Yes** |
| Metadata schema / DB? | Metadata domain | **No** |
| Block a11y acceptance? | 006C | **No** |
| ERP route handler? | apps/erp | **No** (consumer) |

---

# 12. Slice Catalog

| Slice | Title | Status |
| --- | --- | --- |
| P06-008 | Metadata binding contract | **Delivered** |
| P06-008-R1 | Metadata binding registry enforcement | **Delivered** |
| P06-008-R2 | DOM slot markers (`data-afenda-slot`) | **Delivered** |
| P06-009 | Surface template registry | **Delivered** |

May parallelize after P06-004 with independent handoffs.

---

# Related

- [PAS-006B](PAS-006B-INVENTORY-PRODUCTION-PIPELINE-STANDARD.md) · [Enterprise Knowledge PAS-004](../ENTERPRISE-KNOWLEDGE/README.md) (label meaning)
