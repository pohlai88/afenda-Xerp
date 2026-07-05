
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
          appearance-theme-panel.tsx
        _queries/.gitkeep
    modules/
      [moduleSlug]/
        _actions/.gitkeep
        _components/.gitkeep
        _queries/.gitkeep
        [surface]/
          _actions/.gitkeep
          _components/.gitkeep
          _queries/.gitkeep
          [documentId]/
            _components/.gitkeep
```

Related route-lab support files are:

- `src/lib/lab/contracts.ts`
- `src/lib/lab/lab-demo-context.ts`
- `src/lib/lab/route-policy.ts`
- `src/lib/lab/load-dashboard-sales-page.server.ts`
- `src/lib/lab/load-dashboard-finance-page.server.ts`
- `src/lib/lab/load-admin-users-page.server.ts`
- `src/lib/lab/load-settings-appearance-page.server.ts`
- `src/config/nav-config.ts`
- `src/config/theme-config.ts`

Observed route-law evidence:

- `(lab)/layout.tsx` exports `dynamic = "force-dynamic"`.
- Active operator routes use `page.tsx` plus `loading.tsx`.
- `page.tsx` and `layout.tsx` files do not use `"use client"`.
- No repo-owned `src/app/api/**` exists.
- No repo-owned `generateStaticParams` exists under `app/(lab)/**`.

Notable leftover topology:

- `src/app/legacy/_components` still exists and remains outside the route-lab target structure.

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
| `app/(lab)/modules/[moduleSlug]/[surface]/[documentId]/_components/` | Reserved | Future document-surface panels and display helpers | Document authority, live record reads, tenant/document policies | ERP document route presentation |
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
- `Afenda route-lab law`: operator routes use `loading.tsx`; `error.tsx` must be client-safe and avoid `@afenda/shadcn-studio` barrel use; layout boundaries must keep route-lab doctrine clear.
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

| Guidance area | Framework best-practice status | Route-lab treatment | Current codebase state | Status | Evidence | Action or rationale |
|---|---|---|---|---|---|---|
| App Router file conventions | Generally recommended | Applicable now | Active route-lab tree uses `layout.tsx`, `page.tsx`, `loading.tsx`, `error.tsx`, route groups, and dynamic segments | Pass | `src/app`, `src/app/(lab)` | Preserve |
| Server Components default | Generally recommended | Applicable now | Route pages and layouts remain server-first | Pass | repo-owned search under `src/app` | Preserve |
| Client components for interactivity only | Generally recommended | Applicable now | Client usage is limited to shell/error boundaries and interactive leaves | Pass | `src/app/(lab)/_components/lab-shell.client.tsx`, error clients | Preserve |
| Route-local UI colocation | Generally recommended | Applicable now | Screen UI is colocated under route-local `_components` | Pass | `src/app/(lab)/**/_components/` | Preserve |
| Thin async route pages | Generally recommended | Applicable now | Active pages await loaders and pass shaped props | Pass | `src/app/(lab)/**/page.tsx`, `src/lib/lab/load-*.server.ts` | Preserve |
| Request-dynamic rendering for operator routes | Valid when request-aware behavior is needed | Applicable now by route-lab law | `(lab)/layout.tsx` forces dynamic rendering | Pass | `src/app/(lab)/layout.tsx` | Preserve |
| `generateStaticParams` for dynamic routes | Generally valid | Intentionally excluded for `(lab)/**` | None found | Intentional exclusion | repo-owned search under `src/app` | Keep prohibited |
| Route Handlers | Generally valid | Intentionally excluded | No `app/api/**` exists | Intentional exclusion | route topology check | Future runtime handlers belong in ERP |
| Server Actions | Generally valid | Deferred placeholder | `_actions/` exists as `.gitkeep` only | Deferred placeholder | `src/app/(lab)/**/_actions/.gitkeep` | Activate only for a concrete frontend need |
| Query helper layers | Sometimes useful | Deferred placeholder | `_queries/` exists as `.gitkeep` only | Deferred placeholder | `src/app/(lab)/**/_queries/.gitkeep` | Activate only if route complexity justifies it |
| Caching and revalidation optimization | Generally recommended | Intentionally narrowed | No shared cache strategy is implemented for lab data | Intentional exclusion | route-lab loader pattern, dynamic policy | Cache authority belongs with ERP runtime data |
| `next/font` | Recommended when a font baseline is committed | Deferred until typography baseline exists | No repo-owned `next/font` usage | Deferred placeholder | repo-owned search under `src` | Revisit only if typography baseline is formalized |
| `next/image` | Recommended when optimized image rendering is needed | Deferred until image-bearing surfaces exist | No repo-owned `next/image` usage | Deferred placeholder | repo-owned search under `src` | Revisit only if governed image content appears |
| Vercel function optimization | Generally recommended for server runtime surfaces | ERP-only future concern | No lab API/function surface exists | Intentional exclusion | no `app/api/**`, no route handlers | Function tuning belongs to ERP runtime |
| Middleware/routing policy | Generally valid | ERP-only unless route-lab routing need emerges | No middleware-based request shaping is present | Intentional exclusion | route topology and config inspection | Auth/request policy belongs outside the lab |
| Smoke verification | Generally recommended | Applicable now | Repo-owned smoke spec exists for the five documented route-lab routes, and the Playwright harness boots Next directly through the local CLI | Pass | `src/app/__tests__/route-lab-smoke.spec.ts`, `playwright.config.mts`, `package.json` | Preserve and keep the smoke scope route-level only |

## 8. Codebase Comparison Matrix

| Area | Guideline | Expected state | Actual state | Status | Evidence | Action or rationale |
|---|---|---|---|---|---|---|
| Root doctrine | Root route-lab shell states sandbox doctrine clearly | Root surface explains route-lab boundary | Root `page.tsx` states that `apps/developer` proves ERP frontend shape and `apps/erp` owns runtime authority | Pass | `src/app/page.tsx` | Preserve |
| Route pages | `page.tsx` stays thin and async | Await one loader and pass typed props | Active operator pages follow the thin-loader pattern | Pass | `src/app/(lab)/**/page.tsx`, `src/lib/lab/load-*.server.ts` | Preserve |
| Route-local UI | Screen-specific UI stays near the route | `_components/` owns route-local panels | Sales, users, and appearance routes use route-local `_components` | Pass | `src/app/(lab)/**/_components/` | Preserve |
| Rendering law | Operator surfaces are request-dynamic | `(lab)/layout.tsx` exports `dynamic = "force-dynamic"` | Present | Pass | `src/app/(lab)/layout.tsx` | Preserve |
| Loading boundaries | Suspending operator routes expose `loading.tsx` | Active operator routes include loading UI | Sales, finance, users, and appearance routes include `loading.tsx` | Pass | `src/app/(lab)/**/loading.tsx` | Preserve |
| Error boundaries | `error.tsx` is client-safe and independent from runtime authority | Client-safe error boundary with no barrel dependency drift | Current root and lab segment error boundaries are client-safe and local | Pass | `src/app/error.tsx`, `src/app/(lab)/error.tsx`, `src/app/lab-segment-error.client.tsx` | Preserve |
| API boundary | No lab runtime APIs | No `src/app/api/**` | None found | Pass | topology check under `src/app` | Keep prohibited |
| Static params | No prerendered operator dynamic route generation | No `generateStaticParams` under `(lab)/**` | None found | Pass | repo-owned search under `src/app` | Keep prohibited |
| Server/client split | No client `page.tsx` or `layout.tsx` | Route boundaries stay server-first | No repo-owned `page.tsx` or `layout.tsx` uses `"use client"` | Pass | repo-owned search under `src/app` | Add CI guard later if desired |
| Loader placement | Route loaders live under `lib/lab` | `load-*-page.server.ts` files own page-data shaping | Present for all active v1 routes | Pass | `src/lib/lab/load-*.server.ts` | Preserve |
| Demo-data rule | Demo data is a typed fixture, not a fake backend | Plain objects returned by loaders | Sales loader returns typed fixture data and promotion note only | Pass | `src/lib/lab/load-dashboard-sales-page.server.ts` | Preserve |
| Route policy | Rendering and promotion metadata is explicit | Route metadata lives outside page components | Current policies describe `/`, `/dashboard/sales`, `/dashboard/finance`, `/admin/users`, and `/settings/appearance` | Pass | `src/lib/lab/route-policy.ts` | Preserve |
| Dependency wall | No prohibited runtime imports | No imports from auth/kernel/database/server or ERP runtime | No repo-owned source import matches were found | Pass | repo-owned import search under `src` | Preserve |
| Placeholder `_actions` | Server Actions are not implemented speculatively | Placeholder-only unless justified later | Current `_actions/` directories contain `.gitkeep` only | Deferred placeholder | `src/app/(lab)/**/_actions/.gitkeep` | Keep as documentation-only placeholders |
| Placeholder `_queries` | Query helpers are not implemented speculatively | Placeholder-only unless justified later | Current `_queries/` directories contain `.gitkeep` only | Deferred placeholder | `src/app/(lab)/**/_queries/.gitkeep` | Keep as documentation-only placeholders |
| Module placeholders | Future module/surface/document route families stay reserved | `modules/[moduleSlug]/**` remains shape-only | Current nested module tree is placeholder-only | Deferred placeholder | `src/app/(lab)/modules/[moduleSlug]/**/.gitkeep` | Keep reserved until a governed module route exists |
| Fonts | Use `next/font` when the app commits to a font optimization baseline | Either adopted or explicitly deferred | No `next/font` usage exists in repo-owned source | Deferred placeholder | repo-owned search under `src` | Revisit only when typography baseline is committed |
| Images | Use `next/image` when route surfaces render managed images | Either adopted where needed or explicitly not applicable | No `next/image` usage exists in repo-owned source | Deferred placeholder | repo-owned search under `src` | Revisit only when image-bearing surfaces exist |
| Next.js performance | Minimize client JS and keep client leaves small | Client code exists only where interaction is needed | Current route boundaries remain server-first; main client leaf is lab shell | Pass | `src/app/(lab)/_components/lab-shell.client.tsx` and route page audit | Preserve |
| Build hygiene | Sandbox build is explicit and production guard exists | Build/dev scripts are clear and production mode is gated | Present in package scripts and `next.config.ts` | Pass | `package.json`, `next.config.ts` | Preserve |
| Route-lab authority guard | Production boot should fail unless explicitly allowed | Environment guard exists for lab-lane production mode | Present | Pass | `next.config.ts` | Preserve |
| Smoke coverage | App-local smoke command should have app-local specs | Playwright smoke script should resolve to repo-owned tests | Repo-owned smoke spec now proves `/`, `/dashboard/sales`, `/dashboard/finance`, `/admin/users`, and `/settings/appearance` | Pass | `src/app/__tests__/route-lab-smoke.spec.ts`, `playwright.config.mts`, `package.json` | Preserve the route-availability-only scope |
| Placeholder documentation | Placeholder intent should be explicit | Dedicated audit or contract document exists | This audit now defines the placeholder contract and route-lab evaluation model | Pass | `ROUTE_LAB_NEXTJS_VERCEL_AUDIT.md` | Preserve and update with future route-lab changes |
| Legacy topology | Route-lab target shape should not rely on `legacy/**` leftovers | Legacy tree retired or documented for removal | `src/app/legacy/_components` still exists and conflicts with normalized route-local `_components` placement | Gap | `src/app/legacy/_components` | This is a filesystem normalization gap, not a runtime behavior gap |

## 9. Priority Gaps and Recommended Follow-Ups

### Gap: leftover legacy topology

`apps/developer/src/app/legacy/_components` remains in the worktree. This conflicts with the normalized route-lab topology because route-specific UI should live under route-local `_components/`.

This is a filesystem normalization gap, not a runtime behavior gap.

Recommended follow-up:

- Retire or migrate `legacy/_components` only after confirming whether the current legacy surface is still referenced by active routes.

1. Remove or formally retire `src/app/legacy/_components` so the route-lab target structure is not diluted by leftover topology.
2. Keep placeholder directories empty until a governed need exists. If a future route adds `_actions` or `_queries`, document the reason in the same turn.
3. Revisit `next/font` only when the route lab adopts a committed typography baseline rather than incidental font usage.
4. Revisit `next/image` only when a route-lab surface actually renders governed image content.

## 10. Verification Appendix

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

## 11. Verification Snapshot

The current audit is based on these repo checks:

- route-lab topology under `apps/developer/src/app`
- route-lab support files under `apps/developer/src/lib/lab` and `src/config`
- no repo-owned `app/api/**`
- no repo-owned `generateStaticParams`
- no repo-owned `"use client"` in `page.tsx` or `layout.tsx`
- `(lab)/layout.tsx` exports `dynamic = "force-dynamic"`
- placeholder directories remain `.gitkeep`-only
- no repo-owned prohibited runtime imports were found
- Playwright smoke spec exists at `src/app/__tests__/route-lab-smoke.spec.ts`
- Playwright config boots Next directly through the app-local CLI instead of `pnpm dev`
