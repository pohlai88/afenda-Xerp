# TIP-UI-03 — AppShell Token Migration

Status: **Not started**

## Purpose

Migrate `@afenda/appshell` from hardcoded hex colors in CSS Modules to `@afenda/design-system` CSS custom properties. Align the only real UI package in the repo with the token authority.

## Scope

**In scope**

- Replace hex values in `app-shell.module.css` with `var(--token-*)`
- Add `@afenda/design-system` CSS dependency to appshell (registry update required)
- Visual regression tests (render tests + snapshot or screenshot baseline)
- Remove color drift between shell and future `@afenda/ui` components

**Out of scope**

- Rewriting shell in Tailwind (optional follow-up)
- New nav modules or business routes

## Depends on

- TIP-006 AppShell Authority
- TIP-UI-01 CSS Pipeline
- TIP-UI-02 Component Library (for shared Badge/Button in shell chrome)

## Blocks

- TIP-UI-05 ERP App Surfaces (visual consistency)

## Files to change (planned)

| File | Change |
| --- | --- |
| `packages/appshell/src/app-shell.module.css` | Hex → CSS variables |
| `packages/appshell/package.json` | Depend on design-system CSS export |
| `docs/architecture/package-registry.md` | New dependency edge (ADR if required) |
| `docs/architecture/dependency-registry.md` | Approved edge appshell → design-system |

## Acceptance criteria

```gherkin
GIVEN app-shell.module.css uses design-system tokens
WHEN the shell renders in apps/erp
THEN no hardcoded hex color values remain in app-shell.module.css
AND visual layout matches pre-migration baseline
```

## Verdict

Not started.
