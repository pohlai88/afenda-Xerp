---
name: afenda-accessibility
description: >
  Afenda-native accessibility authority for governed UI, MCP/studio blocks, metadata renderers,
  and Storybook stories. Consolidates WCAG 2.2 checks, B42k statistics article contracts,
  delegating-flip a11y parity gates, interaction test patterns, and scoped Storybook addon-a11y
  verification. Use when touching interactive UI, MCP blocks, presentation wrappers, or a11y tests.
paths:
  - packages/ui/**
  - packages/appshell/**
  - packages/metadata-ui/**
  - packages/shadcn-studio/**
  - apps/erp/**
  - apps/storybook/**
disable-model-invocation: true
---

# Afenda Accessibility

Single authority for **perceivable / operable / understandable / robust** UI across the metadata-driven ERP stack.

**Related skills (read in order for full UI work):**

| Layer | Skill |
| --- | --- |
| Visual + anti-slop | `afenda-ui-quality` §5.2 |
| React composition + hooks | `react-erp-quality` |
| Governed primitives | `govern-primitive` checklist item 12 |
| MCP block promotion | `afenda-shadcn-components` + `shadcn-studio-authority` |
| Bundle entry | `ui-consistency-bundle` surface router |

---

## When to use

Apply when editing or reviewing:

- `@afenda/ui` primitives and consumer wiring (`packages/appshell`, `packages/metadata-ui`, `apps/erp`)
- shadcn-studio MCP blocks (`packages/shadcn-studio/**`)
- Presentation MCP wrappers and delegating-flip policy (`presentation-mcp-delegating-flip-policy.registry.ts`)
- Storybook stories and addon-a11y parameters (`apps/storybook/**`)
- Accessibility-focused Vitest / interaction tests

**Out of scope:** Full `test:storybook:run` green — use **story-scoped** contracts and addon-a11y on changed stories only.

---

## Category matrix (WCAG 2.2 framing)

| POUR | Afenda enforcement |
| --- | --- |
| **Perceivable** | APCA contrast ≥ 60 body / ≥ 75 UI labels; meaningful `alt`; charts as `<figure aria-label="…">` with `aria-hidden` on decorative SVG; status as dot + text (not color-only pills) |
| **Operable** | Visible `focus-visible` rings on all interactives; keyboard navigation without mouse; dialog/sheet focus return to trigger; `prefers-reduced-motion` on animated elements; no animation on high-frequency actions |
| **Understandable** | `htmlFor`/`id` label association; `role="alert"` for errors; `aria-live` for dynamic tables/search/notifications; loading `aria-busy="true"` + descriptive `aria-label` |
| **Robust** | Semantic roles from primitives (not div soup); governed `data-*` last in spread; serializable a11y contracts in registry tests; no raw hex in element CSS (R15) |

---

## Afenda-specific contracts

### 1. Statistics MCP blocks (PAS-005A B42k)

Every statistics metric MCP block promoted for appshell delegating flip **must** expose:

```tsx
// Contract (see statistics-metric-a11y.contract.test.tsx)
<article aria-label={title}>
  <span aria-describedby={changeFootnoteId}>{amount}</span>
  <span id={changeFootnoteId}>{change}</span>
</article>
```

**Hard stop:** Do not flip a statistics wrapper to `delegating` in `presentation-mcp-delegating-flip-policy.registry.ts` unless `mcp-a11y-parity` rationale is satisfied **and** B42k contract test passes for that block.

### 2. Delegating-flip policy

Registry: `packages/appshell/src/presentation/wrappers/presentation-mcp-delegating-flip-policy.registry.ts`

| Rationale | Meaning |
| --- | --- |
| `mcp-a11y-parity` | Block has B42k-style contract test; safe to delegate to MCP twin |
| `dashboard-a11y-landmarks` | Dashboard region has landmark/heading structure before flip |
| `governed-compose-required` | Cannot flip — governed shell must compose block |

**Hard stop:** Never add `targetStatus: "delegating"` without documenting rationale and adding or extending a contract test.

### 3. Governed primitive focus

From `govern-primitive` + `ui:guard`:

- Focus rings via governance recipes — not ad-hoc Tailwind on consumers
- No `className` on `@afenda/ui` primitives in consumer packages
- `pnpm ui:guard:scan` must pass after interactive changes

### 4. Recharts / data visualization

```tsx
<figure aria-label="Revenue trend, last 12 months">
  <ResponsiveContainer>
    <AreaChart accessibilityLayer …>
      …
    </AreaChart>
  </ResponsiveContainer>
</figure>
```

SVG decorative chrome: `aria-hidden="true"`. Numeric cells: `tabular-nums`.

---

## Verification ladder

Run **bottom-up** — do not skip lower rungs when adding interactives.

| Rung | Command / action | When |
| --- | --- | --- |
| 1 | Vitest render / `*.interaction.test.tsx` with `@afenda/testing/react` | Every interactive or a11y contract change |
| 2 | `pnpm ui:guard:scan` | Any `@afenda/ui` consumer or primitive touch |
| 3 | `pnpm --filter @afenda/shadcn-studio test:run` (includes B42k) | MCP block changes |
| 4 | Storybook addon-a11y on **changed story only** | New/changed stories — `a11y.test: "warn"` in preview |
| 5 | `pnpm ui:guard` (gates A–F) | Pre-merge UI batches |

### Interaction test standard (AGENTS.md)

```ts
import { render, screen } from "@testing-library/react";
import { openMenu, setupUser } from "@afenda/testing/react";

const user = setupUser();
await user.click(screen.getByRole("button", { name: "Open" }));
```

- **Do not use `fireEvent`** for interactive components
- Name suites `*.interaction.test.tsx`
- Run subset: `pnpm test:interaction`

### Storybook addon-a11y (scoped)

Configured in `apps/storybook/.storybook/preview.tsx`:

- Rules enabled: `color-contrast`, `label`
- `test: "warn"` — violations surface in story panel, not full-runner gate

For a changed story: open Storybook → Accessibility tab → fix violations in the same turn.

---

## Mandatory checklist (from afenda-ui-quality §5.2)

```
[ ] All interactive elements have visible focus-visible ring
[ ] Form inputs associated with labels via htmlFor/id
[ ] Error states use role="alert"
[ ] Images have meaningful alt text
[ ] APCA contrast ≥ 60 for body text, ≥ 75 for UI labels
[ ] Keyboard navigation works without mouse
[ ] No animation on high-frequency actions (keyboard, toggles, typing)
[ ] Dynamic content (search, filtered tables, notifications) has aria-live region
[ ] recharts SVGs wrapped in <figure aria-label="..."> with aria-hidden on decorative SVG
[ ] Dialog/Sheet close returns focus to trigger element
[ ] Loading states use aria-busy="true" with descriptive aria-label
[ ] prefers-reduced-motion honored on every animated element
```

---

## Hard stops

```
Delegating flip without mcp-a11y-parity contract test
fireEvent in interaction tests (use @afenda/testing/react)
className on governed @afenda/ui primitive for focus/hover fixes
Raw hex/oklch on element CSS (R15 — use authority tokens)
Claiming Storybook a11y pass without opening Accessibility tab on changed story
Skipping ui:guard:scan after interactive consumer edit
Icon-only button without aria-label
Color-only status indication (must include text or aria-label)
```

---

## Gates (paste output in Completion Report)

```bash
pnpm ui:guard:scan
pnpm --filter @afenda/ui check:governance    # primitive author changes
pnpm --filter @afenda/shadcn-studio test:run
pnpm test:interaction                        # if *.interaction.test.tsx touched
pnpm check:css-governance                    # if focus ring CSS / token changes
```

---

## Scoring (target 9.5/10)

| Criterion | Weight |
| --- | --- |
| Checklist items satisfied on touched surface | 4.0 |
| Contract test exists for new MCP/delegating block | 2.0 |
| ui:guard:scan + interaction tests green | 2.0 |
| No hard-stop violations | 1.0 |
| Storybook a11y warn cleared on changed stories | 0.5 |

**9.5+** — all weights satisfied with Shell evidence.

---

## References

- B42k contract: `packages/shadcn-studio/src/__tests__/statistics-metric-a11y.contract.test.tsx`
- Delegating policy: `packages/appshell/src/presentation/wrappers/presentation-mcp-delegating-flip-policy.registry.ts`
- Storybook a11y config: `apps/storybook/.storybook/preview.tsx`
- Governed UI policy: `docs/governance/governed-ui-policy.md`
- TIP-004 consumption: `docs/governance/tip-004-policy.md`
