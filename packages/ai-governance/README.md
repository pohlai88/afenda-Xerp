# `@afenda/ai-governance`

**Architecture layer:** Platform  
**Lifecycle:** Active  
**Registry ID:** PKG-020  
**Version:** 1.0.0  
**Fingerprint:** `AI-GOV-BASELINE-2026-06-20-v1`  
**Depends on:** `@afenda/architecture-authority`

## What this package is

`@afenda/ai-governance` enforces the Afenda AI-assisted development governance rules. It provides contracts, validators, policies, and reports that prevent AI IDEs from creating architectural drift — inventing packages, violating layer boundaries, editing contracts without ADRs, suppressing type errors unsafely, or generating changes outside a declared scope manifest.

This package is consumed by CI quality gates and workspace scripts. It is not a UI library.

## What this package owns

| Domain | Exported symbols | Owns |
| --- | --- | --- |
| Change contracts | `AiChangeScopeManifest`, `AiViolation`, `AiValidationResult`, `AI_INVARIANT_IDS` | Scope manifest structure, invariant IDs, violation shape |
| Boundary contracts | `FORBIDDEN_AI_PACKAGE_PATTERNS`, `FORBIDDEN_BROAD_SCOPE_GLOBS`, `BUSINESS_LOGIC_FORBIDDEN_LAYERS` | Package naming rules, glob scope rules |
| Drift contracts | `AI_GOVERNANCE_VERSION`, `AI_GOVERNANCE_FINGERPRINT`, `UNSAFE_SUPPRESSION_PATTERNS` | Drift detection vocabulary |
| Review contracts | `AI_REVIEW_CHECKLIST_ITEMS`, `AiReviewChecklistEntry` | Review checklist structure |
| Policies | `AI_INVARIANT_POLICIES` | Which invariants run in baseline vs scope mode |
| Validators | `validateAiGovernance`, `validateAiChangeGates`, `validateAiBoundaries`, `validateAiDrift`, `validateAiPrompts` | Gate enforcement logic |
| Reports | `buildAiGovernanceReport`, `AiGovernanceReport` | Structured governance output |
| Utils | `matchesGlob`, `pathMatchesAnyGlob` | Glob matching for scope checks |

## Invariant catalogue

| Invariant | Gate | Baseline | Scope |
| --- | --- | --- | --- |
| `AI-001` | registry | ✓ | ✓ |
| `AI-002` | dependencies | ✓ | ✓ |
| `AI-003` | boundaries | ✓ | ✓ |
| `AI-004` | scope | — | ✓ |
| `AI-004-SCOPE` | scope-drift | — | ✓ |
| `AI-005` | boundaries | — | ✓ |
| `AI-006` | boundaries | ✓ | ✓ |
| `AI-007` | change | — | ✓ |
| `AI-008` | change | — | ✓ |
| `AI-009` | change | — | ✓ |
| `AI-010` | drift | — | ✓ |

**Baseline mode** runs AI-001, AI-002, AI-003, AI-006 on every change — no scope manifest required.  
**Scope mode** runs all invariants — requires a `AiChangeScopeManifest` with a declared TIP or ADR.

## Usage

### Validate in baseline mode

```typescript
import { validateAiGovernance } from "@afenda/ai-governance";

const result = validateAiGovernance({
  mode: "baseline",
  changedFiles: ["packages/auth/src/index.ts"],
  changedLines: [],
  packageExportMaps: [],
  scopeManifest: null,
  suppressionLines: [],
  workspacePackages: [],
});

if (!result.ok) {
  for (const violation of result.violations) {
    console.error(`[${violation.invariant}] ${violation.message}`);
  }
}
```

### Validate with scope manifest (scope mode)

```typescript
import { validateAiGovernance } from "@afenda/ai-governance";
import type { AiChangeScopeManifest } from "@afenda/ai-governance";

const manifest: AiChangeScopeManifest = {
  tip: "TIP-012",
  adr: "ADR-0001",
  allowedPaths: ["packages/execution/**", "packages/kernel/**"],
  forbiddenPaths: ["packages/design-system/**", "packages/auth/**"],
  reason: "Implement execution foundation",
  nonGoals: ["Do not add UI components", "Do not modify permissions"],
  testPlan: ["Unit tests for execution engine", "Integration tests for kernel"],
  deletionJustifications: [],
  testExemptions: [],
};

const result = validateAiGovernance({ mode: "scope", scopeManifest: manifest, ... });
```

### Build a governance report

```typescript
import { buildAiGovernanceReport } from "@afenda/ai-governance";

const report = buildAiGovernanceReport({ mode: "baseline", violations: [] });
```

### Check package naming

```typescript
import { FORBIDDEN_AI_PACKAGE_PATTERNS } from "@afenda/ai-governance";

// Forbidden: @afenda/auth-v2, @afenda/auth-new, legacy-auth
// These patterns prevent AI from inventing parallel package architectures
```

## Forbidden patterns enforced

| Pattern | Why forbidden |
| --- | --- |
| Package name matches `/-v\d+$/` | Version-suffix packages indicate duplication, not evolution |
| Package name matches `/-new$/`, `/-temp$/`, `/-refactor$/` etc. | Scratch packages bypass governance |
| Glob scope `**/*`, `packages/**`, `apps/**` | Unbounded scopes allow unrestricted AI changes |
| Unsafe suppressions (`@ts-ignore`, `biome-ignore`, `eslint-disable`) | Added suppressions indicate type-unsafe generation |
| Business logic in Platform / Design / Metadata layers | Domain logic must live in Domain layer packages |

## Installation

```bash
# Workspace-internal only. Not published to npm.
pnpm add @afenda/ai-governance --workspace
```

## Commands

```bash
pnpm --filter @afenda/ai-governance typecheck
pnpm --filter @afenda/ai-governance test
pnpm --filter @afenda/ai-governance build
```

## CI integration

The workspace quality gate `pnpm quality:ai-governance` uses this package to verify the governance fingerprint and run baseline invariants against the current workspace. Fingerprint: `AI-GOV-BASELINE-2026-06-20-v1`.
