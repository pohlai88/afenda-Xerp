---
name: afenda-shadcn-components
description: >-
  Governs all shadcn component, block, and shadcn/studio work inside the Afenda ERP monorepo.
  Covers the full design-system → @afenda/ui → @afenda/appshell → apps/erp token chain,
  the CSS bridge between shadcn variables and afenda variables, the mandatory promotion
  pipeline for shadcn/studio Pro blocks (/cui /rui /iui /ftc commands), governance gates
  (A–G), and the rules that prevent dual-system CSS failures at scale.
  Use when: adding shadcn primitives, adapting shadcn/studio blocks, bridging CSS tokens,
  composing @afenda/ui in consumer packages, or running the studio toolbar/MCP workflow.
disable-model-invocation: true
---

# Afenda shadcn Components & shadcn/studio

**Constitutional authority:** [ADR-0017](../../docs/adr/ADR-0017-shadcn-studio-ui-delivery-acceleration.md)  
**Governance policy:** [TIP-004](../../docs/governance/tip-004-policy.md) · [ui-guard](../../docs/governance/ui-guard.md)  
**Operational detail:** [app-ui-component-adaptation-guide.md](../../docs/architecture/app-ui-component-adaptation-guide.md)

---

## §0 — Before you touch any UI code

State all six Phase 0 lines (afenda-coding-session contract). Read the target FDR §Handoff
block when adapting studio blocks. Never edit production code without Phase 0 complete.

---

## §1 — Token chain (single source of truth)

```
@afenda/design-system          token authority  (--afenda-* CSS vars, recipes)
        ↓
@afenda/ui                     58 governed primitives + resolvePrimitiveGovernance()
        ↓ @afenda/ui/governance
@afenda/appshell               shell chrome + 29+ adapted studio blocks
@afenda/metadata-ui            metadata surfaces (structural CSS only)
        ↓
apps/erp/src/app/globals.css   canonical import order (composing all package CSS)
```

**Dependency direction is hard-wired.** `@afenda/design-system` must never import
`@afenda/ui`. Consumers (`appshell`, `metadata-ui`, `apps/erp`) call governance from
`@afenda/ui/governance` but own zero visual tokens.

### CSS import order in `apps/erp/src/app/globals.css`

1. `tailwindcss`
2. `@afenda/ui/afenda-ui.css` (imports design-system theme)
3. `@afenda/appshell/afenda-appshell.css` (shell chrome + studio layer via `@import`)
4. `@afenda/metadata-ui/afenda-metadata-ui.css` in `layer(components)`
5. `shadcn/tailwind.css`

**Apps import `@afenda/appshell/afenda-appshell.css` ONLY — never studio CSS directly.**

---

## §2 — CSS bridge (afenda ↔ shadcn)

Full variable reference: [css-bridge-reference.md](css-bridge-reference.md)

### How the bridge works — 3-layer chain

The token system uses a deliberate 3-layer chain. Studio blocks consume
shadcn or shell intermediaries, not raw `--afenda-*` directly:

```
@afenda/design-system (Part A)   → --afenda-*  (source tokens)
@afenda/design-system (Part B)   → --card, --primary, --border, etc.  (shadcn layer)
@afenda/appshell                 → --app-shell-*  (shell geometry + trend colors)
@afenda/appshell-studio          → --app-shell-studio-*  (studio block bridge)
```

**Part B** (`afenda-design-system.css`) maps `--afenda-*` → shadcn shorthand vars:

```css
/* Part B — actual token names (source: generate-tokens-css.ts) */
:root {
  --background:   var(--afenda-semantic-surface-canvas);   /* NOT color-surface-canvas */
  --foreground:   var(--afenda-semantic-text-primary);
  --card:         var(--afenda-semantic-surface-card);
  --popover:      var(--afenda-semantic-surface-overlay);  /* NOT surface-card */
  --primary:      var(--afenda-semantic-accent-bg);        /* NOT color-primary-600 */
  --muted:        var(--afenda-semantic-surface-muted);
  --destructive:  var(--afenda-color-destructive);         /* NOT status-tone-danger-solid */
  --border:       var(--afenda-semantic-border-default);   /* NOT color-border-default */
  --ring:         var(--afenda-semantic-border-focus);     /* NOT color-primary-400 */
  --radius:       var(--afenda-radius-base);
  /* + chart-1..8, sidebar-*, font stacks — see css-bridge-reference.md */
}
```

