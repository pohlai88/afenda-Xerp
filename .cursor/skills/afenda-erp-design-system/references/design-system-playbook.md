# Design-System Playbook

Pragmatic enterprise SaaS ERP workflows for this repo. For concepts, layers, quality bar, and ERP interface defaults, read [design-system-fundamentals.md](design-system-fundamentals.md) first.

## External Lessons to Apply

- shadcn/ui works well here because it is open code: use it as a foundation to own, customize, and test in the repo.
- Tailwind v4 makes CSS the token runtime: use `@theme`, `@theme inline`, CSS variables, and `@source` deliberately.
- Base UI is a strong primitive substrate because it is unstyled, composable, and accessibility-oriented.
- Geist is useful as an aesthetic reference: precise typography, high contrast, restrained hierarchy, mono for technical data.
- Storybook is the evidence lab: isolate components/pages, document hard-to-reach states, and keep visual/a11y review out of production routes.
- Primer, Carbon, Polaris, and Spectrum show mature system layers: foundations, tokens, components, patterns, docs, accessibility, contribution rules, and tooling. Use the layer model, not their organization size.

## Minimum Viable Enterprise System

Build only enough system to make repeated ERP work faster and safer. Stop at the first ring that solves the actual problem.

1. **Foundations** — theme tokens, typography, density, motion (see fundamentals).
2. **Primitives** — `src/components/ui/`; accessibility, slots, variants; no business meaning.
3. **Views and patterns** — `src/views/` compositions (tables, filters, page headers, settings, auth); typed props or metadata contracts; no database queries in the package.
4. **Templates** — dashboard, table/list, detail, form/edit, settings, approval, auth, error/forbidden at the app or metadata layer.
5. **Evidence** — Storybook stories and gates for default, dense, empty, loading, error, forbidden, long text, mobile, dark mode, and reduced motion.

## KISS Rules

- Prefer Tailwind utilities over custom CSS.
- Prefer semantic tokens over raw palette utilities.
- Prefer existing shadcn primitives over wrapper components.
- Prefer one explicit view over a generic builder until three real surfaces repeat the same shape.
- Prefer typed props and variants co-located in PascalCase components over parallel contract files when a single primitive owns the rule.
- Prefer Storybook proof over screenshots hidden in docs.
- Prefer package public exports over path aliases in consumers.
- Prefer deleting unused experiments over supporting multiple futures.

## DRY Rules

DRY applies to authority, not to every similar line of UI.

Extract when:

- Two or more production surfaces share the same interactive behavior.
- A repeated token decision must stay visually consistent.
- A repeated table/form/dashboard shape can bind to metadata safely.
- A repeated acceptance rule can be checked by a gate.

Do not extract when:

- The second example is only speculative.
- The abstraction hides business differences.
- It would require app-local design tokens or package boundary exceptions.
- It makes simple Tailwind composition harder to read.

## ERP Interface Defaults

See [design-system-fundamentals.md](design-system-fundamentals.md) for the full operator-surface quality bar, typography, density, state patterns, and anti-patterns. Do not duplicate those lists here.

## Workflows

### Theme or Token Change

1. Confirm the need is shared, not one component polish.
2. Edit `packages/shadcn-studio-v2/src/styles/shadcn-default.css` for canonical token contract changes, or a scoped theme file (`swiss-noir.css`, `verdant-noir.css`) for a theme overlay.
3. Register theme overlays in `packages/shadcn-studio-v2/src/configs/theme-config.ts` (`CANONICAL_THEME_TOKEN_NAMES`, theme IDs).
4. Sync package CSS dist (`pnpm sync:package-css-dist -- --package @afenda/shadcn-studio-v2`).
5. Verify Storybook and ERP/developer composition imports.
6. Run CSS/package gates (`check:drift`, `check:apca` when contrast-relevant).

### Primitive Change

1. Search existing `src/components/ui/` primitive before adding.
2. Keep typed props, variants, and class composition in the PascalCase component file; do not split a parallel `{name}.contract.ts` unless PAS-006B explicitly requires it.
3. Do not overwrite existing primitives with shadcn CLI.
4. Keep accessibility semantics in the primitive; business meaning stays in views or app layers.
5. Add or adjust tests and Storybook stories when behavior or variants change.

### New View (from quarantine)

1. Install raw MCP/CLI output to `src/components/quarantine/`.
2. Replace demo data with typed props or metadata wire shapes.
3. Restore slot markers and `data-slot` markers.
4. Promote to `src/views/**` only after preflight says ready.
5. Add lifecycle review, view metadata binding or waiver, acceptance record when PAS-006C applies, barrel export, and story.
6. Wire ERP or developer lab only from `@afenda/shadcn-studio-v2` public exports after acceptance criteria pass.

### ERP Surface

1. Select an accepted view or surface template from the public barrel.
2. Bind route data at the app layer (`apps/erp/**`, `apps/developer/**`).
3. Keep design-system decisions in `@afenda/shadcn-studio-v2`; consumers do not fork tokens or primitives.
4. Use Tailwind classes for route layout; do not invent local tokens.
5. Verify app gates after package gates.

## Agent Prompt Pattern

Use prompts that constrain authority and evidence:

```text
Use $afenda-erp-design-system and the repo PAS-006 authority chain.
Goal: <specific operator workflow>.
Allowed layer: <one layer — e.g. packages/shadcn-studio-v2/src/views/** or apps/erp/**>.
Prefer existing @afenda/shadcn-studio-v2 primitives/views and Tailwind v4 semantic tokens.
Paths: components/ui/, views/, src/styles/, configs/theme-config.ts.
Do not add local tokens, restore retired packages, or wire quarantine output.
Show the KISS/DRY decision, files to change, and narrow gates before edits.
```
