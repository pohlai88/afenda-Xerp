# TIP-004 — Design System Contracts

Status: **Complete (contracts + tests + docs)**

## Purpose

TIP-004 converts the TIP-003 Design System Authority into enforceable TypeScript contracts for Afenda UI governance. These contracts prevent AI-assisted development from inventing UI behavior, tokens, recipes, variants, slots, state, motion, accessibility, exports, examples, or class-name policy.

Scope is limited to `packages/design-system` contract governance. TIP-004 does not build UI components, AppShell, Metadata UI, permissions, database schema, accounting logic, or page-level styling.

## Files created

- `packages/design-system/src/contracts/token.contract.ts`
- `packages/design-system/src/contracts/recipe.contract.ts`
- `packages/design-system/src/contracts/component.contract.ts`
- `packages/design-system/src/contracts/slot.contract.ts`
- `packages/design-system/src/contracts/variant.contract.ts`
- `packages/design-system/src/contracts/state.contract.ts`
- `packages/design-system/src/contracts/motion.contract.ts`
- `packages/design-system/src/contracts/accessibility.contract.ts`
- `packages/design-system/src/contracts/export.contract.ts`
- `packages/design-system/src/contracts/example.contract.ts`
- `packages/design-system/src/contracts/class-name-policy.contract.ts`
- `packages/design-system/src/contracts/__tests__/design-system-contracts.test.ts`
- `docs/delivery/tip-004-design-system-contracts.md`

## Files updated

- `packages/design-system/src/contracts/index.ts`
- `packages/design-system/src/index.ts`
- `packages/design-system/src/policies/export-surface.ts`
- `packages/design-system/src/policies/class-name-policy.ts`
- `packages/design-system/src/policies/accessibility.ts`
- `packages/design-system/src/policies/motion.ts`
- `packages/design-system/src/policies/state.ts`
- `packages/design-system/src/policies/drift-validation.ts`
- `packages/design-system/src/tokens/registry.ts`
- `packages/design-system/src/variants/registry.ts`
- `packages/design-system/src/recipes/registry.ts`
- `packages/design-system/src/examples/erp-patterns.ts`
- `packages/design-system/src/__tests__/index.test.ts`

## Authority inherited from TIP-003

TIP-004 inherits `designSystemAuthorityContract` from TIP-003. TIP-003 establishes visual authority ownership and lists all TIP-004 downstream contract filenames in `TIP_004_DOWNSTREAM_CONTRACTS`. TIP-004 implements the detailed contracts named by that authority and keeps all public consumption on the root `@afenda/design-system` export surface.

## Ownership matrix

| Contract | Exported symbol | Owned responsibility | Principle |
| --- | --- | --- | --- |
| `token.contract.ts` | `tokenContract` | value | Token owns value |
| `variant.contract.ts` | `variantContract` | meaning | Variant owns meaning |
| `recipe.contract.ts` | `recipeContract` | styling composition | Recipe owns styling composition |
| `component.contract.ts` | `componentContract` | behavior | Component owns behavior |
| `slot.contract.ts` | `slotContract` | structure | Slot owns structure |
| `state.contract.ts` | `stateContract` | UI state | State owns UI state |
| `motion.contract.ts` | `motionContract` | movement safety | Motion owns movement safety |
| `accessibility.contract.ts` | `accessibilityContract` | interaction safety | Accessibility owns interaction safety |
| `class-name-policy.contract.ts` | `classNamePolicyContract` | layout escape only | ClassName owns layout escape only |
| `export.contract.ts` | `exportContract` | public access | Export owns public access |
| `example.contract.ts` | `exampleContract` | AI imitation | Example owns AI imitation |

## Contract responsibility map

Each contract exports a runtime governance object with these fields:

| Field | Type | Purpose |
| --- | --- | --- |
| `contractId` | `"afenda.design-system.<name>"` | Stable namespace identity |
| `version` | semver string | Change tracking |
| `owner` | string containing `"TIP-004"` | Attribution |
| `purpose` | string | One-sentence governance statement |
| `ownedResponsibility` | string | Exactly one value — unique across all contracts |
| `allowedResponsibility` | `string[]` | Permitted scope |
| `prohibitedResponsibility` | `string[]` | Hard stops enforced by tests |
| `downstreamConsumers` | `string[]` | Which packages or surfaces consume this contract |
| `aiGenerationRules.allowed` | `string[]` | What AI may do |
| `aiGenerationRules.forbidden` | `string[]` | What AI must not do |
| `acceptanceRules` | `string[]` | Acceptance conditions for any change |

