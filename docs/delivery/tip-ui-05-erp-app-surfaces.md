# TIP-UI-05 — ERP App Surfaces

| Field | Value |
| --- | --- |
| **Status** | **Partially Implemented** |
| **Runtime evidence** | `globals.css`, `@afenda/ui` auth, protected dashboard, dev harnesses |
| **Status source** | [`afenda-runtime-truth-matrix.md`](../architecture/afenda-runtime-truth-matrix.md) |
| **Remaining gap** | Module placeholder routes, production ApplicationShell wiring |

## Purpose

Replace minimal ERP pages with governed `@afenda/ui` components, proper layouts, and module placeholder surfaces.

## Scope

**In scope**

- `globals.css` in ERP layout
- Auth pages using `@afenda/ui`
- Protected dashboard using AppShell + governed components
- Module placeholder routes: Manufacturing, Inventory, Sales, Accounting, HRM, Projects, System Admin
- Route `loading.tsx` and `error.tsx` with Skeleton and Alert

**Out of scope**

- Business domain logic
- Real accounting/inventory data
- Accounting Core (ADR-0010)

## Runtime evidence (2026-06-23)

| Item | Status | Evidence |
| --- | --- | --- |
| CSS pipeline in ERP | **Implemented** | `apps/erp/src/app/globals.css`, `layout.tsx` import |
| Sign-in uses `@afenda/ui` | **Implemented** | `apps/erp/src/app/(auth)/sign-in/sign-in-form.tsx` |
| Protected dashboard | **Partial** | `apps/erp/src/app/(protected)/page.tsx` |
| ApplicationShell in production layout | **Partial** | Dev harnesses exist; full shell integration open |
| Module placeholder routes | **Missing** | Only 6 page routes — no `/manufacturing`, `/system-admin`, etc. |
| Inline-styled auth (legacy baseline) | **Obsolete claim** | Superseded — auth migrated |

## Depends on

- TIP-UI-02 Component Library ✅
- TIP-UI-03 AppShell Token Migration (partial)
- TIP-UI-04 Metadata-UI Renderers (partial)
- TIP-010 Identity & Authorization (partial)

## Blocks

- Foundation Phase 6 gate
- Demo-ready ERP shell for stakeholders

## Deliverables (remaining)

| Route | Surface | Status |
| --- | --- | --- |
| `/` | Dashboard with governed layout | Partial |
| `/sign-in` | Form with @afenda/ui | Implemented |
| `/manufacturing` … `/system-admin` | Placeholder pages | **Missing** |
| `(protected)` layout | ApplicationShell integration | Partial |

## Acceptance criteria

```gherkin
GIVEN TIP-UI-05 is complete
WHEN a user signs in and navigates module nav items
THEN no page uses inline style objects for layout or color
AND all module routes render without 404
AND auth pages use @afenda/ui components
AND production layout uses ApplicationShell
```

## Verdict

**Partially Implemented** — auth and CSS foundation done; module surfaces and production shell integration remain.
