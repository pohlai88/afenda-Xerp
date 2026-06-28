# Package Structure Reference

`@afenda/enterprise-knowledge` folder tree, exports, and governance rules.

← Back to [SKILL.md](../SKILL.md) | Canonical: [PAS-004 §10](../../../../docs/PAS/ENTERPRISE-KNOWLEDGE/PAS-004-ENTERPRISE-KNOWLEDGE-STANDARD.md) · Rollout: [PAS-004A §6.2](../../../../docs/PAS/ENTERPRISE-KNOWLEDGE/PAS-004A-ENTERPRISE-KNOWLEDGE-PLATFORM-STANDARD.md)

**Source truth order:**

1. Filesystem under `packages/enterprise-knowledge/src/` (wins over all prose)
2. [`src/data/atoms.json`](../../../../packages/enterprise-knowledge/src/data/atoms.json) — authoritative atom corpus (B25)
3. [`src/data/edges.json`](../../../../packages/enterprise-knowledge/src/data/edges.json) — authoritative edge corpus (B25)
4. [`src/data/knowledge.registry.ts`](../../../../packages/enterprise-knowledge/src/data/knowledge.registry.ts) — thin atom loader + fingerprint
5. [`src/index.ts`](../../../../packages/enterprise-knowledge/src/index.ts) — public export surface
6. [`package.json`](../../../../packages/enterprise-knowledge/package.json) — zero runtime dependencies, exports map
7. This reference — skill adapter summary

**Rule:** Do not list slice targets as "future" when they are already on disk. B24 delivered registry/policy/tests; B25 delivered JSON authority + Acceptance Graph contracts.

---

## Current package structure (B25)

```text
packages/enterprise-knowledge/
├── package.json
├── tsconfig.json
├── tsconfig.vitest.json
├── vitest.config.ts
├── PAS-004-ENTERPRISE-KNOWLEDGE-STANDARD.md   # tombstone pointer only
└── src/
    ├── index.ts
    ├── contracts/
    │   ├── knowledge-atom.contract.ts
    │   ├── knowledge-edge.contract.ts          # B25
    │   ├── knowledge-evidence.contract.ts      # B25 shell
    │   ├── knowledge-reasoning.contract.ts     # B25 shell
    │   └── accepting-authority.contract.ts     # B25
    ├── constants/
    │   └── knowledge-integrity.ts
    ├── data/
    │   ├── atoms.json                          # authoritative corpus
    │   ├── edges.json                          # authoritative corpus
    │   ├── knowledge.registry.ts               # thin atom loader (≤40 lines)
    │   ├── knowledge-edge.registry.ts          # thin edge loader
    │   ├── accepting-authority.registry.ts     # typed authority entities
    │   ├── knowledge-data.schema.ts            # pure-TS JSON validation
    │   ├── knowledge-data.loader.ts            # parseAtomCorpus / parseEdgeCorpus
    │   └── knowledge-relationships.registry.ts # @deprecated B24 adapter
    ├── policy/
    │   └── knowledge.policy.ts
    └── __tests__/
        ├── knowledge.registry.test.ts
        ├── knowledge-json-authority.test.ts    # B25
        ├── accepting-authority.test.ts         # B25
        └── architecture-boundary.test.ts
```

Layer: **Platform** · Registry lane: `PKGR04_ENTERPRISE_KNOWLEDGE` · Package id: `PKG-024`

---

## Prohibited paths (PAS-004 §11)

Do not add:

```text
src/context/                    # kernel wire context — reference only via implementationMapping
src/contracts/kernel-*.ts       # duplicate kernel wire contracts
src/scoring/                    # numeric integrity scoring — deferred post-MVP
src/graph/                      # graph DB / MCP runtime — out of MVP scope
src/server/                     # HTTP services — contracts-only package
src/ui/                         # rendering — metadata-ui / apps/erp
```

Do not store Knowledge Atoms under `packages/architecture-authority/` or `packages/kernel/`.
Do not add inline atom/edge literals to `knowledge.registry.ts` — edit JSON only.

---

## Current exports (package.json)

Single root export — no subpath barrels (MVP):

```json
{
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "import": "./dist/index.js",
      "default": "./dist/index.js"
    }
  }
}
```

**Public surface from `src/index.ts`:**

| Export group | Symbols |
| --- | --- |
| Policy constants | `ENTERPRISE_KNOWLEDGE_POLICY`, `KNOWLEDGE_*` enums, contract types |
| Acceptance Graph (B25) | `KnowledgeEdge`, `KnowledgeEvidence`, `KnowledgeReasoning`, `AcceptingAuthorityEntity` |
| Registry data | `ENTERPRISE_KNOWLEDGE_ATOMS`, `KNOWLEDGE_ATOM_IDS`, `ENTERPRISE_KNOWLEDGE_FINGERPRINT` |
| Edges | `KNOWLEDGE_EDGES` (authoritative) · `KNOWLEDGE_RELATIONSHIPS` (@deprecated) |
| Authority registry | `ACCEPTING_AUTHORITY_ENTITIES`, `getAcceptingAuthority` |
| Integrity | `COMPLETE_INTEGRITY_PROFILE` |
| Policy API | `getKnowledgeAtom`, `getKnowledgeEdgesForAtom`, `validateKnowledgeRegistry`, lifecycle helpers |

All public contracts must remain **JSON-serializable** at boundaries. No functions in registry data rows.

---

## Dependency rules

| Allowed | Prohibited |
| --- | --- |
| Zero runtime dependencies (MVP) | `@afenda/architecture-authority` (circular authority risk) |
| Local registry, policy, tests | `@afenda/database`, `@afenda/ui-composition`, `@afenda/ui` |
| Dev: `@afenda/typescript-config`, vitest | `apps/erp`, auth SDKs, React, Next.js |

Architecture-authority **registers** this package in `package-registry.data.ts`; prefer root governance scripts over import cycles.

---

## Required gates

```bash
pnpm --filter @afenda/enterprise-knowledge typecheck
pnpm --filter @afenda/enterprise-knowledge test:run
pnpm check:knowledge-conformance
pnpm check:knowledge-json-authority
pnpm quality:boundaries
```

Foundation disposition (when touching PKGR04):

```bash
pnpm check:foundation-disposition
```

---

## Three layers (PAS-004)

| Layer | Home | Role |
| --- | --- | --- |
| Charter | `docs/PAS/ENTERPRISE-KNOWLEDGE/PAS-004-*.md` | Technology-free constitution |
| Platform | `packages/enterprise-knowledge/` | Atom registry + conformance |
| Representations | glossary, metadata, AI context | Consumers — not authority |

When glossary and registry diverge, **registry wins** until a slice updates the representation.