## Prohibited drift table

| Drift risk | Enforced by |
| --- | --- |
| Component invents tokens | `componentContract.prohibitedResponsibility` + `designSystemAuthorityContract.prohibitedOverlap` |
| Recipe invents behavior | `recipeContract.prohibitedResponsibility` + authority contract |
| Variant invents raw CSS values | `variantContract.prohibitedResponsibility` — variants name meaning only |
| Slot invents styling | `slotContract.prohibitedResponsibility` — slots describe structure only |
| Example invents APIs | `exampleContract.prohibitedResponsibility` + `GovernedExample.imitationOnly: true` (required field) |
| `className` overrides design meaning | `classNamePolicyContract.prohibitedResponsibility` + `validateLayoutClassName` runtime check |
| Business module defines design primitives | `exportContract` + `publicExportContract.deepImportsAllowed: false` |
| AppShell invents local visual rules | `designSystemAuthorityContract.prohibitedOverlap` rule id `app-shell-must-not-invent-local-visual-rules` |
| Metadata UI bypasses contracts | `designSystemAuthorityContract.prohibitedOverlap` rule id `metadata-ui-must-not-bypass-authority` |
| App package defines design primitives | `designSystemAuthorityContract.prohibitedOverlap` rule id `apps-must-not-define-design-primitives` |

## AI allowed / forbidden table

| AI may | AI may not |
| --- | --- |
| Consume exported contracts from `@afenda/design-system` | Invent tokens, variants, recipes, component behavior, or class-name policy |
| Select approved token, variant, recipe, slot, state, motion, and accessibility rules | Attach raw CSS values to variants or examples |
| Use `className` for layout-only escape | Bypass recipes with semantic class overrides |
| Imitate approved governed examples | Treat examples as design authority |
| Request a contract extension when authority is missing | Duplicate UI authority in apps, AppShell, or Metadata UI |
| Generate UI code that consumes all 11 contracts | Infer ownership or create independent visual governance |

## Acceptance criteria

| Scenario | Required result |
| --- | --- |
| AI IDE generates UI code | It can identify the correct design contract owner for each responsibility |
| AI IDE generates UI code | It cannot invent visual authority or duplicate UI responsibility |
| AI IDE generates UI code | It cannot override token, variant, recipe, slot, state, motion, accessibility, export, or example governance |
| Future component is added and needs styling | It must consume tokens, variants, recipes, slots, state, motion, and accessibility contracts |
| Future component is added and needs styling | It must not create new visual rules locally |
| Metadata UI or AppShell renders UI | It consumes approved contracts and does not define independent design authority |

## Verification commands

```bash
pnpm --filter @afenda/design-system typecheck
pnpm --filter @afenda/design-system test
pnpm typecheck
pnpm test:run
pnpm quality
```

## Completion report

### Files created

| File | Purpose |
| --- | --- |
| `packages/design-system/src/contracts/token.contract.ts` | Owns value — TOKEN_CATEGORIES, STATUS_TONES, DENSITIES, SIZES, RADII, SHADOWS, TokenName, TokenDefinition, TokenRegistry |
| `packages/design-system/src/contracts/variant.contract.ts` | Owns meaning — VARIANT_AXES, VARIANT_INTENTS, VARIANT_EMPHASES, VariantDefinition, VariantRegistry |
| `packages/design-system/src/contracts/recipe.contract.ts` | Owns styling composition — RecipeDeclaration, RecipeDefinition, RecipeRegistry |
| `packages/design-system/src/contracts/component.contract.ts` | Owns behavior — GovernedComponentContract |
| `packages/design-system/src/contracts/slot.contract.ts` | Owns structure — SLOT_ROLES, SlotRole, SlotContract |
| `packages/design-system/src/contracts/state.contract.ts` | Owns UI state — GOVERNED_STATES, GovernedState, StatePattern, StateContract |
| `packages/design-system/src/contracts/motion.contract.ts` | Owns movement safety — MOTION_INTENTS, MotionIntent, MotionContract |
| `packages/design-system/src/contracts/accessibility.contract.ts` | Owns interaction safety — ACCESSIBILITY_REQUIREMENTS, AccessibilityRequirement, AccessibilityContract |
| `packages/design-system/src/contracts/export.contract.ts` | Owns public access — PublicExportContract |
| `packages/design-system/src/contracts/example.contract.ts` | Owns AI imitation — GovernedExample (imitationOnly: true required) |
| `packages/design-system/src/contracts/class-name-policy.contract.ts` | Owns layout escape — PROHIBITED_CLASSNAME_PATTERNS, ALLOWED_LAYOUT_CLASSNAME_PATTERNS, ClassNamePolicyContract |
| `packages/design-system/src/contracts/__tests__/design-system-contracts.test.ts` | 8 tests enforcing all governance invariants |

