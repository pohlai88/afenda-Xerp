# ADR-0039 — Developer Presentation Sandbox (Route Lab)

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-07-02 |
| **Owner** | Architecture Authority |
| **Supersedes** | — |
| **Superseded by** | — |

---

## Context

Afenda operates a **three-layer presentation lab model** (ADR-0027 · PAS-006):

| Layer | App | Port | Role |
| --- | --- | --- | --- |
| Block lab | `apps/storybook` | 6006 | Single-block ACPA verification (P06-012 Delivered) |
| **Route lab** | **`apps/developer`** | **3002** | Full operator chrome + multi-block screens |
| Production | `apps/erp` | 3000 | Auth + spine + APIs |

Storybook proves individual blocks; ERP requires auth, operating context, and integration spine. A **route lab** is needed to prototype full operator surfaces — dashboard density, nav grouping, datatable lists, theme settings — using Afenda frontend law (thin RSC pages, `lib/lab/load-*-page.server.ts`, route-colocated `_components/`) while **borrowing visual UX** from the gitignored `_reference/shadcn-nextjs-admincn-admin-template` (ADR-0017 Appendix A).

Port **3001** is reserved for `apps/docs`. Developer sandbox uses **3002**.

---

## Decision

### 1. Lab-lane application

- **Package:** `@afenda/developer` · **port 3002**
- **Lane:** `lab-lane` (registry entry via `@foundation-registry-owner` — separate slice; not in P06-013 scope)
- **Presentation consumer:** `@afenda/shadcn-studio` only — same CSS chain as ERP (PAS-006A)

### 2. Scope boundaries

**ERP production parity:** Route lab frontend **must match ERP production quality** for page law, colocation, AppShell, segment loading/error boundaries, RSC-first composition, and MCP verification. **Only** auth, operating-context spine, BFF, and production deploy are excluded — not a lowered “lab standard.” See PAS-006E §0.1.

**In scope:**

- PAS-006 consumer — studio blocks, theme, AppShell patterns
- Visual UX prototypes that **feed ERP** after acceptance (promotion remaps `lib/lab/load-*` → ERP domain loaders; `_components/` → ERP route tree — separate PAS-001A slices)
- Static demo fixtures in `lib/lab/` — **not** `OperatingContext`
- Demo banner on all routes — no auth redirect

**Non-goals (explicit):**

- Kernel vocabulary or `@afenda/kernel` imports in the sandbox app
- Platform API / BFF routes
- ERP integration spine (PAS-001A IS-002 / IS-003)
- Better Auth or session flows
- Production deployment
- Runtime imports from `_reference/` (read-only local mirror for human/MCP inspiration only)

### 3. Rejected patterns (from reference template)

| Pattern | Decision |
| --- | --- |
| `src/views/` folder law | **Rejected** — use route-colocated `_components/` |
| Fat `src/views/dashboards/*` client pages | **Rejected** — thin `page.tsx` → loader → components |
| Auth routes (`/pages/auth/*`) | **Rejected** — Better Auth owns auth |
| MCP shell blocks (`application-shell`, `dashboard-shell`) | **Rejected** — Studio AppShell authority |
| 56-route clone | **Rejected** — v1 borrow map only ([reference-borrow-map.md](../PAS/PRESENTATION/SLICE/reference-borrow-map.md)) |
| Runtime `_reference` imports | **Rejected** — gitignored; never bundled |

### 4. Production hard-fail

If `NODE_ENV=production` **and** `AFENDA_DEVELOPER_SANDBOX` is **not** set to a truthy value, the developer app **must fail fast** at build or boot (implementation in P06-014):

```txt
NODE_ENV=production without AFENDA_DEVELOPER_SANDBOX → hard fail (non-deployable)
```

Local dev (`pnpm --filter @afenda/developer dev`) runs on port **3002** without production guard. CI smoke (P06-016) uses dev/preview mode only — **no auth**, advisory pipeline.

### 5. Governance chain

