# TIP-UI-03 — AppShell Token Migration

| Field | Value |
| --- | --- |
| **Status** | **Partially Implemented** |
| **Runtime evidence** | `packages/appshell/src/styles/afenda-appshell.css` — replaces legacy CSS Modules approach |
| **Status source** | [`afenda-runtime-truth-matrix.md`](../architecture/afenda-runtime-truth-matrix.md) |
| **Remaining gap** | TIP-006 authority contracts; full visual regression sign-off |

## Purpose

Migrate `@afenda/appshell` from hardcoded hex colors to `@afenda/design-system` CSS custom properties and governed shell styling. Align AppShell with the token authority.

## Scope

**In scope**

- Token-aligned shell CSS (`afenda-appshell.css`)
- Design-system CSS dependency for appshell consumers
- Visual regression tests (render tests + baseline)
- Remove color drift between shell and `@afenda/ui` components

**Out of scope**

- Rewriting shell in Tailwind (optional follow-up)
- New nav modules or business routes
- AppShell authority contracts (TIP-006)

## Runtime evidence (2026-06-23)

| Check | Result | Evidence |
| --- | --- | --- |
| Legacy `app-shell.module.css` | Absent | Grep — file removed |
| `afenda-appshell.css` exists | Yes | `packages/appshell/src/styles/afenda-appshell.css` |
| CSS manifest tests | Yes | `packages/appshell/src/__tests__/css-manifest.test.ts` |
| No raw hex in shell CSS tests | Yes | Same test file |
| ERP imports shell CSS | Yes | Storybook + ERP globals composition |

## Depends on

- TIP-006 AppShell Authority (partial)
- TIP-UI-01 CSS Pipeline ✅
- TIP-UI-02 Component Library ✅

## Blocks

- TIP-UI-05 ERP App Surfaces (visual consistency closeout)

## Acceptance criteria

```gherkin
GIVEN afenda-appshell.css uses design-system token composition
WHEN the shell renders in apps/erp or Storybook
THEN no hardcoded hex color values remain in appshell CSS sources
AND visual layout matches governed baseline tests
```

## Verdict

**Partially Implemented** — token migration largely complete via `afenda-appshell.css`; closeout blocked on TIP-006 contract freeze and production ERP shell integration (TIP-UI-05).
