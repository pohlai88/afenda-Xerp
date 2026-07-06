---
name: afenda-editorial-landing-builder
description: >-
  Concept-first Afenda editorial landing workflow for developer route lab,
  Presentation Lab, and other auth-free editorial landing surfaces. Use with
  afenda-editorial-bundle when creating or improving landing pages that need an
  approved visual concept, design-system extraction, fidelity ledger, browser
  screenshot verification, and no auth or ERP runtime noise.
disable-model-invocation: true
paths:
  - apps/developer/**
  - packages/shadcn-studio/docs/**
---

# Afenda Editorial Landing Builder

## Overview

Supplement to [`afenda-editorial-bundle`](../afenda-editorial-bundle/SKILL.md)
for landing pages. It adapts the curated `frontend-app-builder` concept-first
standard to Afenda editorial surfaces without replacing PAS-006 or route-lab law.

## Required Stack

Run this skill only after:

```txt
coding-consistency-bundle
-> afenda-editorial-bundle
-> afenda-editorial-lab
-> afenda-editorial-compose
-> afenda-editorial-landing-builder
```

For `apps/developer`, also read
[`afenda-nextjs-best-practice/reference/developer-route-lab-parity.md`](../afenda-nextjs-best-practice/reference/developer-route-lab-parity.md).

## Hard Rules

- Generate or receive a visual concept before landing-page implementation.
- Treat the accepted concept as the spec: no unapproved changes to copy, hierarchy,
  layout, palette, container model, or density.
- Extract a compact design system before coding: typography roles, palette,
  spacing, panels, proof rows, command/status text, and responsive behavior.
- Keep auth out of developer landing surfaces: no sign-in form, session, auth
  import, BFF, operating-context spine, protected layout, or credential copy.
- Keep UI route-local in `_components/` unless a promoted package explicitly owns
  the surface.
- Verify with a live browser screenshot and a fidelity ledger before completion.

## Workflow

1. Read the reference:
   [`references/concept-first-landing-workflow.md`](references/concept-first-landing-workflow.md).
2. Classify the landing surface and preset:
   `preset afenda-brand + landing` or `preset afenda-verdant + landing`.
3. Generate or load the concept image and record its path.
4. Post a design inventory before edits: allowed copy, layout, typography, color,
   component families, proof elements, and intentional exclusions.
5. Implement in the existing app/framework with route-local composition.
6. Run the required gates and capture browser screenshot evidence.
7. Finish with a fidelity ledger that compares concept to implementation.

## Completion Evidence

Landing work is incomplete without:

- Concept path or source.
- Browser screenshot path or verification method.
- At least five comparison points: copy, layout, typography, palette, spacing,
  responsive behavior, component/container model, or motion.
- Above-the-fold copy diff result.
- Remaining intentional deviations, or `none`.
- Standard `afenda-coding-session` Completion Report.
