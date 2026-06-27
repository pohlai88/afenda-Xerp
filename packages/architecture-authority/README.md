# `@afenda/architecture-authority`

**Architecture layer:** Platform  
**Lifecycle:** Active  
**Registry ID:** PKG-019  
**Version:** 1.0.0  
**Fingerprint:** `ARCH-BASELINE-2026-06-27-v2`  
**Dependencies:** none

## What this package is

`@afenda/architecture-authority` is the **source of truth for Afenda workspace architecture**. It defines the 8-layer dependency model, registers every package, declares ownership authority levels, governs package lifecycle states, and exposes validators that enforce all architectural rules in CI.

This package is **governance-only**. It has no runtime dependencies on other Afenda packages. Every other governance package (`@afenda/ai-governance`, CI gates) depends on this package, never the reverse.

## What this package owns

### Layer model (8 layers)

| Rank | Layer | Owns | May depend on |
| --- | --- | --- | --- |
| 1 | Platform | Platform truth | — |
| 2 | Design | Visual truth | Platform |
| 2 | Foundation | Shared infrastructure | Platform |
| 3 | Metadata | Rendering truth | Design, Platform |
| 3 | Integration | Cross-cutting integration | Foundation, Platform |
| 4 | ERPSpine | ERP operating shell | Metadata, Integration, Foundation, Design, Platform |
| 5 | Domain | Business truth | Metadata, Integration, Foundation, Design, Platform |
| 6 | Application | Delivery surfaces | ERPSpine, Domain, and everything below |

### Registered workspace packages (22 filesystem-required rows)

| Package | Layer | Authority |
| --- | --- | --- |
| `@afenda/architecture-authority` | Platform | Architecture Authority |
| `@afenda/ai-governance` | Platform | Architecture Authority |
| `@afenda/auth` | Platform | Platform Authority |
| `@afenda/database` | Platform | Platform Authority |
| `@afenda/observability` | Platform | Platform Authority |
| `@afenda/typescript-config` | Platform | Platform Authority |
| `@afenda/design-system` | Design | Design Authority |
| `@afenda/ui` | Design | Design Authority |
| `@afenda/execution` | Foundation | Platform Authority |
| `@afenda/kernel` | Platform | Platform Authority |
| `@afenda/storage` | Foundation | Platform Authority |
| `@afenda/metadata` | Metadata | Metadata Authority |
| `@afenda/metadata-ui` | Metadata | Metadata Authority |
| `@afenda/entitlements` | Integration | Platform Authority |
| `@afenda/feature-flags` | Integration | Platform Authority |
| `@afenda/testing` | Integration | Platform Authority |
| `@afenda/appshell` | ERPSpine | ERP Spine Authority |
| `@afenda/erp` | Application | Application Authority |
| `@afenda/docs` | Application | Application Authority |
| `@afenda/email` | Application | Application Authority |
| `@afenda/storybook` | Application | Application Authority |
| `@afenda/permissions` | Platform | Platform Authority |

### Authority levels

`"platform"` → `"design"` → `"metadata"` → `"erp-spine"` → `"domain"` → `"application"`

## Public API

### Validators

```typescript
import {
  validateArchitecture,    // Runs all 9 ValidationGate values against discovered workspaces
  validateRegistry,        // Every filesystem package is registered
  validateOwnership,       // Every package has a declared owner
  validateLayers,          // Layer assignments are consistent
  validateDependencies,    // Dependencies respect layer rules
  validateForbiddenDependencies, // No explicitly forbidden edges
  validateCycles,          // No circular dependencies
  validateExceptions,      // Exception registry entries are justified
  validateFoundationDisposition, // Foundation disposition registry integrity
  validateLifecycle,       // Lifecycle policy + inactive lifecycle rows
} from "@afenda/architecture-authority";
```

The surface registry currently publishes 10 validator modules: the
`validateArchitecture` composite entry plus 9 leaf validators in
`ARCHITECTURE_AUTHORITY_VALIDATOR_MODULES`.

### Data registries

```typescript
import {
  layerContract,           // Layer definitions + assignments + allowed targets
  packageContract,         // All registered packages with PKG-xxx IDs
  ownershipContract,       // Ownership rows with authority levels
  dependencyContract,      // Approved dependency edges
  lifecycleContract,       // Package lifecycle state definitions
  exceptionContract,       // Approved exceptions to default rules
} from "@afenda/architecture-authority";
```

### Layer utilities

```typescript
import {
  getPackageLayer,              // (packageName) => ArchitectureLayer | undefined
  isLayerDependencyAllowed,     // (fromLayer, toLayer) => boolean
} from "@afenda/architecture-authority";

const layer = getPackageLayer("@afenda/metadata"); // → "Metadata"
const ok = isLayerDependencyAllowed("Metadata", "Design"); // → true
const bad = isLayerDependencyAllowed("Design", "Metadata"); // → false
```

### Workspace discovery

```typescript
import { discoverWorkspaces } from "@afenda/architecture-authority";

const workspaces = await discoverWorkspaces(repoRoot);
const result = validateArchitecture(workspaces);
```

### Reports

```typescript
import {
  buildArchitectureReport,
  buildDependencySnapshot,
  buildOwnershipAuditMarkdown,
} from "@afenda/architecture-authority";
```

### Key types

```typescript
import type {
  ArchitectureLayer,     // "Platform" | "Design" | "Foundation" | "Metadata" | ...
  PackageContract,       // Full registered package shape
  OwnershipContract,     // Ownership table
  LayerContract,         // Layer definitions and allowed targets
  ValidationResult,      // { ok, violations: ArchitectureViolation[] }
  ArchitectureViolation, // { gate, message, packageName? }
  ValidationGate,        // "registry" | "ownership" | "layers" | "dependencies" | "forbidden-dependencies" | "cycles" | "exceptions" | "foundation-disposition"
  AuthorityLevel,        // "platform" | "design" | "metadata" | "erp-spine" | ...
  LifecycleState,        // "active" | "deprecated" | "planned" | "retired"
} from "@afenda/architecture-authority";
```

## Usage: CI quality gate

```typescript
import {
  discoverWorkspaces,
  validateArchitecture,
} from "@afenda/architecture-authority";

const workspaces = await discoverWorkspaces(process.cwd());
const result = validateArchitecture(workspaces);

if (!result.ok) {
  for (const v of result.violations) {
    console.error(`[${v.gate}] ${v.message}`);
  }
  process.exit(1);
}
```

## Installation

```bash
# Workspace-internal only. Not published to npm.
pnpm add @afenda/architecture-authority --workspace
```

## Commands

```bash
pnpm --filter @afenda/architecture-authority typecheck
pnpm --filter @afenda/architecture-authority test
pnpm --filter @afenda/architecture-authority build
```

## Mutability rule

Adding a package, changing a layer assignment, or adding a dependency exception requires:

1. An accepted ADR
2. A version bump in `architecture-authority-version.ts`
3. An updated fingerprint constant `ARCHITECTURE_BASELINE_FINGERPRINT`
4. Updated tests that verify the new state passes all 8 validation gates

AI must not modify this package without a scope manifest referencing the governing ADR.