**Studio bridge** (`afenda-appshell-studio.css`) bridges through shadcn and shell vars:

```css
/* Studio bridge — consumes --card/--primary/--border, not --afenda-* directly */
--app-shell-studio-surface-card:   var(--card);                       /* NOT --afenda-semantic-surface-card */
--app-shell-studio-chart-primary:  var(--primary);                    /* NOT --afenda-color-primary-600 */
--app-shell-studio-border-grid:    var(--border);                     /* NOT --afenda-semantic-border-default */
--app-shell-studio-text-muted:     var(--app-shell-text-muted);       /* NOT --afenda-semantic-text-secondary */
--app-shell-studio-trend-up:       var(--app-shell-text-trend-positive); /* NOT --afenda-chart-trend-positive */
```

This chain means: update one `--afenda-*` token → all shadcn primitives and all studio
blocks update together. **Never shortcut to `--afenda-*` in studio CSS.**

### Rule: never define `--afenda-*` outside `@afenda/design-system`

| Package | May define | May consume |
|---------|-----------|------------|
| `@afenda/design-system` | `--afenda-*`, shadcn bridge | — |
| `@afenda/ui` | structural primitive hooks in `@layer components` | `--afenda-*` |
| `@afenda/appshell` | `--app-shell-*`, `--app-shell-studio-*` | `--afenda-*`, shadcn bridge |
| `@afenda/metadata-ui` | `.metadata-*` structural hooks | `--afenda-*`, shadcn bridge |
| `apps/erp` | nothing | all above via `globals.css` imports |

### Dual-system failure modes to avoid

| Failure | Symptom | Prevention |
|---------|---------|-----------|
| Raw MCP Tailwind in production TSX | Color drift in dark mode / density changes | Use STUDIO-PATTERN-MAP, strip all raw Tailwind |
| `className` on `@afenda/ui` primitives | Runtime `TIP-004 className policy violation` | Governed props only (`intent`, `emphasis`, `tone`, `size`, `state`) |
| `afenda-appshell-studio.css` imported directly by app | Break on CSS layer reorder | Always `@afenda/appshell/afenda-appshell.css` only |
| `--afenda-*` redefined in appshell/erp | Token drift in scale | Design-system owns all `--afenda-*` |
| Deprecated class prefixes in blocks | `studio-legacy-class-guard.test.ts` fails | Use STUDIO-PATTERN-MAP, not old `app-shell-dashboard-kpi-*` |

### Decision filter: what to do with raw MCP Tailwind output

For every `className` string in MCP-installed block TSX, ask in order:

**Q1 — Is this class on an `@afenda/ui` governed primitive?**
(`Button`, `Badge`, `Card`, `Input`, `Avatar`, `Sheet`, `Dialog`, etc.)
→ YES: Strip all `className`. Replace with governed props (`intent`, `emphasis`, `tone`, `size`, `state`).
Gate D and Gate G NS4 enforce this.

**Q2 — Is this a visual/semantic class on a plain HTML element?**
(text colors, backgrounds, typography, borders, spacing, focus rings)
→ Query STUDIO-PATTERN-MAP first. If a match exists: use the studio class.
→ No match + pattern used in ≥2 blocks: add to `afenda-appshell-studio.css`, then use the studio class.
→ No match + 1 block only: use the Afenda semantic Tailwind utility (`text-success` not `text-green-600`).
Never use raw palette (`green-600`, `amber-600`) — see [css-bridge-reference.md](css-bridge-reference.md) status tone table.

**Q3 — Is this a layout/structural class on a plain HTML wrapper?**
(`grid`, `flex`, `col-span`, `gap-6`, `items-center`, `justify-between`)
→ Allowed as-is on plain HTML wrappers in block TSX and in `apps/erp` page files.
→ Never pass layout classes to `@afenda/ui` Card, Button, etc. (Q1 handles that).

