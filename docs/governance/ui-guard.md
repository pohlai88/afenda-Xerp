# UI Guard — `pnpm ui:guard`

Canonical reference for all UI governance gates. Orchestrator: `scripts/governance/ui-guard.mjs`.

TIP-004 policy (author + consumer rules): [`tip-004-policy.md`](tip-004-policy.md)

Run after shadcn-studio block installs, primitive edits, or consumer wiring changes.

---

## Commands

| Command | Behavior |
|---------|----------|
| `pnpm ui:guard` | All gates A–F; **Gate F warns** (non-blocking) |
| `pnpm ui:guard:strict` | All gates; **Gate F fails** the run (CI mode) |
| `pnpm ui:guard:scan` | Gate D only + fix hints (< 2 s) |
| `pnpm ui:guard:erp` | Gate F only + fix hints |
| `pnpm ui:guard:hints` | All gates + remediation hints |
| `pnpm ui:guard --gate A` | Single gate (letters A–F) |

---

## Gates

| Gate | Label | Command / mechanism | Skill / rule |
|------|-------|---------------------|--------------|
| **A** | `@afenda/ui` author governance | `pnpm --filter @afenda/ui check:governance` | [govern-primitive](../../.cursor/skills/govern-primitive/SKILL.md) |
| **B** | `@afenda/appshell` consumer | `pnpm --filter @afenda/appshell check:governance` | [governed-ui-consumption](../../.cursor/rules/governed-ui-consumption.mdc) |
| **C** | `@afenda/erp` consumer | `pnpm --filter @afenda/erp test:run` (governed-ui subset) | [governed-ui-consumption](../../.cursor/rules/governed-ui-consumption.mdc) |
| **D** | In-process full-tree scan | `governed-ui-consumption.mjs` + anti-slop | [afenda-ui-quality](../../.cursor/skills/afenda-ui-quality/SKILL.md) Phase 3 |
| **E** | CSS token authority | `pnpm quality:css` | [css-authority](../architecture/css-authority.md) |
| **F** | React ERP quality | `react-erp-policy.mjs` (in-process) | [react-erp-quality](../../.cursor/skills/react-erp-quality/SKILL.md) |

### Scan roots (Gates D and F)

- `packages/appshell/src/**/*.tsx`
- `packages/metadata-ui/src/**/*.tsx`
- `apps/erp/src/**/*.{tsx,ts}`
- Gate D also scans `packages/ui/src/**/*.stories.tsx`

---

## Gate D — TIP-004 consumption

**Policy:** `scripts/governance/governed-ui-consumption.mjs`

| Pass | Checks |
|------|--------|
| 1 | `className` on `@afenda/ui` governed primitives |
| 2 | Import discipline (no `@/components/ui`, no local governance barrels) |
| 3 | Anti-slop on plain HTML wrapper `className` (gradients, arbitrary values, raw palette) |
| — | Stock shadcn `variant` / `size="icon*"` on `<Button>` |

---

## Gate E — CSS token authority

**Policy:** `scripts/css/check-css-governance.mts`

- CSS manifest validation per package
- No raw hex/rgb/hsl/oklch in governed CSS
- `--afenda-*` definitions only in `@afenda/design-system`

---

## Gate F — React ERP quality

**Policy:** `scripts/governance/react-erp-policy.mjs`  
**Tests:** `scripts/governance/__tests__/react-erp-policy.test.ts`

| Rule | Detection |
|------|-----------|
| R1 | Static `import … from "recharts"` — use `next/dynamic` with `ssr: false` |
| R2 | `forwardRef()` — React 19 uses ref as plain prop |
| R3 | `useEffect` with single `set*` call — derived-state sync |
| R4 | recharts chart element without `aria-hidden="true"` |
| R5 | Raw `<img>` — use `next/image` |
| R6 | Module-level `let`/`var` in non-`"use client"` files |

Gate F is a **warning gate** in default `pnpm ui:guard` so existing technical debt is visible without blocking TIP-004 work. Use `pnpm ui:guard:strict` when all F violations are resolved.

---

## Typical workflows

| Task | Minimum gates |
|------|---------------|
| Edit `packages/ui/src/components/*` | A |
| Install shadcn-studio block | D → full `ui:guard` |
| Edit appshell / erp consumer wiring | D + B or C |
| Dashboard chart / hooks / a11y | F (`ui:guard:erp`) |
| CSS / token changes | E |
| Pre-merge confidence | `pnpm ui:guard` (or `--strict` when F is clean) |

---

## Fix hints

Re-run with `--fix-hint` for per-violation remediation:

```bash
pnpm ui:guard --fix-hint
pnpm ui:guard:scan    # fast Gate D + hints
pnpm ui:guard:erp     # Gate F + hints
```
