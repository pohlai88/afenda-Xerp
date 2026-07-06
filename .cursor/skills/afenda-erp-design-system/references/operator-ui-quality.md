# Operator UI Quality

From frontend-ui-engineering, Afenda-scoped (PAS-006, ADR-0027).

## Composition over configuration

Compose V2 primitives with named parts — no monolithic boolean modes.

## Container vs presentation

```text
page.tsx (RSC) → *-page-view.tsx → *-actions.client.tsx (leaf client only)
```

## Anti–AI-aesthetic

No purple defaults, heavy gradients, marketing heroes on operator routes, or arbitrary spacing. Use semantic tokens and dense ERP layouts.

## Required states

Loading (`Skeleton`), empty (`role="status"`), error (`role="alert"`), forbidden — never silent blank.

## A11y baseline

Real `button`/`link`; `aria-label` on icon buttons; `Label htmlFor`; `DialogTitle` + `DialogCloseButton`; table `scope="col"`.

Target **< ~200 lines** per surface file; split loader/view/actions when larger.
