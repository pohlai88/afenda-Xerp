# Block Promotion Pipeline — Full Checklist

> For every block adapted from shadcn/studio (MCP or CLI), complete all steps in order.
> No bypass. Constitutional authority: ADR-0017 §2.

---

## Step 0 — Pre-flight

- [ ] Read target PAS §Handoff block (PAS-001 for shell/dashboard, PAS-007 for system admin, PAS-014 for RBAC UI)
- [ ] State afenda-coding-session Phase 0 (six lines)
- [ ] Check STUDIO-PATTERN-MAP for existing patterns that match your block's visual vocabulary
- [ ] Check `packages/appshell/src/shadcn-studio/blocks/` — is a similar block already adapted?
- [ ] Verify no deprecated class prefixes will be introduced (`app-shell-dashboard-kpi-*`, `app-shell-dashboard-sparkline-*`, `app-shell-dashboard-revenue-*`, `app-shell-dashboard-invoice-*`, `app-shell-activity-*`) — enforced by `studio-legacy-class-guard.test.ts`
- [ ] Check `_reference/` catalog (`_reference/shadcn-nextjs-admincn-admin-template-1.0.0/`) for pattern reference (read-only — never import)

---

## Step 1 — Install

```powershell
# Pro block (read credentials from .env.secret)
$env:EMAIL="<SHADCN_STUDIO_ACCOUNT_EMAIL>"
$env:LICENSE_KEY="<SHADCN_STUDIO_LICENSE_KEY>"
cd packages/ui
npx shadcn@latest add @ss-blocks/<block-name> -y

# Free shadcn component
npx shadcn@latest add <component-name> -c packages/ui
```

**MCP workflow:** Follow `/cui`, `/iui`, `/rui`, or `/ftc` step sequence exactly per
`.cursor/rules/shadcn-studio.instructions.mdc`. Collect all blocks before install phase.

---

## Step 2 — Stage

Raw MCP output lands in:

```
packages/ui/src/components/shadcn-studio/blocks/   ← staging area (not shipped, not governed)
packages/ui/src/components/shadcn-studio/primitives/  ← primitive variants (staging only)
```

This area is excluded from typecheck, Biome, and governance scans.
**Do not keep blocks here permanently.** This is reference only.

---

## Step 3 — Normalize

For each block component:

### 3a. Strip all `className` from `@afenda/ui` primitives

```tsx
// Before (MCP output)
<Button className="px-4 py-2 gap-2 text-sm font-medium bg-primary text-primary-foreground rounded-md hover:bg-primary/90">
  Save
</Button>

// After (governed)
<Button intent="primary" emphasis="solid" size="sm">
  Save
</Button>
```

Governed `@afenda/ui` components: `Button`, `Badge`, `Card`, `Alert`, `Field`, `Table`,
`Input`, `Label`, `Textarea`, `Checkbox`, `Switch`, `Dialog`, `Popover`, `Tooltip`, `Tabs`,
`Select`, `DropdownMenu`, `ContextMenu`, `Menubar`, `Breadcrumb`, `Pagination`,
`NavigationMenu`, `Sheet`, `Drawer`, `RadioGroup`, `Skeleton`, `ScrollArea`, `Avatar`,
`AlertDialog`, `Form`, `DataTable`, `Toaster`, `Progress`, `Toggle`, `Combobox`, `Sidebar`,
and all others in `GOVERNED_UI_COMPONENTS`.

### 3b. Map Tailwind utility classes → semantic `.app-shell-studio-*` classes

Use `STUDIO-PATTERN-MAP.md` as the lookup:

```tsx
// Before (MCP raw Tailwind)
<article className="flex flex-col gap-4 justify-between min-h-[8.5rem] p-5">
  <div className="flex gap-2 items-start justify-between">
    <div className="flex flex-col gap-[var(--density-field-gap)]">
      <span className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
        Revenue
      </span>
    </div>
  </div>
</article>

// After (semantic)
<article className="app-shell-studio-metric-card">
  <div className="app-shell-studio-metric__body">
    <div className="app-shell-studio-metric__header">
      <div className="app-shell-studio-metric__heading">
        <span className="app-shell-studio-metric__title">Revenue</span>
      </div>
    </div>
  </div>
</article>
```

**Decision guide** (for every remaining `className` in block TSX):

