# Slice B53 — ERP-Domain Meaning Bridge (PAS-004D §4.5)

**Prerequisite:** [B50 Legacy surface retirement](b50-pas004d-legacy-surface-retirement.md) delivered

**Status:** Delivered — `check:knowledge-erp-domain-bridge` registered 2026-06-30

**Type:** Runtime + governance

**Risk class:** Low — corpus seed only; kernel erp-domain contracts read-only

**Clean Core impact:** A→A — meaning in enterprise-knowledge; wire in PAS-001B kernel

## Purpose

Seed accepted meaning atoms bridging PAS-001B inventory/procurement wire vocabulary to PAS-004 Knowledge Atoms. Each atom cites kernel `erp-domain` contract paths and **KV-INV** / **KV-PROC** (not slug-only).

## Handoff block

```
Handoff from: docs/PAS/ENTERPRISE-KNOWLEDGE/SLICE/b53-pas004d-erp-domain-bridge.md

1. Objective    — Seed inventory_item + procurement_requisition atoms with kernel realizationMapping + KV pairing; add check:knowledge-erp-domain-bridge; register PKGR04 evidence (registry owner).
2. Allowed layer— packages/enterprise-knowledge/src/data/** · packages/enterprise-knowledge/src/policy/knowledge-erp-domain-bridge.policy.ts · scripts/governance/check-knowledge-erp-domain-bridge.mts · package.json (script) · docs/PAS/ENTERPRISE-KNOWLEDGE/**
3. Files        —
   packages/enterprise-knowledge/src/data/atoms.json
   packages/enterprise-knowledge/src/data/concepts.json
   packages/enterprise-knowledge/src/data/terms.json
   packages/enterprise-knowledge/src/data/knowledge.registry.ts
   packages/enterprise-knowledge/src/policy/knowledge-erp-domain-bridge.policy.ts
   scripts/governance/check-knowledge-erp-domain-bridge.mts
   scripts/governance/__tests__/check-knowledge-erp-domain-bridge.test.ts
4. Prohibited   — packages/kernel/** edits; foundation-disposition.registry.ts (delegate); PAS-001B wire vocabulary changes
5. Authority    — PAS-004D §4.5 · PAS-001B KV-INV/KV-PROC · enterprise-knowledge skill · kernel-authority (read-only refs)
6. Gates        —
   pnpm check:knowledge-erp-domain-bridge
   pnpm check:knowledge-kernel-mapping
   pnpm check:knowledge-conformance
   pnpm --filter @afenda/enterprise-knowledge test:run
7. Closes       — PAS-004D §4.5 ERP-domain bridge; PAS-001B AUD-10 KV cross-package citation (enterprise-knowledge leg)
8. Evidence     — inventory_item + procurement_requisition atoms · KV-INV/KV-PROC in realizationMapping notes · gate PASS
9. Attestation  — Runtime · Governance
```

## DoD

| # | Criterion | Evidence |
| --- | --- | --- |
| 1 | `inventory_item` atom with kernel contract ref + KV-INV | atoms.json · gate PASS |
| 2 | `procurement_requisition` atom with kernel contract ref + KV-PROC | atoms.json · gate PASS |
| 3 | No parser or @afenda/database imports in bridge policy | policy file |
| 4 | `check:knowledge-erp-domain-bridge` registered in root package.json | package.json |
| 5 | pas-status-index B53 → Delivered; next sequence B51 | pas-status-index |

## Registry delegation

Append B53 gate + evidence paths to PKGR04 via **foundation-registry-owner**.
