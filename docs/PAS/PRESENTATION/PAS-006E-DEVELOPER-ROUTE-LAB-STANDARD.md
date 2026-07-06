# PAS-006E — Developer Route Lab Standard

| Field | Value |
| --- | --- |
| **PAS ID** | PAS-006E |
| **Document class** | `package_authority_standard` |
| **Document role** | `presentation_route_lab_runtime` |
| **Parent charter** | [PAS-006](PAS-006-SHADCN-STUDIO-FRONTEND-STANDARD.md) |
| **Package** | `@afenda/developer` (lab-lane) |
| **Layer** | Application (lab) |
| **Blueprint box** | Developer Route Lab · [developer-sandbox-blueprint.md](../../BLUEPRINT/developer-sandbox-blueprint.md) |
| **Authority ADR** | [ADR-0039](../../adr/ADR-0039-developer-presentation-sandbox.md) · [ADR-0044](../../adr/ADR-0044-developer-route-lab-runtime-authority-boundary.md) |
| **Port** | **3002** |
| **Maturity** | Delivered (P06-014–P06-016) |
| **Consumers** | Local developers only — **no production deploy** |
| **Upstream dependency** | `@afenda/shadcn-studio-v2` only |
| **Slice directory** | `docs/PAS/PRESENTATION/SLICE/` |

#### Required gates (post-scaffold — P06-014+)

| # | Gate command |
| --- | --- |
| 1 | `pnpm --filter @afenda/developer typecheck` |
| 2 | `pnpm --filter @afenda/developer build` |
| 3 | `pnpm check:documentation-drift` |
| 4 | `pnpm check:foundation-disposition` |

---

# 0. Agent Quick Path

1. Read [ADR-0039](../../adr/ADR-0039-developer-presentation-sandbox.md) — lab-lane · no auth · no prod · no `_reference` runtime.
2. Read [reference-borrow-map.md](SLICE/reference-borrow-map.md) — v1 Adapt routes only.
3. Follow **Frontend layout annex** (§7) — reject `src/views/`.
4. Port **3002** — docs app owns 3001.
5. Production guard: `NODE_ENV=production` without `AFENDA_DEVELOPER_SANDBOX` → hard fail.

**Boundary:** `@afenda/developer` **owns** route lab pages, lab loaders, static fixtures, nav/theme config; **never owns** kernel, API spine, auth, OperatingContext, or studio block inventory.

**Hard stops:** no `@afenda/kernel` · no `@afenda/database` · no `@afenda/auth` · no `_reference` imports · no `src/views/` · `error.tsx` must not import studio barrel · **no lowered frontend bar** — see §0.1 ERP production parity.

---

# 0.1 ERP production parity (constitutional)

The route lab **must be as good as ERP production** for Next.js page composition, colocation, rendering, loading/error segments, RSC-first boundaries, PAS-006A CSS, AppShell chrome, and MCP verification.

**Only exclusions** (auth noise + integration absence):

| Excluded in route lab | ERP production |
| --- | --- |
| Better Auth / session redirect | `(protected)/` + auth |
| `OperatingContext` spine | PAS-001A loaders |
| BFF / `api/internal/v1` | Contracted APIs |
| Production deploy | Normal ship |
| Live tenant data | Spine + services |

**Agents must not** write or implement “ERP cannot, lab can” for thin pages, `_components/`, `force-dynamic`, segment `loading.tsx` / `error.tsx`, or client-leaf boundaries.

**Reference:** [developer-route-lab-parity.md](../../../.cursor/skills/afenda-nextjs-best-practice/reference/developer-route-lab-parity.md)

---

# 1. Package Definition

Application-layer **route lab** — full operator chrome and multi-block screens for UX prototyping. Consumes PAS-006 presentation product only. Feeds ERP visually after promotion (separate PAS-001A slices).

---

# 2. Authority Surfaces

| Surface | Path (target P06-014) | Contract rule |
| --- | --- | --- |
| Root layout | `apps/developer/src/app/layout.tsx` | Globals + demo banner — no auth |
| Lab layout | `apps/developer/src/app/(lab)/layout.tsx` | `force-dynamic` · AppShell · nav |
| Thin pages | `apps/developer/src/app/(lab)/**/page.tsx` | RSC delegate to loader only |
| Route components | `apps/developer/src/app/(lab)/**/_components/` | Colocated UI — **not** `src/views/` |
| Lab loaders | `apps/developer/src/lib/lab/load-*-page.server.ts` | Static fixtures · async server functions |
| Demo context | `apps/developer/src/lib/lab/lab-demo-context.ts` | **Not** `OperatingContext` |
| Nav config | `apps/developer/src/config/nav-config.ts` | Serializable nav groups |
| Theme config | `apps/developer/src/config/theme-config.ts` | Theme provider wiring |
| Error boundary | `apps/developer/src/app/error.tsx` | Client-safe — **no** `@afenda/shadcn-studio-v2` import |

---

# 3. Dependency Rules

## 3.1 Allowed

- `@afenda/shadcn-studio-v2` (blocks, theme, CSS)
- Next.js 16 · React 19 · Tailwind (via same four-import CSS chain as ERP — PAS-006A)