---

## §3 — Governed primitive composition rules

### Two layers — do not confuse them

| Layer | Path | className rule |
|-------|------|----------------|
| **Author** (`packages/ui`) | `packages/ui/src/components/` | Layout-only via `resolvePrimitiveGovernance()` — `.cursor/skills/govern-primitive/SKILL.md` |
| **Consumer** (`appshell`, `metadata-ui`, `apps/erp`) | — | **Zero** `className` on `@afenda/ui` primitives |

### Consumer rules (always)

```tsx
// ✅ Correct — governed props, no className
<Button intent="primary" emphasis="solid" size="md">Save</Button>
<Badge emphasis="soft" tone="neutral">8 New</Badge>

// ✅ Shell chrome on plain HTML (layout class is fine here)
<div className="flex gap-2 items-center">
  <Button intent="quiet" emphasis="ghost" presentation="icon" size="lg" />
</div>

// ❌ className on @afenda/ui — TIP-004 violation
<Button className="px-6 bg-primary text-white">Save</Button>

// ❌ Studio block className pollution copy-pasted onto primitives
<SheetContent className="gap-0 sm:max-w-md [&>button]:top-2" />
```

### Import discipline

- Primitives: `import { Button, Badge } from "@afenda/ui"`
- Governance helpers: `import { mapStockButtonProps } from "@afenda/ui/governance"` (use sparingly — `mapStockButtonProps` is deprecated; prefer direct intent/emphasis props)
- **Never**: `import { Button } from "@/components/ui"` or local re-export barrels
- **Every consumer file** that uses governance utilities imports from `@afenda/ui/governance` directly — no local `stock-props.ts` wrappers

### `mapStockButtonProps` status: SUNSET

It is `@deprecated`. Gate D pass 7 and Gate G NS4 fail production usages. New code must use
`intent`, `emphasis`, `size`, `presentation` props directly.

---

## §4 — shadcn/studio Pro workflow

### Setup

- **Install cwd:** always `packages/ui` (where `components.json` lives)
- **Credentials:** read `SHADCN_STUDIO_ACCOUNT_EMAIL` and `SHADCN_STUDIO_LICENSE_KEY`
  from `.env.secret` — never hard-code in any tracked file
- **Toolbar:** start target dev server first, then `pnpm studio:toolbar` (port 3200)

### MCP commands

| Command | Use for |
|---------|--------|
| `/cui` | Customize from existing block — collect ALL blocks first, install last, then customize content |
| `/iui` | Generate inspired UI (Pro) |
| `/rui` | Refine or edit an existing block |
| `/ftc` | Figma design → code (requires Figma MCP; use for unmodified block instances) |

**Follow the MCP step sequence exactly.** Do not skip steps, reorder, or stop mid-workflow
for user confirmation. Full discipline: `.cursor/rules/shadcn-studio.instructions.mdc`.

### Pro block installation (PowerShell)

```powershell
# Read .env.secret values first, then:
$env:EMAIL="<SHADCN_STUDIO_ACCOUNT_EMAIL>"
$env:LICENSE_KEY="<SHADCN_STUDIO_LICENSE_KEY>"
cd packages/ui
npx shadcn@latest add @ss-blocks/<block-name> -y
```

Free shadcn component: `npx shadcn@latest add [component] -c packages/ui`

### Install target paths (set by `packages/ui/components.json`)

| File type | Lands in |
|-----------|----------|
| Block components (raw) | `packages/ui/src/components/shadcn-studio/blocks/` — staging only |
| Shared UI primitives | `packages/ui/src/components/` |
| Hooks | `packages/ui/src/hooks/` |
| App page route | `packages/ui/app/<block-name>/page.tsx` — move to target app after install |

---

## §5 — Production block promotion pipeline

Full checklist: [block-pipeline-reference.md](block-pipeline-reference.md)

