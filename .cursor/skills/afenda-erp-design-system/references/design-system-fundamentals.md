# Design-System Fundamentals

Concepts, layers, quality bar, and ERP defaults for Afenda presentation work. For step-by-step workflows, see [design-system-playbook.md](design-system-playbook.md). For repo paths and gates, see [repo-authority.md](repo-authority.md).

## What Counts as the Design System

In Afenda, the design system is **executable code**, not a documentation project:

```txt
taxonomy + tokens + components + views + exports + consumer route + tests
```

The governed owner is `@afenda/shadcn-studio-v2` (`packages/shadcn-studio-v2`). Consumers (`apps/erp`, `apps/developer`, `apps/storybook`) import public barrels only.

Constitutional chain: ADR-0027 → PAS-006 → V2 package docs → live manifests.

## Layer Model (V2)

| Layer | Path | Role |
| --- | --- | --- |
| L1 Primitives | `src/components/ui/` | Base UI–style components; token-only styling; no business meaning |
| L2 Layout chrome | `src/components/layout/` | AppShell, Sidebar, Topbar |
| L3 Shared runtime | `src/components/shared/`, `src/contexts/` | ThemeProvider, ThemeToggle, ThemeScript, ThemeCustomizer |
| L4 Views | `src/views/` | AuthShell, PageSurface, DataTableSurface, FormSurface, and other ERP compositions |
| L5 Metadata | `src/metadata/` | Contracts, registries, gates, builders |
| L6 Verification | `src/__tests__/`, Storybook | Taxonomy, drift, APCA, interaction and a11y proof |

Quarantine (`src/components/quarantine/`) is a temporary inbox — never a consumer import target.

## Component Quality Bar

Every promoted primitive or view should meet:

- **Accessible** — keyboard, focus, ARIA, and reduced-motion respect.
- **Token-bound** — semantic CSS variables (`bg-primary`, `text-muted-foreground`); no ad-hoc hex in components.
- **Composable** — slots and variants explicit; compound named exports over boolean behavior props; see [react-composition-patterns.md](react-composition-patterns.md).
- **Tested** — unit or interaction tests when behavior is non-trivial; Storybook for visual states.
- **Exported** — only through `index.ts`, `clients.ts`, `server.ts`, or `metadata.ts` root boundaries.
- **Taxonomy-clean** — folder and file names match `docs/TAXONOMY.md`; no legacy `components-ui`, `blocks`, or unregistered folders.

Primitives own interaction and presentation mechanics. Views own layout composition and replaceable slots — not permissions, tenant context, or database access.

## ERP Interface Defaults

Quiet, work-focused operator surfaces:

- Dense but not cramped tables and forms.
- Stable headers, filters, row actions, pagination, and bulk-action zones.
- Clear empty, loading, error, and forbidden states.
- Strong focus rings and keyboard flows.
- `tabular-nums` and mono for money, IDs, timestamps, counters, and command-like data.
- Reserved color semantics for status and risk; avoid decorative color churn.
- Visual hierarchy from type, spacing, borders, and density before gradients or illustrations.
- Cards only for repeated items, dialogs, tools, and real framed content.

Typography: Geist-inspired sans for UI; mono for technical evidence; decorative pixel styles only for rare brand moments (editorial lab routes defer to `afenda-editorial-bundle`).

## Anti-Patterns

Stop and escalate before:

- A second design-system package, token registry, or CSS authority.
- Restoring `@afenda/ui`, `@afenda/appshell`, `@afenda/metadata-ui`, PAS-005, or `ui:guard*`.
- Deep imports from `@afenda/shadcn-studio-v2/src/**`, `components/**`, or `views/**`.
- Wiring quarantine or raw vendor output to ERP, developer lab, or Storybook production paths.
- App-local tokens, variants, recipes, permission constants, or tenant resolvers in consumer surfaces.
- Forbidden token families (`--brand-*`, `--afenda-*`, `--surface-*`) in package or app CSS.
- Marketing hero layouts, global CSS selectors for one route, or per-module brand palettes.
- Overly generic schema-driven UI before metadata contracts exist.
- Premature theme marketplace or token alias explosion when CSS variables suffice.

## Relationship to Sibling Skills

| Need | Skill |
| --- | --- |
| MCP install, promotion, PAS-006 manufacturing | `shadcn-studio` |
| Phase 1 `globals.css`, `@source`, `@theme inline` | `afenda-tailwind` |
| Full ERP presentation gate bundle | `afenda-presentation-quality` |
| ERP React surface scan (B/A/C/Y/T) | `afenda-erp-design-system` → [surface-quality-scan.md](surface-quality-scan.md) |
| CSS dist sync policy | `package-css-dist-sync` |
| Editorial / Swiss Noir / Verdant | `afenda-editorial-bundle` |
| Implementer file edits | `coding-consistency-bundle` + `afenda-coding-session` |

This skill owns **strategy and layer discipline**; sibling skills own execution gates and MCP workflows.
