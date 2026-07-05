# Design System Implementation Slices

## Purpose

This directory converts the active Afenda Studio V2 design-system guideline into executable implementation slices.

Use these slices when design-system work must move from policy to implementation without drifting into new token families, new themes, copied reference code, or consumer internals.

## Slice contract

Every slice in this directory uses the same headings:

- `Slice metadata`
- `Purpose`
- `In scope`
- `Out of scope`
- `Required inputs`
- `Implementation tasks`
- `Evidence required`
- `Acceptance gates`
- `Failure modes`
- `Completion handoff`

Agents must not remove headings from a slice. If a heading is not applicable, write `none - reviewed` and explain why.

## Universal rules

Every slice inherits the design-system law:

```txt
No reference becomes runtime.
No theme creates new token families.
No component becomes public without proof.
No route consumes internals.
No visual idea bypasses taxonomy.
No migration is complete without consumer cutover.
```

Every slice must keep these active names:

```txt
Afenda Studio V2
shadcn-default.css
swiss-noir.css
verdant-noir.css
```

Do not introduce `ledger-noir.css`, `phantom-noir.css`, `executive-noir.css`, `audit-noir.css`, `erp-dark.css`, or `luxury-admin.css` unless a later approved theme-promotion slice amends taxonomy, exports, Storybook proof, and consumer proof together.

## Slice order

Run these slices in order unless a release owner records a narrower exception.

| Slice | Name | Claim target |
| --- | --- | --- |
| [DSS-0](DSS-0-AUTHORITY-ENFORCEMENT-BASELINE.md) | Authority and enforcement baseline | `package-ready` |
| [DSS-1](DSS-1-CSS-TOKEN-THEME-PROOF.md) | CSS token and named-theme proof | `component-ready` |
| [DSS-2](DSS-2-TYPOGRAPHY-DENSITY-LAYOUT.md) | Typography, density, and layout rules | `component-ready` |
| [DSS-3](DSS-3-PRIMITIVE-COMPONENT-COMPLETENESS.md) | Primitive component completeness | `component-ready` |
| [DSS-4](DSS-4-SHELL-CHROME-NAVIGATION.md) | Shell chrome and navigation ergonomics | `component-ready` |
| [DSS-5](DSS-5-DATA-DISPLAY-WIDGETS-TABLES.md) | Data display, widgets, charts, and tables | `component-ready` |
| [DSS-6](DSS-6-FORMS-DIALOGS-SETTINGS-AUTH.md) | Forms, dialogs, settings, and auth presentation | `component-ready` |
| [DSS-7](DSS-7-STORYBOOK-CONSUMER-CUTOVER-EVIDENCE.md) | Storybook, consumer cutover, and release evidence | `production-ready` only for the bounded route |

## Shared evidence gates

Run these commands for any slice that changes package code, exports, CSS, docs, or tests:

```bash
pnpm --filter @afenda/shadcn-studio-v2 check:drift
pnpm --filter @afenda/shadcn-studio-v2 test
pnpm --filter @afenda/shadcn-studio-v2 typecheck
pnpm --filter @afenda/shadcn-studio-v2 build
pnpm exec biome ci packages/shadcn-studio-v2
```

For a consumer claim, add the selected consumer gates from `../PHASE-R-CONSUMER-CUTOVER-GUIDE.md`.

## Completion rule

A slice is complete only when its completion handoff has direct evidence for every requirement. A changed file is not enough evidence unless the requirement is specifically file creation.