1. **Q1 — On an `@afenda/ui` governed primitive?** → Strip `className`; use governed props (`intent`, `emphasis`, `tone`, `size`, `state`). See Step 3a.
2. **Q2 — Visual/semantic class on plain HTML?** → Query STUDIO-PATTERN-MAP first. Match → use studio class. No match + ≥2 blocks → add to `afenda-appshell-studio.css`. No match + 1 block → use Afenda semantic Tailwind (`text-success`, not `text-green-600`).
3. **Q3 — Layout/structural class on plain HTML wrapper?** → Allowed as-is (`grid`, `flex`, `col-span`, `gap-*`, `items-*`, `justify-*`). Never on `@afenda/ui` primitives.

Full filter: [SKILL.md §2 decision filter](SKILL.md).

### 3c. Verify icon library

All icons must come from `lucide-react`. Replace any `@heroicons/react`, `react-icons`,
or inline SVGs with the equivalent Lucide icon.

---

## Step 4 — Promote CSS (if new reusable pattern)

Only add CSS when a pattern is reused across ≥2 blocks:

1. Add semantic class to `packages/appshell/src/styles/afenda-appshell-studio.css`
2. Add a row to `packages/appshell/src/shadcn-studio/STUDIO-PATTERN-MAP.md`
3. Use `--app-shell-studio-*` custom props in CSS — never hardcode color/spacing values

```css
/* Example: new pattern addition */
.app-shell-studio-new-pattern__title {
  font-size: var(--app-shell-type-body);
  color: var(--app-shell-studio-text-label);
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}
```

---

## Step 5 — Move to production

```
packages/appshell/src/shadcn-studio/blocks/<block-name>.tsx   ← production location
```

File naming convention: `app-shell-<domain>-<block-name>.tsx` (e.g. `app-shell-dashboard-kpi-stat.tsx`)

---

## Step 6 — Storybook story

Every block requires a `.stories.tsx` companion:

```tsx
// app-shell-dashboard-kpi-stat.stories.tsx
import type { Meta, StoryObj } from "@storybook/react";
import { AppShellDashboardKpiStat } from "./app-shell-dashboard-kpi-stat";

const meta: Meta<typeof AppShellDashboardKpiStat> = {
  title: "AppShell/Dashboard/KpiStat",
  component: AppShellDashboardKpiStat,
};
export default meta;
type Story = StoryObj<typeof AppShellDashboardKpiStat>;

export const Default: Story = {
  args: { /* fixture data */ },
};
```

---

## Step 7 — Tests

Required test files:

| File | Must cover |
|------|-----------|
| `<block-name>.test.tsx` | Render smoke test; no `@afenda/ui` className violations |
| `<block-name>.interaction.test.tsx` | (if interactive) user flows |

Governance test pattern:

```tsx
it("has no className on governed @afenda/ui primitives", () => {
  const { container } = render(<AppShellDashboardKpiStat {...fixtures} />);
  const buttons = container.querySelectorAll("[data-slot]");
  for (const el of buttons) {
    expect(el.getAttribute("class")).not.toMatch(/px-|py-|bg-|text-|rounded-/);
  }
});
```

---

## Step 8 — Wire in apps/erp

Import block from `@afenda/appshell`, never from the file path directly:

```tsx
// ✅ Correct
import { AppShellDashboardKpiStat } from "@afenda/appshell";

// ❌ Wrong — bypasses package boundary
import { AppShellDashboardKpiStat } from "../../packages/appshell/src/shadcn-studio/blocks/...";
```

CSS: ensure `globals.css` imports `@afenda/appshell/afenda-appshell.css` — studio CSS
is included transitively via `@import` inside that file.

---

## Step 9 — Gates (all must pass)

```bash
pnpm --filter @afenda/appshell test:run         # governance + render tests
pnpm --filter @afenda/appshell check:governance # Gate B — appshell consumer layer
pnpm ui:guard:scan                              # Gate D — fast className check (<2s)
pnpm ui:guard                                   # Gates A–G full sweep (B and C included)
pnpm ui:guard:proof                             # Gate G — NS1–NS5 attestation
pnpm --filter @afenda/erp typecheck             # if apps/erp changed
pnpm check                                      # Biome lint + format
```

**Do not report completion while any gate fails.**

---

## Completion Report template (afenda-coding-session §11)

```
Objective: [block name] adapted from shadcn/studio to @afenda/appshell
Files changed: [list]
Authority followed: ADR-0017, Foundation phase 04, Foundation phase 06, govern-primitive
Drift-prevention:
  | STUDIO-PATTERN-MAP consulted | Pass |
  | className stripped from @afenda/ui | Pass |
  | Deprecated prefixes absent | Pass |
  | No --afenda-* redefined | Pass |
  | afenda-appshell.css only imported | Pass |
Gates run: ui:guard:scan ✅ | ui:guard ✅ | ui:guard:proof ✅ | typecheck ✅ | check ✅
Known gaps: [none / describe]
```
