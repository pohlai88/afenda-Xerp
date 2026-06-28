# UI Guard — `pnpm ui:guard`

Canonical reference for all UI governance gates. Orchestrator: `scripts/governance/ui-guard.mjs`.

TIP-004 policy (author + consumer rules): [`tip-004-policy.md`](tip-004-policy.md)

Run after shadcn-studio block installs, primitive edits, or consumer wiring changes.

---

## Commands

| Command | Behavior |
|---------|----------|
| `pnpm ui:guard` | All gates A–G; **Gate F warns** (non-blocking) |
| `pnpm ui:guard:strict` | All gates; **Gate F fails** the run (CI mode) |
| `pnpm ui:guard:scan` | Gate D only + fix hints (< 2 s) |
| `pnpm ui:guard:proof` | Gate G only — CSS bridge negative-search attestation |
| `pnpm ui:guard:erp` | Gate F only + fix hints |
| `pnpm ui:guard:hints` | All gates + remediation hints |
| `pnpm ui:guard --gate A` | Single gate (letters A–G) |

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
| **G** | CSS bridge negative search | `check-css-bridge-negative-search.mjs` (NS1–NS5) | [afenda-ui-quality](../../.cursor/skills/afenda-ui-quality/SKILL.md) |

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
| 4 | Staging import ban (`#/components/shadcn-studio/*`, staging primitive paths) |
| 5 | Studio block TSX: only `.app-shell-*` / `.app-shell-studio-*` (+ `sr-only`) — no raw Tailwind |
| 6 | Studio block TSX: Lucide-only icon imports |
| 7 | `mapStockButtonProps` sunset (allowlist grandfathered files only) |
| 8 | Direct studio CSS import ban (TS-side mirror of Gate E R22) |
| — | Stock shadcn `variant` / `size="icon*"` on `<Button>` |

---

## CSS bridge hardening (Tier A–D)

Enterprise criteria from the CSS bridge evaluation — cross-reference for pre-merge attestation.

### Tier A — Automated CI gates

| ID | Criterion | Gate |
|----|-----------|------|
| **A1** | No `className` on governed primitives in consumers | Gate D pass 1 |
| **A2** | No staging primitive imports from appshell / erp / metadata-ui | Gate D pass 4 |
| **A3** | CSS token authority (no raw literals, namespace prefixes) | Gate E |
| **A4** | `globals.css` import order immutable | Gate E + composition test |
| **A5** | Studio blocks: semantic `.app-shell-*` classes only in TSX | Gate D pass 5 |
| **A6** | `pnpm ui:guard:strict` when Gate F debt is zero | CI optional strict mode |
| **A7** | `pnpm ui:guard` in `pnpm quality` | Root `package.json` |
| **A8** | Token generation before CSS governance | `quality:css` pre-step |
| **A9** | Direct studio CSS import ban | Gate E R22 + Gate D pass 8 |

### Tier B — Structural contracts

| ID | Criterion | Evidence |
|----|-----------|----------|
| **B1** | Reusable patterns in `afenda-appshell-studio.css` | [`STUDIO-PATTERN-MAP.md`](../../packages/appshell/src/presentation/STUDIO-PATTERN-MAP.md) |
| **B5** | `mapStockButtonProps` sunset | Gate D pass 7 + Gate G NS4 |
| **B6** | Single MCP install cwd (`packages/shadcn-studio`) | `shadcn-studio.config.json` |
| **B7** | Legacy class guard on deprecated prefixes | `studio-legacy-class-guard.test.ts` |
| **B8** | Direct studio CSS import ban (manifest + R22) | Gate E R22 + `css-manifest.test.ts` |

### Tier C — Visual consistency (Storybook)

| ID | Criterion | Test |
|----|-----------|------|
| **C2** | `tabular-nums` on numeric studio cells | `dashboard-block.stories.test.tsx` |
| **C5** | Lucide-only icons in blocks | Gate D pass 6 + story test |
| **C8** | Reference KPI + sparkline stories render | `dashboard-block.stories.test.tsx` |

### Tier D — Process attestation

Pre-merge report fields:

- MCP block ID and STUDIO-PATTERN-MAP rows touched
- Gate evidence: `pnpm ui:guard`, `pnpm ui:guard:proof`, `pnpm quality:css`, appshell tests
- **Gate G attestation block** (paste verbatim on pass):

```txt
CSS Bridge Negative Search — PASS
  NS1 staging refs in production: 0
  NS2 shadcn-studio imports in production: 0
  NS3 raw Tailwind in block TSX: 0
  NS4 mapStockButtonProps in production: 0 (tests exempt)
  NS5 non-Lucide icons in blocks: 0
```

- **Changed-files containment:** `git diff --name-only` summary — all paths within Phase 0 allowed scope
- Collateral scan for staging imports and deleted class prefixes

Authority: [`css-authority.md`](../architecture/css-authority.md) · [`afenda-shadcn-components SKILL`](../../.cursor/skills/afenda-shadcn-components/SKILL.md) · [`afenda-ui-quality`](../../.cursor/skills/afenda-ui-quality/SKILL.md)

---

## MCP block normalization — 3-question decision filter

Before running Gate D on a new studio block, apply this filter to every MCP `className`:

| Step | Question | Action |
|------|----------|--------|
| **Q1** | On an `@afenda/ui` governed primitive? | Strip `className`; use governed props |
| **Q2** | Visual/semantic on plain HTML? | STUDIO-PATTERN-MAP → studio CSS (≥2 blocks) → Afenda semantic Tailwind |
| **Q3** | Layout/structural on plain HTML wrapper? | Allowed as-is (`grid`, `flex`, `col-span`) |

Canonical detail: [afenda-shadcn-components SKILL §2](../../.cursor/skills/afenda-shadcn-components/SKILL.md).
Promotion pipeline: [block-pipeline-reference.md](../../.cursor/skills/afenda-shadcn-components/block-pipeline-reference.md).

---

## Gate E — CSS token authority

**Policy:** `scripts/css/check-css-governance.mts`

- CSS manifest validation per package
- No raw hex/rgb/hsl/oklch in governed CSS
- `--afenda-*` definitions only in `@afenda/design-system`
- **R22:** Direct `afenda-appshell-studio.css` imports banned outside `afenda-appshell.css`

---

## Gate G — CSS bridge negative search

**Policy:** `scripts/governance/check-css-bridge-negative-search.mjs`  
**Command:** `pnpm ui:guard:proof` (or `pnpm ui:guard --gate G`)

| Probe | Intent | Expected |
|-------|--------|----------|
| **NS1** | Staging path refs in production packages | 0 |
| **NS2** | Forbidden `shadcn-studio` staging imports | 0 |
| **NS3** | Raw Tailwind in `presentation/blocks/*.tsx` | 0 |
| **NS4** | `mapStockButtonProps` in production | 0 (tests exempt) |
| **NS5** | Non-Lucide icons in studio blocks | 0 |

On pass, prints the Tier D attestation block above.

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
| Install shadcn-studio block | D → full `ui:guard` → `ui:guard:proof` |
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
