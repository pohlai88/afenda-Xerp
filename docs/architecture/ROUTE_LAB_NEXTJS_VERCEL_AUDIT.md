
## 1. Purpose and Doctrine

```text
apps/developer proves ERP frontend shape.
apps/erp owns ERP runtime authority.
Promotion replaces data authority, not route composition.
```

This document is a documentation-control artifact for `apps/developer`. It completes the current placeholder tree by documenting intent, not by adding runtime behavior. It also evaluates the current route-lab implementation against Next.js and Vercel best-practice categories, filtered through ADR-0039 and PAS-006E.

This document is descriptive and restrictive. It documents allowed future shape, but it does not authorize implementation of runtime authority inside `apps/developer`.

Any new runtime behavior must be justified by a separate ADR/PAS update.

```text
Placeholder means reserved topology.
Placeholder does not mean missing implementation.
```

Three kinds of truth apply throughout this audit:

- `Next.js/Vercel general best practice`: normal framework guidance for an App Router frontend.
- `Afenda route-lab law`: additional rules that `apps/developer` must obey because it is a frontend sandbox, not an ERP runtime.
- `ERP-only future concern`: valid architecture that belongs in `apps/erp`, not in the lab.

### Route Lab Canonical Law

A route-lab page is valid only when:

1. `page.tsx` is a thin async route boundary.
2. `page.tsx` calls exactly one route loader.
3. The loader returns typed, serializable page data.
4. Route-local UI lives under `_components`.
5. Route-local panels receive data through explicit props.
6. The route does not import auth, database, kernel, ERP runtime, or server-side domain modules.
7. The route does not expose `app/api/**`.
8. The route passes TypeScript, Biome, Playwright smoke verification, and the route-lab governance check.

## 2. Non-Goals

- This audit does not authorize new runtime files.
- This audit does not require adding Route Handlers to `apps/developer`.
- This audit does not convert `.gitkeep` placeholders into service layers.
- This audit does not introduce auth, tenant context, database access, kernel imports, or live BFF behavior.
- This audit does not override ADR-0039 or PAS-006E.

## Status Decision Model

| Status | Meaning |
|---|---|
| `Pass` | Current codebase satisfies the rule with evidence. |
| `Intentional exclusion` | A generally valid Next.js/Vercel feature is deliberately prohibited by ADR-0039 / PAS-006E route-lab law. |
| `Deferred placeholder` | Topology exists only to reserve future shape; no runtime implementation is required now. |
| `Gap` | The baseline expects documentation, tests, topology cleanup, or enforcement that does not yet exist. |

## Best-Practice Status Snapshot

The audit now tracks progress as both governance resolution and implementation accomplishment.

Interpretation:

- `Applicable-now accomplishment %` counts only checks that should be implemented in the route lab today.
- `Implemented-now %` counts concrete repo-owned implementation rows and treats reserved placeholders as not yet implemented.
- `Open-gap %` is the percentage of rows that still fail the documented baseline.

| Scope | Pass | Intentional exclusion | Deferred placeholder | Gap | Completion view |
|---|---|---|---|---|---|
| Best-Practice Applicability Comparison | 14 | 5 | 2 | 0 | `Applicable-now accomplishment: 100% (14/14)` · `Governance-resolved: 100% (21/21)` |
| Codebase Comparison Matrix | 34 | 0 | 2 | 0 | `Implemented-now: 94% (34/36)` · `Open-gap: 0% (0/36)` |
| Combined audit view | 48 | 5 | 4 | 0 | `Applicable-now accomplishment: 100% (48/48 applicable rows)` · `Whole audited surface implemented now: 84% (48/57 total rows)` |

This means the route lab is structurally strong, green-lighted, and currently complete against the latest applicable Next.js surface for a governed frontend-only route lab. Remaining non-pass rows are doctrine exclusions or sterile placeholders rather than active misses.

## Activated Doctrine Exclusions

These framework capabilities are intentionally excluded in `apps/developer`
even though they are valid in generic Next.js or Vercel applications.

They are active architectural prohibitions, not postponed implementation tasks.

| Capability | Route-lab status | Why excluded here | Valid future home |
|---|---|---|---|
| Route Handlers / `app/api/**` | Intentionally excluded | The route lab must not grow a live BFF or runtime API surface | `apps/erp/src/app/api/internal/v1/**/route.ts` |
| Live Server Actions | Intentionally excluded until a governed seam is explicitly activated | The lab may reserve `_actions/`, but it must not own mutation authority by default | ERP mutation seams or explicitly governed route-lab seams later |
| `cacheComponents` or shared operator-route cache strategies | Intentionally excluded | Operator-route parity favors request-dynamic behavior over static cache optimization in the lab | ERP runtime when authoritative data and cache policy exist |
| Middleware / request-policy runtime surfaces | Intentionally excluded | Auth, request shaping, tenant policy, and ingress enforcement belong outside the route lab | ERP ingress and runtime boundary |

## 3. Current Route-Lab Filesystem

The current repo-owned route-lab shape under `apps/developer/src/app` is:

```text
app/
  layout.tsx
  error.tsx
  globals.css
  page.tsx
  lab-segment-error.client.tsx
  (lab)/
    layout.tsx
    error.tsx
    _components/
      lab-shell.client.tsx
    dashboard/
      sales/
        page.tsx
        loading.tsx
        _actions/.gitkeep
        _components/
          sales-overview-panel.tsx
          sales-proof-panel.tsx
        _queries/.gitkeep
      finance/
        page.tsx
        loading.tsx
        _components/
          finance-focus-panel.tsx
          finance-revenue-panel.tsx
        _actions/.gitkeep
        _queries/.gitkeep
    admin/
      users/
        page.tsx
        loading.tsx
        _actions/.gitkeep
        _components/
          users-directory-panel.tsx
        _queries/.gitkeep
    settings/
      appearance/
        page.tsx
        loading.tsx
        _actions/.gitkeep
        _components/
          appearance-guidelines-panel.tsx
          appearance-theme-panel.tsx
        _queries/.gitkeep
    modules/
      [moduleSlug]/
        _actions/.gitkeep
        _components/.gitkeep
        _queries/.gitkeep
        [surface]/
          _actions/.gitkeep
          _queries/.gitkeep
          _components/.gitkeep
          [documentId]/
            page.tsx
            loading.tsx
            not-found.tsx
            _components/
              module-document-overview-panel.tsx
              module-document-proof-panel.tsx
              module-document-state-panel.tsx
```

Related route-lab support files are:

