# TIP-UI-05 — ERP App Surfaces

Status: **Not started**

## Purpose

Replace minimal inline-styled ERP pages with governed `@afenda/ui` components, proper layouts, and module placeholder surfaces. Delivers the user-visible ERP experience for Phase 1.

## Scope

**In scope**

- Import `globals.css` in `apps/erp/src/app/layout.tsx`
- Replace inline styles on sign-in / sign-out with `@afenda/ui` Form, Input, Button, Card
- Protected dashboard using AppShell + `@afenda/ui` Card/Badge/Skeleton
- Module placeholder routes: Manufacturing, Inventory, Sales, Accounting, HRM, Projects, System Admin
- Route `loading.tsx` and `error.tsx` with Skeleton and Alert
- Wire `AppShellMain` consistently

**Out of scope**

- Business domain logic
- Real accounting/inventory data
- Metadata renderer integration (optional stretch — prefer after TIP-UI-04)

## Depends on

- TIP-UI-02 Component Library
- TIP-UI-03 AppShell Token Migration
- TIP-UI-04 Metadata-UI Renderers (recommended)
- TIP-010 Identity & Authorization (protected routes)

## Blocks

- Phase 1 UI exit gate
- Demo-ready ERP shell for stakeholders

## Current problems (baseline)

| File | Issue |
| --- | --- |
| `apps/erp/src/app/layout.tsx` | No CSS import |
| `apps/erp/src/app/(auth)/sign-in/sign-in-form.tsx` | Inline styles, native inputs |
| `apps/erp/src/components/sign-out-button.tsx` | Inline styles |
| Module routes | Missing — nav links go to 404 |

## Deliverables (planned)

| Route | Surface |
| --- | --- |
| `/` | Dashboard with Card layout |
| `/sign-in` | Form with @afenda/ui |
| `/manufacturing` … `/system-admin` | Placeholder pages (coming-soon state) |
| `loading.tsx` / `error.tsx` | Skeleton + Alert per route group |

## Acceptance criteria

```gherkin
GIVEN TIP-UI-05 is complete
WHEN a user signs in and navigates module nav items
THEN no page uses inline style objects for layout or color
AND all module routes render without 404
AND auth pages use @afenda/ui components
```

## Verdict

Not started.
