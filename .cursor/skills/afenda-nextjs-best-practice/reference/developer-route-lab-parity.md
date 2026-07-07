# Developer route lab — ERP production parity

**Authority:** [ADR-0039](../../../../docs/adr/ADR-0039-developer-presentation-sandbox.md) · [ADR-0044](../../../../docs/adr/ADR-0044-developer-route-lab-runtime-authority-boundary.md) · [PAS-006E §0.1](../../../../docs/PAS/PRESENTATION/PAS-006E-DEVELOPER-ROUTE-LAB-STANDARD.md) · `@afenda/developer` port **3002**.

---

## Constitutional rule

The route lab **must be as good as ERP production frontend** for every Next.js and presentation concern. The **only** intentional differences are **auth noise removal** and **integration spine absence**.

```txt
SAME frontend law as apps/erp
MINUS auth redirect / session / permissions / OperatingContext spine / BFF / production deploy
```

**Agents must not** document or implement “ERP cannot, lab can” for page composition, colocation, rendering, loading/error segments, RSC-first boundaries, or MCP verification.

---

## Parity matrix

| Concern | ERP (`apps/erp`) | Route lab (`apps/developer`) | Parity |
| ------- | ---------------- | ---------------------------- | ------ |
| Thin async RSC `page.tsx` | Required | Required | **Same** |
| `load-*-page.server.ts` ingress | `lib/{domain}/` | `lib/lab/` | **Same pattern** |
| Route `_components/` colocation | Required | Required | **Same** |
| No `src/views/` / module recycling bin | Required | Required | **Same** |
| Server Components default | Required | Required | **Same** |
| Client leaves only for interactivity | Required | Required | **Same** |
| `(segment)/layout.tsx` + AppShell | `(protected)/` | `(lab)/` | **Same chrome** |
| `force-dynamic` on operator layout | modules layout | `(lab)/layout.tsx` | **Same bar** |
| `loading.tsx` per suspending segment | Required | Required | **Same** |
| `error.tsx` per failing segment | Required | Required | **Same** |
| `error.tsx` — no studio barrel | Required | Required | **Same** |
| PAS-006A CSS four-import chain | Required | Required | **Same** |
| Studio AppShell (not reference MCP shell) | Required | Required | **Same** |
| MCP after App Router edits | port 3000 | port **3002** | **Same sequence** |
| Auth redirect / session | Better Auth | **None** | **Excluded only** |
| OperatingContext | PAS-001A spine | `resolveLabShellOperatingContext()` demo-fixture wire ([ADR-0044](../../../../docs/adr/ADR-0044-developer-route-lab-runtime-authority-boundary.md)) | **Excluded only** |
| BFF / `api/internal/v1` | Required where contracted | None | **Excluded only** |
| `pas006-ui.contract.ts` row | Required at ship | Borrow-map row until promotion | **Promotion step** |
| Production deploy | Normal | Hard-fail without flag | **Excluded only** |

---

## Request flow (parallel)

```text
ERP:     proxy → (protected)/layout → modules/layout → page → lib/{domain}/load-* → _components/ → studio
Route lab: proxy (correlation-id) → (lab)/layout (resolveLabShellOperatingContext) → page → lib/lab/load-* → _components/ → studio
```

Data source differs (spine vs fixtures). **Composition law does not.**

---

## Hard stops (lab-specific wording)

- **Do not** ship fat client pages because “it’s just the lab”
- **Do not** skip segment `error.tsx` because “ERP doesn’t have them everywhere yet” — lab sets the bar
- **Do not** put route UI in `src/components/{route}/` — cross-cutting shell only
- **Do not** wire live auth, kernel spine, or `api/internal/v1` BFF in the route lab ([ADR-0044](../../../../docs/adr/ADR-0044-developer-route-lab-runtime-authority-boundary.md))

---

## MCP verification

```text
nextjs_index → get_routes → get_errors   (port 3002)
```

P0: `get_errors` clean on touched routes.

---

## Skill routing

| Task | Entry |
| ---- | ----- |
| Developer app surfaces | [developer-app-surfaces.md](reference/developer-app-surfaces.md) |
| Route lab UI / ERP parity detail | [developer-route-lab-parity.md](reference/developer-route-lab-parity.md) |
| PAS charter | [PAS-006E](../../../../docs/PAS/PRESENTATION/PAS-006E-DEVELOPER-ROUTE-LAB-STANDARD.md) |
| Promotion to ERP | Remap loaders + `_components/`; add spine in PAS-001A slices |
