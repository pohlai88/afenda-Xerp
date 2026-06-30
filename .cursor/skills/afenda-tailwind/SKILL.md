---
name: afenda-tailwind
description: >-
  Afenda ERP Tailwind v4 authority for PAS-006 Phase 1. Use when editing
  globals.css, preview.css, shadcn-studio theme CSS, @source/@theme/@utility,
  or Tailwind className in apps/erp and packages/shadcn-studio. Enforces
  import-only composition entries and pure shadcn + Tailwind styling — not
  legacy PAS-005 css-authority or governed-ui layers.
paths:
  - apps/erp/**/*.css
  - apps/erp/**/*.{ts,tsx}
  - apps/storybook/**/*.css
  - packages/shadcn-studio/**/*.css
  - packages/shadcn-studio/**/*.{ts,tsx}
---

# Afenda Tailwind v4 (PAS-006 Phase 1)

Single Tailwind entry for **ADR-0027 ERP presentation**. Scoped to `@afenda/shadcn-studio`, `apps/erp`, `apps/storybook`.

**Retired scope:** `packages/ui`, `packages/appshell`, `packages/css-authority`, governed-ui layered model — historical only under `_retired/legacy-ui/afenda-tailwind/`. Do not apply those rules to ERP.

**Authority:** [PAS-006A §4](../../../docs/PAS/PRESENTATION/PAS-006A-SHADCN-STUDIO-PRODUCT-STANDARD.md) · [ADR-0027](../../../docs/adr/ADR-0027-frontend-presentation-reset.md)

---

## When to use / when to defer

| Task | Skill |
| --- | --- |
| `globals.css`, `preview.css`, theme CSS, `@source`, `@theme inline` | **this skill** |
| MCP block install, studio barrel, metadata binding | `shadcn-studio` |
| Full ERP presentation gate bundle | `afenda-presentation-quality` |
| CSS dist sync policy | `package-css-dist-sync` |
| PAS-005 / css-authority (audit only) | `_retired/legacy-ui/css-authority` — **do not use for ERP** |

---

## Phase 1 doctrine (do not optimize)

1. **Composition CSS = imports only** — no bespoke visual rules in app entries.
2. **Styling = Tailwind `className`** on ERP routes and studio blocks/components.
3. **Theme tokens = `shadcn-studio.css`** — unprefixed shadcn `--*` vars; sync dist after edits.
4. **Stock shadcn primitives** (`Button`, `Card`, etc.) over one-off CSS.
5. **Stabilize first** — do not extract CSS modules, refactor tokens, or add `@layer components` shortcuts.

---

## Composition entries (import-only)

### ERP — `apps/erp/src/app/globals.css`

```css
@import "tailwindcss";
@import "tw-animate-css";
@import "shadcn/tailwind.css";
@import "@afenda/shadcn-studio/shadcn-studio.css";

@source "../**/*.{ts,tsx}";
@source "../../../../packages/shadcn-studio/src/**/*.{ts,tsx}";
```

### Storybook — `apps/storybook/.storybook/preview.css`

Same four `@import`s (AdminCN order) and `@source` globs. Optional shell rules on `html, body, #storybook-root` only.

**Do not:**

- Insert imports between the four canonical entries
- Add `@layer components { .erp-* { … } }` or any bespoke selectors
- Re-import `tailwindcss` in package CSS
- Import retired package CSS (`@afenda/ui`, appshell, metadata-ui, css-authority)

Gate: `pnpm check:downstream-integration`

---

## Theme authority

| Surface | Path |
| --- | --- |
| CSS source (authoring) | `packages/shadcn-studio/src/styles/shadcn-studio.css` |
| CSS dist (app import) | `packages/shadcn-studio/dist/shadcn-studio.css` |

After editing source:

```bash
pnpm sync:package-css-dist -- --package @afenda/shadcn-studio
pnpm check:package-css-dist-sync
```

`@custom-variant dark` and `:root` / `.dark` token blocks stay **unlayered** in theme CSS (Tailwind v4 requirement).

`@theme inline` maps sidebar/chart tokens to utilities — extend here, not in `globals.css`.

---

## Tailwind in TSX (ERP + studio)

**Preferred:**

- Semantic utilities: `bg-background`, `text-foreground`, `border-border`, `bg-card`, `text-muted-foreground`
- Layout: flex/grid/gap/padding via utilities (`flex min-h-dvh flex-col items-center gap-4 p-6`)
- shadcn components: `Button`, `Card`, `Alert` from `@afenda/shadcn-studio`
- Stock block `className` during stabilization (PAS-006C acceptance later)

**Forbidden in ERP TSX:**

- Legacy BEM classes (`.erp-route-error__*`, `.erp-system-admin-*`, `.app-shell-*`)
- Raw palette utilities when semantic tokens exist (`bg-gray-900` → `bg-background`)
- Hex/OKLCH literals in TSX (use CSS vars via utilities)

**Forbidden in `@afenda/shadcn-studio`:**

- `@afenda/kernel` or any `@afenda/*` runtime dependency
- Business logic in presentation components

---

## v3 banlist (reject on sight)

| v3 (ban) | v4 (use) |
| --- | --- |
| `@tailwind base/components/utilities` | `@import "tailwindcss"` |
| `tailwind.config.js` theme.extend | `@theme` / `@theme inline` in CSS |
| Multi-package CSS import chains | AdminCN four-import composition only |
| `@afenda/css-authority` imports | `@afenda/shadcn-studio/shadcn-studio.css` |
| `pnpm ui:guard*` | `pnpm check:downstream-integration` |

Extended historical reference: `_retired/legacy-ui/afenda-tailwind/reference/v3-banlist.md`

---

## Fix workflow

1. **Wrong color/token** → fix in `shadcn-studio.css`, sync dist
2. **Missing utility** → add `@theme inline` mapping in theme CSS if token-backed; otherwise use existing semantic utility
3. **Page layout** → Tailwind `className` in route/component TSX, or install shadcn block via MCP
4. **globals.css temptation** → **stop** — composition entry is not a styling escape hatch
5. Re-run gates below

---

## Verification

```bash
pnpm check:downstream-integration
pnpm quality:css
pnpm --filter @afenda/shadcn-studio typecheck
pnpm --filter @afenda/erp typecheck
pnpm sync:package-css-dist -- --package @afenda/shadcn-studio
pnpm check:package-css-dist-sync
```

Manual checks:

- [ ] `globals.css` and `preview.css` have no bespoke `@layer components` rules
- [ ] ERP TSX uses Tailwind + shadcn, not legacy BEM class names
- [ ] Theme edits reflected in `dist/shadcn-studio.css`

---

## References

- Composer: [`afenda-presentation-quality/SKILL.md`](../afenda-presentation-quality/SKILL.md)
- MCP authority: [`shadcn-studio/SKILL.md`](../shadcn-studio/SKILL.md)
- CSS dist: [`package-css-dist-sync/SKILL.md`](../package-css-dist-sync/SKILL.md)
- Retired layered model (audit): `_retired/legacy-ui/afenda-tailwind/`
- Tailwind v4: [theme](https://tailwindcss.com/docs/theme) · [directives](https://tailwindcss.com/docs/functions-and-directives)
