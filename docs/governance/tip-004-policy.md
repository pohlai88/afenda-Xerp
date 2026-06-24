# TIP-004 — Governed UI Policy (canonical)

Operational policy for `@afenda/ui` governance. Delivery history lives in [`docs/delivery/tips/`](../delivery/tips/); status authority is [`tip-status-index.md`](../delivery/tip-status-index.md). **This file** is the single source of truth for day-to-day enforcement.

Related: [`ui-guard.md`](ui-guard.md) · [`downstream-ui-composition.md`](downstream-ui-composition.md)

---

## Document map

| ID | Topic | Status | Doc |
|----|-------|--------|-----|
| TIP-004 contracts | Design system contracts (tokens, recipes, className policy metadata) | Complete (authority only) | [`tip-004-design-system-contracts.md`](../delivery/tips/%5BComplete%20(authority%20only)%5D%20tip-004-design-system-contracts.md) |
| TIP-004 UI consumption | `@afenda/ui` adapter + consumer adoption evidence | Complete | [`tip-004-ui-consumption.md`](../delivery/tips/%5BComplete%5D%20tip-004-ui-consumption.md) |
| TIP-004A | Token authority (`--afenda-*` CSS variables) | Complete | [`tip-004a-token-authority.md`](../delivery/tips/%5BComplete%5D%20tip-004a-token-authority.md) |
| TIP-004B | Governed primitive adapter (`resolvePrimitiveGovernance`) | Complete | [`tip-004b-primitive-adapter.md`](../delivery/tips/%5BComplete%5D%20tip-004b-primitive-adapter.md) |
| TIP-004 (this) | Author + consumer runtime policy | Active | **This file** |

---

## Two layers — do not confuse them

| Layer | Paths | `className` on `@afenda/ui` primitives |
|-------|-------|----------------------------------------|
| **Author** | `packages/ui/src/components/` | Layout-only via `resolvePrimitiveGovernance()` — semantic styling from governed props/recipes |
| **Consumer** | `packages/appshell/`, `packages/metadata-ui/`, `apps/erp/` | **Zero** — governed props only; shell chrome on plain HTML wrappers |

Author checklist: [`.cursor/skills/govern-primitive/SKILL.md`](../../.cursor/skills/govern-primitive/SKILL.md) (16 items)  
Consumer checklist: same skill, consumer section (8 items) + [`.cursor/rules/governed-ui-consumption.mdc`](../../.cursor/rules/governed-ui-consumption.mdc)

---

## Dependency direction

```txt
@afenda/design-system   → contracts, tokens, recipe metadata, className policy
@afenda/ui/governance   → bridge, registry, resolvePrimitiveGovernance()
@afenda/ui/components   → Radix behavior + governed presentation
appshell / metadata-ui / erp → composition only (no parallel design vocabulary)
```

**Prohibited:** `@afenda/design-system` must never import `@afenda/ui`.

---

## Author layer policy

### Presentation pipeline

```txt
recipe → variant → state → slot → accessibility → motion → className policy
```

All governed components call `resolvePrimitiveGovernance()` with a registered `recipeName` and slot from [`primitive-registry.ts`](../../packages/ui/src/governance/primitive-registry.ts).

`STOCK_SHADCN_PENDING` is empty — every primary export is governed or internal-only.

### className (author only)

- **Allowed:** layout utilities validated by `assertAllowedLayoutClassName` / `guardClassName` (`flex`, `grid`, `w-*`, `h-*`, `overflow-*`, etc.)
- **Prohibited:** semantic color, radius, shadow, motion, typography overrides; anti-slop patterns (gradients, arbitrary values, raw palette)
- **Runtime:** throws `TIP-004 className policy violation` in dev/test when violated

```tsx
// ✅ Author — layout-only className through governance
<Button intent="primary" emphasis="solid" size="md" className="w-full" />

// ❌ Author — semantic override
<Button className="bg-blue-600 rounded-lg" />
```

### Static enforcement (Gate A)

```bash
pnpm --filter @afenda/ui check:governance
pnpm --filter @afenda/ui test:run
```

Policy source: [`packages/ui/scripts/check-design-system-consumption.ts`](../../packages/ui/scripts/check-design-system-consumption.ts)

