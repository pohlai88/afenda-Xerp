# Afenda Fumadocs — Content Authoring Patterns

Deep reference for MDX page authoring, navigation structure, and visual quality in `@afenda/docs`.

---

## Frontmatter schema reference

### Minimal (all pages)

```mdx
---
title: Page Title
description: One sentence summary for search and SEO.
---
```

### Extended (with Slice 3+ custom fields)

```mdx
---
title: Page Title
description: Summary.
status: published
noIndex: false
---
```

`status` and `noIndex` require `source.config.ts` schema extension — see SKILL.md §3.

---

## Page anatomy

### Section page (index of a sub-section)

```mdx
---
title: Getting Started
description: Clone, install, and run the Afenda ERP monorepo locally.
---

## Prerequisites

- Node.js 20+
- pnpm 10+
- Docker (for local Postgres via Supabase)

## Quick start

```bash
git clone https://github.com/your-org/afenda-Xerp.git
cd afenda-Xerp
pnpm install
```

Then see [Dev Setup](/docs/getting-started/dev-setup) for database configuration.
```

### Reference page (deep technical content)

```mdx
---
title: Package Dependency Rules
description: How workspace packages may depend on each other in the Afenda monorepo.
---

## Overview

The Afenda monorepo enforces strict one-way dependency rules per [ADR-0001](https://github.com/your-org/afenda-Xerp/blob/main/docs/adr/ADR-0001.md).

## Dependency matrix

| Package | May depend on | May NOT depend on |
|---------|--------------|-------------------|
| `apps/erp` | `packages/*` | `apps/docs` |
| `apps/docs` | `@afenda/typescript-config` (dev only) | `apps/erp`, any ERP package |

## Running the check

```bash
pnpm quality:boundaries
```
```

---

## Navigation patterns

### Single-level section

```
getting-started/
├── meta.json
├── index.mdx       → /docs/getting-started
├── installation.mdx → /docs/getting-started/installation
└── dev-setup.mdx   → /docs/getting-started/dev-setup
```

`meta.json`:
```json
{
  "title": "Getting Started",
  "pages": ["index", "installation", "dev-setup"]
}
```

### Two-level section

```
monorepo-map/
├── meta.json
├── index.mdx
└── packages/
    ├── meta.json
    ├── ui.mdx
    └── database.mdx
```

Root `meta.json`:
```json
{
  "title": "Monorepo Map",
  "pages": ["index", "packages"]
}
```

`packages/meta.json`:
```json
{
  "title": "Packages",
  "pages": ["ui", "database"]
}
```

### Separator usage

```json
{
  "title": "Docs",
  "pages": [
    "index",
    "---",
    "getting-started",
    "monorepo-map",
    "---",
    "contributing"
  ]
}
```

---

## Visual quality standards

### Tables

Use GitHub-flavored markdown tables. Include a header row and alignment.

```mdx
| Package | Port | Purpose |
|---------|------|---------|
| `@afenda/erp` | 3000 | ERP application |
| `@afenda/docs` | 3001 | Documentation site |
```

### Steps / numbered workflows

For ordered workflows, use ordered lists with code blocks inside list items:

```mdx
1. Install dependencies at the monorepo root:

   ```bash
   pnpm install
   ```

2. Start the docs dev server:

   ```bash
   pnpm --filter @afenda/docs dev
   ```

3. Visit [http://localhost:3001/docs](http://localhost:3001/docs).
```

### Callout hierarchy

```mdx
import { Callout } from 'fumadocs-ui/components/callout';

<!-- Informational — blue -->
<Callout type="info">Use this for helpful tips.</Callout>

<!-- Warning — yellow -->
<Callout type="warn">Use this for gotchas or footguns.</Callout>

<!-- Error — red -->
<Callout type="error">Use this for breaking changes or blockers.</Callout>

<!-- Note — neutral -->
<Callout type="note">Use this for side remarks.</Callout>
```

### Property/parameter documentation

```mdx
### `baseOptions()`

Returns `BaseLayoutProps` with the shared navigation configuration.

| Return key | Type | Description |
|------------|------|-------------|
| `nav.title` | `string` | Text displayed in the top navigation bar |
```

---

## Anti-patterns

### ❌ Copy-pasting governance content

```mdx
<!-- WRONG: do not copy ADR-0001 into MDX -->
## ADR-0001 — Architecture Authority

**Status:** Accepted
**Decision:** The architecture authority owns...
[3 pages of ADR content]
```

```mdx
<!-- CORRECT: cross-link -->
The dependency rules are defined in [ADR-0001](https://github.com/your-org/afenda-Xerp/blob/main/docs/adr/ADR-0001.md).
```

### ❌ Skipping description in frontmatter

```mdx
---
title: Dev Setup
---
```

```mdx
---
title: Dev Setup
description: Configure local environment variables and Supabase for development.
---
```

### ❌ Nested ternary in MDX JSX

```mdx
<!-- WRONG: logic in MDX -->
{condition ? <A /> : anotherCondition ? <B /> : <C />}
```

```mdx
<!-- CORRECT: create a dedicated React component for complex logic -->
import { StatusBadge } from "@/components/status-badge";
<StatusBadge status={status} />
```

### ❌ Hardcoded absolute URLs to localhost

```mdx
<!-- WRONG -->
Visit [the ERP](http://localhost:3000) to see the dashboard.
```

```mdx
<!-- CORRECT -->
Start the ERP dev server (`pnpm --filter @afenda/erp dev`) and visit port 3000.
```

### ❌ Missing page in meta.json

```
content/docs/
├── meta.json  ← "pages": ["index"]  (does NOT include "setup")
├── index.mdx
└── setup.mdx  ← ORPHAN — unreachable from sidebar
```

Fix: add `"setup"` to `meta.json` pages array.

---

## Fumadocs built-in component reference

| Component | Import | Use case |
|-----------|--------|----------|
| `Callout` | `fumadocs-ui/components/callout` | Info, warning, error notes |
| `Tabs`, `Tab` | `fumadocs-ui/components/tabs` | Code variant switching |
| `Steps`, `Step` | `fumadocs-ui/components/steps` | Numbered workflows |
| `Accordion` | `fumadocs-ui/components/accordion` | Collapsible FAQ sections |
| `TypeTable` | `fumadocs-ui/components/type-table` | TypeScript type prop tables |
| `DocsPage` | `fumadocs-ui/layouts/docs/page` | Page wrapper (in route component) |
| `DocsLayout` | `fumadocs-ui/layouts/docs` | Docs layout with sidebar (in layout) |

**Rule:** Use built-ins before creating custom components. Custom MDX components live in `apps/docs/src/components/` — never in shared packages.

---

## Seed content sections (TIP-032 Slice 4)

### Required sections

| Section | File | URL | Purpose |
|---------|------|-----|---------|
| Home | `content/docs/index.mdx` | `/docs` | Welcome + quick links |
| Getting Started | `content/docs/getting-started/index.mdx` | `/docs/getting-started` | Clone, install, dev servers |
| Monorepo Map | `content/docs/monorepo-map/index.mdx` | `/docs/monorepo-map` | Packages, layers, what to edit |
| Contributing | `content/docs/contributing/index.mdx` | `/docs/contributing` | afenda-coding-session, TIP handoff |

### Content rules for seed pages

1. **Do not** reproduce TIP delivery doc tables — link to them instead
2. **Do** describe the workflow in plain English with commands
3. **Do** use `<Callout type="info">` for ERP-first reminders (e.g., "docs don't need ERP running")
4. **Keep** each section to a single page initially — sub-pages are added as content grows
5. **Must** pass `pnpm --filter @afenda/docs build` before the slice is closed