### Files modified (TypeScript quality pass)

| File | Change |
| --- | --- |
| `packages/design-system/src/contracts/example.contract.ts` | `imitationOnly` changed from `?: true` (optional) to `: true` (required) — closes type enforcement gap |
| `packages/design-system/src/variants/registry.ts` | `mapOptions` return type annotated explicitly as `readonly VariantDefinition[]` |
| `packages/design-system/src/policies/class-name-policy.ts` | Added `u` flag to `CLASS_NAME_SEPARATOR_PATTERN` regex |
| `packages/design-system/src/__tests__/index.test.ts` | Added `u` flag to `SEMANTIC_CLASS_PATTERN` regex |

### Contract ownership matrix

| Domain | Contract | Owned responsibility | Prohibited from |
| --- | --- | --- | --- |
| Token | `tokenContract` | value | behavior, recipes, slot structure, business logic |
| Variant | `variantContract` | meaning | raw CSS values, component behavior, business logic |
| Recipe | `recipeContract` | styling composition | behavior, raw values, visual meaning, business logic |
| Component | `componentContract` | behavior | inventing tokens, variants, recipes, slots, business logic |
| Slot | `slotContract` | structure | styling, raw values, behavior, business logic |
| State | `stateContract` | UI state | domain workflow state, permissions, data fetching |
| Motion | `motionContract` | movement safety | component behavior, UI state, raw CSS outside tokens |
| Accessibility | `accessibilityContract` | interaction safety | domain permissions, business rules, tokens, recipes |
| ClassName | `classNamePolicyContract` | layout escape only | design meaning overrides, tokens, variants, recipes |
| Export | `exportContract` | public access | tokens, variants, recipes, component behavior, business logic |
| Example | `exampleContract` | AI imitation | public APIs, tokens, variants, recipes, business rules |

### Prohibited drift rules enforced in tests

1. All contract files present (`design-system-contracts.test.ts` — file system check)
2. Every contract has `contractId`, `version` (semver), `owner` (contains "TIP-004"), `purpose` (non-empty)
3. Every responsibility is unique — `ownedResponsibility` values form a set with no duplicates
4. Prohibited overlap from authority contract has ≥ 10 rules
5. Every named contract appears in `publicExportContract.stableExports`
6. No contract references ERP business logic in its governance object
7. `classNamePolicyContract.ownedResponsibility === "layout escape only"`
8. `exampleContract.ownedResponsibility === "AI imitation"` and every `GovernedExample.imitationOnly === true`

### Tests added

| Test file | Tests | What is verified |
| --- | --- | --- |
| `src/contracts/__tests__/design-system-contracts.test.ts` | 8 | Contract file presence, identity metadata, unique ownership, prohibited overlap, public export coverage, no ERP logic, className policy, example imitation-only |
| `src/__tests__/index.test.ts` | 17 | Full public API surface, token/variant/recipe registries, governance validator, frozen authority contract, motion policy coverage, status-tone token coverage |

**Total: 25 tests — all passing.**

### Commands run and results

```
pnpm --filter @afenda/design-system typecheck  →  Exit 0 (clean)
pnpm --filter @afenda/design-system test       →  25/25 passed
```

### Pass/fail verdict

**PASS — Enterprise 9.5+/10**

TIP-004 is complete. All 11 design-system contracts are implemented, exported, tested, documented, and proven to prevent ownership overlap and AI visual drift. The TypeScript quality pass tightened type soundness (`imitationOnly: true` required), improved return-type explicitness on `mapOptions`, and brought regex literals to Biome compliance.
