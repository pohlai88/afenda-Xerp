---
name: afenda-react-surface-quality
description: >-
  Redirect — ERP React/TypeScript surface quality (B/A/C/Y/T scan, RSC splits, operator a11y)
  consolidated into afenda-erp-design-system. Use afenda-erp-design-system references
  surface-quality-scan.md, rsc-refactor-playbook.md, operator-a11y-checklist.md, and
  surface-testing.md. v1 primitives still route to afenda-primitive-contract.
disable-model-invocation: true
paths:
  - apps/erp/**
  - packages/shadcn-studio/src/components-layouts/**
---

# Afenda React Surface Quality (Redirect)

**Consolidated into [`afenda-erp-design-system`](../afenda-erp-design-system/SKILL.md)** (2026-07-06).

## Use Instead

| Former content | New location |
| --- | --- |
| B/A/C/Y/T scan, effort R0–R4, hard stops | [surface-quality-scan.md](../afenda-erp-design-system/references/surface-quality-scan.md) |
| RSC/client split playbook | [rsc-refactor-playbook.md](../afenda-erp-design-system/references/rsc-refactor-playbook.md) |
| Operator a11y Y1–Y7 | [operator-a11y-checklist.md](../afenda-erp-design-system/references/operator-a11y-checklist.md) |
| Test proof T1–T8 | [surface-testing.md](../afenda-erp-design-system/references/surface-testing.md) |
| React perf A1–A3, A7 | [react-best-practices.md](../afenda-erp-design-system/references/react-best-practices.md) |
| Composition A8–A10 | [react-composition-patterns.md](../afenda-erp-design-system/references/react-composition-patterns.md) |
| Operator UX, states, anti-AI aesthetic | [operator-ui-quality.md](../afenda-erp-design-system/references/operator-ui-quality.md) |

## Still Route Elsewhere

| Target | Skill |
| --- | --- |
| `packages/shadcn-studio/src/components-ui/**` (v1) | `afenda-primitive-contract` |
| PAS-006 gate bundle composer | `afenda-presentation-quality` |
| Implementer edits | `coding-consistency-bundle` + `afenda-coding-session` |

Invoke **`/afenda-erp-design-system`** for all new ERP surface review and repair work.

Legacy reference copies under `reference/` remain for deep links until removed — prefer design-system `references/` paths above.
