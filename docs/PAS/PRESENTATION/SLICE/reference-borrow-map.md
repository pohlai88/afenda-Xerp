# Reference Borrow Map — Developer Route Lab v1

| Field | Value |
| --- | --- |
| **Authority** | [ADR-0017 Appendix A](../../../adr/ADR-0017-shadcn-studio-ui-delivery-acceleration.md) · [ADR-0039](../../../adr/ADR-0039-developer-presentation-sandbox.md) |
| **Scope** | v1 sandbox routes only — not full 56-route inventory |
| **App** | `@afenda/developer` · port **3002** |
| **Last reviewed** | 2026-07-02 |

> **One sentence:** Maps each v1 Developer Route Lab route to its AdminCN reference source and Afenda build decision — **Adapt** routes only for initial sandbox delivery.

---

## Template source

| Field | Value |
| --- | --- |
| **Template** | `shadcn-nextjs-admincn-admin-template` v1.0.0 |
| **Path** | `_reference/shadcn-nextjs-admincn-admin-template-1.0.0/` (gitignored) |
| **Runtime import** | **Forbidden** — read-only local mirror for human/MCP inspiration |

Full 56-route inventory: [ADR-0017 Appendix A](../../../adr/ADR-0017-shadcn-studio-ui-delivery-acceleration.md).

---

## v1 sandbox routes (Adapt)

| Sandbox route | Reference route | Group | Afenda decision | Build notes | Slice |
| --- | --- | --- | --- | --- | --- |
| `/` | *(new)* | Lab index | **Adapt** | Lab index + demo banner; link to v1 routes | P06-014 |
| `/dashboard/sales` | `/dashboard/sales` | Dashboard | **Adapt** | KPI cards, charts — loader + `_components/` + studio blocks | P06-014 |
| `/dashboard/finance` | `/dashboard/finance` | Dashboard | **Adapt** | Revenue/metrics — second composition using same page law | P06-015 |
| `/admin/users` | `/apps/users/list` | Apps | **Adapt** | Studio datatable density; list patterns for system-admin | P06-016 |
| `/settings/appearance` | `themeConfig` (settings) | Settings | **Adapt** | Theme provider from `config/theme-config.ts` | P06-016 |

---

## Explicitly rejected for sandbox v1

| Reference pattern | Decision | Reason |
| --- | --- | --- |
| `/pages/auth/*` | **Rejected** | Better Auth owns auth |
| `/dashboard/ecommerce` | **Rejected** | eCommerce context |
| `/pages/pricing` | **Rejected** | Marketing |
| `application-shell` / MCP shell blocks | **Rejected** | Studio AppShell authority |
| `src/views/` folder structure | **Rejected** | Use `_components/` + `lib/lab/` |
| All other Appendix A routes | **Reference** or **Rejected** | Not in v1 scope — extend map via ADR amendment |

---

## Borrow vs reject summary

**Borrow:** dashboard density, nav grouping, theme settings UX, datatable list patterns.

**Reject:** auth routes, ecommerce/marketing, MCP shell blocks, runtime `_reference` imports, 56-route clone, `src/views/` folder law.

---

## Promotion note

Accepted sandbox UX promotes to `apps/erp` via loader remap and `_components/` relocation — not by copying `apps/developer` wholesale. Spine wiring (context, auth, APIs) is PAS-001A scope.

---

## Related

- [PAS-006E](../PAS-006E-DEVELOPER-ROUTE-LAB-STANDARD.md) — frontend layout annex
- [developer-sandbox-blueprint.md](../../../BLUEPRINT/developer-sandbox-blueprint.md)
- [presentation-slice-catalog.md](./presentation-slice-catalog.md)