```text
ADR-0039 (this document)
  → Presentation NS §3 (Block lab vs Route lab)
  → developer-sandbox-north-star.md (adjunct)
  → developer-sandbox-blueprint.md
  → PAS-006E (route lab standard + frontend layout annex)
  → P06-013 docs → P06-014 scaffold → P06-015/016 compositions
```

PAS-007 is **not** created — route lab doctrine folds into **PAS-006E** under the PAS-006 family.

---

## Consequences

### Positive

- Full-screen UX prototyping without ERP auth/spine blockers
- Mechanical promotion path — sandbox routes mirror Afenda Next.js law (`afenda-nextjs-best-practice`)
- Clear separation: Storybook (blocks) · Developer (routes) · ERP (production)

### Negative / trade-offs

- Additional app surface to maintain (lab-lane only)
- Registry row required before scaffold (foundation-registry-owner)
- Visual borrow from reference requires manual adaptation — no runtime import shortcut

---

## Acceptance Gate

P06-013 (docs) is complete when **all** rows pass before any `apps/developer` code:

| # | Criterion | Evidence |
| --- | --- | --- |
| 1 | ADR-0039 Status **Accepted** | This document |
| 2 | Presentation NS §3 splits Block lab vs Route lab | [shadcn-studio-presentation-north-star.md](../NORTHSTAR/shadcn-studio-presentation-north-star.md) |
| 3 | Adjunct NS published | [developer-sandbox-north-star.md](../NORTHSTAR/developer-sandbox-north-star.md) |
| 4 | Blueprint published + sibling link from Presentation Blueprint | [developer-sandbox-blueprint.md](../BLUEPRINT/developer-sandbox-blueprint.md) |
| 5 | PAS-006E + frontend layout annex | [PAS-006E](../PAS/PRESENTATION/PAS-006E-DEVELOPER-ROUTE-LAB-STANDARD.md) |
| 6 | Reference borrow map (v1 routes) | [reference-borrow-map.md](../PAS/PRESENTATION/SLICE/reference-borrow-map.md) |
| 7 | Slice handoffs P06-013–P06-016 + catalog | [presentation-slice-catalog.md](../PAS/PRESENTATION/SLICE/presentation-slice-catalog.md) |
| 8 | DEVELOPMENT-LANE-BOUNDARIES consumer diagram updated | Three consumers: storybook · developer · erp |
| 9 | pas-status-index PAS-006 family updated | P06-013 Delivered · P06-014+ Planned |
| 10 | afenda-nextjs-best-practice multi-app table includes developer **3002** | `.cursor/skills/afenda-nextjs-best-practice/SKILL.md` |
| 11 | `pnpm check:documentation-drift` | Gate output |
| 12 | `pnpm check:foundation-disposition` (no registry edit in P06-013) | Gate output |
| 13 | `@afenda/developer` registry entry | **Deferred** — foundation-registry-owner after ADR Accepted |

**P06-014 gate (app code):** P06-013 checklist complete + registry row live.

---

## References

- [ADR-0017](../adr/ADR-0017-shadcn-studio-ui-delivery-acceleration.md) — MCP vendor · Appendix A route inventory
- [ADR-0027](../adr/ADR-0027-frontend-presentation-reset.md) — sole presentation chain
- [Presentation North Star](../NORTHSTAR/shadcn-studio-presentation-north-star.md)
- [Developer Sandbox North Star](../NORTHSTAR/developer-sandbox-north-star.md)
- [Developer Sandbox Blueprint](../BLUEPRINT/developer-sandbox-blueprint.md)
- [PAS-006E](../PAS/PRESENTATION/PAS-006E-DEVELOPER-ROUTE-LAB-STANDARD.md)
- [P06-013 handoff](../PAS/PRESENTATION/SLICE/p06-013-developer-route-lab-docs.md)
- [DEVELOPMENT-LANE-BOUNDARIES](../PAS/DEVELOPMENT-LANE-BOUNDARIES.md)
