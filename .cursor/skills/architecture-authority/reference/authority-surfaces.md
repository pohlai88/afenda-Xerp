# Authority Surfaces Reference

Detailed TypeScript shapes for `@afenda/architecture-authority` authority surfaces.

← Back to [SKILL.md](../SKILL.md) | Canonical: [PAS-002 §4](../../../../docs/PAS/PAS-002-ARCHITECTURE-AUTHORITY.md#4-authority-surfaces)

**Status labels used in this file:**

| Label | Meaning |
| --- | --- |
| `Status: Current` | Matches current source in `packages/architecture-authority/src/` |
| `Status: Target` | Planned addition — requires a dedicated slice |

**Machine index:** `packages/architecture-authority/src/surface/architecture-authority-surface-registry.ts` — read before inferring structure from PAS prose.

---

## Package registry (§4.1)

Status: Current — `data/package-registry.data.ts` · `validators/validate-registry.ts`

```ts
type ArchitectureLayer = "Platform" | "Foundation" | "Application" | "UI";
type PackageRegistryStatus = "active" | "deprecated" | "blocked" | "planned";

interface PackageDefinition {
  readonly id: string;
  readonly name: string;
  readonly layer: ArchitectureLayer;
  readonly status: PackageRegistryStatus;
  readonly filesystemExpected: boolean;
}
```

Answers: does the package exist, which layer, lifecycle, filesystem expectation. Does **not** define runtime behavior.

---

## Layer registry (§4.2)

Status: Current — `data/layer-registry.data.ts` · `validators/validate-layers.ts`

```ts
interface LayerContract {
  readonly layers: readonly ArchitectureLayer[];
  readonly allowedDependencies: Readonly<Record<ArchitectureLayer, readonly ArchitectureLayer[]>>;
}

// Helpers: getPackageLayer, isLayerDependencyAllowed
```

Minimum layers: Platform → Foundation → Application → UI (dependency direction enforced downward).

---

## Ownership registry (§4.3)

Status: Current — `data/ownership-registry.data.ts` · `validators/validate-ownership.ts`

```ts
type AuthorityLevel = "primary" | "consulted" | "informed";

interface PackageOwnership {
  readonly packageName: string;
  readonly owner: string;
  readonly authorityLevel: AuthorityLevel;
}
```

Governance metadata only — not HR employee master data.

---

## Foundation disposition registry (§4.4)

Status: Current — `data/foundation-disposition.registry.ts` · `validators/validate-foundation-disposition.ts`

```ts
type FoundationLane = "red" | "amber" | "blue" | "archive-lane";

interface FoundationDispositionEntry {
  readonly id: string;
  readonly lane: FoundationLane;
  readonly status: string;
  readonly evidence: readonly string[];
}
```

Records status truth and pointers — not long-form FDR/TIP bodies. **Edits:** `foundation-registry-owner` only.

---

## Boundary rules (§4.5)

Status: Current — `validators/validate-dependencies.ts`, `validate-forbidden-dependencies.ts`, `validate-layers.ts`, `validate-cycles.ts`

Detects: unregistered packages, wrong-layer imports, UI/runtime SDK leakage, deprecated packages, missing ownership/lifecycle.

Repo gates: `pnpm quality:boundaries`, `pnpm quality:architecture`, `pnpm architecture:cycles`.

---

## Exception registry (§4.6)

Status: Current — `data/exception-registry.data.ts` · `validators/validate-exceptions.ts`

```ts
interface ArchitectureException {
  readonly id: string;
  readonly status: "active" | "completed" | "waived" | "rejected";
  readonly owner: string;
  readonly evidence: readonly string[];
  readonly resolution?: string;
  readonly adr: string;
  readonly approvedBy: string;
  readonly expiresAt: string;
  readonly packageName: string;
  readonly reason: string;
  readonly subject: string;
}
```

ADR-level architecture exceptions only. PAS §4.6 governance fields are additive; runtime compatibility fields remain in the contract for existing exception consumers. Documentation drift → `pnpm architecture:drift` — not duplicated here.

---

## Architecture gates (§4.7)

Status: Current — `validators/validate-architecture.ts` + repo scripts under `scripts/quality/` and `scripts/governance/`

Composite entry: `validateArchitecture()`. Must be deterministic, CI-safe, actionable failures (file path, registry key, or package name).

---

## Dependency registry (§4.8)

Status: Current — `data/dependency-registry.data.ts`

```ts
type DependencyClassification = "runtime" | "dev" | "peer";

interface DependencyEdge {
  readonly from: string;
  readonly to: string;
  readonly classification: DependencyClassification;
}
```

Approved runtime edges between workspace packages. `@afenda/architecture-authority` itself has **zero** `@afenda/*` runtime dependencies.

---

## Lifecycle registry (§4.9)

Status: Current — `data/lifecycle-registry.data.ts`

Closed-union lifecycle states for registered packages. Consumed by registry and ownership validators.

---

## Business master data authority (§4.10)

Status: Current — `data/business-master-data-authority.registry.ts` + `business-master-data-*.policy.ts`

Records **which business entity IDs are reserved for which domain packages** (ADR-0020). Package governance metadata — not business master data runtime, not Kernel `ID_FAMILIES` semantics ([PAS-001 §4.1](../../../../docs/PAS/PAS-001-KERNEL-AUTHORITY-STANDARD.md)).

---

## Surface registry (§4.11)

Status: Current — `surface/architecture-authority-surface-registry.ts` · export `@afenda/architecture-authority/surface`

```ts
export const ARCHITECTURE_AUTHORITY_DATA_MODULES = [/* path, role, primaryExports */] as const;
export const ARCHITECTURE_AUTHORITY_VALIDATOR_MODULES = [/* … */] as const;
export const ARCHITECTURE_AUTHORITY_CANONICAL_DOCS = [/* doc paths + fingerprint flags */] as const;
export const MULTI_TENANCY_FORBIDDEN_RUNTIME_EDGES = [/* … */] as const;
```

Single source for agents and CI: what exists in this package.

---

## Workspace discovery (§4.12)

Status: Current — `workspace/discover-workspaces.ts`

```ts
interface DiscoveredWorkspace {
  readonly name: string;
  readonly root: string;
  readonly packageJsonPath: string;
}
```

Filesystem discovery for registry parity gates — not an ERP runtime resolver.

---

## Validation result contract

Status: Current — `contracts/validation-result.contract.ts`

```ts
interface ArchitectureViolation {
  readonly code: string;
  readonly message: string;
  readonly path?: string;
}

interface ValidationResult {
  readonly ok: boolean;
  readonly violations: readonly ArchitectureViolation[];
}
```

---

## Kernel boundary (read-only)

| Concern | Owner |
| --- | --- |
| Enterprise ID families, parsers, wire normalizers | `@afenda/kernel` |
| Permission evaluation | `@afenda/permissions` |
| Serializable operating context shapes | `@afenda/kernel` |
| ERP context integration | `apps/erp` |
| Package/layer/dependency legality | `@afenda/architecture-authority` |

Do not add Kernel ID format rules or parser behavior to architecture-authority registries.
