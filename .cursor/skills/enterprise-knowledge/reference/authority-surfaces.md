# Authority Surfaces Reference

`@afenda/enterprise-knowledge` contract shapes — skill adapter for PAS-004 §5–§12.

← Back to [SKILL.md](../SKILL.md) | Canonical: [PAS-004 §5–§12](../../../../docs/PAS/PAS-004-ENTERPRISE-KNOWLEDGE-STANDARD.md)

**Status legend:** `Current` = on disk in `packages/enterprise-knowledge/src/` · `Target` = PAS slice not yet delivered

---

## Surface map

| Surface | Path | Status | Owns | Does not own |
| --- | --- | --- | --- | --- |
| Knowledge Atom contracts | `src/contracts/knowledge-atom.contract.ts` | Current | Types, enums, policy constants, effective time | Kernel wire types, IFRS rule engines |
| Knowledge Edge contracts | `src/contracts/knowledge-edge.contract.ts` | Current (B25) | `KnowledgeEdge`, 18 edge types | Graph DB, MCP traversal |
| Knowledge Evidence contracts | `src/contracts/knowledge-evidence.contract.ts` | Current (B25 shell) | Typed evidence record | Atom migration (B29) |
| Knowledge Reasoning contracts | `src/contracts/knowledge-reasoning.contract.ts` | Current (B25 shell) | Structured reasoning node | Atom migration (B29) |
| Accepting Authority contracts | `src/contracts/accepting-authority.contract.ts` | Current (B25) | `AcceptingAuthorityEntity` | Chain migration (B29) |
| Atom corpus (JSON) | `src/data/atoms.json` | Current (B25) | Authoritative atom rows | DB rows, tenant-editable stores |
| Edge corpus (JSON) | `src/data/edges.json` | Current (B25) | Authoritative edge rows | Graph DB runtime |
| Atom loader | `src/data/knowledge.registry.ts` | Current (B25) | Thin loader, fingerprint, `KNOWLEDGE_ATOM_IDS` | Inline atom literals |
| Edge loader | `src/data/knowledge-edge.registry.ts` | Current (B25) | `KNOWLEDGE_EDGES` | Inline edge literals |
| Accepting authority registry | `src/data/accepting-authority.registry.ts` | Current (B25) | Typed authority entities | Free-string chain refs (B29) |
| JSON schema validation | `src/data/knowledge-data.schema.ts` | Current (B25) | Pure-TS corpus validation | Zod runtime (deferred) |
| Relationship adapter | `src/data/knowledge-relationships.registry.ts` | Deprecated (B25) | B24 backward-compat alias | New code — use `KNOWLEDGE_EDGES` |
| Conformance policy | `src/policy/knowledge.policy.ts` | Current | Validation, lookup, lifecycle helpers | UI rendering, scoring |
| Integrity constants | `src/constants/knowledge-integrity.ts` | Current | `COMPLETE_INTEGRITY_PROFILE` | Numeric scoring (Target) |
| Public exports | `src/index.ts` | Current | Serializable boundary API | Cross-package re-export barrels |
| Integrity scoring engine | `src/scoring/` (reserved) | Target | Future 0–100 scoring | Not in MVP charter |

Consumers import `@afenda/enterprise-knowledge` — never copy atom definitions locally.

---

## Registry fingerprint — **Current**

Status: Current — `packages/enterprise-knowledge/src/data/knowledge.registry.ts`

```ts
export const ENTERPRISE_KNOWLEDGE_FINGERPRINT =
  "ENTERPRISE-KNOWLEDGE-2026-06-28-v1" as const;
```

Bump fingerprint when atom set or constitutional policy changes materially.

---

## Constitutional policy — **Current**

Status: Current — `packages/enterprise-knowledge/src/contracts/knowledge-atom.contract.ts`

```ts
export const ENTERPRISE_KNOWLEDGE_POLICY = {
  pasSection: "4.1",
  charterDoc: "docs/PAS/PAS-004-ENTERPRISE-KNOWLEDGE-STANDARD.md",
  constitutionalSentence:
    "Enterprise knowledge exists when meaning is accepted, reasoning is understood, evidence is trusted, relationships are preserved, decisions are explainable, and evolution is traceable.",
  firstPrinciple:
    "Knowledge becomes authoritative through acceptance by an accepted authority, supported by evidence, within a defined domain.",
} as const;
```

---

## Knowledge Atom — **Current** (key fields)

Status: Current — full shape in `knowledge-atom.contract.ts`

```ts
export interface KnowledgeAtom {
  readonly atomId: string;
  readonly fqn: string;
  readonly kind: KnowledgeAtomKind;
  readonly acceptanceChain: readonly AcceptanceChainEntry[];
  readonly authorityType: AuthorityType;
  readonly binding: BindingLevel;
  readonly confidence: Confidence;
  readonly reasoning: string;
  readonly knowledgeDecision: KnowledgeDecision;
  readonly meaning: KnowledgeMeaning;
  readonly knowledgeDomain: readonly KnowledgeDomain[];
  readonly applicability: KnowledgeApplicability;
  readonly lifecycle: KnowledgeLifecycleStatus;
  readonly lineage: KnowledgeLineage;
  readonly misconceptions: readonly KnowledgeMisconception[];
  readonly exposure: KnowledgeExposure;
  readonly integrity: KnowledgeIntegrityProfile;
  readonly evidence: readonly string[];
  readonly implementationMapping?: KnowledgeImplementationMapping;
  readonly ownedByPas: "PAS-004";
}
```

