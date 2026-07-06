# PAS-006B — Inventory & Production Pipeline Standard

| Field | Value |
| --- | --- |
| **PAS ID** | PAS-006B |
| **Document class** | `package_authority_standard` |
| **Document role** | `relational_inventory_production_pipeline` |
| **Parent charter** | [PAS-006](PAS-006-SHADCN-STUDIO-FRONTEND-STANDARD.md) |
| **Package** | `@afenda/shadcn-studio-v2` |
| **Blueprint box** | shadcn/studio Presentation |
| **Maturity** | Production Candidate |
| **Runtime status** | P06-002–P06-004 delivered — relational inventory, slot map, block data contracts, lifecycle registry live |
| **Remaining slices** | none — hardening via PAS-006C/006D only |
| **Depends on** | [PAS-006A](PAS-006A-SHADCN-STUDIO-PRODUCT-STANDARD.md) product baseline |

#### Required gates

| # | Gate command |
| --- | --- |
| 1 | `pnpm --filter @afenda/shadcn-studio-v2 typecheck` |
| 2 | `pnpm --filter @afenda/shadcn-studio-v2 test:run` |
| 3 | `pnpm check:studio-inventory-lifecycle` |
| 4 | `pnpm check:foundation-disposition` |

> **Maturity is part of authority.** Do not claim block **Accepted** until PAS-006C Acceptance Record exists. This PAS owns **structure and lifecycle**, not ACPA proof.

---

# 0. Agent Quick Path

**Boundary:** PAS-006B **owns** relational presentation inventory (theme preset → primitive → variant → block → slot → block data contract → surface template links), block lifecycle states (NS §8.1), structural normalization rules, and production pipeline stage tracking; **never owns** ACPA verification (006C), metadata schema (Metadata domain), or ERP route wiring.

**Hard stops:**

- No skip from **Imported** to **Accepted** — full chain required.
- No ERP customization before **Stabilized** + **Theme-bound** (NS I6).
- Inventory must be discoverable without reading `apps/erp` routes (NS I4).

---

# 1. Relational Inventory Model

Machine representation extends `studio-block-parity.registry.ts` into full relational layers:

| Layer | Owns | Wire shape (target) |
| --- | --- | --- |
| Theme preset | Token bundle id | `themePresetId` |
| Primitive | Base a11y role | `primitiveId` |
| Variant | Visual density/emphasis | `variantId` |
| Block | Composed pattern | `blockId` |
| Block slot | Named region | `slotId` |
| Block data contract | Serializable field/column/action shape | `blockDataContractId` |
| Surface template | Screen composition recipe | `surfaceTemplateId` |
| Acceptance Record link | Pointer to 006C record | `acceptanceRecordId` |

Reference diagram: [Presentation NS §3.1](../../NORTHSTAR/shadcn-studio-presentation-north-star.md).

---

# 2. Block Lifecycle (authoritative)

```text
Imported → Normalized → Stabilized → Theme-bound → Metadata-bound → Accepted → Production wired → Customized → Deprecated → Retired
```

| Transition | Business gate |
| --- | --- |
| → Normalized | Structure, slots, exports, naming aligned |
| → Stabilized | Keyboard, focus, responsive, state surfaces verified |
| → Theme-bound | Consumes theme preset; no local token drift |
| → Metadata-bound | Renders from metadata contract OR recorded N/A waiver |
| → Accepted | **Acceptance Record sealed** (PAS-006C) |
| → Customized | ERP variation within accepted boundaries only |

---

# 3. Stabilization-First Pipeline Stages

Maps NS §3.4 to implementable registry events:

| Stage | Registry event |
| --- | --- |
| 1 Import | `block.imported` |
| 2 Stabilize | `block.stabilized` |
| 3 Normalize | `block.normalized` |
| 4 Theme-bind | `block.theme_bound` |
| 5 Metadata-bind | `block.metadata_bound` |
| 6 Accept | `block.accepted` *(requires 006C)* |
| 7 Customize | `block.customized` |

---

# 4. Authority Surfaces (target)

| Surface | Path (target) | Status |
| --- | --- | --- |
| Parity / inventory registry | `src/registry/studio-block-parity.registry.ts` | **Live** (partial) |
| Relational inventory | `src/registry/presentation-inventory.registry.ts` | Proposed P06-002 |
| Block data contracts | `src/contracts/block-data-contract.ts` | **Live** (P06-003) |
| Slot map | `src/registry/block-slot.registry.ts` | **Live** (P06-003) |
| Lifecycle helper | `src/registry/block-lifecycle.ts` | Proposed P06-004 |

All contract objects: `readonly` · JSON-serializable · no side effects on import.

---

# 5. Decision Matrix

| Question | If yes → | In 006B? |
| --- | --- | --- |
| Block lifecycle state? | 006B | **Yes** |
| Slot definition? | 006B | **Yes** |
| Block data contract shape? | 006B | **Yes** |
| ACPA contrast proof? | 006C | **No** |
| Metadata field schema? | Metadata / 006D | **No** |
| Theme preset tokens? | 006A | **No** |

---

# 12. Slice Catalog

| Slice | Title | Status |
| --- | --- | --- |
| P06-002 | Relational inventory registry scaffold | **Delivered** |
| P06-003 | Block slot + block data contract surfaces | **Delivered** |
| P06-004 | Block lifecycle state in registry | Proposed |

---

# Related

- [PAS-006C](PAS-006C-SURFACE-ACCEPTANCE-ACPA-STANDARD.md) · [Presentation NS §3.1–§3.4](../../NORTHSTAR/shadcn-studio-presentation-north-star.md)
