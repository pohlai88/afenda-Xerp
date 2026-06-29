# Module Foundation + Procurement — PAS-004 Promotion Backlog

| Field | Value |
| --- | --- |
| **Document class** | `promotion_backlog` |
| **Authority** | [PAS-004](../ENTERPRISE-KNOWLEDGE/PAS-004-ENTERPRISE-KNOWLEDGE-STANDARD.md) · [Knowledge LAW K6](../../CONSTITUTION/knowledge-constitutional-laws.md) |
| **Sources** | [Module Foundation NS §3.1](../../NORTHSTAR/erp-module-runtime-north-star.md) · [Procurement NS §3](../../NORTHSTAR/procurement-north-star.md) · [Gap report §B](../KERNEL/audit/procurement-foundation-gap-report.md) |
| **Status** | P0 module foundation atoms promoted (EK-MOD-FDN-001/002/003) — procurement P0–P1 planned |
| **Last reviewed** | 2026-06-30 |

> **One sentence:** Track Enterprise Knowledge atom promotion for module-foundation delivery terms (P0) and procurement business terms (P0–P1) before semantic runtime behavior — wire shapes alone are insufficient per LAW K6.

---

## P0 — Module foundation domain (from NS §3.1)

| Term | NS status | Atom ID | Blocker for | Promotion slice |
| --- | --- | --- | --- | --- |
| Module runtime identity | accepted | `module_runtime_identity` | — | EK-MOD-FDN-001 ✓ |
| Wire catalog key | accepted | `wire_catalog_key` | — | EK-MOD-FDN-001 ✓ |
| Module ownership contract | accepted | `module_ownership_contract` | — | EK-MOD-FDN-001 ✓ |
| Knowledge map status | accepted | `knowledge_map_status` | — | EK-MOD-FDN-002 ✓ |
| Operating context consumption | accepted | `operating_context_consumption` | — | EK-MOD-FDN-002 ✓ |
| Permission binding | accepted | `permission_binding` | — | EK-MOD-FDN-002 ✓ |
| Audit action map | accepted | `audit_action_map` | — | EK-MOD-FDN-002 ✓ |
| Metadata surface binding | accepted | `metadata_surface_binding` | — | EK-MOD-FDN-002 ✓ |
| Module readiness dimension | accepted | `module_readiness_dimension` | — | EK-MOD-FDN-003 ✓ |
| Foundation lifecycle phase | accepted | `foundation_lifecycle_phase` | — | EK-MOD-FDN-003 ✓ |
| Module ingress | accepted | `module_ingress` | — | EK-MOD-FDN-003 ✓ |
| Readiness report | accepted | `readiness_report` | — | EK-MOD-FDN-003 ✓ |

## P1 — Module foundation (deferred semantic scope)

| Term | NS status | Notes |
| --- | --- | --- |
| Module policy declaration | planned | EK-MOD-FDN-004 |
| Module event catalog | planned | EK-MOD-FDN-004 |
| Outbox requirement classification | planned | EK-MOD-FDN-004 |

## wire_only — promote meaning before semantic ops

| Term | NS status | Notes |
| --- | --- | --- |
| Document family | wire_only | EK-MOD-FDN-002 |

---

## P0 — Procurement business (from gap report)

| Term | Current status | Required action |
| --- | --- | --- |
| purchase_order | wire_only | PAS-004 atom before PO runtime |
| purchase_requisition | partial atom | Extend corpus · 3-way match deps |
| supplier | missing / BMD | Business master data + atom |
| rfq | wire_only | Atom before sourcing runtime |
| blanket_agreement | wire_only | Atom before contract release |
| goods_receipt | missing | Inventory cross-domain atom |
| three_way_match | missing | Accounting cross-domain — ADR-gated |

## Promotion pipeline (LAW K6)

```text
Domain NS §3 term row
        ↓
PAS-004 promotion slice
        ↓
@afenda/enterprise-knowledge atom (authoritative ID)
        ↓
Module knowledge-map.ts status → accepted
        ↓
Semantic runtime permitted
```

**Hard stop:** Do not mark NS §3 `Knowledge atom` column `accepted` until PAS-004 slice closes with atom ID evidence.

---

## Sync obligations

| Event | Update |
| --- | --- |
| Atom promoted | Procurement NS §3 · module knowledge-map reference bundle |
| NS term added | New row here · new EK-MOD slice |
| wire_only blocks runtime | Gap report · readiness report Knowledge row |
