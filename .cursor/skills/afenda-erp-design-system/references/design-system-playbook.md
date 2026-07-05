# Design-System Playbook

This is a pragmatic enterprise SaaS ERP playbook for this repo. It borrows from mature OSS systems without copying their scale.

## External Lessons to Apply

- shadcn/ui works well here because it is open code: use it as a foundation to own, customize, and test in the repo.
- Tailwind v4 makes CSS the token runtime: use `@theme`, `@theme inline`, CSS variables, and `@source` deliberately.
- Base UI is a strong primitive substrate because it is unstyled, composable, and accessibility-oriented.
- Geist is useful as an aesthetic reference: precise typography, high contrast, restrained hierarchy, mono for technical data.
- Storybook is the evidence lab: isolate components/pages, document hard-to-reach states, and keep visual/a11y review out of production routes.
- Primer, Carbon, Polaris, and Spectrum show mature system layers: foundations, tokens, components, patterns, docs, accessibility, contribution rules, and tooling. Use the layer model, not their organization size.

## Minimum Viable Enterprise System

Build only enough system to make repeated ERP work faster and safer.

1. Foundations
   - Theme tokens: background/foreground pairs, border/input/ring, destructive, sidebar, chart tokens, radius.
   - Typography: UI, mono, optional display. Keep long-form editorial fonts outside dense ERP workflow screens.
   - Density: table, form, card, dashboard, and settings density rules.
   - Motion: reduced-motion support and purposeful transitions only.

2. Primitives
   - Button, input, label, select, checkbox, radio, switch, tabs, dialog, dropdown, table, card, badge, alert, toast, sidebar.
   - Each primitive owns accessibility behavior, slots, variants, and class composition.
   - Do not add business meaning to primitives.

3. Blocks and patterns
   - Tables, filters, page headers, settings sections, metric cards, dashboards, auth screens, activity/audit panels.
   - Blocks own layout and replaceable slots, not database queries or permissions.
   - Each block should expose typed props or wire contracts for real data states.

4. Templates
   - Dashboard, table/list, detail, form/edit, settings, approval, auth, error/forbidden.
   - Prefer metadata binding and surface templates for repeated LoB screens.

5. Evidence
   - Storybook stories for default, dense, empty, loading, error, forbidden, long text, mobile, dark mode, and reduced motion.
   - Tests for contract, accessibility, keyboard interaction, registry coverage, and import boundaries.

Stop at the first ring that solves the actual problem.

## KISS Rules

- Prefer Tailwind utilities over custom CSS.
- Prefer semantic tokens over raw palette utilities.
- Prefer existing shadcn primitives over wrapper components.
- Prefer one explicit block over a generic builder until three real surfaces repeat the same shape.
- Prefer co-located primitive contracts over a broad registry if only one primitive needs the rule.
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

Use quiet, work-focused composition:

- Dense but not cramped tables and forms.
- Stable headers, filters, row actions, pagination, and bulk-action zones.
- Clear empty/loading/error/forbidden states.
- Strong focus rings and keyboard flows.
- `tabular-nums` and mono for money, IDs, timestamps, counters, and command-like data.
- Reserved color semantics for status and risk; avoid decorative color churn.
- Visual hierarchy from type, spacing, borders, and density before gradients or illustrations.
- Cards only for repeated items, dialogs, tools, and real framed content.

Avoid:

- Marketing hero layouts for operator tools.
- Global CSS selectors for one route.
- Per-module brand palettes.
- Overly generic schema-driven UI before metadata contracts exist.
- Premature theme marketplace, token alias explosion, or design-token build pipeline if CSS variables are sufficient.

## Workflows

### Theme or Token Change

1. Confirm the need is shared, not one component polish.
2. Edit `shadcn-default.css` for canonical token contract changes, or a scoped theme file for a theme overlay.
3. Register theme overlays in `theme-manifest.json`.
4. Sync package CSS dist.
5. Verify Storybook and ERP composition imports.
6. Run CSS/package gates.

### Primitive Change

1. Search existing `components-ui` primitive and contract.
2. Preserve `{name}.contract.ts` + `{name}.tsx` split.
3. Do not overwrite existing primitives with shadcn CLI.
4. Keep accessibility semantics in the primitive, business meaning outside it.
5. Add/adjust tests and Storybook stories when behavior or variants change.

### New Block

1. Install raw output to quarantine.
2. Replace demo data with typed props or wire shapes.
3. Restore slot markers and data-slot markers.
4. Promote only after preflight says ready.
5. Add lifecycle, block data contract, metadata binding or waiver, acceptance record if applicable, barrel export, and story.
6. Wire ERP only from public exports after acceptance criteria pass.

### ERP Surface

1. Select an accepted block or surface template.
2. Bind route data at the app layer.
3. Keep design-system decisions in `@afenda/shadcn-studio`.
4. Use Tailwind classes for route layout; do not invent local tokens.
5. Verify app gates after package gates.

## Agent Prompt Pattern

Use prompts that constrain authority and evidence:

```text
Use $afenda-erp-design-system and the repo PAS-006 authority chain.
Goal: <specific operator workflow>.
Allowed layer: <one layer>.
Prefer existing @afenda/shadcn-studio primitives/blocks and Tailwind v4 semantic tokens.
Do not add local tokens, restore retired packages, or wire quarantine output.
Show the KISS/DRY decision, files to change, and narrow gates before edits.
```
