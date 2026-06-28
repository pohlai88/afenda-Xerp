# Slice B32 — ERP Consumer Integration (PAS-004A §4.4)

**Prerequisite:** [B31 Ontology completion](b31-ontology-completion.md) delivered

**Status:** Delivered · 2026-06-28

**Type:** Implementation

**Risk class:** Low — ERP consumer wiring + glossary manifest parity

## Handoff block

```
Handoff from: docs/PAS/slice/b32-erp-consumer-integration.md

1. Objective    — Wire system-admin settings section titles to Knowledge Atoms; require full 24-atom glossary manifest parity; export B29/B31 ID tuples from package surface.
2. Allowed layer— apps/erp/src/lib/knowledge/** · apps/erp/src/lib/system-admin/resolve-system-admin-settings-form-values.ts · packages/enterprise-knowledge/src/index.ts · docs/architecture/glossary.md · scripts/governance/check-glossary-knowledge-sync.mts · docs/PAS/**
3. Files        —
   apps/erp/src/lib/knowledge/enterprise-knowledge-vocabulary.server.ts
   apps/erp/src/lib/knowledge/__tests__/enterprise-knowledge-vocabulary.test.ts
   apps/erp/src/lib/system-admin/resolve-system-admin-settings-form-values.ts
   apps/erp/src/lib/system-admin/__tests__/resolve-system-admin-settings-form-values.test.ts
   packages/enterprise-knowledge/src/index.ts
   docs/architecture/glossary.md
   scripts/governance/check-glossary-knowledge-sync.mts
   docs/PAS/slice/b32-erp-consumer-integration.md
4. Prohibited   — Inline atom meaning in ERP; registry mutation; metadata package deps
5. Authority    — PAS-004A §4.4 consumer proof · enterprise-knowledge skill
6. Gates        —
   pnpm --filter @afenda/enterprise-knowledge typecheck
   pnpm --filter @afenda/enterprise-knowledge test:run
   pnpm --filter @afenda/enterprise-knowledge build
   pnpm --filter @afenda/erp typecheck
   pnpm --filter @afenda/erp test:run -- enterprise-knowledge resolve-system-admin-settings
   pnpm check:knowledge-consumer-proof
   pnpm check:glossary-knowledge-sync
7. Closes       — ERP UI vocabulary wiring for system-admin settings; glossary manifest full parity
8. Evidence     — enterprise-knowledge-vocabulary.server.ts · glossary.md manifest
9. Attestation  — Contract · Test · Governance · Integration
```

## Integration map

| System admin section | Knowledge atom | Surface |
| --- | --- | --- |
| `tenant` | `tenant` | Settings form section title |
| `legal-entity` | `legal_entity` | Settings form section title |
| `permission-scope` | `permission_scope` | Settings form section title |

Descriptions remain in `system-admin-settings.copy.contract.ts` (operational copy). Titles derive from atom `meaning.business` (serializable, registry-authoritative).
