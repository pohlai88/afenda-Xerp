# Slice B36 — Acceptance Graph Queries (PAS-004B §4.3)

**Prerequisite:** [B35 Docs consumer proof](b35-docs-consumer-proof.md) delivered

**Status:** Delivered — 2026-06-28

**Type:** Implementation

**Risk class:** Low — four pure query helpers over JSON registries

**Clean Core impact:** A→A — no graph engine; fixed export surface

## Handoff block

```
Handoff from: docs/PAS/slice/b36-acceptance-graph-queries.md

1. Objective    — Add exactly four acceptance-graph query helpers + check:knowledge-acceptance-graph gate.
2. Allowed layer— packages/enterprise-knowledge/src/query/** · packages/enterprise-knowledge/src/__tests__/** · packages/enterprise-knowledge/src/index.ts · scripts/governance/check-knowledge-acceptance-graph.mts · package.json · docs/PAS/**
3. Files        —
   packages/enterprise-knowledge/src/query/knowledge-graph.query.ts
   packages/enterprise-knowledge/src/__tests__/knowledge-graph.query.test.ts
   packages/enterprise-knowledge/src/index.ts
   scripts/governance/check-knowledge-acceptance-graph.mts
   package.json
   docs/PAS/slice/b36-acceptance-graph-queries.md
4. Prohibited   — fifth query export; graph DB; MCP server; B37 in same slice; foundation-disposition.registry.ts
5. Authority    — PAS-004B §4.3 · PAS-004 §3.1 · enterprise-knowledge skill
6. Gates        —
   pnpm --filter @afenda/enterprise-knowledge typecheck
   pnpm --filter @afenda/enterprise-knowledge test:run
   pnpm check:knowledge-acceptance-graph
7. Closes       — PAS-004B scorecard row #19; acceptance graph query surface
8. Evidence     —
   packages/enterprise-knowledge/src/query/knowledge-graph.query.ts
   scripts/governance/check-knowledge-acceptance-graph.mts
9. Attestation  — Contract · Test · Governance · Documentation
```

## Fixed export surface (exactly four)

| Export | Purpose |
| --- | --- |
| `getKnowledgeAtomsByDomain` | Filter atoms by `knowledgeDomain` |
| `getKnowledgeEdgesFrom` | Outbound edges from an atom (optional type filter) |
| `getSupersessionChain` | Walk `supersededBy` chain |
| `resolveAcceptanceGraphRoots` | Atoms not superseded by field or `supersedes` edge |