**Kinds:** `concept` · `vocabulary` · `principle` · `rule` · `decision` · `pattern` · `standard` · `relationship`

**Lifecycle:** `observed` → `proposed` → `under_review` → `accepted` → `ratified` → `implemented` → `superseded` → `historical`

---

## Acceptance chain entry — **Current**

```ts
export interface AcceptanceChainEntry {
  readonly step: AcceptanceChainStep;
  readonly by: AcceptingAuthority | string;
  readonly on?: string;
  readonly evidence?: readonly string[];
}
```

**Steps:** `origin` · `observed` · `proposed` · `under_review` · `accepted` · `ratified` · `implemented` · `superseded` · `historical`

**Accepting authorities:** `board` · `architecture_authority` · `accounting_authority` · `legal_authority` · `erp_authority` · `standard_body` · `external_source`

---

## Three orthogonal axes — **Current**

```ts
export type AuthorityType =
  | "standard"
  | "regulatory"
  | "legal"
  | "corporate"
  | "architectural"
  | "operational"
  | "engineering"
  | "informative";

export type BindingLevel =
  | "mandatory"
  | "recommended"
  | "optional"
  | "historical";

export interface Confidence {
  readonly score: number; // 0–100
  readonly basis: readonly ConfidenceBasis[];
}
```

Never collapse `authorityType`, `binding`, and `confidence` into a single label.

---

## Knowledge integrity profile — **Current**

Status: Current — presence only in MVP; numeric scoring is **Target**

```ts
export const KNOWLEDGE_INTEGRITY_DIMENSIONS = [
  "correctness",
  "completeness",
  "consistency",
  "authority",
  "acceptance",
  "evidence",
  "reasoning",
  "applicability",
  "evolution",
  "relationship",
] as const;

export type KnowledgeIntegrityProfile = Readonly<
  Record<KnowledgeIntegrityDimension, boolean>
>;

export const COMPLETE_INTEGRITY_PROFILE = {
  correctness: true,
  completeness: true,
  consistency: true,
  authority: true,
  acceptance: true,
  evidence: true,
  reasoning: true,
  applicability: true,
  evolution: true,
  relationship: true,
} as const satisfies KnowledgeIntegrityProfile;
```

---

## Knowledge relationship — **Current**

```ts
export interface KnowledgeRelationship {
  readonly relationshipId: string;
  readonly type: KnowledgeRelationshipType;
  readonly fromAtomId: string;
  readonly toAtomId: string;
  readonly note?: string;
}
```

**Types:** `contains` · `owns` · `operates` · `stores` · `governs` · `derives_from` · `related` · `supersedes` · `values`

---

## Implementation mapping — **Current**

Honesty fields — must not overstate delivery:

```ts
export interface KnowledgeImplementationMapping {
  readonly upstreamContract?: string;
  readonly databaseTable?: string;
  readonly operatingContextField?: string;
  readonly runtimeStatus:
    | "implemented"
    | "partial"
    | "planned"
    | "authority_only";
  readonly persistenceClass:
    | "persisted"
    | "derived"
    | "deferred"
    | "authority_only";
}
```

Example: `workspace` and `surface` use `persistenceClass: "derived"` — no DB tables.

---

## Conformance policy API — **Current**

```ts
export function validateKnowledgeAtom(atom: KnowledgeAtom): readonly string[];
export function validateKnowledgeRegistry(): readonly string[];
export function getKnowledgeAtom(atomId: KnowledgeAtom["atomId"]): KnowledgeAtom;
export function isKnowledgeAtomId(value: string): value is KnowledgeAtom["atomId"];
export function isAcceptedOrLaterLifecycle(lifecycle: KnowledgeLifecycleStatus): boolean;
export function isRatifiedOrLaterLifecycle(lifecycle: KnowledgeLifecycleStatus): boolean;
```

Root gate: `pnpm check:knowledge-conformance` → `scripts/governance/check-knowledge-conformance.mts`

---

## MVP seed atoms — **Current**

| atomId | kind | Notes |
| --- | --- | --- |
| `legal_entity` | concept | Statutory boundary |
| `organization_unit` | concept | Org structure |
| `workspace` | concept | Derived context |
| `surface` | concept | Derived UI routing |
| `payload` | concept | Request payload scope |
| `invariant` | principle | Platform invariant |
| `contract` | pattern | Contract pattern |
| `metadata` | vocabulary | Metadata vs meaning |
| `double_entry` | principle | Accounting principle |
| `accounting_equation` | principle | A = L + E |
| `organization_split` | decision | v1/v2 evolution honesty |
| `ifrs_10` | standard | External standard reference |

Full registry: `packages/enterprise-knowledge/src/data/knowledge.registry.ts`
