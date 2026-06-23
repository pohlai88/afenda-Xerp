# TIP-UI-06 — React 19 Ref-as-Prop Migration

Status: **Proposed** (blocked until design-system upgrade gates are green)

## Purpose

Migrate the `@afenda/ui` **author layer** from `React.forwardRef` to React 19 **ref-as-prop** in one coordinated batch, without changing consumer ref APIs or mixing the work into token/recipe/governance upgrades.

**Constitutional decision:** [ADR-0008 — React 19 Ref-as-Prop in `@afenda/ui` Author Layer](../adr/ADR-0008-react19-ref-as-prop-ui-author-layer.md)

---

## Scope

### In scope

- `packages/ui/src/components/**` — all governed primitives and compounds
- `packages/ui/src/governance/create-governed-slot.tsx` — slot factories
- Public TypeScript prop interfaces in component files
- Ref-forwarding Vitest tests
- Static governance rule: ban new `forwardRef` in author layer
- Update `.cursor/skills/govern-primitive/SKILL.md` checklist item 5 after completion

### Out of scope

- `apps/erp/**`, `packages/appshell/**`, `packages/metadata-ui/**`
- `@afenda/design-system` token/recipe changes
- Radix UI / cmdk upstream ref internals
- Storybook-only helpers unless they duplicate primitive wrappers

---

## Depends on

| Prerequisite | Gate |
| --- | --- |
| Design-system upgrade stable | `pnpm --filter @afenda/ui check:governance` |
| Primitive normalization complete | [ui-radix-primitive-normalization.md](./ui-radix-primitive-normalization.md) |
| TIP-004B adapter layer | [tip-004b-primitive-adapter.md](./tip-004b-primitive-adapter.md) |
| ADR-0008 | Status → **Accepted** before implementation starts |

**Do not start** while an active DS/recipe migration PR is open.

---

## Blocks

- Future govern-primitive checklist update (React 19 ref-as-prop as canonical)
- Optional: Biome/Ultracite rule for `forwardRef` ban in `packages/ui/src/components`

---

## Target pattern

### Before (React 18 style — current)

```tsx
const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, intent = "primary", ...props }, ref) => {
    const governed = resolvePrimitiveGovernance({ /* … */ });
    return (
      <button ref={ref} {...props} {...governed.dataAttributes} className={cn(governed.className)} />
    );
  }
);
Button.displayName = "Button";
```

### After (React 19 ref-as-prop — target)

```tsx
export interface ButtonProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "className" | "ref">,
    GovernedButtonProps {
  readonly className?: string;
  readonly ref?: React.Ref<HTMLButtonElement>;
}

function Button({ ref, className, intent = "primary", ...props }: ButtonProps) {
  const governed = resolvePrimitiveGovernance({ /* … */ });
  return (
    <button ref={ref} {...props} {...governed.dataAttributes} className={cn(governed.className)} />
  );
}
Button.displayName = "Button";
```

### Slot factory (migrate first)

```tsx
// create-governed-slot.tsx — same ref-as-prop shape for Div/Span slots
function GovernedDivSlot({ ref, className, ...props }: GovernedDivSlotProps) {
  const governed = resolveSlotGovernance(input, className);
  return <div ref={ref} {...applyGovernedPresentation(props, governed)} />;
}
```

---

## Migration order

Execute in this order. **Finish each chunk’s tests before the next.**

| Phase | Chunk | Files (representative) | Est. forwardRef sites |
| --- | --- | --- | --- |
| 0 | ADR + TIP acceptance | docs only | — |
| 1 | Slot factories | `create-governed-slot.tsx` | 2 |
| 2 | Leaf primitives | `button`, `badge`, `input`, `textarea`, `label`, `checkbox`, `switch`, `separator`, `skeleton`, `spinner`, `progress`, `slider`, `toggle`, `status-indicator` | ~15 |
| 3 | Form compounds | `field`, `form`, `input-group`, `input-otp`, `native-select`, `radio-group`, `select` | ~35 |
| 4 | Surface / layout | `card`, `alert`, `empty`, `item`, `table`, `data-table`, `scroll-area`, `avatar`, `aspect-ratio` | ~25 |
| 5 | Overlay / menu | `dialog`, `sheet`, `drawer`, `alert-dialog`, `popover`, `tooltip`, `hover-card`, `dropdown-menu`, `context-menu`, `menubar`, `command`, `combobox` | ~60 |
| 6 | Navigation / shell | `tabs`, `accordion`, `collapsible`, `breadcrumb`, `navigation-menu`, `pagination`, `sidebar`, `carousel`, `calendar`, `chart`, `resizable`, `direction`, `button-group`, `kbd`, `sonner` | ~70 |
| 7 | Governance gate + skill update | static checker, govern-primitive SKILL | — |