---

## Consumer layer policy

### Scope

| Package | CSS surface | Blocks / wiring |
|---------|-------------|-----------------|
| `packages/appshell` | `afenda-appshell.css` | shadcn-studio blocks under `src/shadcn-studio/blocks/` |
| `packages/metadata-ui` | `afenda-metadata-ui.css` | metadata renderers |
| `apps/erp` | `globals.css` (imports package CSS) | page wiring |

### className (consumer)

**No `className` on any governed `@afenda/ui` tag** — including layout utilities. Wrap with plain HTML when positioning is needed.

Governed tag set (source of truth): `GOVERNED_UI_TAGS` in [`scripts/governance/governed-ui-consumption.mjs`](../../scripts/governance/governed-ui-consumption.mjs). Covers all exported primitives and slots (Button, Badge, Card, Alert, Field, Table, Dialog*, Sheet*, DropdownMenu*, Sidebar*, Avatar, Tabs*, Combobox*, InputGroup*, Kbd, etc.).

```tsx
// ✅ Consumer — shell chrome on plain wrapper
<div className="relative">
  <Button intent="quiet" emphasis="ghost" size="lg" presentation="icon" />
</div>

// ✅ Consumer — governed props only
<Badge emphasis="soft" tone="neutral">8 New</Badge>

// ❌ Consumer — any className on a governed primitive
<SheetContent className="gap-0 sm:max-w-md" />
<Button className="relative w-full" />
```

### Plain HTML wrapper className

Allowed on `div`, `span`, `header`, `nav`, `p`, etc.:

- Semantic token utilities (`bg-muted`, `text-foreground`, `rounded-lg`, `border-border`)
- **Prohibited on wrappers:** anti-slop patterns (gradients, `shadow-[…]`, `rounded-[…]`, raw palette scales, hex colors)

Policy source: [`scripts/governance/consumer-class-name-policy.mjs`](../../scripts/governance/consumer-class-name-policy.mjs) (mirrors [`class-name-guard.ts`](../../packages/ui/src/governance/class-name-guard.ts))

### Import discipline

Every consumer file that imports `@afenda/ui` must also import from `@afenda/ui/governance` (types or governed prop helpers where required by Gate D).

| Rule | Detail |
|------|--------|
| Primitives | `@afenda/ui` |
| Button presentation | Governed props: `intent`, `emphasis`, `size`, `presentation` — **`mapStockButtonProps` is sunset** |
| No local wrappers | No `stock-props.ts`, no `resolveStockButtonProps` |
| No re-export barrels | No `packages/appshell/src/governance/index.ts` |
| No shadcn alias | No `@/components/ui` — use `@afenda/ui` |
| No parallel CSS modules | Use package CSS + `globals.css` token surface |

```tsx
// ❌ Stock shadcn on governed Button
<Button variant="ghost" size="icon-lg" />

// ✅ Governed props at call site
<Button intent="quiet" emphasis="ghost" size="lg" presentation="icon" />
```

### Studio block scaling gate

**No new production AppShell studio block merges without:**

1. Phase 3 normalization (semantic `.app-shell-*` classes; zero raw Tailwind in block TSX)
2. `pnpm ui:guard` (Gates A–G; Gate F warns until debt cleared)
3. `pnpm ui:guard:proof` — Gate G negative-search attestation (NS1–NS5 all zero)

Apps import **`@afenda/appshell/afenda-appshell.css` only** — never `afenda-appshell-studio.css` directly (Gate E R22 + Gate D pass 8).

### shadcn-studio workflow

1. Install cwd: `packages/ui` (`components.json` lives there)
2. Stage raw MCP output in `packages/ui/src/components/shadcn-studio/` (never ship from here)
3. **Normalize:** apply the **3-question decision filter** (Q1 governed primitive → Q2 visual/semantic → Q3 layout/structural)
4. Consult [`STUDIO-PATTERN-MAP.md`](../../packages/appshell/src/shadcn-studio/STUDIO-PATTERN-MAP.md); add reusable patterns to `afenda-appshell-studio.css` only when ≥2 blocks need them
5. Move to `packages/appshell/src/shadcn-studio/blocks/`
6. Run `pnpm ui:guard:scan` → `pnpm ui:guard` → `pnpm ui:guard:proof`

