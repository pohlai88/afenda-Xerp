# ADR-0008 — React 19 Ref-as-Prop in `@afenda/ui` Author Layer

| Field | Value |
|-------|-------|
| **Status** | Proposed |
| **Date** | 2026-06-22 |
| **Owner** | Architecture Authority · UI Platform |
| **Supersedes** | — |
| **Superseded by** | — |

---

## Context

Afenda runs **React 19.1** (`pnpm-workspace.yaml` catalog). React 19 allows `ref` as a normal component prop; `React.forwardRef` remains supported but is no longer the canonical author-layer pattern.

`@afenda/ui` currently implements **~50 component files** with `React.forwardRef`, including multi-slot compounds (Field, Dialog, DropdownMenu) and governed slot factories (`createGovernedDivSlot`, `createGovernedSpanSlot`). The **govern-primitive** skill explicitly forbids **component-by-component** ref migration until a package-wide decision is recorded.

The design-system upgrade (tokens, recipes, TIP-004B governance) is **orthogonal** to ref ergonomics. Mixing both in one pass increases regression risk without consumer-visible benefit — `<Button ref={r} />` already works with either implementation.

Third-party dependencies (Radix UI, cmdk, recharts wrappers) still ship `forwardRef` internally. Afenda controls only the **author layer** in `packages/ui/src/components/**`.

---

## Decision

1. **Defer** ref-as-prop migration until the active design-system / primitive-normalization gates are stable (`pnpm --filter @afenda/ui check:governance`, `pnpm ui:guard`, Storybook, ERP surface smoke).

2. **Adopt** ref-as-prop as the **canonical pattern for new and migrated code in `packages/ui` author layer only**, executed as a **single package-wide batch** documented in [TIP-UI-06](../delivery/tips/%5BBlocked%5D%20tip-ui-06-react19-ref-as-prop.md).

3. **Do not** change consumer-facing ref APIs in `apps/erp`, `@afenda/appshell`, or `@afenda/metadata-ui`. Call sites keep `<Primitive ref={…} />`.

4. **Migrate in dependency order** (see TIP-UI-06):
   - Governed slot factories first
   - Leaf primitives (Input, Button, …)
   - Multi-slot compounds last

5. **Keep `displayName`** on every exported component after migration.

6. **Add a static governance gate** after migration: no `React.forwardRef` in `packages/ui/src/components/**` (exempt list empty unless ADR-0005 exception).

7. **Do not** migrate ref strategy in consumer packages in this ADR — out of scope.

---

## Consequences

### Positive

- Aligns `@afenda/ui` with React 19 idioms and reduces boilerplate in 58+ primitives.
- Slot factories migrate once and benefit all compound components.
- Clear separation from DS upgrade — failures are attributable to one change set.
- Consumer API unchanged — zero ERP/AppShell migration cost.

### Negative / trade-offs

- Large single PR or sequenced PR chain touching most of `packages/ui/src/components/**`.
- Temporary inconsistency with Radix/cmdk internals still using `forwardRef` (acceptable — boundary is Afenda author layer).
- Type churn on public prop interfaces (`ref?: React.Ref<T>` on each props type).
- Existing ref-forwarding Vitest tests must be updated, not deleted.

---

## Acceptance Gate

This ADR is **Accepted** when TIP-UI-06 is **Complete** and all of the following pass:

```bash
pnpm --filter @afenda/ui typecheck
pnpm --filter @afenda/ui test:run
pnpm --filter @afenda/ui check:governance
pnpm ui:guard
```

Additional gate (added during implementation):

- Static check: **zero** `React.forwardRef` in `packages/ui/src/components/**` (excluding `.stories.tsx` if stories mirror primitives — stories should follow same rule).
- Ref forwarding tests pass for Button, Input, DialogTitle, TableCell (representative leaf + compound sample).
- No new deep imports or public export drift (`pnpm quality:exports`).

---

## Out of scope

- Migrating `@afenda/appshell` or `apps/erp` component definitions
- Changing Radix or third-party library internals
- Removing `forwardRef` from `@afenda/ui/governance` test utilities unless required
- React Compiler or concurrent feature adoption

---

## Rollback

If ref-as-prop migration causes regressions:

1. Revert the TIP-UI-06 merge commit(s) — `forwardRef` remains valid on React 19.
2. Re-run `@afenda/ui` test + governance gates.
3. No consumer package rollback required (API unchanged).

---

## References

- Policy: [TIP-004 governed UI](../governance/tip-004-policy.md) · [ui-guard gates](../governance/ui-guard.md)
- Skill: `.cursor/skills/govern-primitive/SKILL.md`
- React catalog: `pnpm-workspace.yaml` → `react: ^19.1.0`
