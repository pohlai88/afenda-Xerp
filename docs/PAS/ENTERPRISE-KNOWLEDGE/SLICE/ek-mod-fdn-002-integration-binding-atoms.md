# Slice EK-MOD-FDN-002 — Integration & Binding Atoms (PAS-004 P0)

**Prerequisite:** [EK-MOD-FDN-001 Module identity & ownership](ek-mod-fdn-001-module-identity-ownership-atoms.md) delivered

**Status:** Delivered — `check:knowledge-conformance` PASS 2026-06-30

**Type:** Corpus + governance

**Risk class:** Low — meaning promotion only; no kernel runtime edits

**Clean Core impact:** A→A — integration binding meaning in enterprise-knowledge; spine consumption remains PAS-001A

## Purpose

Promote P0 module foundation integration and binding terms (knowledge map, context consumption, permission, audit, metadata) into accepted Knowledge Atoms per LAW K6.

## Handoff block

```
Handoff from: docs/PAS/ENTERPRISE-KNOWLEDGE/SLICE/ek-mod-fdn-002-integration-binding-atoms.md

1. Objective    — Seed knowledge_map_status, operating_context_consumption, permission_binding, audit_action_map, and metadata_surface_binding atoms citing PAS-001C/template (not kernel runtime).
2. Allowed layer— packages/enterprise-knowledge/src/data/** · docs/PAS/ENTERPRISE-KNOWLEDGE/SLICE/** · docs/PAS/ERP-MODULES/PAS-004-module-foundation-promotion-backlog.md · docs/NORTHSTAR/erp-module-runtime-north-star.md
3. Files        —
   packages/enterprise-knowledge/src/data/atoms.json
   packages/enterprise-knowledge/src/data/concepts.json
   packages/enterprise-knowledge/src/data/terms.json
   packages/enterprise-knowledge/src/data/knowledge.registry.ts
   packages/enterprise-knowledge/src/__tests__/knowledge-concept-vocabulary.test.ts
   packages/enterprise-knowledge/src/__tests__/knowledge.registry.test.ts
   packages/enterprise-knowledge/src/__tests__/knowledge-json-authority.test.ts
   packages/enterprise-knowledge/src/__tests__/knowledge-transition.test.ts
4. Prohibited   — packages/kernel/** edits; foundation-disposition.registry.ts (delegate)
5. Authority    — PAS-004 · Module Foundation NS §3.1 · PAS-001C · LAW K6 · enterprise-knowledge skill
6. Gates        —
   pnpm check:knowledge-conformance
   pnpm --filter @afenda/enterprise-knowledge test:run
   pnpm --filter @afenda/enterprise-knowledge typecheck
7. Closes       — EK-MOD-FDN-002 P0 integration/binding promotion backlog rows
8. Evidence     — knowledge_map_status · operating_context_consumption · permission_binding · audit_action_map · metadata_surface_binding atoms · gates PASS
9. Attestation  — Governance
```

## DoD

| # | Criterion | Evidence |
| --- | --- | --- |
| 1 | `knowledge_map_status` atom with LAW K6 reasoning | atoms.json · gate PASS |
| 2 | `operating_context_consumption` distinct from operating_context | atoms.json · gate PASS |
| 3 | `permission_binding` atom with template §3.5 realizationMapping | atoms.json · gate PASS |
| 4 | `audit_action_map` and `metadata_surface_binding` atoms delivered | atoms.json · gate PASS |
| 5 | NS §3 Knowledge atom column accepted for rows 4–8 | erp-module-runtime-north-star.md |
