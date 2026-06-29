# Frontend Architecture Reference

## Phase 1 — Discovery Checklist

Before auditing, establish ground truth:

```
[ ] Identify all surfaces: apps/erp, apps/docs, packages/appshell, packages/metadata-ui, packages/ui, packages/css-authority
[ ] Map css-authority import chain: afenda-ui.css → design-system tokens + css-authority bundle
[ ] Verify vendored shadcn-theme.css version matches shadcn-theme.json authority
[ ] List CSS-TOKEN-* rows for in-scope custom properties
[ ] Flag --afenda-semantic-* usage in ERP — candidate for shadcn var migration
[ ] Map current routing structure — Next.js App Router route groups, layouts, pages
[ ] Inventory "use client" boundaries — are they at the correct layer?
[ ] Enumerate RSC pages that could be server-rendered but are not
[ ] Identify density contexts (compact / default) — are they applied consistently?
[ ] Catalogue all open @afenda/ui primitive imports by package
[ ] Verify globals.css cascade order (theme → base → components → utilities)
[ ] Check turbo.json task pipeline for correctness
[ ] List all packages in the dependency graph; flag circular deps
```

---

## Phase 2 — Architecture Audit

### 2.1 App Router composition

**Routing architecture checks:**

```
[ ] Route groups use (group) syntax — not flat file proliferation
[ ] Layout nesting is correct: root → auth → protected → workspace → feature
[ ] No page.tsx doing data fetching AND rendering in the same client component
[ ] Metadata API (generateMetadata) used for SEO — not manual <head>
[ ] Not-found.tsx and error.tsx present at appropriate route group boundaries
[ ] loading.tsx present for data-heavy routes (Suspense fallback)
[ ] Parallel routes used for independent panel streams (e.g., side panel vs. main)
[ ] Intercepting routes used for modal flows (e.g., drawer open without navigation)
```

**RSC / client boundary discipline (react-best-practices rule: server-client-boundary):**

```
[ ] Root layout and shell layouts are RSC — no "use client" in layout.tsx
[ ] "use client" boundaries pushed as far down the tree as possible
[ ] Interactive widgets are isolated client islands — not entire page subtrees
[ ] Async data fetched in RSC, NOT in useEffect on client
[ ] No "use client" added to a file solely to import a client dependency
[ ] No async client components (React 19 does not support async client components)
[ ] Every "use client" file has a documented reason in a comment or is obvious from hooks/events
```

**Streaming and Suspense (react-best-practices: async-suspense-boundaries):**

```
[ ] Suspense boundaries wrap independent data-dependent subtrees
[ ] Loading skeletons match the layout of the content they replace (no layout shift)
[ ] Suspense fallbacks use aria-busy="true" for accessibility
[ ] Nested Suspense used intentionally — not to mask poor data architecture
[ ] await Promise.all() used instead of sequential awaits in RSC (async-parallel)
[ ] React.cache() wraps per-request server functions called in multiple places
```

### 2.2 App Shell architecture

```
[ ] AppShell chrome (header, sidebar, nav) is RSC or thin "use client" wrappers only
[ ] Workspace context resolved server-side via resolveOperatingContext()
[ ] No client-side workspace initialization (fetch-on-mount for initial tenant data)
[ ] DashboardCanvas is the only heavy "use client" boundary in AppShell
[ ] Sidebar state (collapsed/expanded) uses URL state or RSC cookie — not just client useState
[ ] No module-level mutable state in AppShell RSC files (server-no-shared-module-state)
```

### 2.3 Feature composition

```
[ ] Feature modules have clear boundaries: route → page (RSC) → feature shell → client widgets
[ ] No cross-feature imports at the app layer (each feature is self-contained)
[ ] Shared state flows through URL params, server context, or explicit prop drilling — no global client stores for server-derivable data
[ ] Server Actions used for mutations (not fetch() to API routes from client components)
[ ] Server Actions authenticate via the same middleware chain as API routes (server-auth-actions)
```