```txt
MCP / CLI install (cwd: packages/ui)
  → STAGE:   packages/ui/src/components/shadcn-studio/blocks/  [raw MCP — never ship here]
  → CONSULT: STUDIO-PATTERN-MAP.md — map Tailwind → .app-shell-studio-* classes
  → PROMOTE: afenda-appshell-studio.css — add new reusable patterns (≥2 blocks)
  → MOVE:    packages/appshell/src/shadcn-studio/blocks/  [production governed block]
  → STORY:   *.stories.tsx companion (required)
  → TEST:    *.test.tsx or *.interaction.test.tsx (render + governance + a11y)
  → WIRE:    apps/erp imports @afenda/appshell exports only — never studio CSS directly
  → GATES:   pnpm ui:guard:scan → pnpm ui:guard → pnpm ui:guard:proof
```

### Post-install checklist (required before merge)

- [ ] Every `@afenda/ui` primitive: zero `className`; governed props only
- [ ] Block TSX: semantic `.app-shell-*` / `.app-shell-studio-*` classes only (no raw Tailwind)
- [ ] Icons: `lucide-react` only (no heroicons, react-icons, etc.)
- [ ] STUDIO-PATTERN-MAP: consulted; new row added if pattern is reusable across ≥2 blocks
- [ ] No deprecated class prefixes (`app-shell-dashboard-kpi-`, `app-shell-dashboard-sparkline-`, etc.)
- [ ] `pnpm ui:guard` passes (Gates A–G); `pnpm ui:guard:proof` prints Gate G attestation

---

## §6 — Governance gates quick reference

| Gate | Command | Scope |
|------|---------|-------|
| A | `pnpm --filter @afenda/ui check:governance` | Primitive author layer |
| B | `pnpm --filter @afenda/appshell check:governance` | AppShell consumer layer |
| C | `pnpm --filter @afenda/erp test:run` (static subset) | ERP consumer layer |
| D | `pnpm ui:guard:scan` (<2 s) | className policy — fast local check |
| E | `pnpm quality:css` | CSS token authority (manifest + raw value bans) |
| F | `pnpm ui:guard:strict` | React ERP policy (Recharts, forwardRef, img, useEffect) |
| G | `pnpm ui:guard:proof` | NS1–NS5 negative search — shadcn bridge attestation |
| All | `pnpm ui:guard` | Full A–G sweep (F warns by default) |

Run after any change to `packages/appshell/`, `packages/ui/`, or `apps/erp/`.

---

## §7 — Prohibited

| Action | Reason |
|--------|--------|
| Direct copy from `_reference/` into runtime code | Bypasses TIP-004 / ADR-0017 |
| Replacing TIP-006 AppShell chrome (`application-shell`, `dashboard-shell`) | Shell authority is frozen |
| Auth page variants from template | Better Auth owns authentication |
| New npm deps without ADR-0003 / `dependency-registry.md` | Dependency governance |
| `className` on `@afenda/ui` primitives in consumers | TIP-004 consumer rule |
| `--afenda-*` re-definition outside design-system | Token drift |
| Importing `afenda-appshell-studio.css` directly from apps | CSS cascade integrity |
| Production blocks kept in `packages/ui/src/components/shadcn-studio/` | Staging-only policy |
| Local re-export barrels or local `stock-props.ts` wrappers | ADR-0002 import discipline |

---

## §8 — Reference files

| File | Purpose |
|------|---------|
| [css-bridge-reference.md](css-bridge-reference.md) | Complete token mapping: afenda ↔ shadcn ↔ app-shell-studio |
| [block-pipeline-reference.md](block-pipeline-reference.md) | Full promotion pipeline + per-block story/test checklist |
| [STUDIO-PATTERN-MAP.md](../../packages/appshell/src/shadcn-studio/STUDIO-PATTERN-MAP.md) | Tailwind → semantic class lookup (single canonical lookup) |
| [govern-primitive SKILL](../govern-primitive/SKILL.md) | Author layer — resolvePrimitiveGovernance() deep guide |
| [shadcn-studio SKILL](../shadcn-studio/SKILL.md) | MCP wiring, toolbar, Pro install, ADR-0017 summary |
| [afenda-ui-quality SKILL](../afenda-ui-quality/SKILL.md) | Five-phase workflow: generate → normalize → govern → QA |
