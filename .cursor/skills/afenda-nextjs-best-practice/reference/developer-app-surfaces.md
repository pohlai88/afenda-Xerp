# Developer app surfaces — unified checklist

**Authority:** [PAS-006E §7.8](../../../../docs/PAS/PRESENTATION/PAS-006E-DEVELOPER-ROUTE-LAB-STANDARD.md) · [ADR-0039](../../../../docs/adr/ADR-0039-developer-presentation-sandbox.md) · [ADR-0044](../../../../docs/adr/ADR-0044-developer-route-lab-runtime-authority-boundary.md)

**SSOT:** [`apps/developer/src/lib/lab/route-surface-registry.ts`](../../../../apps/developer/src/lib/lab/route-surface-registry.ts)

---

## Agent workflow

1. Find the route in `route-surface-registry.ts` → read **`routeProfile`** and **`importLaw`**
2. Apply profile rules below (not a separate Phase 8 / route-lab doctrine fork)
3. Run **`pnpm --filter @afenda/developer verify:greenlight`** before claiming done
4. After App Router edits: **`nextjs_index` → `get_routes` → `get_errors`** on port **3002**
5. **Never** wire live auth, kernel spine, database, or BFF in `@afenda/developer` (ADR-0044)

---

## Surface profiles

| Profile | Routes | Page law | Data | Shell | Import law |
| --- | --- | --- | --- | --- | --- |
| `index` | `/` | static index RSC | none | none | `lab-runtime-ceiling` |
| `operator-lab` | `(lab)/**` registry rows | thin async RSC + **one** `lib/lab/load-*` | typed loader fixtures | `(lab)` AppShell layout | `lab-runtime-ceiling` |
| `consumer-proof` | `/design-system/v2-proof` | thin async RSC + client leaf | `lib/v2-proof/fixtures` | inline `AppShell01` | `public-v2-exports-only` |

---

## Profile rules

### All profiles

- Server-first `page.tsx` and `layout.tsx` (no `"use client"` on route boundaries)
- Segment `error.tsx` client-safe — **no** `@afenda/shadcn-studio-v2` in error boundaries
- Prohibited: `@afenda/auth`, `@afenda/kernel`, `@afenda/database`, `@afenda/server`, `apps/erp` imports
- Registry row required for every active route filesystem

### `operator-lab`

- `(lab)/layout.tsx`: `export const dynamic = "force-dynamic"`
- Exactly one `load-*-page.server.ts` per page
- Route UI under `_components/` — not `src/views/`
- `loading.tsx` when `requiresLoadingBoundary: true`
- Governed seams: `_actions`, `_queries`, cache, runtime authority per registry

### `consumer-proof`

- Public imports only: `@afenda/shadcn-studio-v2`, `@afenda/shadcn-studio-v2/clients`
- CSS via package exports in `globals.css` only
- Static fixtures in `lib/v2-proof/` — **no** `lib/lab/load-*`
- `useMounted()` gate for theme/runtime-sensitive client UI
- **Outside** `(lab)` shell — do not merge into route-lab layout

---

## Verification matrix

| Gate | Scope |
| --- | --- |
| `pnpm --filter @afenda/developer verify:greenlight` | **Canonical** — all profiles |
| `check-developer-app-governance.mjs` | Registry + profile-aware filesystem law |
| `check-developer-presentation-runtime.mjs` | Provider/CSS boundary (app-wide) |
| `check-developer-hydration-governance.mjs` | Hydration gates (app-wide) |
| `pnpm check:v1-consumer-imports` | When touching v2 consumers |
| Playwright `route-lab-smoke.spec.ts` | Registry-driven smoke for all profiles |

Fast inner loop:

```bash
pnpm --filter @afenda/developer verify:v2-proof   # consumer-proof unit + presentation gates only
pnpm --filter @afenda/developer verify:route-lab # typecheck + governance only
```

---

## Promotion

- `promotionTarget: "erp-route"` → implement live spine in `apps/erp`, not additional sandbox authority
- `promotionTarget: "studio-reference"` → design-system / proof surfaces only

See also: [developer-route-lab-parity.md](developer-route-lab-parity.md)
