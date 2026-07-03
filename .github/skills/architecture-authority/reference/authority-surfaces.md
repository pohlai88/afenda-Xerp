# Authority Surfaces Reference

Detailed TypeScript shapes for `@afenda/architecture-authority` authority surfaces.

← Back to [SKILL.md](../SKILL.md) | Canonical: [PAS-002 §4](../../../../docs/PAS/ARCHITECTURE-AUTHORITY/PAS-002-ARCHITECTURE-AUTHORITY.md#4-authority-surfaces)

**Status labels used in this file:**

| Label | Meaning |
| --- | --- |
| `Status: Current` | Matches current source in `packages/architecture-authority/src/` |
| `Status: Target` | Planned addition — requires a dedicated slice |

**Machine index:** `packages/architecture-authority/src/surface/architecture-authority-surface-registry.ts` — read before inferring structure from PAS prose.

**Runtime parity (2026-06-27):** `ValidationGate` = 9 values · validator modules = 10 (1 composite + 9 leaf) · public lookup maps are immutable (`create-readonly-lookup-map.ts`).

---

## Package registry (§4.1)

Status: Current — `data/package-registry.data.ts` · `validators/validate-registry.ts`

```ts
type ArchitectureLayer =
  | "Platform"
  | "Design"
  | "Foundation"
  | "Metadata"
  | "Integration"
  | "ERPSpine"
  | "Domain"
  | "Application";

type PackageRegistryStatus =
  | "active"
  | "active-exempt"
  | "planned"
  | "experimental"
  | "deprecated"
  | "retired";

interface PackageDefinition {
  readonly registryId: string;
  readonly packageName: string;
  readonly path: string;
  readonly layer: ArchitectureLayer;
  readonly lifecycle: PackageRegistryStatus;
  readonly purpose: string;
  readonly publicApiOwner: string;
  readonly layerDepExempt: boolean;
  readonly filesystemRequired: boolean;
  /** Required when lifecycle === "experimental" (ADR-0006). */
  readonly experimentalStartedAt?: string;
  /** Required when lifecycle === "experimental" (ADR-0006). */
  readonly experimentalExpiresAt?: string;
  /** Required when lifecycle === "deprecated" (ADR-0006). */
  readonly deprecatedAt?: string;
}

// Readonly lookup: packageByName — immutable at runtime (B20)
```

Answers: does the package exist, which layer, lifecycle, filesystem expectation. Does **not** define runtime behavior.

---

## Layer registry (§4.2)

Status: Current — `data/layer-registry.data.ts` · `validators/validate-layers.ts`

```ts
interface LayerContract {
  readonly assignments: Readonly<Record<string, ArchitectureLayer>>;
  readonly allowedTargets: Readonly<Record<ArchitectureLayer, readonly ArchitectureLayer[]>>;
}

// Helpers: getPackageLayer, isLayerDependencyAllowed
```

Eight-layer model (Platform → Design → Foundation → Metadata → Integration → ERPSpine → Domain → Application). Dependency direction enforced by validators.

---

## Ownership registry (§4.3)

Status: Current — `data/ownership-registry.data.ts` · `validators/validate-ownership.ts`

```ts
type AuthorityLevel =
  | "architecture"
  | "platform"
  | "design"
  | "metadata"
  | "erp-spine"
  | "domain"
  | "application";

interface PackageOwnership {
  readonly packageName: string;
  readonly ownerDomain: string;
  readonly authorityLevel: AuthorityLevel;
}

// Readonly lookup: ownershipByPackage — immutable at runtime (B20)
// validateOwnership covers all lifecycle === "active" packageContract rows (B19)
```

Governance metadata only — not HR employee master data.

---

## Foundation disposition registry (§4.4)

Status: Current — `data/foundation-disposition.registry.ts` · `validators/validate-foundation-disposition.ts`

```ts
type FoundationLane =
  | "red-lane"
  | "amber-lane"
  | "green-lane"
  | "blue-lane"
  | "black-lane"
  | "archive-lane";

interface FoundationDispositionEntry {
  readonly id: string;
  readonly packageId: string;
  readonly packageName: string;
  readonly domain: string;
  readonly lane: FoundationLane;
  readonly runtimeOwner: string;
  readonly authority: string;
  readonly requiredBeforeAccounting: boolean;
  readonly evidence: readonly string[];
  readonly gates: readonly string[];
  readonly prohibited: readonly string[];
  readonly allowedAgents: readonly string[];
  readonly knownGaps: readonly string[]; // deprecated — always []
  readonly legacyTipEvidence: readonly string[];
}
```

**PKGR02_ARCHITECTURE_AUTHORITY** (PKG-019) records `@afenda/architecture-authority` disposition (B18). **Edits:** `foundation-registry-owner` only.

---

## Boundary rules (§4.5)

Status: Current — `validators/validate-dependencies.ts`, `validate-forbidden-dependencies.ts`, `validate-layers.ts`, `validate-cycles.ts`

Detects: unregistered packages, wrong-layer imports, forbidden edges, cycles, deprecated packages on filesystem.

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

Active exceptions require non-empty `id`, `owner`, and `evidence` (B12).

---

## Architecture gates (§4.7)

Status: Current — `validators/validate-architecture.ts` + repo scripts under `scripts/quality/` and `scripts/governance/`

```ts
type ValidationGate =
  | "registry"
  | "ownership"
  | "layers"
  | "dependencies"
  | "forbidden-dependencies"
  | "cycles"
  | "exceptions"
  | "foundation-disposition"
  | "lifecycle";

interface ArchitectureViolation {
  readonly gate: ValidationGate;
  readonly message: string;
  readonly packageName?: string;
}

interface ValidationResult {
  readonly ok: boolean;
  readonly violations: readonly ArchitectureViolation[];
}
```

Composite entry: `validateArchitecture()` merges all leaf validators including `validateFoundationDisposition()` (B13) and `validateLifecycle()` (B15).

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

Status: Current — `data/lifecycle-registry.data.ts` · `validators/validate-lifecycle.ts`

```ts
interface LifecycleContract {
  readonly experimentalMaxDays: number;
  readonly maxDeprecationMonths: number;
}

// Registry lifecycle statuses extend LIFECYCLE_STATES with "active-exempt"
```

`validateLifecycle()` enforces positive policy thresholds, inactive lifecycle filesystem rules, and ADR-0006 metadata using a **deterministic reference date** (`ARCHITECTURE_VALIDATION_REFERENCE_ISO`, overridable via `AFENDA_ARCHITECTURE_VALIDATION_REFERENCE_ISO`):

- `experimental` → requires `experimentalStartedAt` and `experimentalExpiresAt` (ISO-8601 UTC via `parseIso8601UtcTimestamp`: `Z` or `+00:00` only); fails when expired, start is in the future, or window span exceeds `experimentalMaxDays`
- `deprecated` → requires `deprecatedAt` (ISO-8601 UTC); fails when deprecated longer than `maxDeprecationMonths`

---

## Business master data authority (§4.10)

Status: Current — `data/business-master-data-authority.registry.ts` + `business-master-data-*.policy.ts`

Records **which business entity IDs are reserved for which domain packages** (ADR-0020). Package governance metadata — not business master data runtime, not Kernel `ID_FAMILIES` semantics ([PAS-001 §4.1](../../../../docs/PAS/KERNEL/PAS-001-KERNEL-VOCABULARY-AUTHORITY-STANDARD.md)).

---

## Surface registry (§4.11)

Status: Current — `surface/architecture-authority-surface-registry.ts` · export `@afenda/architecture-authority/surface`

```ts
export const ARCHITECTURE_AUTHORITY_DATA_MODULES = [/* path, role, primaryExports */] as const;
export const ARCHITECTURE_AUTHORITY_VALIDATOR_MODULES = [/* 10 modules incl. validate-lifecycle */] as const;
export const ARCHITECTURE_AUTHORITY_CANONICAL_DOCS = [/* doc paths + fingerprint flags */] as const;
export const MULTI_TENANCY_FORBIDDEN_RUNTIME_EDGES = [/* … */] as const;
```

Single source for agents and CI: what exists in this package.

---

## Workspace discovery (§4.12)

Status: Current — `workspace/discover-workspaces.ts`

```ts
interface DiscoveredWorkspace {
  readonly packageJson: { readonly name: string; readonly dependencies?: Record<string, string> };
  readonly packageJsonPath: string;
  readonly root: string;
  readonly directoryName: string;
}
```

Filesystem discovery for registry parity gates — not an ERP runtime resolver.

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
