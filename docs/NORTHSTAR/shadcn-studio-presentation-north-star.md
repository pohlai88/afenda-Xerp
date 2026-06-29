# shadcn-studio Presentation North Star

**Authority:** ADR-0027 · PAS-006  
**Runtime owner:** `@afenda/shadcn-studio`  
**Consumer:** `apps/erp`, `apps/storybook`

---

## Why

Afenda ERP ships enterprise UI from a **single, inspectable presentation package** fed by shadcn/studio MCP — not from parallel governed-ui, appshell, and metadata-ui stacks.

---

## Capability expectations

1. **Blocks live in shadcn-studio** — staged, tested, exported for ERP import.
2. **CSS is composable** — `shadcn-studio.css` → Tailwind v4 → `shadcn/tailwind.css` at ERP globals.
3. **Storybook proves blocks** before ERP wiring.
4. **No className pollution on deleted primitives** — Tailwind at app shell chrome only until blocks absorb layout.
5. **Serializable contracts** at package boundaries — theme presets, block registry entries are JSON-safe.

---

## Non-goals (post-reset)

- Restoring `@afenda/ui` / `@afenda/appshell` / `@afenda/metadata-ui` without a new ADR
- Dual-stack ERP presentation debugging
- Metadata workspace UI until PAS-006 greenfield slice lands

---

## Success signals

| Signal | Evidence |
|--------|----------|
| ERP builds with 4 runtime deps + shadcn-studio | `apps/erp/package.json` |
| Storybook builds shadcn-studio stories only | `apps/storybook/.storybook/main.ts` |
| Foundation disposition archive-lane for legacy UI | `foundation-disposition.registry.ts` |
| CSS dist sync scoped to shadcn-studio | `scripts/governance/package-css-dist-policy.mjs` |

---

## Related

- [Blueprint](../BLUEPRINT/shadcn-studio-presentation-blueprint.md)
- [PAS-006](../PAS/PRESENTATION/PAS-006-SHADCN-STUDIO-FRONTEND-STANDARD.md)
