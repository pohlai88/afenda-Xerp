# Agent Design Constraints

Closed sets for V2 agents. See [react-composition-patterns.md](react-composition-patterns.md) and [react-best-practices.md](react-best-practices.md).

## Closed Sets

| Domain | Use | Forbidden |
| --- | --- | --- |
| Color | `bg-primary`, `text-muted-foreground` | Hex, arbitrary `[#…]` |
| Variants | Owner-file `satisfies Record<…>` | Consumer inline ternaries |
| Behavior API | Compound parts, explicit variants | `show*`, `hide*`, `is*` booleans |

## Decision Tree

```text
Color    → semantic token utility
Spacing  → Tailwind scale
Variant  → extend src/components/ui/*.tsx
Optional UI → compound part or explicit variant component
```

## Agent Prompt Snippet

```text
Use afenda-erp-design-system + agent-design-constraints.
Closed semantic tokens and variant maps only. No show*/is* on L1 primitives.
Gates: pnpm studio:v2:primitives when touching components/ui/**.
```
