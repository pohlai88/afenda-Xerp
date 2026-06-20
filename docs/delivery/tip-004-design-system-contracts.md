# TIP-004 - Design System Contracts

Status: **Complete (contracts)**

## Purpose

TIP-004 converts the TIP-003 Design System Authority into enforceable TypeScript contracts for Afenda UI governance. These contracts prevent AI-assisted development from inventing UI behavior, tokens, recipes, variants, slots, state, motion, accessibility, exports, examples, or class-name policy.

Scope is limited to `packages/design-system` contract governance. TIP-004 does not build UI components, AppShell, Metadata UI, permissions, database schema, accounting logic, or page-level styling.

## Files created

- `packages/design-system/src/contracts/__tests__/design-system-contracts.test.ts`
- `docs/delivery/tip-004-design-system-contracts.md`

## Files updated

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
- `packages/design-system/src/contracts/index.ts`
- `packages/design-system/src/index.ts`
- `packages/design-system/src/policies/export-surface.ts`
- `packages/design-system/src/examples/erp-patterns.ts`
- `packages/design-system/src/__tests__/index.test.ts`

## Authority inherited from TIP-003

TIP-004 inherits `designSystemAuthorityContract` from TIP-003. TIP-003 establishes visual authority ownership. TIP-004 implements the detailed contracts named by that authority and keeps all public consumption on the root `@afenda/design-system` export surface.

## Ownership matrix

| Contract | Owned responsibility | Principle |
| --- | --- | --- |
| `tokenContract` | value | Token owns value |
| `variantContract` | meaning | Variant owns meaning |
| `recipeContract` | styling composition | Recipe owns styling composition |
| `componentContract` | behavior | Component owns behavior |
| `slotContract` | structure | Slot owns structure |
| `stateContract` | UI state | State owns UI state |
| `motionContract` | movement safety | Motion owns movement safety |
| `accessibilityContract` | interaction safety | Accessibility owns interaction safety |
| `classNamePolicyContract` | layout escape only | ClassName owns layout escape only |
| `exportContract` | public access | Export owns public access |
| `exampleContract` | AI imitation | Example owns AI imitation |

## Contract responsibility map

Each contract defines:

- `contractId`
- `version`
- `owner`
- `purpose`
- `ownedResponsibility`
- `allowedResponsibility`
- `prohibitedResponsibility`
- `downstreamConsumers`
- `aiGenerationRules`
- `acceptanceRules`

## Prohibited drift

| Drift | Contract enforcement |
| --- | --- |
| Components invent tokens | `componentContract.prohibitedResponsibility` |
| Recipes invent behavior | `recipeContract.prohibitedResponsibility` |
| Variants invent raw CSS values | `variantContract.prohibitedResponsibility` |
| Slots invent styling | `slotContract.prohibitedResponsibility` |
| Examples invent APIs | `exampleContract.prohibitedResponsibility` |
| `className` overrides design meaning | `classNamePolicyContract.prohibitedResponsibility` |
| Business modules define design primitives | `tokenContract`, `variantContract`, and `exportContract` downstream rules |
| AppShell or Metadata UI bypasses contracts | downstream consumers must use root exports |

## AI allowed / forbidden

| AI may | AI may not |
| --- | --- |
| Consume exported contracts | Invent tokens |
| Select approved token, variant, recipe, slot, state, motion, and accessibility rules | Invent variants or recipes |
| Use `className` for layout-only escape | Override design meaning through `className` |
| Imitate approved examples | Treat examples as authority |
| Request a contract extension when authority is missing | Duplicate UI authority in apps, AppShell, or Metadata UI |

## Acceptance criteria

| Scenario | Required result |
| --- | --- |
| AI IDE generates UI code | It can identify the correct design contract owner |
| AI IDE generates UI code | It cannot invent visual authority or duplicate UI responsibility |
| Future component needs styling | It consumes tokens, variants, recipes, slots, state, motion, and accessibility contracts |
| Metadata UI or AppShell renders UI | It consumes approved contracts and does not define independent design authority |

## Verification commands

```bash
pnpm --filter @afenda/design-system typecheck
pnpm --filter @afenda/design-system test
pnpm typecheck
pnpm test:run
pnpm quality
```

## Completion report template

- Files created:
- Files modified:
- Contract ownership matrix:
- Prohibited drift rules:
- Tests added:
- Commands run:
- Pass/fail verdict:

## Completion evidence

- Every required contract file exists
- Every contract exports governance metadata
- Every responsibility has exactly one owner
- Public exports include every contract object
- Examples are marked imitation-only
- Class-name policy remains layout-only
- Tests enforce prohibited overlap and AI anti-drift rules
