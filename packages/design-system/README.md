# `@afenda/design-system`

**Architecture layer:** Design  
**Lifecycle:** Active  
**Registry ID:** PKG-004  
**TIP:** TIP-003 — Design System Authority / TIP-004 — Design System Contracts  
**Version:** 0.1.0  
**Dependencies:** none

## What this package is

`@afenda/design-system` is the **Design Authority** for the Afenda workspace. It owns every design decision that flows downstream — tokens, variants, recipes, component behaviors, slot structures, state patterns, motion intents, accessibility requirements, class-name policy, export surface, and AI imitation examples.

This package is **governance-only**. It contains no React components, no Storybook stories, no CSS files, and no runtime UI code. It has zero runtime dependencies on other Afenda packages.

Downstream UI packages (`@afenda/ui`, `@afenda/metadata-ui`, `@afenda/appshell`) are the implementation layer. They **must** consume the contracts and registries from this package and must not define parallel design values.

## Governance principles

| Principle | Rule |
| --- | --- |
| **Token owns value** | Every design value (color, spacing, radius, shadow, typography, density, motion) must exist as a registered token. Raw CSS values are forbidden in all downstream packages. |
| **Variant owns meaning** | Intent, emphasis, and density axes are governed here. Consumers may select; they may not invent. |
| **Recipe owns styling** | Component styling recipes are declared here. Downstream renders the recipe, not raw classes. |
| **Component owns behavior** | Interaction, animation, and ARIA behavior patterns are declared here. |
| **Slot owns structure** | Slot roles and layout regions are declared here. Downstream fills them. |
| **Class name owns layout only** | Tailwind layout utilities are permitted in consumers. Semantic design classes must trace to a token or recipe. |
| **Example owns AI imitation** | `erpGovernedExamples` provides the imitation corpus. AI must pattern-match these, not invent. All examples carry `imitationOnly: true`. |

## Authority domains

Declared in `designSystemAuthorityContract`:

`token` · `recipe` · `variant` · `component` · `slot` · `state` · `motion` · `accessibility` · `classNamePolicy` · `exportSurface` · `examplePolicy`

## Public API

### Root contract

```typescript
import { designSystemContract } from "@afenda/design-system";

// Single source: tokens + variants + recipes + policies + examples + exports
```

### Token registry

```typescript
import { tokenRegistry } from "@afenda/design-system";
import type { AfendaTokenName, TokenDefinition } from "@afenda/design-system";

// Governed token categories:
// "color" | "statusTone" | "spacing" | "radius" | "shadow" | "typography" | "motion" | "density"
```

Governed enumerations:

```typescript
import {
  TOKEN_CATEGORIES,  // 8 categories
  STATUS_TONES,      // "neutral" | "info" | "success" | "warning" | "danger" | "forbidden" | "invalid"
  DENSITIES,         // "compact" | "standard" | "comfortable"
  SIZES,             // "xs" | "sm" | "md" | "lg"
  RADII,             // "none" | "sm" | "md" | "lg"
  SHADOWS,           // "none" | "raised" | "overlay"
} from "@afenda/design-system";
```

### Variant registry

```typescript
import { variantRegistry } from "@afenda/design-system";
import type {
  VariantAxis,      // "intent" | "emphasis" | "density" | "size"
  VariantIntent,    // "primary" | "secondary" | "neutral" | "danger" | ...
  VariantEmphasis,  // "filled" | "outlined" | "ghost" | "link"
  VariantDefinition,
  VariantSelection,
} from "@afenda/design-system";
```

### Recipe registry

```typescript
import { recipeRegistry } from "@afenda/design-system";
import type { RecipeDeclaration, RecipeDefinition, RecipeRegistry } from "@afenda/design-system";
```

### State policy

```typescript
import { statePolicy, GOVERNED_STATES } from "@afenda/design-system";
import type { GovernedState, StatePattern } from "@afenda/design-system";

// GOVERNED_STATES: "default" | "hover" | "active" | "focus" | "disabled" | "loading" | "error" | "empty"
```

### Motion policy

```typescript
import { motionPolicy, MOTION_INTENTS } from "@afenda/design-system";
import type { MotionIntent } from "@afenda/design-system";
```

### Accessibility policy

```typescript
import { accessibilityPolicy, ACCESSIBILITY_REQUIREMENTS } from "@afenda/design-system";
import type { AccessibilityRequirement } from "@afenda/design-system";
```

### Class-name policy

```typescript
import {
  classNamePolicy,
  validateLayoutClassName,
  ALLOWED_LAYOUT_CLASSNAME_PATTERNS,
  PROHIBITED_CLASSNAME_PATTERNS,
} from "@afenda/design-system";
```

### Export surface

```typescript
import { publicExportContract, isPublicDesignSystemImport } from "@afenda/design-system";
```

### Governance validation

```typescript
import {
  validateDesignSystemGovernance,
  driftPreventionChecklist,
} from "@afenda/design-system";

const result = validateDesignSystemGovernance({ /* options */ });
if (!result.ok) {
  console.error(result.violations);
}
```

### Governed examples (AI imitation patterns)

```typescript
import { erpGovernedExamples } from "@afenda/design-system";
import type { GovernedExample } from "@afenda/design-system";

// All examples have imitationOnly: true — they are patterns to follow, not authority.
```

## TIP-004 downstream contracts

Every downstream contract must satisfy one of these 11 governed contract files before consuming:

`token.contract.ts` · `recipe.contract.ts` · `component.contract.ts` · `slot.contract.ts` · `variant.contract.ts` · `state.contract.ts` · `motion.contract.ts` · `accessibility.contract.ts` · `export.contract.ts` · `example.contract.ts` · `class-name-policy.contract.ts`

## Installation

```bash
# Workspace-internal only. Not published to npm.
pnpm add @afenda/design-system --workspace
```

## Commands

```bash
pnpm --filter @afenda/design-system typecheck
pnpm --filter @afenda/design-system test
pnpm --filter @afenda/design-system build
pnpm --filter @afenda/design-system check:governance
```

## Governance rules

| AI may | AI may not |
| --- | --- |
| Select existing exported tokens, variants, recipes, and states | Invent raw color, spacing, radius, shadow, typography, or density values |
| Generate components that consume governed examples as imitation patterns | Create token lookalikes outside this package |
| Reference `GOVERNED_STATES`, `STATUS_TONES`, `MOTION_INTENTS` in downstream UI | Invent new variant axes or new state names without ADR + version bump |
| Validate layout class names against `ALLOWED_LAYOUT_CLASSNAME_PATTERNS` | Apply semantic design classes that don't trace to a registered token or recipe |
| Use `validateDesignSystemGovernance` in CI gates | Modify `components/ui/` primitives for app-scoped polish without approval |

## Mutability rule

Adding a token, variant, recipe, state, or motion intent requires:

1. An accepted ADR referencing TIP-003 or TIP-004
2. A version bump in the affected contract interface and runtime object
3. Updated tests confirming the new value is reachable via the public API
4. No changes to the governance principles above without Architecture Authority approval