### 2.4 Lazy loading and bundle splitting

```
[ ] Heavy library imports (recharts, heavy form libraries) use next/dynamic with ssr: false
[ ] next/dynamic loading prop provides a skeleton (not null) for graceful loading
[ ] No barrel file imports from @afenda/* packages (bundle-barrel-imports)
[ ] Dynamic import used for modals, dialogs, drawers — only loaded when opened
[ ] Storybook stories not imported in production bundles
[ ] Lucide icons imported individually (import { ArrowRight } from "lucide-react") — not the entire library
```

### 2.5 Code organization and folder structure

**Conventions to verify:**

```
apps/erp/src/
  app/                        ← Next.js App Router pages (RSC by default)
    (auth)/                   ← public auth routes
    (protected)/              ← authenticated routes
      (workspace)/            ← tenant-scoped routes
        [module]/             ← feature module pages
  lib/                        ← shared utilities (not UI)
    api/                      ← API route helpers
    context/                  ← operating context resolvers
    permissions/              ← RBAC check utilities
    modules/                  ← module metadata
    workspace/                ← workspace scope resolvers

packages/appshell/src/
  dashboard/                  ← Dashboard blocks (client islands)
  shadcn-studio/blocks/       ← shadcn-studio installed blocks (normalized)
  nav/                        ← Navigation components

packages/metadata-ui/src/     ← Metadata renderer components
packages/ui/src/
  components/                 ← governed primitives
  governance/                 ← Governed UI runtime + resolver
```

**Anti-patterns to flag:**

```
[ ] Feature-specific components in packages/ui/ (belongs in apps/erp or packages/appshell)
[ ] UI logic in lib/ files (belongs in components)
[ ] API fetching logic in UI components (belongs in lib/api or RSC)
[ ] God-file components > 400 lines without clear slot separation
[ ] Duplicated utility functions across packages (should be in shared lib)
[ ] Direct node_modules imports of library internals (fragile — flag for upgrade risk)
```

### 2.6 Dependency graph health

Run and review:

```bash
pnpm check:foundation-disposition  # registry lane conformance
pnpm --filter <pkg> why <dep>      # trace unexpected dependencies
```

Checks:

```
[ ] No circular dependencies between packages
[ ] apps/erp does not import from apps/docs (and vice versa)
[ ] packages/ui does not import from packages/appshell (primitive layer cannot depend on consumer)
[ ] packages/appshell does not import from apps/erp
[ ] Every package.json "dependencies" vs "devDependencies" is correct
[ ] @afenda/design-system is not imported in apps/erp directly for token values
    (should go through @afenda/ui CSS variables or @afenda/design-system public API)
```

---

## Architecture drift classification

For every deviation found in Phase 10:

| Class | Definition | Examples |
|-------|-----------|---------|
| **Critical** | Breaks governance, causes production failures, or violates PAS hard stops | "use client" on RSC layout, module mutable state in RSC, className on governed primitive |
| **High** | Violates Governed UI / PAS boundary, will fail CI, blocks merge | barrel imports, recharts static import, sequential awaits in RSC |
| **Medium** | Architectural anti-pattern, accumulates tech debt | boolean prop explosion, inline component definitions, missing Suspense |
| **Low** | Style inconsistency, improvement opportunity | naming convention, folder structure deviation, missing JSDoc |

---

## Architecture conformance sources

Compare implementation against these documents (read before Phase 10):

```
docs/PAS/README.md                                    ← PAS index
docs/PAS/KERNEL/PAS-001-KERNEL-VOCABULARY-AUTHORITY-STANDARD.md         ← kernel boundary
docs/adr/                                             ← all ADRs
docs/PAS/CSS-AUTHORITY/SLICE/                                       ← active slice handoffs
docs/PAS/pas-status-index.md      ← runtime authority
packages/architecture-authority/src/data/foundation-disposition.registry.ts           ← lane vocabulary
packages/architecture-authority/src/data/
  foundation-disposition.registry.ts                  ← machine authority
```
