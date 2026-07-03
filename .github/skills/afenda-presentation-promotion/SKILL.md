---
name: afenda-presentation-promotion
description: >-
  Promotes Afenda editorial lab patterns through auth-shell to ERP production.
  Use only when the user explicitly asks to promote, wire into ERP sign-in, or
  make a lab pattern the production auth surface.
paths:
  - apps/erp/**
  - packages/shadcn-studio/src/components-auth-shell/**
  - apps/erp/src/lib/auth/**
disable-model-invocation: true
---

# Afenda Presentation Promotion

**Prerequisite:** Pattern passes [afenda-editorial-compose](../afenda-editorial-compose/SKILL.md) visual proof.

**Detail:** [stage-checklists.md](reference/stage-checklists.md) · **Authority:** [auth-ingress-ecosystem.md](../../../packages/shadcn-studio/docs/auth-ingress-ecosystem.md) § Phase C

## Invocation rule

**Do not invoke automatically** (`disable-model-invocation: true`).

Explicit triggers only: `promote to ERP` · `wire into ERP sign-in` · `production auth pattern` · `promote to auth shell`

If runtime ignores the flag, treat as hard stop anyway.

## Quick start

```txt
Lab (A) → auth-shell candidate (B) → ERP route (C)
Never skip stages. ERP /sign-in stays login-page-04 until Stage C + explicit user request.
```

| Stage | ERP `/sign-in` |
| --- | --- |
| A — Lab | Untouched |
| B — Auth shell | Untouched |
| C — ERP | Changed on explicit command only |

Full checklists: [stage-checklists.md](reference/stage-checklists.md)

## Hard stops

- Preview-only request but ERP edited
- Lab-only request but auth registry touched
- Skip B before C
- Global ERP CSS without scope explanation
- No rollback path
- `@afenda/auth` in `@afenda/shadcn-studio`

## Verification

- [ ] Stage matches user intent
- [ ] A/B did not modify ERP `/sign-in`
- [ ] C: registry + env documented; gates from reference run
- [ ] Rollback steps stated
