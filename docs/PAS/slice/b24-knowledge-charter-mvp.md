# Slice B24 — Knowledge Charter MVP (PAS-004 §0)

**Prerequisite:** PAS-004 freeze-candidate plan (`.cursor/plans/pas-004_business_metadata_5f12bd2f.plan.md`)

**Status:** Delivered (2026-06-28)

**Type:** Foundation package + charter

**Risk class:** Medium — new Platform package and constitutional PAS

**Clean Core impact:** A→A — contracts-only registry; no runtime behavior change

## Purpose

Deliver PAS-004 Enterprise Knowledge Charter MVP: constitutional doc (chapters 1–4 technology-free), `@afenda/enterprise-knowledge` package with twelve seed Knowledge Atoms, PKGR04 foundation disposition, conformance gates, skill, and glossary demotion to representation.

## Handoff block

```
Handoff from: docs/PAS/slice/b24-knowledge-charter-mvp.md

1. Objective    — Implement PAS-004 MVP: charter doc, @afenda/enterprise-knowledge package (atoms, relationships, policy, tests), PKGR04 disposition, knowledge-conformance gate, skill, glossary demotion, cross-links.
2. Allowed layer— packages/enterprise-knowledge/** · docs/PAS/** · docs/architecture/glossary.md (header only) · packages/architecture-authority/src/data/** (registry rows) · scripts/governance/check-knowledge-conformance.mts · .cursor/skills/enterprise-knowledge/** · AGENTS.md · package.json (check script only)
3. Files        —
   docs/PAS/PAS-004-ENTERPRISE-KNOWLEDGE-STANDARD.md
   docs/PAS/slice/b24-knowledge-charter-mvp.md
   docs/PAS/README.md
   docs/PAS/pas-status-index.md
   docs/architecture/glossary.md
   docs/architecture/foundation-disposition.md
   packages/enterprise-knowledge/**
   packages/architecture-authority/src/data/foundation-disposition.registry.ts
   packages/architecture-authority/src/data/package-registry.data.ts
   packages/architecture-authority/src/data/layer-registry.data.ts
   packages/architecture-authority/src/data/dependency-registry.data.ts
   packages/architecture-authority/src/data/ownership-registry.data.ts
   scripts/governance/check-knowledge-conformance.mts
   .cursor/skills/enterprise-knowledge/**
   .cursor/skills/architecture-authority/SKILL.md
   AGENTS.md
   package.json
4. Prohibited   — stuffing atoms into packages/architecture-authority or packages/kernel; apps/erp runtime; @afenda/ui-composition contract changes; database migrations; tenant-editable knowledge stores; integrity scoring engine
5. Authority    — PAS-004 · PKGR04_ENTERPRISE_KNOWLEDGE · foundation-registry-owner (disposition fingerprint) · enterprise-knowledge skill
6. Gates        —
   pnpm --filter @afenda/enterprise-knowledge typecheck
   pnpm --filter @afenda/enterprise-knowledge test:run
   pnpm check:knowledge-conformance
   pnpm quality:boundaries
   pnpm check:foundation-disposition
   pnpm check:documentation-drift
7. Closes       — Missing PAS-004 charter, enterprise-knowledge package, PKGR04 lane, and glossary authority demotion
8. Evidence     —
   docs/PAS/PAS-004-ENTERPRISE-KNOWLEDGE-STANDARD.md
   packages/enterprise-knowledge/src/data/knowledge.registry.ts
   packages/architecture-authority/src/data/foundation-disposition.registry.ts
   scripts/governance/check-knowledge-conformance.mts
9. Attestation  — Registry · Documentation · Governance · TypeScript
```

## DoD

| # | Criterion | Evidence |
| --- | --- | --- |
| 1 | PAS-004 doc with technology-free chapters 1–4 | `docs/PAS/PAS-004-ENTERPRISE-KNOWLEDGE-STANDARD.md` |
| 2 | `@afenda/enterprise-knowledge` with zero runtime deps | `package.json` + architecture-boundary test |
| 3 | Twelve seed atoms + relationships | `knowledge.registry.ts` + registry test |
| 4 | `PKGR04_ENTERPRISE_KNOWLEDGE` + PKG-024 | foundation-disposition.registry.ts |
| 5 | `pnpm check:knowledge-conformance` passes | root package.json script |
| 6 | Glossary demoted to representation | glossary.md header |
| 7 | Skill + PAS README index | `.cursor/skills/enterprise-knowledge/` |