## 3.2 Prohibited imports

`@afenda/kernel` · `@afenda/database` · `@afenda/auth` · `@afenda/permissions` · `@afenda/erp` · `apps/erp` · runtime paths under `_reference/`

---

# 4. Production Guard

When `NODE_ENV=production` and `AFENDA_DEVELOPER_SANDBOX` is unset or falsy, build or boot **must fail** with an explicit error. Implementation detail in P06-014 scaffold — doctrine source: ADR-0039 §4.

---

# 5. ERP production parity (not “lab lite”)

Route lab matches ERP for **frontend law**. Differences are **integration only**:

| Concern | Route lab | ERP |
| --- | --- | --- |
| Page / loader / `_components/` law | **Same** | **Same** |
| AppShell + nav chrome | **Same** | **Same** |
| `force-dynamic` operator layout | **Same** | **Same** |
| Segment `loading.tsx` / `error.tsx` | **Same** | **Same** |
| RSC shell + client leaves | **Same** | **Same** |
| Data ingress | `lib/lab/` fixtures | `lib/{domain}/` + spine |
| Auth | Demo banner only | Better Auth |
| Deploy | Lab hard-fail | Production |

Promotion remaps paths — **not** quality bar.

---

# 6. Promotion Chain

```text
apps/developer route accepted
  → remap lib/lab/load-* → apps/erp/src/lib/{domain}/load-*-page.server.ts
  → remap _components/ → ERP route tree
  → add PAS-001A spine (context, auth, APIs) — separate slices
```

Route lab does **not** auto-promote — ERP slices own spine wiring.

---

# 7. Frontend Layout Annex

Mandatory page law for all route lab surfaces (P06-014+).

## 7.1 Directory law

| Pattern | Verdict |
| --- | --- |
| `app/(lab)/[route]/page.tsx` — thin RSC | **Required** |
| `app/(lab)/[route]/_components/*.tsx` | **Required** for route UI |
| `lib/lab/load-[surface]-page.server.ts` | **Required** for data/fixtures |
| `src/views/**` | **Rejected** — reference template only |
| Fat pages with inline mocks | **Rejected** |

## 7.2 Page flow

```text
page.tsx (thin RSC)
  → await load{Surface}Page() from lib/lab/
  → pass serializable props to _components/
  → _components/ compose @afenda/shadcn-studio-v2 blocks
```

## 7.3 Layout law

- `(lab)/layout.tsx`: export `dynamic = 'force-dynamic'` — prototypes ERP tenant-route rendering
- Root `layout.tsx`: import globals (AdminCN four-import chain); render persistent **demo banner**
- No auth redirect middleware

## 7.4 Error boundary law

- `error.tsx` at **app root and each operator segment** that can fail (`(lab)/`, `dashboard/`, `admin/`, `settings/`)
- Client component only; shared recovery UI via `lab-segment-error.client.tsx`
- **Must not** import `@afenda/shadcn-studio-v2` — same hard stop as ERP

## 7.5 RSC-first composition

- `*-panel.tsx` in `_components/` — **Server Component** shell (title, layout)
- `*-content.client.tsx` — client leaf for studio blocks / charts / theme controls only
- **Rejected:** full-route `"use client"` panels when header could stay on server

## 7.6 Loading law

- `loading.tsx` per route segment that suspends — match ERP segment pattern

## 7.7 Target tree (reference)

```text
apps/developer/src/
  app/
    layout.tsx
    error.tsx
    (lab)/
      page.tsx              # Overview — inside AppShell (ERP-parity chrome)
      layout.tsx            # force-dynamic + AppShell + nav
      error.tsx
      dashboard/
        error.tsx
        sales/
          page.tsx
          loading.tsx
          _components/
            sales-dashboard-panel.tsx          # RSC shell
            sales-dashboard-content.client.tsx # client leaf
```

---

# 8. Slice Queue

| Slice | Title | Status |
| --- | --- | --- |
| P06-013 | Route lab docs (ADR · NS · Blueprint · PAS-006E · borrow map) | **Delivered** |
| P06-014 | App scaffold + `/dashboard/sales` | **Delivered** |
| P06-015 | `/dashboard/finance` composition | **Delivered** |
| P06-016 | `/admin/users` + `/settings/appearance` + Playwright smoke | **Delivered** |

Handoffs: [SLICE/](SLICE/)

---

## References

| Document | Role |
| --- | --- |
| [ADR-0039](../../adr/ADR-0039-developer-presentation-sandbox.md) | Constitutional decision |
| [Developer Sandbox North Star](../../NORTHSTAR/developer-sandbox-north-star.md) | Business scope |
| [reference-borrow-map.md](SLICE/reference-borrow-map.md) | v1 routes |
| [PAS-006A](PAS-006A-SHADCN-STUDIO-PRODUCT-STANDARD.md) | CSS + studio consumption |
| [afenda-nextjs-best-practice SKILL](../../../.cursor/skills/afenda-nextjs-best-practice/SKILL.md) | Page law |
