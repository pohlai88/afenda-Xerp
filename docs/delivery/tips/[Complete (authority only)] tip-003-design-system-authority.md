# TIP-003 - Design System Authority

Status: **Complete (authority only)**

## Purpose

TIP-003 establishes the Afenda Design System Authority before detailed UI contracts or component implementation. It defines who owns visual truth, how visual decisions are governed, and how AI-assisted coding is prevented from inventing UI behavior, styling, tokens, variants, recipes, slots, states, motion, accessibility rules, or public access paths.

TIP-003 is governance only. TIP-004 owns the detailed contract implementations.

## Files created

- `packages/design-system/src/contracts/design-system-authority.contract.ts`
- `packages/design-system/src/contracts/index.ts`
- `docs/delivery/tip-003-design-system-authority.md`

## Files updated

- `packages/design-system/src/index.ts`
- `packages/design-system/src/policies/export-surface.ts`
- `packages/design-system/src/__tests__/index.test.ts`

## Authority map

| Authority | Owner |
| --- | --- |
| Contract id | `afenda.design-system.authority` |
| Package | `@afenda/design-system` |
| Decision authority | ADR-governed Design System Authority |
| Supersession | Accepted ADR, version bump, contract update, tests |
| Related TIPs | TIP-003, TIP-004 |

## Ownership table

| Domain | Owns | Boundary |
| --- | --- | --- |
| Token | Raw and semantic design values | No behavior or layout recipes |
| Variant | Visual meaning and option vocabulary | No raw values |
| Recipe | Styling composition | No behavior, state meaning, or accessibility rules |
| Component | Behavior and accessibility wiring | Consumes authority; does not create it |
| Slot | Structure | No styling or behavior invention |
| State | UI state meaning | No data fetching or business workflows |
| Motion | Movement safety | No component API creation |
| Accessibility | Interaction safety | No domain permission logic |
| Class name policy | Layout escape rules | No design meaning overrides |
| Export surface | Public access | No design primitive creation |
| Example policy | Approved AI imitation patterns | No new APIs |

## Prohibited drift

| Rule |
| --- |
| Components must not invent tokens |
| Recipes must not invent behavior |
| Variants must not invent raw values |
| Slots must not invent styling |
| Examples must not invent APIs |
| `className` must not override design meaning |
| App packages must not define design primitives |
| `metadata-ui` must not bypass design-system authority |
| AppShell must not invent local visual rules |
| Business modules must not own UI governance |

## AI rules

AI may consume exported contracts, extend only through approved contract surfaces, generate examples only from approved examples, and implement UI only after TIP-004 contracts exist.

AI may not invent tokens, variants, recipes, component behavior, class naming policy, or ownership; create visual authority in app packages; or duplicate design contracts in `metadata-ui` or apps.

## Acceptance criteria

| Scenario | Result |
| --- | --- |
| Future UI work begins | Every visual responsibility has exactly one owner |
| Future UI work begins | No UI responsibility overlaps |
| AI-assisted coding starts | AI has no permission to invent visual architecture |
| TIP-004 starts | Detailed contracts have an explicit authority baseline |

## Verification commands

```bash
pnpm --filter @afenda/design-system typecheck
pnpm --filter @afenda/design-system test
pnpm typecheck
pnpm test:run
pnpm quality
```

## Completion evidence

- Authority identity is exported from `@afenda/design-system`
- All authority domains are declared exactly once
- All prohibited overlap rules are tested
- All downstream TIP-004 contracts are referenced
- Public exports include authority runtime symbols
- Authority contract is frozen at runtime and mutable only through ADR

## Final verdict

TIP-003 delivers the Design System Authority constitution. It does not implement new UI components, screens, business workflows, database schema, permissions, AppShell navigation logic, or metadata rendering logic.