**Total:** ~50 files · report progress as “Updated N of 50 files”.

---

## Per-component checklist

For each migrated component:

```
[ ] Props extend Omit<..., "ref"> and declare readonly ref?: React.Ref<T>
[ ] No React.forwardRef wrapper
[ ] ref passed to DOM or Radix root only
[ ] displayName preserved
[ ] resolvePrimitiveGovernance / applyGovernedPresentation unchanged
[ ] Existing render + ref tests updated and passing
[ ] No consumer API rename
```

---

## Testing requirements

### Must pass (unchanged behavior)

| Test area | Representative suite |
| --- | --- |
| Ref forwarding | `button.test.tsx`, `overlay-primitives.test.tsx` (DialogTitle) |
| Governance authority | All `*.test.tsx` under `src/__tests__/components/` |
| Static source rules | `component-source-governance.test.ts` |
| Public exports | `public-api.test.ts` |

### Add or update

| Test | Assertion |
| --- | --- |
| Ref forwarding smoke | `ref` callback receives HTMLElement for Button, Input, DialogTitle |
| Type surface | `ButtonProps` accepts `ref` without `ComponentRef` helper at call site |

### Interaction tests

No change expected — `aria-checked` / Radix behavior unchanged.

---

## Governance / CI additions (Phase 7)

Add to `component-source-governance.test.ts` or `check-design-system-consumption.ts`:

```txt
Rule: packages/ui/src/components/**/*.tsx (excl. stories)
  MUST NOT contain: React.forwardRef(
  Exception: none (post-migration)
```

Optional interim rule (during migration only — **not recommended**):

```txt
  MUST NOT add new React.forwardRef( in files touched by non-TIP-UI-06 PRs
```

---

## Verification commands

Run after **each phase** and before marking Complete:

```bash
pnpm --filter @afenda/ui typecheck
pnpm --filter @afenda/ui test:run
pnpm --filter @afenda/ui check:governance
pnpm ui:guard:scan
pnpm ui:guard
pnpm quality:exports
```

Full monorepo (before merge to main):

```bash
pnpm typecheck
pnpm test:run
pnpm build
pnpm quality
```

---

## Rollback plan

| Step | Action |
| --- | --- |
| 1 | `git revert` TIP-UI-06 merge commit(s) |
| 2 | Confirm ADR-0008 status remains Proposed or mark Superseded if partial |
| 3 | Run `@afenda/ui` gates above |
| 4 | No ERP/AppShell consumer changes needed |

`forwardRef` on React 19 is fully supported — rollback is safe.

---

## Migration notes for consumers

**None.** Call sites remain:

```tsx
const ref = useRef<HTMLButtonElement>(null);
<Button ref={ref} intent="primary" emphasis="solid">Save</Button>
```

Type-only change: exported `*Props` types include optional `ref`; no import path changes.

---

## Remaining gaps (post-migration)

| Gap | Owner | Notes |
| --- | --- | --- |
| Radix/cmdk still use forwardRef internally | Upstream | Not Afenda's boundary |
| appshell local components | TIP-UI-03+ follow-up | Separate ADR if needed |
| React 19 `use()` vs useContext | react-erp-quality | Out of scope for TIP-UI-06 |

---

## Acceptance criteria

```gherkin
GIVEN ADR-0008 is Accepted
AND design-system upgrade gates are green
WHEN TIP-UI-06 is implemented
THEN packages/ui/src/components contains zero React.forwardRef(
AND ref forwarding tests pass
AND pnpm --filter @afenda/ui check:governance passes
AND consumer packages require no ref API changes
```

---

## Status tracking

| Milestone | Target | Actual |
| --- | --- | --- |
| ADR-0008 proposed | 2026-06-22 | ✅ |
| ADR-0008 accepted | After DS gates green | ☐ |
| Phase 1 factories | — | ☐ |
| Phase 2–6 components | — | ☐ |
| Phase 7 CI gate | — | ☐ |
| TIP-UI-06 complete | — | ☐ |

---

## Related

- [ADR-0008](../adr/ADR-0008-react19-ref-as-prop-ui-author-layer.md)
- [ui-radix-primitive-normalization.md](./ui-radix-primitive-normalization.md)
- [tip-ui-02-component-library.md](./tip-ui-02-component-library.md)
- `.cursor/skills/govern-primitive/SKILL.md`
- `.cursor/skills/react-erp-quality/SKILL.md` — `react19-no-forwardref`