- `src/lib/lab/contracts.ts`
- `src/lib/lab/lab-demo-context.ts`
- `src/lib/lab/route-policy.ts`
- `src/lib/lab/route-surface-registry.ts`
- `src/lib/lab/load-dashboard-sales-page.server.ts`
- `src/lib/lab/load-dashboard-finance-page.server.ts`
- `src/lib/lab/load-admin-users-page.server.ts`
- `src/lib/lab/load-settings-appearance-page.server.ts`
- `src/lib/lab/load-module-document-page.server.ts`
- `src/config/nav-config.ts`
- `src/config/theme-config.ts`

Observed route-law evidence:

- `(lab)/layout.tsx` exports `dynamic = "force-dynamic"`.
- Active operator routes use `page.tsx` plus `loading.tsx`.
- `page.tsx` and `layout.tsx` files do not use `"use client"`.
- No repo-owned `src/app/api/**` exists.
- No repo-owned `generateStaticParams` exists under `app/(lab)/**`.

Legacy route topology is no longer present in the current filesystem under `src/app`.

### Active Route Ledger

| Route | Loader | Data contract | Panels | Smoke | Status |
|---|---|---|---|---|---|
| `/dashboard/sales` | yes | typed serializable | route-local | pass | normalized |
| `/dashboard/finance` | yes | typed serializable | route-local | pass | normalized |
| `/admin/users` | yes | typed serializable | route-local | pass | normalized |
| `/settings/appearance` | yes | typed serializable | route-local | pass | normalized |
| `/modules/procurement/requisition/REQ-1001` | yes | typed serializable | route-local | pass | normalized |

### Route Surface Registry Control

The active route set is now normalized through one explicit registry:

- `src/lib/lab/route-surface-registry.ts` is the source of truth for active `href`, `routePath`, route heading, smoke marker, rendering posture, nav exposure, and seam metadata.
- `src/lib/lab/route-policy.ts` derives policy rows from that registry rather than re-declaring route identity.
- `src/config/nav-config.ts` derives operator navigation groups from that registry.
- `src/app/__tests__/route-lab-smoke.spec.ts` derives route expectations from that registry.
- `scripts/check-route-lab-governance.mjs` fails when route policy, nav, or smoke verification drift away from the registry-backed active route set.

This is a route-lab governance hardening move, not a runtime expansion. It reduces duplication and makes active route drift visible at the repo boundary.

## 4. Placeholder Directory Contract

The placeholder tree reserves future route shape. It does not authorize runtime authority, service layering, or backend simulation.

| Placeholder | Active now? | Allowed files | Disallowed responsibilities | ERP promotion target |
|---|---|---|---|---|
| `app/(lab)/**/_components/` | Yes | Route-local panels, presentational server components, client leaves for interaction/rendering only | Data fetching, auth, tenant resolution, database access, service clients, fake backend logic | Preserve route-local UI composition and replace data authority in `apps/erp` |
| `app/(lab)/**/_actions/` | Reserved | Future route-local Server Actions only if the route-lab later needs real UI-triggered mutation boundaries | Mock APIs, generic service layers, auth mutation authority, database writes, fake BFFs | ERP Server Actions or ERP mutation adapters |
| `app/(lab)/**/_queries/` | Reserved | Route-local read-shaping helpers only if page complexity later justifies them | ORM access, tenant resolution, API clients, service simulation, BFF simulation | ERP domain loaders or internal BFF readers |
| `app/(lab)/modules/[moduleSlug]/_components/` | Reserved | Future module-level layout helpers and module-local presentation seams | Global runtime routing authority, module registries, fake composition engines | ERP module route shells |
| `app/(lab)/modules/[moduleSlug]/_actions/` | Reserved | Future module-level Server Action placeholders | Runtime mutation authority, backend simulation, auth-sensitive actions | ERP module actions |
| `app/(lab)/modules/[moduleSlug]/_queries/` | Reserved | Future module-level read shaping if later justified | Data authority, tenant-scoped readers, API simulators | ERP module readers |
| `app/(lab)/modules/[moduleSlug]/[surface]/_components/` | Reserved | Future surface-local panels and interaction leaves | Route orchestration, domain fetching, permissions, fake API clients | ERP surface UI |
| `app/(lab)/modules/[moduleSlug]/[surface]/_actions/` | Reserved | Future surface-local Server Actions if a route needs them | Mock mutation infrastructure, BFF behavior, backend service classes | ERP surface mutation boundary |
| `app/(lab)/modules/[moduleSlug]/[surface]/_queries/` | Reserved | Future surface-local read helpers | Live data clients, ORM access, fake backend reads | ERP surface loader or BFF reader |
| `app/(lab)/modules/[moduleSlug]/[surface]/[documentId]/_components/` | Active for the canonical proving route | Document-surface panels and display helpers for the governed route-lab document family | Document authority, live record reads, tenant/document policies | ERP document route presentation |
| `.gitkeep` placeholders | Reserved marker | `.gitkeep` only until a governed need exists | Treating the directory as unfinished backend work | Documentation-guided future promotion |

The placeholder tree does not authorize:

- `app/api/**`
- mock APIs
- service classes
- fake backend clients
- tenant or operating-context authority
- auth or permission enforcement

## Placeholder Sterilization Rules

Placeholder directories are sterile by default.

- They may contain `.gitkeep` and documentation that explains future intent.
- They must not contain runtime services, fake clients, mock API handlers, tenant resolution, database access, permission constants, auth logic, or ERP runtime simulation.

A placeholder may become active only when:

1. the route has a concrete frontend need,
2. the file type is allowed by the placeholder contract,
3. the implementation does not cross prohibited package boundaries,
4. the change preserves ADR-0039 / PAS-006E route-lab law.

## Import Boundary Table

| Import family | Status | Rationale |
|---|---|---|
| `@afenda/shadcn-studio` | Allowed | Primary presentation dependency for the route lab. |
| lower-level presentation packages | Allowed by exception | Direct usage requires a documented presentation reason and must not bypass route-lab law. |
| `@afenda/auth` | Prohibited | Auth belongs outside the route lab. |
| `@afenda/kernel` | Prohibited | Operating-context spine belongs outside the route lab. |
| `@afenda/database` | Prohibited | Database authority belongs to ERP or runtime packages. |
| `@afenda/server` | Prohibited | Server runtime authority does not belong in the route lab. |
| `apps/erp/**` | Prohibited | The lab must not import ERP runtime authority. |
| `app/api/**` | Prohibited | Live BFF/API routes are not allowed in `apps/developer`. |

## 5. Next.js Best-Practice Catalogue

This section lists the full best-practice categories relevant to an App Router frontend and records how route-lab law narrows them.

### App Router file conventions