Apps import **`@afenda/appshell/afenda-appshell.css` only** — never `afenda-appshell-studio.css` directly.

Agent operational authority: [`.cursor/skills/afenda-shadcn-components/SKILL.md`](../../.cursor/skills/afenda-shadcn-components/SKILL.md) (token chain, decision filter, pipeline).
MCP wiring: [`.cursor/skills/shadcn-studio/SKILL.md`](../../.cursor/skills/shadcn-studio/SKILL.md).

**Superseded:** Manual per-utility CSS mapping tables; moving all semantic layout to `afenda-*`-prefixed package CSS regardless of the decision filter.

---

## Verification gates

Full gate reference: [`ui-guard.md`](ui-guard.md)

| Command | Gates | When |
|---------|-------|------|
| `pnpm ui:guard:scan` | D (+ hints) | After block install; fast local check (< 2 s) |
| `pnpm ui:guard` | A–G (F warns) | Pre-merge confidence |
| `pnpm ui:guard:proof` | G only | CSS bridge negative-search attestation (NS1–NS5) |
| `pnpm ui:guard:strict` | A–G (F fails) | CI when Gate F debt is clean |
| `pnpm ui:guard:erp` | F (+ hints) | Charts, hooks, a11y |
| `pnpm ui:guard --gate A` | Single gate | Primitive-only edits |

| Gate | Layer | Mechanism |
|------|-------|-----------|
| **A** | Author | `pnpm --filter @afenda/ui check:governance` |
| **B** | Consumer (appshell) | `pnpm --filter @afenda/appshell check:governance` |
| **C** | Consumer (erp) | `pnpm --filter @afenda/erp test:run` (governed-ui subset) |
| **D** | Consumer (all) + stories | `governed-ui-consumption.mjs` in-process scan — **primary gate for `metadata-ui`** |
| **E** | CSS tokens | `pnpm quality:css` |
| **F** | React ERP quality | `react-erp-policy.mjs` (companion: react-erp-quality skill) |
| **G** | CSS bridge negative search | `check-css-bridge-negative-search.mjs` (NS1–NS5 attestation) |

**Gate D scan roots:** `packages/appshell/src`, `packages/metadata-ui/src`, `apps/erp/src`, `packages/ui/src/**/*.stories.tsx`

---

## Skills and rules index

| Task | Skill / rule |
|------|--------------|
| Block install → normalize → verify | [afenda-shadcn-components](../../.cursor/skills/afenda-shadcn-components/SKILL.md) |
| Primitive author audit | [govern-primitive](../../.cursor/skills/govern-primitive/SKILL.md) |
| Accessibility, hooks, RSC, bundle (after TIP-004 clean) | [react-erp-quality](../../.cursor/skills/react-erp-quality/SKILL.md) |
| Consumer Cursor rule | [governed-ui-consumption.mdc](../../.cursor/rules/governed-ui-consumption.mdc) |
| shadcn-studio MCP wiring | [shadcn-studio](../../.cursor/skills/shadcn-studio/SKILL.md) |

---

## Runtime error codes

| Message | Layer | Meaning |
|---------|-------|---------|
| `TIP-004 className policy violation` | Author or consumer runtime | Semantic or anti-slop class on governed component |
| `TIP-004B primitive slot key violation` | Author runtime | `slotKey` missing from `dataSlotByKey` in registry |
| `TIP-004B export coverage violation` | Author static | Export not in `GOVERNED_PRIMITIVE_REGISTRY` |
| `TIP-004 slot/state policy violation` | Author runtime | Unregistered slot role or governed state |

---

## Anti-slop patterns (author + consumer wrappers)

Enforced by `guardClassName()` and Gate D wrapper scan:

```
from-*, to-*, via-*          gradient stops
bg-gradient-*                gradient backgrounds
backdrop-blur, glass         glassmorphism
shadow-[…], rounded-[…]      arbitrary values
text-[…], bg-[…], bg-#*      arbitrary / hex
raw palette scales           bg-blue-600, text-green-700, etc.
```

Use semantic tokens: `var(--primary)`, `var(--muted-foreground)`, `var(--afenda-radius-lg)`, `var(--afenda-shadow-md)`.