- `Next.js/Vercel general best practice`: use App Router file conventions such as `layout.tsx`, `page.tsx`, `loading.tsx`, `error.tsx`, route groups, and dynamic segments in a file-system route tree.
- `Afenda route-lab law`: `apps/developer` keeps route UI inside `app/(lab)/**` with route-local `_components` and thin route files.
- `ERP-only future concern`: advanced runtime surfaces such as `route.ts` belong to ERP when they introduce authority.

Reference:
- [Next.js App Router](https://nextjs.org/docs/app)
- [Next.js file conventions](https://nextjs.org/docs/app/api-reference/file-conventions)
- [Next.js project structure](https://nextjs.org/docs/app/getting-started/project-structure)

### Server and Client boundaries

- `Next.js/Vercel general best practice`: Server Components are the default; Client Components should exist only where browser APIs, interactivity, or client state are required.
- `Afenda route-lab law`: `page.tsx` and `layout.tsx` stay server-first. Client leaves must not import loaders, route policy, demo data, nav config, or future API clients.
- `ERP-only future concern`: tenant-aware client orchestration remains outside the route lab.

Reference:
- [Next.js Server and Client Components](https://nextjs.org/docs/app/getting-started/server-and-client-components)

### Thin `page.tsx` law

- `Next.js/Vercel general best practice`: fetch data on the server and keep route boundaries simple.
- `Afenda route-lab law`: each route `page.tsx` awaits one route loader and passes typed serializable props downward.
- `ERP-only future concern`: tenant-scoped loader replacement happens in ERP, not here.

### Route-local colocation

- `Next.js/Vercel general best practice`: colocate route-specific UI close to the route that owns it.
- `Afenda route-lab law`: use route-local `_components/` instead of generic cross-route screen folders.
- `ERP-only future concern`: promotion preserves composition but swaps data authority.

### Rendering policy

- `Next.js/Vercel general best practice`: choose static or dynamic rendering intentionally; use dynamic segments and request-time rendering only when needed.
- `Afenda route-lab law`: root `/` remains `auto`; `(lab)/layout.tsx` is `force-dynamic`; operator routes inherit request-dynamic behavior by default; no `generateStaticParams` under `(lab)/**`.
- `ERP-only future concern`: tenant-driven caching and revalidation strategy belongs in ERP runtime.

Reference:
- [Next.js dynamic route segments](https://nextjs.org/docs/app/api-reference/file-conventions/dynamic-routes)

### Data fetching and loader shape

- `Next.js/Vercel general best practice`: prefer server-side data fetching in App Router and pass only the shape needed by the view.
- `Afenda route-lab law`: `lib/lab/load-*-page.server.ts` returns typed demo fixtures shaped like future ERP contracts.
- `ERP-only future concern`: live data sources, tenant-scoped domain loaders, and internal BFF readers belong to ERP.

### Route Handlers

- `Next.js/Vercel general best practice`: App Router supports Route Handlers in `app/**/route.ts` for request handling.
- `Afenda route-lab law`: `apps/developer/src/app/api/**` is prohibited.
- `ERP-only future concern`: internal API route handlers belong in `apps/erp/src/app/api/internal/v1/**/route.ts`.

Reference:
- [Next.js Route Handlers](https://nextjs.org/docs/app/getting-started/route-handlers)

### Server Actions

- `Next.js/Vercel general best practice`: Server Actions can handle user-triggered mutations without building separate REST endpoints.
- `Afenda route-lab law`: `_actions/` remains placeholder-only until a route-lab screen has a concrete need for a governed mutation seam.
- `ERP-only future concern`: any real mutation authority belongs to ERP.

### Caching and revalidation

- `Next.js/Vercel general best practice`: apply caching, revalidation, and invalidation deliberately for performance and correctness.
- `Afenda route-lab law`: no shared `"use cache"` strategy for lab route data; request-dynamic operator routes favor frontend-law parity over cache optimization.
- `ERP-only future concern`: revalidation and cache policy become runtime concerns when the source is authoritative ERP data.

### Metadata, `layout.tsx`, `loading.tsx`, and `error.tsx`

- `Next.js/Vercel general best practice`: use special route files for layout, loading, and error boundaries; loading states should support streaming and perceived performance.
- `Afenda route-lab law`: operator routes use `loading.tsx`; those loading boundaries should expose route-owned status meaning, and `error.tsx` must be client-safe and avoid `@afenda/shadcn-studio` barrel use; layout boundaries must keep route-lab doctrine clear.
- `ERP-only future concern`: runtime telemetry and tenant-aware incident behavior belong elsewhere.

Reference:
- [Next.js loading UI](https://nextjs.org/docs/app/api-reference/file-conventions/loading)

### Performance

- `Next.js/Vercel general best practice`: minimize client JavaScript, lazy-load client-only code when useful, use optimized fonts and images where those assets exist, and keep route boundaries stream-friendly.
- `Afenda route-lab law`: favor server-first routes, route-local UI, typed loaders, and minimal client leaves; `loading.tsx` is part of the performance contract for suspending operator screens.
- `ERP-only future concern`: cache optimization, CDN strategy, and function-level latency tuning matter more once ERP runtime authority exists.

Reference:
- [Next.js lazy loading](https://nextjs.org/docs/app/guides/lazy-loading)

### Security

- `Next.js/Vercel general best practice`: keep secrets server-side, avoid unnecessary runtime surfaces, and use framework-safe request boundaries.
- `Afenda route-lab law`: no auth, database access, operating-context logic, or live BFF/API handlers.
- `ERP-only future concern`: protected APIs, auth flows, and tenant security policy belong in ERP.

## 6. Vercel Best-Practice Catalogue

This section captures the Vercel categories relevant to a Next.js App Router app and maps them to route-lab boundaries.

### Next.js on Vercel compatibility

- `Next.js/Vercel general best practice`: keep the app compatible with Vercel’s Next.js deployment model and framework expectations.
- `Afenda route-lab law`: `apps/developer` is allowed to build and run as a sandbox, but production-mode boot is guarded by `AFENDA_DEVELOPER_SANDBOX`.
- `ERP-only future concern`: production operator runtime belongs to ERP.

Reference:
- [Next.js on Vercel](https://vercel.com/docs/frameworks/full-stack/nextjs)

### Dynamic rendering cost awareness

- `Next.js/Vercel general best practice`: use dynamic rendering deliberately because request-time execution has cost and latency implications.
- `Afenda route-lab law`: `force-dynamic` under `(lab)` is intentional to mirror operator-route behavior, not accidental optimization loss.
- `ERP-only future concern`: production scaling and cost tuning happen in ERP.

### Function and runtime surface

- `Next.js/Vercel general best practice`: every App Router API route becomes a deployed function surface, so runtime exposure should be intentional.
- `Afenda route-lab law`: no `app/api/**` means no lab function surface.
- `ERP-only future concern`: serverless function tuning, regions, and runtime controls matter when ERP introduces API surfaces.

Reference:
- [Vercel Functions](https://vercel.com/docs/functions)
- [Vercel Functions API reference](https://vercel.com/docs/functions/functions-api-reference)

### CDN and cache guidance

- `Next.js/Vercel general best practice`: static and cacheable assets should leverage platform caching when correctness allows.
- `Afenda route-lab law`: operator routes prioritize request-dynamic parity over cache optimization.
- `ERP-only future concern`: cache topology becomes important when authoritative ERP data and static asset strategy are mixed.

### Middleware and routing considerations

- `Next.js/Vercel general best practice`: middleware and routing controls are valid for request shaping when needed.
- `Afenda route-lab law`: the current lab does not need middleware or auth-oriented routing control.
- `ERP-only future concern`: auth, tenant routing, and request policy belong in ERP.

### Deployment and build hygiene

- `Next.js/Vercel general best practice`: deployments should have deterministic build commands, clear environment usage, and workspace-local validation.
- `Afenda route-lab law`: `build`, `dev`, `start`, and `typecheck` scripts exist; production build is intentionally gated; `biome ci` and TypeScript remain required validation.
- `ERP-only future concern`: deployment promotion pipelines and environment hardening belong to ERP operations.

Reference:
- [Vercel deployments](https://vercel.com/docs/deployments)
- [Vercel build configuration](https://vercel.com/docs/builds/configure-a-build)

### Runtime security and secrets posture

- `Next.js/Vercel general best practice`: keep secrets scoped to the server and minimize exposed runtime capability.
- `Afenda route-lab law`: the app should remain frontend-only and should not grow secret-backed runtime integrations.
- `ERP-only future concern`: production secret rotation, protected source maps, security headers, and conformance rules matter once the runtime surface expands.

Reference:
- [Vercel Conformance](https://vercel.com/docs/conformance)
- [Vercel Conformance rules](https://vercel.com/docs/conformance/rules)

## 7. Best-Practice Applicability Comparison

This section normalizes generic best practice into route-lab treatment before comparing it to the codebase. It prevents generic framework advice from overriding ADR-0039 / PAS-006E.

### Status Interpretation

- `Pass` rows in this section are framework practices that the route lab is already implementing now.
- `Intentional exclusion` rows are not missing work. They are framework features deliberately pushed out to ERP runtime.
- `Deferred placeholder` rows are reserved route-lab seams that remain sterile until a real frontend need exists.

Current interpretation:

- `Applicable-now accomplishment`: `100% (14/14)`
- `Excluded by doctrine`: `24% (5/21)`
- `Deferred by design`: `10% (2/21)`
- `Open gaps`: `0% (0/21)`

| Guidance area | Framework best-practice status | Route-lab treatment | Current codebase state | Status | Evidence | Action or rationale |
|---|---|---|---|---|---|---|
| App Router file conventions | Generally recommended | Applicable now | Active route-lab tree uses `layout.tsx`, `page.tsx`, `loading.tsx`, `error.tsx`, route groups, and dynamic segments | Pass | `src/app`, `src/app/(lab)` | Preserve |
| Server Components default | Generally recommended | Applicable now | Route pages and layouts remain server-first | Pass | repo-owned search under `src/app` | Preserve |
| Client components for interactivity only | Generally recommended | Applicable now | Client usage is limited to shell/error boundaries and interactive leaves | Pass | `src/app/(lab)/_components/lab-shell.client.tsx`, error clients | Preserve |
| Route-local UI colocation | Generally recommended | Applicable now | Screen UI is colocated under route-local `_components` | Pass | `src/app/(lab)/**/_components/` | Preserve |
| Dynamic route params | Required in Next.js 16 | Applicable now | Dynamic route pages type `params` as `Promise<T>` and await it before use; governance now fails if an active dynamic route regresses to synchronous params access | Pass | `src/app/(lab)/modules/[moduleSlug]/[surface]/[documentId]/page.tsx`, `scripts/check-route-lab-governance.mjs`, `src/app/(lab)/DYNAMIC_PARAMS_PROMISE_HARDENING.md` | Preserve for every future dynamic route |
| Thin async route pages | Generally recommended | Applicable now | Active pages await loaders and pass shaped props | Pass | `src/app/(lab)/**/page.tsx`, `src/lib/lab/load-*.server.ts` | Preserve |
| Request-dynamic rendering for operator routes | Valid when request-aware behavior is needed | Applicable now by route-lab law | `(lab)/layout.tsx` forces dynamic rendering | Pass | `src/app/(lab)/layout.tsx` | Preserve |
| `generateStaticParams` for dynamic routes | Generally valid | Intentionally excluded for `(lab)/**` | None found | Intentional exclusion | repo-owned search under `src/app` | Keep prohibited |
| Route Handlers | Generally valid | Intentionally excluded | No `app/api/**` exists | Intentional exclusion | route topology check | Future runtime handlers belong in ERP |
| Server Actions | Generally valid | Deferred placeholder | `_actions/` exists as `.gitkeep` only | Deferred placeholder | `src/app/(lab)/**/_actions/.gitkeep` | Activate only for a concrete frontend need |
| Query helper layers | Sometimes useful | Deferred placeholder | `_queries/` exists as `.gitkeep` only | Deferred placeholder | `src/app/(lab)/**/_queries/.gitkeep` | Activate only if route complexity justifies it |
| Caching and revalidation optimization | Generally recommended | Intentionally narrowed | No shared cache strategy is implemented for lab data | Intentional exclusion | route-lab loader pattern, dynamic policy | Cache authority belongs with ERP runtime data |
| Metadata file conventions | Generally recommended | Applicable now | Root metadata object exists and the app now owns `icon.png`, `apple-icon.png`, `opengraph-image.png`, and `twitter-image.png` under `src/app` | Pass | `src/app/layout.tsx`, `src/app/icon.png`, `src/app/apple-icon.png`, `src/app/opengraph-image.png`, `src/app/twitter-image.png` | Preserve the App Router metadata-file layer and keep assets route-lab branded |
| Root unmatched-route handling | Generally recommended | Applicable now | Root `app/not-found.tsx` now provides an explicit route-lab unmatched-route surface; module-local `not-found.tsx` remains for the governed document family | Pass | `src/app/not-found.tsx`, `src/app/(lab)/modules/[moduleSlug]/[surface]/[documentId]/not-found.tsx` | Preserve the root fallback surface and keep it route-lab-only |
| `next/font` | Recommended for optimized web-font delivery | Applicable now | Root layout provisions `Geist` and `Geist Mono` through `next/font/google`, exposing the `--font-geist-*` variables already expected by the studio theme runtime | Pass | `src/app/layout.tsx`, `packages/shadcn-studio/src/theme-runtime/theme-runtime.font-attribute.ts` | Preserve the root-level font loader and keep route typography aligned to the studio variable contract |
| `next/image` | Recommended when optimized image rendering is needed | Applicable now | Root route, the four active operator routes, and the canonical module document route use `next/image` with responsive `sizes`; above-the-fold route preview images now declare eager loading explicitly, and `next.config.ts` keeps the optimized local image allowlist explicit | Pass | `src/app/page.tsx`, `src/app/(lab)/**/_components/*.tsx`, `next.config.ts`, `public/*.svg` | Preserve framework-managed image rendering, explicit eager loading for above-the-fold route previews, and the local image allowlist |
| Accessibility and responsive visual acceptance | Generally recommended | Applicable now | Playwright now verifies landmarks, one visible level-one heading, accessible link/button names, image alt attributes, keyboard focus reachability, and no horizontal overflow across desktop and mobile route-lab viewports | Pass | `src/app/__tests__/route-lab-smoke.spec.ts`, `packages/shadcn-studio/src/components-layouts/menu-trigger.tsx`, module document route wrapping fixes | Preserve the acceptance checks and fix route-local UI if they catch drift |
| Vercel function optimization | Generally recommended for server runtime surfaces | ERP-only future concern | No lab API/function surface exists | Intentional exclusion | no `app/api/**`, no route handlers | Function tuning belongs to ERP runtime |
| Middleware/routing policy | Generally valid | ERP-only unless route-lab routing need emerges | No middleware-based request shaping is present | Intentional exclusion | route topology and config inspection | Auth/request policy belongs outside the lab |
| Smoke verification | Generally recommended | Applicable now | Repo-owned smoke spec exists for the six documented route-lab routes, proves stable route headings plus shell doctrine surfaces, and the Playwright harness boots Next directly through the local CLI | Pass | `src/app/__tests__/route-lab-smoke.spec.ts`, `src/app/(lab)/_components/lab-shell.client.tsx`, `playwright.config.mts`, `package.json` | Preserve and keep the smoke scope route-level only |
| Live route error verification | Generally recommended after App Router edits | Applicable now | Next.js MCP `get_errors` remains the preferred external check when available; the repo-owned Playwright smoke suite now provides executable live-route error probing by failing on browser `pageerror` and `console.error` across the registry-backed route set | Pass | `src/app/__tests__/route-lab-smoke.spec.ts`, `src/app/(lab)/LIVE_ROUTE_ERROR_PROBE_HARDENING.md` | Preserve the probe and still run Next.js MCP verification when the tool surface is available |

## 8. Codebase Comparison Matrix

| Area | Guideline | Expected state | Actual state | Status | Evidence | Action or rationale |
|---|---|---|---|---|---|---|
| Root doctrine | Root route-lab shell states sandbox doctrine clearly | Root surface explains route-lab boundary | Root `page.tsx` states that `apps/developer` proves ERP frontend shape and `apps/erp` owns runtime authority | Pass | `src/app/page.tsx` | Preserve |
| Route pages | `page.tsx` stays thin and async | Await one loader and pass typed props | Active operator pages follow the thin-loader pattern and derive route-owned metadata from loader-shaped contracts instead of ad-hoc runtime seams | Pass | `src/app/(lab)/**/page.tsx`, `src/lib/lab/load-*.server.ts`, `src/lib/lab/create-route-lab-metadata.ts` | Preserve |
| Route-local UI | Screen-specific UI stays near the route | `_components/` owns route-local panels | Sales, finance, users, and appearance routes use route-local `_components` | Pass | `src/app/(lab)/**/_components/` | Preserve |
| Rendering law | Operator surfaces are request-dynamic | `(lab)/layout.tsx` exports `dynamic = "force-dynamic"` | Present | Pass | `src/app/(lab)/layout.tsx` | Preserve |
| Loading boundaries | Suspending operator routes expose `loading.tsx` with stable route-owned meaning | Active operator routes include route-shaped loading UI plus named status semantics | Sales, finance, users, and appearance routes now compose through `LabRouteLoadingState` with route-specific headings, descriptions, and `aria-busy` / `role="status"` semantics | Pass | `src/app/(lab)/**/loading.tsx`, `src/app/(lab)/_components/lab-route-loading-state.tsx` | Preserve the route-owned boundary pattern |
| Error boundaries | `error.tsx` is client-safe and independent from runtime authority | Client-safe error boundary with clear recovery semantics and frontend-safe navigation | Current root and lab segment error boundaries are client-safe, local, use clear recovery copy, and use frontend navigation back to `/` | Pass | `src/app/error.tsx`, `src/app/(lab)/error.tsx`, `src/app/lab-segment-error.client.tsx` | Preserve the recovery semantics and Next.js-safe navigation |
| Error boundary governance | App Router error boundaries must be client-safe and independent from failing presentation/runtime surfaces | Governance should fail if `error.tsx` or `global-error.tsx` is not a client component or imports studio/runtime authority | Governance now checks every repo-owned `error.tsx` and `global-error.tsx` for `"use client"`, blocks `@afenda/shadcn-studio`, and applies the prohibited runtime import wall | Pass | `apps/developer/scripts/check-route-lab-governance.mjs`, `src/app/error.tsx`, `src/app/(lab)/error.tsx`, `src/app/(lab)/ERROR_BOUNDARY_CLIENT_SAFETY_HARDENING.md` | Preserve because this is a known App Router P0 failure mode |
| API boundary | No lab runtime APIs | No `src/app/api/**` | None found | Pass | topology check under `src/app` | Keep prohibited |
| Static params | No prerendered operator dynamic route generation | No `generateStaticParams` under `(lab)/**` | None found | Pass | repo-owned search under `src/app` | Keep prohibited |
| Server/client split | No client `page.tsx` or `layout.tsx` | Route boundaries stay server-first | No repo-owned `page.tsx` or `layout.tsx` uses `"use client"` | Pass | repo-owned search under `src/app` | Add CI guard later if desired |
| Client leaf import wall | Client Components should remain interaction/rendering leaves | Client leaves must not import loaders, demo data, route policy, route registry, nav config, theme config, or API surfaces | Governance now scans repo-owned client files and fails if a `"use client"` file imports route-lab authority/config/API paths instead of receiving shaped props | Pass | `apps/developer/scripts/check-route-lab-governance.mjs`, `src/app/(lab)/_components/lab-shell.client.tsx`, `src/app/(lab)/CLIENT_LEAF_IMPORT_WALL_HARDENING.md` | Preserve the RSC-first boundary and shape data in server routes |
| Loader placement | Route loaders live under `lib/lab` | `load-*-page.server.ts` files own page-data shaping | Present for all active v1 routes | Pass | `src/lib/lab/load-*.server.ts` | Preserve |
| Demo-data rule | Demo data is a typed fixture, not a fake backend | Plain objects returned by loaders | Sales loader returns typed fixture data and promotion note only | Pass | `src/lib/lab/load-dashboard-sales-page.server.ts` | Preserve |
| Route policy | Rendering, promotion, and seam metadata are explicit | Route metadata lives outside page components | Current policies describe `/`, `/dashboard/sales`, `/dashboard/finance`, `/admin/users`, `/settings/appearance`, and the canonical module document route with separate `href` and `routePath` support plus explicit `actionSeam` and `querySeam` status | Pass | `src/lib/lab/route-policy.ts` | Preserve |
| Route surface registry | Active route identity should exist in one source of truth | Route policy, nav, smoke, and governance should derive from one explicit registry | `route-surface-registry.ts` now owns route identity, nav metadata, smoke headings/markers, rendering posture, and seam metadata; policy, nav config, smoke spec, and governance all consume it | Pass | `src/lib/lab/route-surface-registry.ts`, `src/lib/lab/route-policy.ts`, `src/config/nav-config.ts`, `src/app/__tests__/route-lab-smoke.spec.ts`, `scripts/check-route-lab-governance.mjs` | Preserve and update the registry first when adding a governed route |
| Route surface registry invariants | Registry-backed route identity should reject invalid states before they reach navigation, policy, or smoke proof | Governance should fail on duplicate route identity, invalid hrefs, missing nav labels, incorrect root posture, and non-dynamic operator route posture | Governance now enforces unique `href` and `routeId`, absolute non-trailing route paths, concrete smoke hrefs, dotted lowercase route IDs, root route constraints, navigable label completeness, and `force-dynamic` loading-boundary posture for non-root routes | Pass | `src/lib/lab/route-surface-registry.ts`, `scripts/check-route-lab-governance.mjs`, `src/app/(lab)/ROUTE_SURFACE_REGISTRY_INVARIANT_HARDENING.md` | Preserve and extend only when new registry fields become route-law critical |
| Dependency wall | No prohibited runtime imports | No imports from auth/kernel/database/server or ERP runtime | No repo-owned source import matches were found | Pass | repo-owned import search under `src` | Preserve |
| Placeholder `_actions` | Server Actions are not implemented speculatively | Placeholder-only unless justified later | Current `_actions/` directories contain `.gitkeep` only, and the governance script now fails if a placeholder-only route gains runtime action files without a matching policy change | Deferred placeholder | `src/app/(lab)/**/_actions/.gitkeep`, `scripts/check-route-lab-governance.mjs`, `src/lib/lab/route-policy.ts` | Keep as documentation-only placeholders until a governed route explicitly activates an action seam |
| Placeholder `_queries` | Query helpers are not implemented speculatively | Placeholder-only unless justified later | Current `_queries/` directories contain `.gitkeep` only, and the governance script now fails if a placeholder-only route gains runtime query files without a matching policy change | Deferred placeholder | `src/app/(lab)/**/_queries/.gitkeep`, `scripts/check-route-lab-governance.mjs`, `src/lib/lab/route-policy.ts` | Keep as documentation-only placeholders until a governed route explicitly activates a query seam |
| Module document family | The reserved module/surface/document topology should activate only through a governed proving route | One normalized dynamic route proves the document family while `_actions` and `_queries` remain sterile | The canonical route `/modules/procurement/requisition/REQ-1001` now renders through the dynamic module tree with typed params, one loader, route-local panels, route-owned state variants, `generateMetadata`, a local `not-found.tsx`, and a governed image surface | Pass | `src/app/(lab)/modules/[moduleSlug]/[surface]/[documentId]/**`, `src/lib/lab/load-module-document-page.server.ts`, `src/lib/lab/contracts.ts`, `src/lib/lab/route-policy.ts` | Preserve the proving route and keep the remaining placeholder seams sterile |
| Dynamic params Promise contract | Dynamic App Router pages should use Next.js 16 Promise params | Active dynamic route pages must type `params` as `Promise<T>` and await `params` before reading route values | Governance now fails active dynamic routes that omit `params: Promise<...>` or do not await `params`; the module document route satisfies the rule in both `generateMetadata` and the page boundary | Pass | `src/app/(lab)/modules/[moduleSlug]/[surface]/[documentId]/page.tsx`, `scripts/check-route-lab-governance.mjs`, `src/app/(lab)/DYNAMIC_PARAMS_PROMISE_HARDENING.md` | Preserve and extend when new dynamic routes are registered |
| Root unmatched-route surface | Root App Router applications should own a stable unmatched-route UI | `src/app/not-found.tsx` or a justified `global-not-found.tsx` should exist | Root `src/app/not-found.tsx` now provides a stable unmatched-route surface with route-lab doctrine and recovery links | Pass | `src/app/not-found.tsx`, `src/app/__tests__/route-lab-smoke.spec.ts` | Preserve and keep under green-light proof |
| Metadata files | Root App Router applications should own file-convention metadata where the app has a defined brand surface | Root `src/app` should own at least an app icon/fallback icon and route-lab metadata-file posture | The app now owns `icon.png`, `apple-icon.png`, `opengraph-image.png`, and `twitter-image.png` under `src/app`, backed by governed local assets | Pass | `src/app/icon.png`, `src/app/apple-icon.png`, `src/app/opengraph-image.png`, `src/app/twitter-image.png`, `public/afenda-brand/**`, `public/afenda-reference/**` | Preserve and keep assets local to the route lab |
| Fonts | Use `next/font` at the root when the app owns a typography baseline | Root layout should provide optimized font variables and the shell should consume them through shared font utilities | Root layout now provisions `Geist` and `Geist Mono` with `next/font/google`, and the body adopts `font-sans antialiased` against the existing studio font-variable contract | Pass | `src/app/layout.tsx`, `packages/shadcn-studio/src/theme-runtime/theme-runtime.font-attribute.ts` | Preserve |
| Images | Use `next/image` when route surfaces render managed images | Adopt `next/image` for meaningful app-owned image surfaces and keep allowed local paths explicit | Root route, the four active operator routes, and the canonical module document route use `next/image` with responsive `sizes`; above-the-fold route preview images declare eager loading explicitly, and `next.config.ts` restricts optimized local images to named public paths | Pass | `src/app/page.tsx`, `src/app/(lab)/**/_components/*.tsx`, `next.config.ts`, `public/*.svg` | Preserve |
| Accessibility and visual layout acceptance | Route-lab surfaces should remain usable and stable across desktop and mobile | Playwright should prove semantic landmarks, headings, accessible names, image alt attributes, keyboard focus, and responsive overflow behavior | Smoke coverage now validates these conditions on the registered route set at desktop and mobile sizes; it found and closed an unnamed shell trigger plus module-route mobile overflow | Pass | `src/app/__tests__/route-lab-smoke.spec.ts`, `packages/shadcn-studio/src/components-layouts/menu-trigger.tsx`, `src/app/(lab)/modules/[moduleSlug]/[surface]/[documentId]/page.tsx`, `src/app/(lab)/modules/[moduleSlug]/[surface]/[documentId]/_components/module-document-proof-panel.tsx` | Preserve and treat future failures as route-quality regressions |
| Next.js performance | Minimize client JS and keep client leaves small | Client code exists only where interaction is needed | Current route boundaries remain server-first; main client leaf is lab shell | Pass | `src/app/(lab)/_components/lab-shell.client.tsx` and route page audit | Preserve |
| Build hygiene | Sandbox build is explicit and production guard exists | Build/dev scripts are clear, production mode is gated, and the primary presentation package has a reproducible local rebuild path even when workspace-level `pnpm` install hooks are blocked | Present in package scripts and `next.config.ts`; `@afenda/shadcn-studio` now exposes `build:local` for dist regeneration through package-local binaries | Pass | `apps/developer/package.json`, `apps/developer/next.config.ts`, `packages/shadcn-studio/package.json`, `packages/shadcn-studio/scripts/build-local.mjs` | Preserve the package-local rebuild path until workspace build approval friction is retired |
| Route-lab authority guard | Production boot should fail unless explicitly allowed | Environment guard exists for lab-lane production mode | Present | Pass | `next.config.ts` | Preserve |
| Smoke coverage | App-local smoke command should have app-local specs | Playwright smoke script should resolve to repo-owned tests | Repo-owned smoke spec now proves `/`, `/dashboard/sales`, `/dashboard/finance`, `/admin/users`, `/settings/appearance`, and `/modules/procurement/requisition/REQ-1001`, including stable route headings, route entry links, and lab-shell doctrine text; the harness runs serially against the local Next dev server and now matches `*.spec.ts` only so Vitest `*.test.*` files cannot bleed into Playwright discovery | Pass | `src/app/__tests__/route-lab-smoke.spec.ts`, `src/app/(lab)/_components/lab-shell.client.tsx`, `playwright.config.mts`, `package.json` | Preserve the route-availability-only scope, the serial dev-server harness, and the spec-only boundary |
| Live route error probe | App Router route edits should be checked for live runtime errors | Registered routes should fail smoke proof when they emit browser `pageerror` or `console.error` during navigation | The Playwright smoke suite now subscribes to `pageerror` and `console.error`, navigates every registry-backed route, waits for the route-owned heading, and asserts no runtime errors were collected | Pass | `src/app/__tests__/route-lab-smoke.spec.ts`, `src/app/(lab)/LIVE_ROUTE_ERROR_PROBE_HARDENING.md` | Preserve as repo-owned coverage; run Next.js MCP `get_errors` as an additional check when available |
| App-local Vitest hardening | App-local route proof should include fast component-level tests for shell and loading semantics | Repo-owned Vitest config should target app-owned `*.test.*` files only and prove shell accessibility/interaction plus loading boundary semantics without pulling Playwright specs into the unit harness | `apps/developer` now owns a dedicated Vitest config, a local `next/navigation` mock, shell interaction coverage, and loading-state semantics coverage; the harness passes without changing runtime behavior | Pass | `vitest.config.ts`, `src/test/mocks/next-navigation.ts`, `src/app/(lab)/__tests__/lab-shell.interaction.test.tsx`, `src/app/(lab)/__tests__/lab-route-loading-state.test.tsx`, `package.json` | Preserve the app-local test boundary and keep Playwright `*.spec.ts` outside Vitest scope |
| Green-light verification path | App-local route-lab proof should have one governed verification command | A single app-owned command should run Biome, Vitest, route-law governance, Playwright smoke, and sandbox build in sequence | `apps/developer` now exposes `verify:greenlight` through a dedicated Node runner, and the workspace root delegates to the same runner through `check:developer-route-lab-greenlight` / `quality:developer-route-lab` plus a root Node wrapper, so the route lab can declare one reproducible green-light path without depending on workspace-level `pnpm` health | Pass | `package.json`, `scripts/governance/check-developer-route-lab-greenlight.mjs`, `apps/developer/package.json`, `apps/developer/scripts/verify-greenlight.mjs`, `apps/developer/README.md` | Preserve the direct runner as the single source of truth and keep root delegates thin |
| Route-law governance guard | Active lab routes should remain structurally normalized | Repo-owned check enforces loader, import, route-local panel law, server-first page/layout boundaries, `(lab)` force-dynamic rendering, no legacy route topology, and no `generateStaticParams` under lab routes | Governance script now verifies the normalized active route set and reports actionable file-path failures across page, layout, legacy topology, and lab segment drift | Pass | `scripts/check-route-lab-governance.mjs`, `package.json` | Preserve and extend when new active routes are added |
| Placeholder documentation | Placeholder intent should be explicit | Dedicated audit or contract document exists | This audit now defines the placeholder contract and route-lab evaluation model | Pass | `ROUTE_LAB_NEXTJS_VERCEL_AUDIT.md` | Preserve and update with future route-lab changes |
| Legacy topology | Route-lab target shape should not rely on `legacy/**` leftovers | Legacy tree retired from the current route-lab filesystem and protected from regression | No repo-owned `src/app/legacy/**` files remain, and governance now fails if `apps/developer/src/app/legacy` reappears | Pass | current filesystem topology under `src/app`, `apps/developer/scripts/check-route-lab-governance.mjs`, `src/app/(lab)/LEGACY_TOPOLOGY_REGRESSION_GUARD_HARDENING.md` | Preserve the normalized route-only structure |

### Status Interpretation

- `Implemented-now`: `94% (34/36)` of the audited repo-owned controls are live in the current codebase.
- `Reserved by placeholder law`: `6% (2/36)` remain intentionally sterile.
- `Open gaps`: `0% (0/36)`.

This is the correct route-lab posture: route composition, rendering law, testing, green-light verification, root unmatched-route handling, and metadata-file conventions are hardened, while runtime-authority features remain excluded by doctrine.

## 9. Runtime Activation Gate

A route-lab surface may graduate into ERP runtime only when:

1. Its domain owner is known.
2. Its API/data boundary is approved.
3. Its permission model is declared.
4. Its audit events are declared.
5. Its loading, error, forbidden, and empty states are covered.
6. Its route data contract is backed by real server authority.
7. Its Playwright smoke test is upgraded into acceptance coverage.

Existing route-lab pages prove only the route pattern. They do not prove
business authority, domain execution, or ERP runtime readiness.

## 10. Priority Gaps and Recommended Follow-Ups

1. Keep placeholder directories empty until a governed need exists. If a future route adds `_actions` or `_queries`, document the reason in the same turn.
2. Keep typography aligned to the root `Geist` / `Geist Mono` baseline unless a future governed presentation decision intentionally changes the studio font-variable contract.
3. Preserve the root `not-found.tsx`, metadata-file layer, and legacy-topology regression guard inside green-light proof when new top-level route surfaces are added.

## 11. Verification Appendix

These checks are verification aids, not implementation mandates.

### PowerShell

```powershell
Get-ChildItem apps/developer/src/app -Recurse -File | Sort-Object FullName | Select-Object FullName
```

```powershell
Get-ChildItem apps/developer/src/app -Recurse -Directory | Where-Object { $_.FullName -match "\\app\\api($|\\)" }
```

```powershell
Select-String -Path "apps/developer/src/app/**/*.tsx" -Pattern "generateStaticParams" -ErrorAction SilentlyContinue
```

```powershell
Get-ChildItem apps/developer/src/app -Recurse -Include page.tsx,layout.tsx | Select-String -Pattern "'use client'|""use client"""
```

```powershell
Select-String -Path "apps/developer/src/**/*" -Pattern "@afenda/auth|@afenda/kernel|@afenda/database|@afenda/server|apps/erp" -ErrorAction SilentlyContinue
```

```powershell
node packages/shadcn-studio/scripts/build-local.mjs
```

```powershell
node apps/developer/scripts/check-route-lab-governance.mjs
```

### POSIX

```bash
find apps/developer/src/app -maxdepth 8 -type f | sort
```

```bash
find apps/developer/src/app -path "*/api/*" -print
```

```bash
grep -R "generateStaticParams" apps/developer/src/app || true
```

```bash
grep -R "'use client'\|\"use client\"" apps/developer/src/app --include="page.tsx" --include="layout.tsx" || true
```

```bash
grep -R "@afenda/auth\|@afenda/kernel\|@afenda/database\|@afenda/server\|apps/erp" apps/developer/src || true
```

```bash
node packages/shadcn-studio/scripts/build-local.mjs
```

## 12. Verification Snapshot

The current audit is based on these repo checks:

- route-lab topology under `apps/developer/src/app`
- route-lab support files under `apps/developer/src/lib/lab` and `src/config`
- root `src/app/not-found.tsx` exists and now owns the explicit unmatched-route surface
- root metadata files now exist at `src/app/icon.png`, `src/app/apple-icon.png`, `src/app/opengraph-image.png`, and `src/app/twitter-image.png`
- no repo-owned `app/api/**`
- no repo-owned `generateStaticParams`
- no repo-owned `"use client"` in `page.tsx` or `layout.tsx`
- every repo-owned `error.tsx` / `global-error.tsx` must use `"use client"` and must not import `@afenda/shadcn-studio` or prohibited runtime authority
- repo-owned client leaves must not import loaders, demo data, route policy, route registry, nav config, theme config, or API surfaces
- active dynamic routes must type `params` as `Promise<T>` and await `params` before reading route values
- `(lab)/layout.tsx` exports `dynamic = "force-dynamic"`
- placeholder directories remain `.gitkeep`-only
- no repo-owned prohibited runtime imports were found
- no repo-owned `src/app/legacy/**` files remain in the current filesystem
- route-lab governance fails if `apps/developer/src/app/legacy` reappears
- root layout provisions `Geist` and `Geist Mono` through `next/font/google`
- root route, the four active operator routes, and the canonical module document route use `next/image` for governed local blueprint assets, and the above-the-fold route previews now declare eager loading explicitly
- Playwright smoke spec exists at `src/app/__tests__/route-lab-smoke.spec.ts`, and `playwright.config.mts` now matches `*.spec.ts` only so app-local Vitest files stay outside e2e discovery
- Playwright smoke now fails on browser `pageerror` and `console.error` while navigating the registry-backed route set, providing repo-owned live route error coverage when Next.js MCP tools are not exposed in the active tool surface
- App-local Vitest proof now exists at `src/app/(lab)/__tests__/lab-shell.interaction.test.tsx` and `src/app/(lab)/__tests__/lab-route-loading-state.test.tsx`, with `apps/developer/vitest.config.ts` excluding Playwright `*.spec.ts` files from the unit/interaction harness
- `apps/developer/package.json` now exposes `verify:greenlight`, backed by `apps/developer/scripts/verify-greenlight.mjs`, which runs app-local Biome, Vitest, route-law governance, Playwright smoke, and sandbox build proof in one governed sequence
- the workspace root now delegates to that same runner through `check:developer-route-lab-greenlight` and `quality:developer-route-lab`, with `scripts/governance/check-developer-route-lab-greenlight.mjs` as a direct Node entry point when root `pnpm` execution is blocked by ignored-build enforcement
- the release-grade green-light contract is documented in `docs/architecture/DEVELOPER_ROUTE_LAB_GREENLIGHT.md`, and the root wrapper resolves the app-owned runner from its own location so the direct Node fallback is independent of the caller's working directory
- Lab shell now exposes a stable visible `Afenda Route Lab` heading for route-level accessibility and smoke proof
- Active operator loading boundaries now expose route-specific status semantics through `src/app/(lab)/_components/lab-route-loading-state.tsx`
- The canonical module document route now renders at `/modules/procurement/requisition/REQ-1001` through the dynamic module tree with a typed param-aware lab loader, route-owned state variants, dynamic metadata, and a local `not-found.tsx` boundary
- The four active operator routes now derive route-owned metadata from loader-shaped contracts and expose governed local blueprint assets through `next/image`, with eager loading declared on the above-the-fold route previews
- Route policy now records `_actions` and `_queries` posture explicitly through `actionSeam` and `querySeam`, and governance fails when placeholder-only routes gain runtime seam files
- Active route identity is centralized in `src/lib/lab/route-surface-registry.ts`, and route policy, nav, smoke, and governance consume the same registry-backed route set
- Route surface registry invariants now fail governance on duplicate route identity, invalid href or route path shape, missing nav labels, incorrect root route posture, or non-dynamic operator route posture
- Playwright config boots Next directly through the app-local CLI instead of `pnpm dev`
- `@afenda/shadcn-studio` now has a package-local rebuild path at `packages/shadcn-studio/scripts/build-local.mjs`, so the route lab can verify its governed presentation dependency without depending on blocked workspace-level `pnpm` install hooks
- Playwright smoke now runs serially against the local route-lab dev server to avoid Fast Refresh contention during route verification
